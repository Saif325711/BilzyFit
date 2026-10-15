import React, { useState } from 'react';
import {
  CheckCircle2,
  ShieldCheck,
  CreditCard,
  QrCode,
  ArrowRight,
  ArrowLeft,
  Building2,
  User,
  Phone,
  Mail,
  MapPin,
  Lock,
  Sparkles,
  Download,
  School,
  Check,
  Laptop,
  HelpCircle,
  AlertCircle
} from 'lucide-react';

export default function Checkout({ initialPlan = 'premium', onNavigateHome, onNavigatePlans }) {
  const [selectedPlan, setSelectedPlan] = useState(initialPlan === 'basic' ? 'basic' : 'premium');
  const [step, setStep] = useState(1); // 1: Info Collection, 2: Payment, 3: Success

  // Form State
  const [formData, setFormData] = useState({
    schoolName: '',
    adminName: '',
    mobileNumber: '',
    email: '',
    city: '',
    state: 'Rajasthan',
    board: 'CBSE',
    studentCount: '500-1,000',
    password: ''
  });

  const [formErrors, setFormErrors] = useState({});
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking'
  const [upiId, setUpiId] = useState('');
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');
  const [cardData, setCardData] = useState({
    cardNumber: '4532 •••• •••• 8821',
    expiry: '12/28',
    cvv: '•••',
    nameOnCard: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [transactionId, setTransactionId] = useState('');

  const planPrices = {
    basic: {
      name: 'Basic Plan',
      price: 1999,
      period: 'per year',
      gst: 360,
      total: 2359,
      features: [
        'Student Profile & Document Archive',
        'Daily Class Attendance System',
        'Fee Collection & PDF Receipts',
        'Exam Management & Gradebook',
        'Single Campus License',
        'Standard Email & Phone Support'
      ]
    },
    premium: {
      name: 'Premium Plan',
      price: 2999,
      period: 'per year',
      gst: 540,
      total: 3539,
      features: [
        'Everything in Basic Plan, PLUS:',
        'Official Meta WhatsApp Business API',
        'Online Fee Gateway (0% UPI, QR Code, Cards)',
        '4 Native Mobile Apps (Admin, Teachers, Parents, Students)',
        'NEP 2020 Holistic Progress Card (HPC)',
        'School Bus Live GPS Fleet Tracking',
        'Biometric Gate & Face Scanner Sync',
        'AI Timetable & Daily Teacher Substitution'
      ]
    }
  };

  const currentPlan = planPrices[selectedPlan];

  const handleInfoSubmit = (e) => {
    e.preventDefault();
    const errors = {};
    if (!formData.schoolName.trim()) errors.schoolName = 'School name is required';
    if (!formData.adminName.trim()) errors.adminName = 'Administrator name is required';
    if (!formData.mobileNumber.trim()) errors.mobileNumber = 'Mobile number is required';
    if (!formData.email.trim()) errors.email = 'Valid email is required';
    if (!formData.city.trim()) errors.city = 'City is required';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    setFormErrors({});
    setStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const generatedTxId = 'EDBLQ-' + Math.floor(100000 + Math.random() * 900000);
      setTransactionId(generatedTxId);
      setStep(3);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1600);
  };

  return (
    <div className="checkout-page" style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: '"Lora", serif', color: '#0f172a', paddingBottom: '80px' }}>
      
      {/* Top Header Bar */}
      <header style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '16px 0' }}>
        <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }} onClick={onNavigateHome}>
            <div style={{ width: '34px', height: '34px', borderRadius: '8px', background: 'linear-gradient(135deg, #2563eb, #1e40af)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}>
              <School className="h-5 w-5" />
            </div>
            <span style={{ fontSize: '1.2rem', fontWeight: '800', color: '#0f172a' }}>Edu<span style={{ color: '#2563eb' }}>Bliq</span></span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '13px', color: '#64748b', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> 256-Bit SSL Encrypted Checkout
            </span>
            <button 
              onClick={onNavigatePlans}
              className="btn btn-secondary btn-sm"
              style={{ fontSize: '12px', padding: '5px 12px' }}
            >
              Back to Plans
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <div className="container" style={{ maxWidth: '1000px', marginTop: '36px' }}>
        
        {/* Step Indicator Header */}
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', backgroundColor: '#eff6ff', color: '#1d4ed8', padding: '4px 14px', borderRadius: '999px', fontSize: '12px', fontWeight: '700', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Sparkles className="h-3.5 w-3.5" /> Instant School Setup
          </div>
          <h1 style={{ fontSize: '2.4rem', fontWeight: '800', color: '#090d16', margin: '0 0 8px 0' }}>
            {step === 1 && 'School Registration & Admin Details'}
            {step === 2 && 'Complete Payment & Activate License'}
            {step === 3 && 'Order Confirmed & School Portal Ready!'}
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            {step === 1 && 'Please provide your institutional details to register your official EduBliq portal.'}
            {step === 2 && 'Review your subscription summary and choose your preferred payment method.'}
            {step === 3 && 'Your annual school license is active and ready for your staff, teachers, and parents.'}
          </p>

          {/* Stepper Dots */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: step >= 1 ? '#2563eb' : '#cbd5e1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>1</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: step >= 1 ? '#2563eb' : '#64748b' }}>School Details</span>
            </div>
            <div style={{ width: '30px', height: '2px', backgroundColor: step >= 2 ? '#2563eb' : '#cbd5e1' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: step >= 2 ? '#2563eb' : '#cbd5e1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>2</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: step >= 2 ? '#2563eb' : '#64748b' }}>Payment</span>
            </div>
            <div style={{ width: '30px', height: '2px', backgroundColor: step >= 3 ? '#16a34a' : '#cbd5e1' }}></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '26px', height: '26px', borderRadius: '50%', backgroundColor: step >= 3 ? '#16a34a' : '#cbd5e1', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' }}>3</span>
              <span style={{ fontSize: '13px', fontWeight: '700', color: step >= 3 ? '#16a34a' : '#64748b' }}>Portal Active</span>
            </div>
          </div>
        </div>

        {/* STEP 1: REGISTRATION / INFORMATION COLLECTION FORM */}
        {step === 1 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
            
            {/* Form Left Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              
              {/* Plan Switch Selector */}
              <div style={{ marginBottom: '24px', padding: '14px', backgroundColor: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Selected Annual Plan
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <button
                    type="button"
                    onClick={() => setSelectedPlan('basic')}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: selectedPlan === 'basic' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: selectedPlan === 'basic' ? '#eff6ff' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <div style={{ fontWeight: '800', fontSize: '14px', color: selectedPlan === 'basic' ? '#1d4ed8' : '#0f172a' }}>Basic Plan</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>₹1,999<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>/yr</span></div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>Essential ERP modules</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedPlan('premium')}
                    style={{
                      padding: '12px 14px',
                      borderRadius: '8px',
                      border: selectedPlan === 'premium' ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: selectedPlan === 'premium' ? '#eff6ff' : '#ffffff',
                      textAlign: 'left',
                      cursor: 'pointer',
                      position: 'relative',
                      transition: 'all 0.15s ease'
                    }}
                  >
                    <span style={{ position: 'absolute', top: '-8px', right: '8px', backgroundColor: '#16a34a', color: '#fff', fontSize: '9px', fontWeight: '800', padding: '1px 6px', borderRadius: '999px' }}>
                      POPULAR
                    </span>
                    <div style={{ fontWeight: '800', fontSize: '14px', color: selectedPlan === 'premium' ? '#1d4ed8' : '#0f172a' }}>Premium Plan</div>
                    <div style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '2px 0' }}>₹2,999<span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>/yr</span></div>
                    <div style={{ fontSize: '11px', color: '#64748b' }}>WhatsApp + Apps + GPS</div>
                  </button>
                </div>
              </div>

              <form onSubmit={handleInfoSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                
                {/* School Name */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    School / Institution Full Name *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <School className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input 
                      type="text"
                      placeholder="e.g. St. Xavier's International School"
                      value={formData.schoolName}
                      onChange={(e) => setFormData({ ...formData, schoolName: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: formErrors.schoolName ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  {formErrors.schoolName && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.schoolName}</span>}
                </div>

                {/* Admin Name & Mobile */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Principal / Admin Name *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <User className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input 
                        type="text"
                        placeholder="Dr. Anand Verma"
                        value={formData.adminName}
                        onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: formErrors.adminName ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    {formErrors.adminName && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.adminName}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Mobile Number (WhatsApp) *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <Phone className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input 
                        type="tel"
                        placeholder="+91 98765 43210"
                        value={formData.mobileNumber}
                        onChange={(e) => setFormData({ ...formData, mobileNumber: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: formErrors.mobileNumber ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    {formErrors.mobileNumber && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.mobileNumber}</span>}
                  </div>
                </div>

                {/* Email Address */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Official School Email Address *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Mail className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input 
                      type="email"
                      placeholder="principal@school.edu.in"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: formErrors.email ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  {formErrors.email && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.email}</span>}
                </div>

                {/* City & State */}
                <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      City *
                    </label>
                    <div style={{ position: 'relative' }}>
                      <MapPin className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                      <input 
                        type="text"
                        placeholder="Jaipur / Bengaluru"
                        value={formData.city}
                        onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: formErrors.city ? '1px solid #ef4444' : '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    {formErrors.city && <span style={{ fontSize: '11px', color: '#ef4444' }}>{formErrors.city}</span>}
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      State
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Rajasthan">Rajasthan</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Delhi-NCR">Delhi-NCR</option>
                      <option value="Telangana">Telangana</option>
                      <option value="Uttar Pradesh">Uttar Pradesh</option>
                      <option value="Gujarat">Gujarat</option>
                      <option value="Madhya Pradesh">Madhya Pradesh</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                      <option value="West Bengal">West Bengal</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                {/* Board & Student Strength */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Board Affiliation
                    </label>
                    <select
                      value={formData.board}
                      onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="CBSE">CBSE Board</option>
                      <option value="ICSE">ICSE / ISC</option>
                      <option value="State Board">State Education Board</option>
                      <option value="IB/Cambridge">IB / Cambridge</option>
                      <option value="Play/Pre-Primary">Play / Pre-Primary</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                      Student Strength
                    </label>
                    <select
                      value={formData.studentCount}
                      onChange={(e) => setFormData({ ...formData, studentCount: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#ffffff' }}
                    >
                      <option value="Up to 500">Up to 500 Students</option>
                      <option value="500-1,000">500 - 1,000 Students</option>
                      <option value="1,000-2,500">1,000 - 2,500 Students</option>
                      <option value="2,500+">2,500+ Students</option>
                    </select>
                  </div>
                </div>

                {/* Create Password */}
                <div>
                  <label style={{ display: 'block', fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Create School Portal Master Password *
                  </label>
                  <div style={{ position: 'relative' }}>
                    <Lock className="h-4 w-4 text-slate-400" style={{ position: 'absolute', left: '12px', top: '13px' }} />
                    <input 
                      type="password"
                      placeholder="••••••••••••"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      style={{ width: '100%', padding: '10px 14px 10px 38px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <span style={{ fontSize: '11px', color: '#64748b' }}>Used to log into your school admin dashboard after payment.</span>
                </div>

                <button 
                  type="submit" 
                  className="btn btn-primary btn-lg"
                  style={{ width: '100%', padding: '14px', marginTop: '10px', fontSize: '1rem', fontWeight: '700' }}
                >
                  Proceed to Secure Payment →
                </button>
              </form>
            </div>

            {/* Order Summary Right Card */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '13px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '6px' }}>
                Subscription Summary
              </div>
              <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                {currentPlan.name}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '18px' }}>
                Full 1-Year Institutional License (365 Days)
              </div>

              <div style={{ padding: '14px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#475569' }}>Annual License Fee:</span>
                  <span style={{ fontWeight: '700', color: '#0f172a' }}>₹{currentPlan.price.toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#475569' }}>Cloud Onboarding & Data Migration:</span>
                  <span style={{ fontWeight: '700', color: '#16a34a' }}>FREE (₹0)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
                  <span style={{ color: '#475569' }}>GST (18% Included):</span>
                  <span style={{ fontWeight: '600', color: '#64748b' }}>₹{currentPlan.gst.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid #f1f5f9' }}>
                <span style={{ fontWeight: '800', fontSize: '1.1rem', color: '#0f172a' }}>Total Amount Payable:</span>
                <span style={{ fontWeight: '800', fontSize: '1.6rem', color: '#2563eb' }}>₹{currentPlan.price.toLocaleString('en-IN')}</span>
              </div>

              {/* Highlights included */}
              <div style={{ marginTop: '20px' }}>
                <div style={{ fontSize: '12px', fontWeight: '800', color: '#334155', textTransform: 'uppercase', marginBottom: '10px' }}>
                  Included In Your License:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {currentPlan.features.map((feat, idx) => (
                    <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12.5px', color: '#475569' }}>
                      <Check className="h-4 w-4 text-emerald-600" style={{ flexShrink: 0 }} />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ marginTop: '24px', padding: '12px', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <CheckCircle2 className="h-4 w-4 text-emerald-600" style={{ flexShrink: 0 }} />
                <span style={{ fontSize: '11.5px', color: '#166534', fontWeight: '600' }}>
                  30-Day Unconditional Money-Back Guarantee
                </span>
              </div>
            </div>

          </div>
        )}

        {/* STEP 2: PAYMENT METHOD SELECTION SCREEN */}
        {step === 2 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '32px', alignItems: 'start' }}>
            
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '32px', border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
              
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <h2 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                  Select Payment Option
                </h2>
                <button
                  onClick={() => setStep(1)}
                  style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#2563eb', fontSize: '13px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <ArrowLeft className="h-3.5 w-3.5" /> Edit Details
                </button>
              </div>

              {/* Payment Methods Tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '24px' }}>
                {[
                  { id: 'upi', label: 'UPI / QR Code', icon: QrCode },
                  { id: 'card', label: 'Credit / Debit Card', icon: CreditCard },
                  { id: 'netbanking', label: 'Net Banking', icon: Building2 }
                ].map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => setPaymentMethod(m.id)}
                    style={{
                      padding: '14px 10px',
                      borderRadius: '10px',
                      border: paymentMethod === m.id ? '2px solid #2563eb' : '1px solid #cbd5e1',
                      backgroundColor: paymentMethod === m.id ? '#eff6ff' : '#ffffff',
                      color: paymentMethod === m.id ? '#1d4ed8' : '#475569',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '6px',
                      cursor: 'pointer',
                      fontWeight: '700',
                      fontSize: '12px'
                    }}
                  >
                    <m.icon className="h-5 w-5" />
                    <span>{m.label}</span>
                  </button>
                ))}
              </div>

              {/* METHOD 1: UPI / QR CODE */}
              {paymentMethod === 'upi' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0', textAlign: 'center' }}>
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#334155', marginBottom: '12px' }}>
                    Scan QR Code using Google Pay, PhonePe, Paytm, or any UPI App
                  </div>

                  {/* Mock QR Code Display */}
                  <div style={{ width: '170px', height: '170px', backgroundColor: '#ffffff', border: '2px solid #0f172a', borderRadius: '12px', padding: '10px', margin: '0 auto 16px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <div style={{ width: '100%', height: '100%', background: 'repeating-conic-gradient(#0f172a 0% 25%, #ffffff 0% 50%) 50% / 14px 14px', borderRadius: '4px' }}></div>
                  </div>

                  <div style={{ fontSize: '13px', fontWeight: '800', color: '#0f172a', marginBottom: '4px' }}>
                    UPI ID: <span style={{ color: '#2563eb' }}>edubliq@icici</span>
                  </div>
                  <div style={{ fontSize: '11px', color: '#64748b', marginBottom: '20px' }}>
                    Amount: ₹{currentPlan.price.toLocaleString('en-IN')} (One-time annual payment)
                  </div>

                  <div style={{ display: 'flex', gap: '8px', maxWidth: '360px', margin: '0 auto' }}>
                    <input 
                      type="text" 
                      placeholder="Or enter your UPI ID (e.g. mobile@upi)" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      style={{ flex: 1, padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>
              )}

              {/* METHOD 2: CARDS */}
              {paymentMethod === 'card' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Card Number</label>
                    <input 
                      type="text" 
                      value={cardData.cardNumber}
                      onChange={(e) => setCardData({ ...cardData, cardNumber: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Expiry (MM/YY)</label>
                      <input 
                        type="text" 
                        value={cardData.expiry}
                        onChange={(e) => setCardData({ ...cardData, expiry: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>CVV</label>
                      <input 
                        type="password" 
                        value={cardData.cvv}
                        onChange={(e) => setCardData({ ...cardData, cvv: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                      />
                    </div>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Name on Card</label>
                    <input 
                      type="text" 
                      placeholder={formData.adminName || "Principal / Management Account"}
                      style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px' }}
                    />
                  </div>
                </div>
              )}

              {/* METHOD 3: NETBANKING */}
              {paymentMethod === 'netbanking' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '8px' }}>Select Institutional Bank</label>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '14px' }}>
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Bank', 'Punjab National Bank'].map((b) => (
                      <button
                        key={b}
                        type="button"
                        onClick={() => setSelectedBank(b)}
                        style={{
                          padding: '10px 12px',
                          borderRadius: '8px',
                          border: selectedBank === b ? '2px solid #2563eb' : '1px solid #cbd5e1',
                          backgroundColor: selectedBank === b ? '#eff6ff' : '#ffffff',
                          fontWeight: '700',
                          fontSize: '12px',
                          textAlign: 'left',
                          cursor: 'pointer'
                        }}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Pay Now Button */}
              <button
                type="button"
                onClick={handlePayment}
                disabled={isProcessing}
                className="btn btn-primary btn-lg"
                style={{ width: '100%', padding: '15px', marginTop: '24px', fontSize: '1.05rem', fontWeight: '800' }}
              >
                {isProcessing ? 'Processing Payment with Bank...' : `Pay ₹${currentPlan.price.toLocaleString('en-IN')} & Activate School ERP`}
              </button>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '14px', fontSize: '11px', color: '#64748b' }}>
                <Lock className="h-3.5 w-3.5 text-emerald-600" />
                RBI & PCI-DSS Level-1 Certified Safe Payment Gateway
              </div>
            </div>

            {/* Right Side Summary */}
            <div style={{ backgroundColor: '#ffffff', borderRadius: '16px', padding: '28px', border: '1px solid #e2e8f0', boxShadow: '0 4px 14px rgba(0,0,0,0.03)' }}>
              <div style={{ fontSize: '12px', fontWeight: '800', color: '#2563eb', textTransform: 'uppercase', marginBottom: '6px' }}>
                Registered School Entity
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>
                {formData.schoolName || 'Your School Campus'}
              </h3>
              <div style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '16px' }}>
                Admin: {formData.adminName} • {formData.city}, {formData.state}
              </div>

              <div style={{ padding: '12px 0', borderTop: '1px solid #f1f5f9', borderBottom: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '13.5px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Plan Selected:</span>
                  <span style={{ fontWeight: '700' }}>{currentPlan.name} (1 Year)</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Student Range:</span>
                  <span style={{ fontWeight: '600' }}>{formData.studentCount}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Board:</span>
                  <span style={{ fontWeight: '600' }}>{formData.board}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Total Due:</span>
                  <span style={{ fontWeight: '800', color: '#2563eb', fontSize: '16px' }}>₹{currentPlan.price.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div style={{ marginTop: '20px', padding: '12px', backgroundColor: '#eff6ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '700', color: '#1d4ed8', marginBottom: '4px' }}>
                  What happens next?
                </div>
                <div style={{ fontSize: '11.5px', color: '#1e40af', lineHeight: '1.5' }}>
                  Once your payment is approved, your master login credentials will be generated instantly and sent to your WhatsApp ({formData.mobileNumber}) and email ({formData.email}).
                </div>
              </div>
            </div>

          </div>
        )}

        {/* STEP 3: SUCCESS & ACTIVATION SCREEN */}
        {step === 3 && (
          <div style={{ backgroundColor: '#ffffff', borderRadius: '20px', padding: '48px 36px', border: '1px solid #e2e8f0', boxShadow: '0 8px 30px rgba(0,0,0,0.06)', maxWidth: '720px', margin: '0 auto', textAlign: 'center' }}>
            
            <div style={{ width: '72px', height: '72px', borderRadius: '50%', backgroundColor: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
              <Check className="h-10 w-10" />
            </div>

            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', backgroundColor: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '999px', fontSize: '12px', fontWeight: '800', textTransform: 'uppercase', marginBottom: '12px' }}>
              Payment Verified • Transaction Successful
            </div>

            <h2 style={{ fontSize: '2.2rem', fontWeight: '800', color: '#0f172a', marginBottom: '10px' }}>
              Welcome to EduBliq!
            </h2>

            <p style={{ fontSize: '1.05rem', color: '#475569', lineHeight: '1.6', maxWidth: '540px', margin: '0 auto 28px' }}>
              Congratulations! The <strong>{currentPlan.name}</strong> for <strong>{formData.schoolName || 'your school'}</strong> has been officially activated.
            </p>

            {/* Receipt Summary Box */}
            <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px 24px', textAlign: 'left', marginBottom: '32px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', fontSize: '13.5px' }}>
                <div>
                  <span style={{ color: '#64748b' }}>Transaction ID:</span>
                  <div style={{ fontWeight: '800', color: '#0f172a' }}>{transactionId}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Amount Paid:</span>
                  <div style={{ fontWeight: '800', color: '#16a34a', fontSize: '15px' }}>₹{currentPlan.price.toLocaleString('en-IN')} (Annual)</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>Admin Portal Login:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{formData.email}</div>
                </div>
                <div>
                  <span style={{ color: '#64748b' }}>SMS/WhatsApp Alerts:</span>
                  <div style={{ fontWeight: '700', color: '#0f172a' }}>{formData.mobileNumber}</div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', gap: '14px', flexWrap: 'wrap' }}>
              <button 
                onClick={onNavigateHome}
                className="btn btn-primary btn-lg"
                style={{ padding: '14px 28px', fontWeight: '700' }}
              >
                Go to School Dashboard / Home →
              </button>
              <button 
                onClick={() => alert(`Tax Invoice downloaded for ${formData.schoolName} (${transactionId}).`)}
                className="btn btn-secondary btn-lg"
                style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <Download className="h-4 w-4" /> Download Tax Invoice (PDF)
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
