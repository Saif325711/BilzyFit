import { BrowserRouter, Routes, Route, Navigate, Outlet, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth, roles } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Members from './pages/Members';
import AddMember from './pages/AddMember';
import MemberProfile from './pages/MemberProfile';
import Attendance from './pages/Attendance';
import QRCheckIn from './pages/QRCheckIn';
import Memberships from './pages/Memberships';
import Finance from './pages/Finance';
import Workouts from './pages/Workouts';
import Diets from './pages/Diets';
import Leads from './pages/Leads';
import Staff from './pages/Staff';
import Trainers from './pages/Trainers';
import Reports from './pages/Reports';
import Analytics from './pages/Analytics';
import MemberPortalPage from './pages/MemberApp';
import MemberPortal from '../member-app/MemberApp';
import Settings from './pages/Settings';
import Branches from './pages/Branches';
import Messaging from './pages/Messaging';
import Operations from './pages/Operations';
import Subscription from './pages/Subscription';
import Landing from './pages/Landing';
import NotFound from './pages/NotFound';
import StaffRedirect from './pages/StaffRedirect';
import AdminPanel from './pages/AdminPanel';

function ProtectedRoute() {
  const { user, canAccess } = useAuth();
  const location = useLocation();
  if (!user) return <Navigate to="/login" replace />;
  if (user.isTrial && user.trialEndsAt && new Date(user.trialEndsAt).getTime() <= Date.now()) {
    return <Navigate to="/login?trial=expired" replace />;
  }
  const routePermissions = [
    ['/members', 'members'],
    ['/attendance', 'attendance'],
    ['/memberships', 'memberships'],
    ['/finance', 'finance'],
    ['/workouts', 'workouts'],
    ['/diets', 'diets'],
    ['/leads', 'leads'],
    ['/staff', 'staff'],
    ['/trainers', 'trainers'],
    ['/reports', 'reports'],
    ['/analytics', 'analytics'],
    ['/member-app', 'member-app'],
    ['/branches', 'branches'],
    ['/messaging', 'messaging'],
    ['/operations', 'operations'],
    ['/subscription', 'subscription'],
    ['/settings', 'settings'],
  ];
  const permission = routePermissions.find(([prefix]) =>
    location.pathname === prefix || location.pathname.startsWith(`${prefix}/`)
  )?.[1];
  if (permission && !canAccess(permission)) return <Navigate to="/" replace />;
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  );
}

function RoleRedirect() {
  const { user } = useAuth();
  if (user?.role === roles.MEMBER) return <Navigate to="/portal" replace />;
  return <Dashboard />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <DataProvider>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/staff-login" element={<StaffRedirect />} />
            <Route path="/portal" element={<MemberPortal />} />
            <Route path="/landing" element={<Landing />} />
            <Route path="/admin" element={<AdminPanel />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/" element={<RoleRedirect />} />
              <Route path="/members" element={<Members />} />
              <Route path="/members/new" element={<AddMember />} />
              <Route path="/members/:id" element={<MemberProfile />} />
              <Route path="/members/:id/edit" element={<AddMember />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/attendance/qr" element={<QRCheckIn />} />
              <Route path="/memberships" element={<Memberships />} />
              <Route path="/finance" element={<Finance />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/diets" element={<Diets />} />
              <Route path="/leads" element={<Leads />} />
              <Route path="/staff" element={<Staff />} />
              <Route path="/trainers" element={<Trainers />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/member-app" element={<MemberPortalPage />} />
              <Route path="/branches" element={<Branches />} />
              <Route path="/messaging" element={<Messaging />} />
              <Route path="/operations" element={<Operations />} />
              <Route path="/subscription" element={<Subscription />} />
              <Route path="/settings" element={<Settings />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </DataProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
