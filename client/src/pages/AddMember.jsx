import { useState, useMemo, useRef, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { User, Phone, Info, ImageIcon, ArrowRight, ArrowLeft, UserPlus, Upload } from 'lucide-react';
import { useData } from '../context/DataContext';
import { enrollMember, updateMember } from '../data/services';
import { fmtDate, addMonths } from '../data/seed';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Textarea from '../components/ui/Textarea';
import Avatar from '../components/ui/Avatar';
import PageHeader from '../components/ui/PageHeader';

const emptyMember = {
  fullName: '',
  gender: 'Male',
  dob: '',
  mobile: '',
  address: '',
  goal: 'General Fitness',
  bloodGroup: 'O+',
  emergencyContact: '',
  email: '',
  joiningDate: fmtDate(new Date()),
  notes: '',
  branch: 'Delhi Branch',
  status: 'active',
  photo: '',
  height: '',
  weight: '',
  kycType: '',
  kycNumber: '',
  healthDeclaration: '',
  waiverAccepted: false,
  documents: [],
};

function SectionHeader({ icon: Icon, title }) {
  return (
    <div className="flex items-center gap-2 rounded-t-lg bg-primary-700 px-4 py-3 text-white">
      <Icon className="h-5 w-5" />
      <span className="font-medium">{title}</span>
    </div>
  );
}

export default function AddMember() {
  const { data, setData, activeBranch } = useData();
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);
  const fileInputRef = useRef(null);
  const [step, setStep] = useState(1);
  const [member, setMember] = useState(emptyMember);
  const [payment, setPayment] = useState(() => ({
    planId: data.plans[0]?.id || '',
    startDate: fmtDate(new Date()),
    payingAmount: data.plans[0]?.price || 0,
    transactionDate: fmtDate(new Date()),
    paymentMethod: 'Cash',
    remark: '',
  }));
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isEdit) {
      const existing = data.members.find((m) => m.id === id);
      if (existing) {
        setMember({ ...emptyMember, ...existing });
      }
    } else {
      const defaultBranch = (activeBranch && activeBranch !== 'all')
        ? activeBranch
        : data.settings.branches?.[0]?.name || 'Main Branch';
      setMember({
        ...emptyMember,
        branch: defaultBranch,
      });
    }
  }, [isEdit, id, data.members, data.settings.branches, activeBranch]);

  const selectedPlan = useMemo(
    () => data.plans.find((p) => p.id === payment.planId),
    [data.plans, payment.planId]
  );

  const membershipDetails = useMemo(() => {
    if (!selectedPlan || !payment.startDate) return { endDate: '', amount: 0 };
    const start = new Date(payment.startDate);
    const end = addMonths(start, selectedPlan.durationMonths);
    return { endDate: fmtDate(end), amount: selectedPlan.price };
  }, [selectedPlan, payment.startDate]);

  const handleMemberChange = (field, value) => setMember((m) => ({ ...m, [field]: value }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      handleMemberChange('photo', ev.target?.result || '');
    };

    reader.readAsDataURL(file);
  };

  const handleDocumentChange = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    Promise.all(files.map((file) => new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve({ name: file.name, type: file.type, data: reader.result });
      reader.readAsDataURL(file);
    }))).then((documents) => setMember((current) => ({ ...current, documents: [...(current.documents || []), ...documents] })));
  };

  const handlePlanChange = (planId) => {
    const plan = data.plans.find((p) => p.id === planId);
    setPayment((p) => ({
      ...p,
      planId,
      payingAmount: plan ? plan.price : p.payingAmount,
    }));
  };

  const handlePaymentChange = (field, value) => setPayment((p) => ({ ...p, [field]: value }));

  const canGoNext = member.fullName && member.mobile;

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      if (isEdit) {
        const { data: next } = updateMember(data, id, member);
        setData(next);
      } else {
        const { data: next } = enrollMember(data, member, {
          planId: payment.planId,
          startDate: payment.startDate,
          paymentAmount: Number(payment.payingAmount),
          paymentMethod: payment.paymentMethod,
        });
        setData(next);
      }
      setLoading(false);
      navigate('/members');
    }, 300);
  };

  const bottomActions = (
    <div className="mt-6 flex items-center justify-between border-t border-gray-200 pt-4">
      {step === 1 ? (
        <>
          <Button variant="secondary" onClick={() => navigate('/members')}>
            Cancel
          </Button>
          <Button onClick={() => setStep(2)} disabled={!canGoNext} icon={ArrowRight}>
            Next Step
          </Button>
        </>
      ) : (
        <>
          <Button variant="secondary" onClick={() => setStep(1)} icon={ArrowLeft}>
            Back
          </Button>
          <Button onClick={handleSubmit} disabled={loading} icon={UserPlus}>
            {loading ? 'Saving...' : isEdit ? 'Save Changes' : 'Add Member'}
          </Button>
        </>
      )}
    </div>
  );

  return (
    <div className="page-container">
      <PageHeader
        title={isEdit ? 'Edit Member' : 'Add Member'}
        subtitle={step === 1 ? 'Step 1: Personal details' : isEdit ? 'Step 2: Review & body metrics' : 'Step 2: Membership & payment'}
      />

      <form onSubmit={handleSubmit}>
        {step === 1 && (
          <>
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <SectionHeader icon={User} title="Personal Information" />
                <div className="space-y-4 p-4">
                  <Input
                    label="Name *"
                    value={member.fullName}
                    onChange={(e) => handleMemberChange('fullName', e.target.value)}
                    required
                  />
                  <div>
                    <label className="mb-1.5 block text-sm font-medium text-gray-700">Gender *</label>
                    <div className="flex gap-6">
                      {['Male', 'Female', 'Other'].map((g) => (
                        <label key={g} className="flex items-center gap-2 text-sm text-gray-700">
                          <input
                            type="radio"
                            name="gender"
                            value={g}
                            checked={member.gender === g}
                            onChange={(e) => handleMemberChange('gender', e.target.value)}
                            className="h-4 w-4 text-primary-600 focus:ring-primary-500"
                          />
                          {g}
                        </label>
                      ))}
                    </div>
                  </div>
                  <Input
                    label="Date of birth"
                    type="date"
                    value={member.dob}
                    onChange={(e) => handleMemberChange('dob', e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <SectionHeader icon={Phone} title="Contact Information" />
                <div className="space-y-4 p-4">
                  <Input
                    label="Contact *"
                    value={member.mobile}
                    onChange={(e) => handleMemberChange('mobile', e.target.value)}
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    value={member.email}
                    onChange={(e) => handleMemberChange('email', e.target.value)}
                  />
                  <Textarea
                    label="Address"
                    value={member.address}
                    onChange={(e) => handleMemberChange('address', e.target.value)}
                  />
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <SectionHeader icon={Info} title="Other Information" />
                <div className="space-y-4 p-4">
                  <Select
                    label="Goal"
                    value={member.goal}
                    onChange={(e) => handleMemberChange('goal', e.target.value)}
                    options={[
                      { value: 'Weight Loss', label: 'Weight Loss' },
                      { value: 'Muscle Gain', label: 'Muscle Gain' },
                      { value: 'General Fitness', label: 'General Fitness' },
                      { value: 'Strength', label: 'Strength' },
                      { value: 'Bodybuilding', label: 'Bodybuilding' },
                      { value: 'Endurance', label: 'Endurance' },
                    ]}
                  />
                  <Select
                    label="Blood Group"
                    value={member.bloodGroup}
                    onChange={(e) => handleMemberChange('bloodGroup', e.target.value)}
                    options={['A+', 'B+', 'O+', 'AB+', 'A-', 'B-', 'O-', 'AB-'].map((v) => ({ value: v, label: v }))}
                  />
                  <Input
                    label="Emergency Contact"
                    value={member.emergencyContact}
                    onChange={(e) => handleMemberChange('emergencyContact', e.target.value)}
                  />
                  <Input
                    label="Joining Date"
                    type="date"
                    value={member.joiningDate}
                    onChange={(e) => handleMemberChange('joiningDate', e.target.value)}
                  />
                  <Select
                    label="Status"
                    value={member.status}
                    onChange={(e) => handleMemberChange('status', e.target.value)}
                    options={[
                      { value: 'active', label: 'Active' },
                      { value: 'inactive', label: 'Inactive' },
                      { value: 'expiring', label: 'Expiring' },
                      { value: 'expired', label: 'Expired' },
                    ]}
                  />
                  <Select
                    label="Branch"
                    value={member.branch}
                    onChange={(e) => handleMemberChange('branch', e.target.value)}
                    options={(data.settings.branches || []).map((branch) => ({
                      value: branch.name,
                      label: branch.name,
                    }))}
                  />
                  <Textarea
                    label="Notes"
                    value={member.notes}
                    onChange={(e) => handleMemberChange('notes', e.target.value)}
                  />
                  <div className="border-t border-gray-100 pt-4">
                    <p className="mb-3 text-sm font-semibold text-gray-800">KYC, health & waiver</p>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Select
                        label="KYC document"
                        value={member.kycType}
                        onChange={(e) => handleMemberChange('kycType', e.target.value)}
                        options={[{ value: '', label: 'Not provided' }, { value: 'Aadhaar', label: 'Aadhaar' }, { value: 'PAN', label: 'PAN' }, { value: 'Passport', label: 'Passport' }, { value: 'Driving Licence', label: 'Driving Licence' }]}
                      />
                      <Input
                        label="KYC number"
                        value={member.kycNumber}
                        onChange={(e) => handleMemberChange('kycNumber', e.target.value)}
                      />
                    </div>
                    <Textarea
                      label="Health declaration"
                      value={member.healthDeclaration}
                      onChange={(e) => handleMemberChange('healthDeclaration', e.target.value)}
                      placeholder="Injuries, conditions or exercise restrictions"
                    />
                    <label className="mt-3 flex items-start gap-2 text-sm text-gray-700">
                      <input type="checkbox" checked={Boolean(member.waiverAccepted)} onChange={(e) => handleMemberChange('waiverAccepted', e.target.checked)} className="mt-0.5" />
                      I acknowledge the gym waiver and member participation terms.
                    </label>
                    <label className="mt-3 block text-sm font-medium text-gray-700">
                      Supporting documents
                      <input type="file" multiple accept="image/*,.pdf" onChange={handleDocumentChange} className="mt-1 block w-full text-sm text-gray-500" />
                    </label>
                    {member.documents?.length > 0 && <p className="mt-2 text-xs text-gray-500">{member.documents.map((document) => document.name).join(', ')}</p>}
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <SectionHeader icon={ImageIcon} title="Profile Photo" />
                <div className="flex flex-col items-center p-6">
                  <Avatar
                    name={member.fullName || '?'}
                    src={member.photo}
                    size="lg"
                    className="mb-4 h-28 w-28 text-2xl"
                  />
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhotoChange}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={Upload}
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Upload Photo
                  </Button>
                </div>
              </div>
            </div>
            {bottomActions}
          </>
        )}

        {step === 2 && (
          <>
            <div className="mx-auto max-w-3xl space-y-6">
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <SectionHeader icon={User} title="Profile Summary" />
                <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-start">
                  <Avatar
                    name={member.fullName || '?'}
                    src={member.photo}
                    size="lg"
                    className="h-20 w-20 text-xl"
                  />
                  <div className="grid flex-1 gap-x-4 gap-y-2 text-sm sm:grid-cols-2">
                    <p><span className="font-medium text-gray-900">Name:</span> {member.fullName}</p>
                    <p><span className="font-medium text-gray-900">Gender:</span> {member.gender}</p>
                    <p><span className="font-medium text-gray-900">DOB:</span> {member.dob || '—'}</p>
                    <p><span className="font-medium text-gray-900">Contact:</span> {member.mobile}</p>
                    <p><span className="font-medium text-gray-900">Email:</span> {member.email || '—'}</p>
                    <p><span className="font-medium text-gray-900">Goal:</span> {member.goal}</p>
                    <p className="sm:col-span-2"><span className="font-medium text-gray-900">Address:</span> {member.address || '—'}</p>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <div className="bg-primary-700 px-4 py-3 text-white">
                  <h3 className="font-medium">Body Metrics</h3>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <Input
                    label="Height (cm)"
                    type="number"
                    min={1}
                    value={member.height}
                    onChange={(e) => handleMemberChange('height', e.target.value)}
                    placeholder="e.g. 175"
                  />
                  <Input
                    label="Weight (kg)"
                    type="number"
                    min={1}
                    value={member.weight}
                    onChange={(e) => handleMemberChange('weight', e.target.value)}
                    placeholder="e.g. 70"
                  />
                </div>
              </div>

              {!isEdit && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <div className="bg-primary-700 px-4 py-3 text-white">
                  <h3 className="font-medium">1. Select Membership</h3>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <Select
                    label="Select membership *"
                    value={payment.planId}
                    onChange={(e) => handlePlanChange(e.target.value)}
                    options={data.plans.map((p) => ({
                      value: p.id,
                      label: `${p.name} — ₹${p.price.toLocaleString('en-IN')}`,
                    }))}
                    required
                  />
                  <Input
                    label="Start date *"
                    type="date"
                    value={payment.startDate}
                    onChange={(e) => handlePaymentChange('startDate', e.target.value)}
                    required
                  />
                  <Input
                    label="End date *"
                    type="date"
                    value={membershipDetails.endDate}
                    disabled
                    required
                  />
                  <Input
                    label="Amount (₹) *"
                    type="number"
                    value={membershipDetails.amount}
                    disabled
                    required
                  />
                </div>
              </div>
              )}
              {!isEdit && (
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-card">
                <div className="bg-primary-700 px-4 py-3 text-white">
                  <h3 className="font-medium">2. Payments</h3>
                </div>
                <div className="grid gap-4 p-4 sm:grid-cols-2">
                  <Input
                    label="Paying amount (₹) *"
                    type="number"
                    value={payment.payingAmount}
                    onChange={(e) => handlePaymentChange('payingAmount', e.target.value)}
                    required
                  />
                  <Input
                    label="Transaction date *"
                    type="date"
                    value={payment.transactionDate}
                    onChange={(e) => handlePaymentChange('transactionDate', e.target.value)}
                    required
                  />
                  <Select
                    label="Select payment mode *"
                    value={payment.paymentMethod}
                    onChange={(e) => handlePaymentChange('paymentMethod', e.target.value)}
                    options={[
                      { value: 'Cash', label: 'Cash' },
                      { value: 'UPI', label: 'UPI' },
                      { value: 'Card', label: 'Card' },
                      { value: 'Bank Transfer', label: 'Bank Transfer' },
                      { value: 'Online', label: 'Online Payment' },
                    ]}
                    required
                  />
                  <Textarea
                    label="Remark"
                    value={payment.remark}
                    onChange={(e) => handlePaymentChange('remark', e.target.value)}
                  />
                </div>
              </div>
              )}
            </div>
            {bottomActions}
          </>
        )}
      </form>
    </div>
  );
}
