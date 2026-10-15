import { useState, useEffect } from 'react';
import { Camera, Eye, EyeOff, KeyRound, ShieldCheck } from 'lucide-react';
import { useData } from '../context/DataContext';
import { addStaff, updateStaff } from '../data/services';
import Modal from './ui/Modal';
import Input from './ui/Input';
import Select from './ui/Select';
import Button from './ui/Button';
import Avatar from './ui/Avatar';

const emptyForm = {
  name: '',
  phone: '',
  email: '',
  role: 'Receptionist',
  branch: 'All Branches',
  joiningDate: new Date().toISOString().split('T')[0],
  salary: '',
  workingHours: '',
  status: 'active',
  photo: '',
  loginEnabled: false,
  password: '',      // plain text — only used during save, never persisted
  changePassword: false,
};

const staffRoles = ['Gym Owner', 'Manager', 'Trainer', 'Receptionist', 'Nutritionist', 'Cleaner', 'Security', 'Other'];

async function hashPassword(password) {
  if (window.crypto?.subtle) {
    const bytes = new TextEncoder().encode(`bilzyfit-local-v1:${password}`);
    const digest = await window.crypto.subtle.digest('SHA-256', bytes);
    return Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  return btoa(unescape(encodeURIComponent(`bilzyfit-local-v1:${password}`)));
}

export default function StaffModal({ open, onClose, staff }) {
  const { data, setData } = useData();
  const [form, setForm] = useState(emptyForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const isEdit = Boolean(staff);

  useEffect(() => {
    if (open) {
      setShowPassword(false);
      setPasswordError('');
      setForm(staff ? { ...emptyForm, ...staff, password: '', changePassword: false } : emptyForm);
    }
  }, [open, staff]);

  const handleChange = (field, value) =>
    setForm((f) => ({ ...f, [field]: value }));

  const handlePhotoChange = (file) => {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => handleChange('photo', reader.result);
    reader.readAsDataURL(file);
  };

  const removePhoto = () => handleChange('photo', '');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.phone.trim()) return;

    setPasswordError('');

    // Validate password if login is enabled
    if (form.loginEnabled) {
      const needsPassword = !isEdit || form.changePassword;
      if (needsPassword && form.password.trim().length < 6) {
        setPasswordError('Password must be at least 6 characters.');
        return;
      }
    }

    setLoading(true);

    // Build payload — never persist plain password
    const { password, changePassword, ...rest } = form;
    const payload = { ...rest, salary: Number(form.salary) || 0 };

    if (form.loginEnabled) {
      const needsHash = !isEdit || changePassword;
      if (needsHash && password.trim()) {
        payload.passwordHash = await hashPassword(password.trim());
      }
    } else {
      // If login disabled, clear credentials
      payload.passwordHash = '';
    }

    if (isEdit) {
      const { data: next } = updateStaff(data, staff.id, payload);
      setData(next);
    } else {
      const { data: next } = addStaff(data, payload);
      setData(next);
    }

    setLoading(false);
    onClose();
  };

  const showPasswordField = form.loginEnabled && (!isEdit || form.changePassword);

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEdit ? 'Edit Staff' : 'Add Staff'}
      size="md"
      footer={
        <>
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" form="staff-form" disabled={loading}>
            {loading ? 'Saving...' : isEdit ? 'Update Staff' : 'Add Staff'}
          </Button>
        </>
      }
    >
      <form id="staff-form" onSubmit={handleSubmit} className="space-y-4">
        {/* Photo upload */}
        <div className="flex items-center gap-4">
          <Avatar name={form.name} src={form.photo} size="lg" />
          <div className="flex-1">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">Profile Photo</label>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-600 transition-colors hover:bg-gray-50">
              <Camera className="h-4 w-4 text-primary-600" />
              <span>{form.photo ? 'Change Photo' : 'Upload Photo'}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePhotoChange(e.target.files[0])}
              />
            </label>
            {form.photo && (
              <button
                type="button"
                onClick={removePhoto}
                className="ml-3 text-sm text-red-600 hover:text-red-700"
              >
                Remove
              </button>
            )}
          </div>
        </div>

        {/* Basic fields */}
        <div className="grid gap-4 sm:grid-cols-2">
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            required
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            required
          />
          <Input
            label="Email"
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />
          <Select
            label="Role"
            value={form.role}
            onChange={(e) => handleChange('role', e.target.value)}
            options={staffRoles.map((r) => ({ value: r, label: r }))}
          />
          <Select
            label="Assigned Gym Branch"
            value={form.branch || 'All Branches'}
            onChange={(e) => handleChange('branch', e.target.value)}
            options={[
              { value: 'All Branches', label: '🌐 All Branches (Global)' },
              ...(data.settings?.branches || []).map((b) => ({
                value: b.name,
                label: `🏢 ${b.name} (${b.city || 'Main'})`,
              })),
            ]}
          />
          <Input
            label="Joining Date"
            type="date"
            value={form.joiningDate}
            onChange={(e) => handleChange('joiningDate', e.target.value)}
          />
          <Input
            label="Salary (₹)"
            type="number"
            min={0}
            value={form.salary}
            onChange={(e) => handleChange('salary', e.target.value)}
          />
          <Input
            label="Working Hours"
            value={form.workingHours}
            onChange={(e) => handleChange('workingHours', e.target.value)}
            placeholder="e.g. 9 AM - 6 PM"
          />
          <Select
            label="Status"
            value={form.status}
            onChange={(e) => handleChange('status', e.target.value)}
            options={[
              { value: 'active', label: 'Active' },
              { value: 'inactive', label: 'Inactive' },
            ]}
          />
        </div>

        {/* Login access section */}
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <KeyRound className="h-4 w-4 text-primary-600" />
              <span className="text-sm font-semibold text-gray-800">App Login Access</span>
            </div>
            <label className="relative inline-flex cursor-pointer items-center">
              <input
                id="staff-login-enabled"
                type="checkbox"
                className="peer sr-only"
                checked={form.loginEnabled}
                onChange={(e) => handleChange('loginEnabled', e.target.checked)}
              />
              <div className="peer h-6 w-11 rounded-full bg-gray-300 transition-colors after:absolute after:left-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow after:transition-all after:content-[''] peer-checked:bg-primary-600 peer-checked:after:translate-x-full" />
            </label>
          </div>

          {form.loginEnabled && (
            <p className="text-xs text-gray-500">
              This staff member can log in using their <strong>name + role + password</strong>.
            </p>
          )}

          {form.loginEnabled && isEdit && staff?.passwordHash && !form.changePassword && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-xs text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Password is set
              </div>
              <button
                type="button"
                onClick={() => handleChange('changePassword', true)}
                className="text-xs font-medium text-primary-600 hover:text-primary-800"
              >
                Change password
              </button>
            </div>
          )}

          {showPasswordField && (
            <div className="relative">
              <label className="mb-1 block text-xs font-medium text-gray-700">
                {isEdit ? 'New Password' : 'Login Password'} <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  id="staff-login-password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(e) => handleChange('password', e.target.value)}
                  placeholder="Min. 6 characters"
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {passwordError && <p className="mt-1 text-xs text-red-600">{passwordError}</p>}
            </div>
          )}
        </div>
      </form>
    </Modal>
  );
}
