/**
 * Central Enterprise API Client for EduBliq Cloud Backbone
 * Provides automatic JWT Bearer token attachment, active campus headers, and error normalization.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1';

class ApiClient {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  getAuthToken() {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.token || parsed.accessToken || null;
      }
    } catch (e) {}
    return null;
  }

  getActiveCampusId() {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.activeCampusId || parsed.primaryCampusId || null;
      }
    } catch (e) {}
    return null;
  }

  getActiveOrganizationId() {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.organizationId || null;
      }
    } catch (e) {}
    return null;
  }

  getActiveSchoolId() {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.schoolId || parsed.user?.schoolId || null;
      }
    } catch (e) {}
    return null;
  }

  getRefreshToken() {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (session) {
        const parsed = JSON.parse(session);
        return parsed.refreshToken || null;
      }
    } catch (e) {}
    return null;
  }

  /**
   * Persist freshly issued token pair back into the active session store.
   */
  saveRefreshedTokens(tokens) {
    try {
      const session = localStorage.getItem('edubliq_session');
      if (!session || !tokens?.accessToken) return;
      const parsed = JSON.parse(session);
      parsed.token = tokens.accessToken;
      parsed.accessToken = tokens.accessToken;
      if (tokens.refreshToken) parsed.refreshToken = tokens.refreshToken;
      parsed.tokenRefreshedAt = Date.now();
      localStorage.setItem('edubliq_session', JSON.stringify(parsed));
    } catch (e) {}
  }

  /**
   * Single-flight session renewal: concurrent 401s share ONE refresh request.
   * Returns true when a fresh access token is now available.
   */
  refreshSession() {
    if (!this.refreshPromise) {
      this.refreshPromise = (async () => {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        const response = await fetch(`${this.baseUrl}/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!response.ok) return false;

        const data = await response.json().catch(() => ({}));
        const tokens = data?.data?.tokens;
        if (!tokens?.accessToken) return false;

        this.saveRefreshedTokens(tokens);
        return true;
      })();

      // Always clear the in-flight promise so future expiries can retry
      this.refreshPromise.finally(() => { this.refreshPromise = null; });
    }
    return this.refreshPromise;
  }

  async request(endpoint, options = {}, _isRetry = false) {
    const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      ...options.headers
    };

    const token = this.getAuthToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const schoolId = this.getActiveSchoolId();
    if (schoolId) {
      headers['X-School-Id'] = schoolId;
    }

    const campusId = this.getActiveCampusId();
    if (campusId) {
      headers['X-Campus-Id'] = campusId;
    }

    const orgId = this.getActiveOrganizationId();
    if (orgId) {
      headers['X-Organization-Id'] = orgId;
    }

    const config = {
      ...options,
      headers
    };

    try {
      const response = await fetch(url, config);

      // Silent session renewal on access-token expiry (skip auth endpoints to avoid loops)
      const isAuthEndpoint = endpoint.startsWith('/auth/login') || endpoint.startsWith('/auth/refresh');
      if (response.status === 401 && !_isRetry && !isAuthEndpoint) {
        const refreshed = await this.refreshSession();
        if (refreshed) {
          return this.request(endpoint, options, true);
        }
        // Refresh failed — session is truly dead. Notify the UI layer.
        console.warn('[ApiClient] Session expired and refresh failed. Re-authentication required.');
        try {
          window.dispatchEvent(new CustomEvent('edubliq:session-expired', { detail: { endpoint } }));
        } catch (e) {}
      }

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        const error = new Error(data.message || data.detail || data.title || response.statusText);
        error.status = response.status;
        error.data = data;
        throw error;
      }

      return data;
    } catch (error) {
      if (error.status === undefined) {
        console.error(`[ApiClient Network Error] ${options.method || 'GET'} ${url}:`, error.message);
        const netError = new Error('Unable to reach EduBliq servers. Please check your connectivity and try again.');
        netError.status = 0;
        netError.isNetworkError = true;
        throw netError;
      }
      console.error(`[ApiClient Error] ${options.method || 'GET'} ${url}:`, error.message);
      throw error;
    }
  }

  get(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'GET', headers });
  }

  post(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'POST', body: JSON.stringify(body), headers });
  }

  put(endpoint, body, headers = {}) {
    return this.request(endpoint, { method: 'PUT', body: JSON.stringify(body), headers });
  }

  delete(endpoint, headers = {}) {
    return this.request(endpoint, { method: 'DELETE', headers });
  }

  // --- Core Authentication Methods ---
  async login(email, password, campusId) {
    return this.post('/auth/login', { email, password, campusId });
  }

  async getSession() {
    return this.get('/auth/session');
  }

  async logout() {
    try {
      await this.post('/auth/logout', {});
    } catch (e) {}
    localStorage.removeItem('edubliq_session');
    return { success: true };
  }

  async switchCampus(targetCampusId) {
    return this.post('/auth/switch-campus', { targetCampusId });
  }

  // --- School Onboarding & Hierarchy Methods (Phase 5) ---
  async registerSchool(onboardingData) {
    return this.post('/hierarchy/schools/register', onboardingData);
  }

  async getSchoolDetails(schoolId) {
    return this.get(`/hierarchy/schools/${schoolId}`);
  }

  async launchSchool(schoolId) {
    return this.post(`/hierarchy/schools/${schoolId}/launch`, {});
  }

  // --- Staff Invitation & Portal Access Methods (Phase 6) ---
  async getPortalAccessMatrix(schoolId) {
    const query = schoolId ? `?schoolId=${encodeURIComponent(schoolId)}` : '';
    return this.get(`/invitations/matrix${query}`);
  }

  async regenerateRoleSecretCode(role, customCode) {
    return this.post('/invitations/regenerate', { role, customCode });
  }

  async createInvitation(invitationData) {
    return this.post('/invitations', invitationData);
  }

  async listInvitations(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/invitations${qs ? `?${qs}` : ''}`);
  }

  async verifyInvitationToken(token) {
    return this.get(`/invitations/verify/${encodeURIComponent(token)}`);
  }

  async verifySecretCode({ role, secretCode, schoolId }) {
    return this.post('/invitations/verify-code', { role, secretCode, schoolId });
  }

  async acceptInvitation(payload) {
    return this.post('/invitations/accept', payload);
  }

  async revokeInvitation(invitationId) {
    return this.post(`/invitations/${invitationId}/revoke`, {});
  }

  // --- Core Academic Modules & SIS Operations (Phase 7) ---
  async getAcademicSessions() {
    return this.get('/academics/sessions');
  }

  async createAcademicSession(sessionData) {
    return this.post('/academics/sessions', sessionData);
  }

  async getClassSections(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/academics/classes${qs ? `?${qs}` : ''}`);
  }

  async createClassSection(classData) {
    return this.post('/academics/classes', classData);
  }

  async getSubjects(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/academics/subjects${qs ? `?${qs}` : ''}`);
  }

  async createSubject(subjectData) {
    return this.post('/academics/subjects', subjectData);
  }

  async getTimetables(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/academics/timetables${qs ? `?${qs}` : ''}`);
  }

  async schedulePeriod(periodData) {
    return this.post('/academics/timetables/schedule', periodData);
  }

  async getHomework(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/academics/homework${qs ? `?${qs}` : ''}`);
  }

  async createHomework(homeworkData) {
    return this.post('/academics/homework', homeworkData);
  }

  async submitHomework(homeworkId, submissionData) {
    return this.post(`/academics/homework/${homeworkId}/submit`, submissionData);
  }

  async enrollStudent(studentData) {
    return this.post('/students/enroll', studentData);
  }

  async getStudents(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/students${qs ? `?${qs}` : ''}`);
  }

  async getStudentById(studentId) {
    return this.get(`/students/${studentId}`);
  }

  async updateStudent(studentId, updateData) {
    return this.put(`/students/${studentId}`, updateData);
  }

  async deleteStudent(studentId) {
    return this.delete(`/students/${studentId}`);
  }

  // --- Fee Management & Real Ledger Accounting (Phase 8) ---
  async collectFeePayment(paymentData) {
    return this.post('/finance/collect', paymentData);
  }

  async getFeeTransactions(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/finance/transactions${qs ? `?${qs}` : ''}`);
  }

  async getStudentFeeLedger(studentId) {
    return this.get(`/finance/ledger/${encodeURIComponent(studentId)}`);
  }

  async getDaybookSummary() {
    return this.get('/finance/daybook');
  }

  async getFeeDefaulters(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/finance/defaulters${qs ? `?${qs}` : ''}`);
  }

  async getFeeStructures(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/finance/structures${qs ? `?${qs}` : ''}`);
  }

  async createFeeStructure(structureData) {
    return this.post('/finance/structures', structureData);
  }

  // --- Attendance & Daily Operations (Phase 9) ---
  async markStudentAttendance(attendanceData) {
    return this.post('/attendance/mark', attendanceData);
  }

  async getDailyAttendanceRegister(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/attendance/register${qs ? `?${qs}` : ''}`);
  }

  async getStudentMonthlyAttendance(studentId) {
    return this.get(`/attendance/summary/${encodeURIComponent(studentId)}`);
  }

  async recordRfidTapEvent(tapData) {
    return this.post('/attendance/rfid/tap', tapData);
  }

  async getRfidLogs(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/attendance/rfid/logs${qs ? `?${qs}` : ''}`);
  }

  async markStaffAttendance(attendanceData) {
    return this.post('/attendance/staff/mark', attendanceData);
  }

  async getStaffAttendance(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/attendance/staff${qs ? `?${qs}` : ''}`);
  }

  async applyStaffLeave(leaveData) {
    return this.post('/attendance/leaves/apply', leaveData);
  }

  async getLeaveApplications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/attendance/leaves${qs ? `?${qs}` : ''}`);
  }

  async reviewLeaveApplication(leaveId, reviewData) {
    return this.patch(`/attendance/leaves/${leaveId}/review`, reviewData);
  }

  // --- Examinations & Report Cards (Phase 10) ---
  async getExams(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/examinations${qs ? `?${qs}` : ''}`);
  }

  async createExam(examData) {
    return this.post('/examinations', examData);
  }

  async recordExamMarks(marksData) {
    return this.post('/examinations/marks', marksData);
  }

  async getExamMarksheet(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/examinations/marksheet${qs ? `?${qs}` : ''}`);
  }

  async getStudentReportCard(studentId, params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/examinations/report-card/${encodeURIComponent(studentId)}${qs ? `?${qs}` : ''}`);
  }

  async publishExamResults(examTermId) {
    return this.post(`/examinations/${examTermId}/publish`, {});
  }

  // --- Parent Portal & Ward Analytics (Phase 11) ---
  async getParentProfile() {
    return this.get('/parents/profile');
  }

  async getWardOverview(studentId) {
    return this.get(`/parents/wards/${encodeURIComponent(studentId)}/overview`);
  }

  async getWardFees(studentId) {
    return this.get(`/parents/wards/${encodeURIComponent(studentId)}/fees`);
  }

  async submitWardLeave(leaveData) {
    return this.post('/parents/wards/leave', leaveData);
  }

  async getWardDiary(studentId) {
    return this.get(`/parents/wards/${encodeURIComponent(studentId)}/diary`);
  }

  // --- Notifications & Multi-Channel Communications (Phase 12) ---
  async sendBroadcastCommunication(payload) {
    return this.post('/communications/broadcast', payload);
  }

  async getBroadcastHistory(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/communications${qs ? `?${qs}` : ''}`);
  }

  async getEmergencyAlerts() {
    return this.get('/communications/emergency');
  }

  async getUserNotifications(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/notifications${qs ? `?${qs}` : ''}`);
  }

  async getUnreadNotificationCount() {
    return this.get('/notifications/unread-count');
  }

  async markNotificationRead(notificationId) {
    return this.patch(`/notifications/${notificationId}/read`, {});
  }

  async markAllNotificationsRead() {
    return this.patch('/notifications/read-all', {});
  }

  // --- Audit Logs, Security Forensics & Compliance (Phase 13) ---
  async getAuditLogs(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.get(`/audits${qs ? `?${qs}` : ''}`);
  }

  async getSecuritySummary() {
    return this.get('/audits/summary');
  }

  async exportAuditLogs(format = 'csv') {
    return this.get(`/audits/export?format=${encodeURIComponent(format)}`);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);

