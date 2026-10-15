import { useMemo, useState } from 'react';
import { CreditCard, Check, Clock3, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';

const plans = [
  { name: 'Core', monthly: 199, yearly: 999, features: ['Up to 150 active members', 'Billing and attendance', '2 user logins'] },
  { name: 'Basic', monthly: 299, yearly: 1499, features: ['Unlimited member records', 'Lead follow-up tools', '3 user logins'] },
  { name: 'Premium', monthly: 399, yearly: 1999, features: ['Member mobile app', 'Multi-branch support', 'Priority support'] },
];

export default function Subscription() {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const [yearly, setYearly] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(searchParams.get('plan') || '');
  const [message, setMessage] = useState('');
  const trialDaysLeft = user?.isTrial
    ? Math.max(0, Math.ceil((new Date(user.trialEndsAt).getTime() - Date.now()) / 86400000))
    : null;

  const activeSubscription = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('bilzyfit_last_subscription') || 'null');
    } catch {
      return null;
    }
  }, [message]);

  const handlePurchase = (plan) => {
    const amount = yearly ? plan.yearly : plan.monthly;
    const billing = yearly ? 'Annual' : 'Monthly';
    const purchase = {
      id: `test-sub-${Date.now()}`,
      plan: plan.name,
      billing,
      amount,
      paymentId: `pay_test_${Date.now()}`,
      status: 'paid',
      mode: 'test',
      paidAt: new Date().toISOString(),
    };
    localStorage.setItem('bilzyfit_last_subscription', JSON.stringify(purchase));
    setSelectedPlan(plan.name);
    setMessage(`Test subscription activated: ${plan.name} ${billing.toLowerCase()} plan. No real amount was charged.`);
  };

  return (
    <div className="page-container">
      <PageHeader title="Subscription & Plans" subtitle="Choose a plan for your gym management workspace." />

      {trialDaysLeft !== null && (
        <Card className="mb-6 border-amber-200 bg-amber-50">
          <div className="flex items-center gap-3 text-amber-900">
            <Clock3 className="h-5 w-5" />
            <p className="text-sm font-medium">Free trial: <strong>{trialDaysLeft} {trialDaysLeft === 1 ? 'day' : 'days'} left</strong>. Upgrade before your trial expires.</p>
          </div>
        </Card>
      )}

      {message && <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{message}</div>}

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold text-gray-900">Plans for {user?.businessName || user?.name || 'your gym'}</h2>
          <p className="text-sm text-gray-500">Test mode is active until a Razorpay key is configured.</p>
        </div>
        <div className="inline-flex rounded-full border border-gray-200 bg-white p-1">
          <button onClick={() => setYearly(false)} className={`rounded-full px-4 py-2 text-sm font-medium ${!yearly ? 'bg-primary-600 text-white' : 'text-gray-500'}`}>Monthly</button>
          <button onClick={() => setYearly(true)} className={`rounded-full px-4 py-2 text-sm font-medium ${yearly ? 'bg-primary-600 text-white' : 'text-gray-500'}`}>Annual</button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {plans.map((plan) => (
          <Card key={plan.name} className={selectedPlan === plan.name ? 'border-primary-500 ring-2 ring-primary-100' : ''}>
            {plan.name === 'Premium' && <Badge variant="success">Recommended</Badge>}
            <h3 className="mt-3 text-xl font-bold text-gray-900">{plan.name}</h3>
            <p className="mt-2 text-3xl font-extrabold text-primary-700">₹{(yearly ? plan.yearly : plan.monthly).toLocaleString('en-IN')} <span className="text-sm font-normal text-gray-500">/ {yearly ? 'year' : 'month'}</span></p>
            <ul className="my-6 space-y-3">{plan.features.map((feature) => <li key={feature} className="flex items-center gap-2 text-sm text-gray-600"><Check className="h-4 w-4 text-emerald-600" />{feature}</li>)}</ul>
            <Button className="w-full" icon={CreditCard} onClick={() => handlePurchase(plan)}>Buy {plan.name}</Button>
          </Card>
        ))}
      </div>

      {activeSubscription && (
        <Card className="mt-6 border-primary-100 bg-primary-50">
          <div className="flex items-start gap-3">
            <ShieldCheck className="mt-0.5 h-5 w-5 text-primary-700" />
            <div><p className="font-semibold text-primary-900">Latest subscription</p><p className="text-sm text-primary-800">{activeSubscription.plan} · {activeSubscription.billing} · ₹{Number(activeSubscription.amount).toLocaleString('en-IN')} · {activeSubscription.paymentId}</p></div>
          </div>
        </Card>
      )}
    </div>
  );
}
