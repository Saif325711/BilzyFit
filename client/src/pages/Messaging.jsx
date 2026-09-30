import { useState, useMemo } from 'react';
import { useData } from '../context/DataContext';
import { addMessage } from '../data/services';
import PageHeader from '../components/ui/PageHeader';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Textarea from '../components/ui/Textarea';
import Badge from '../components/ui/Badge';
import { MessageSquare, Send, Clock, Users, UserCheck, CalendarClock, Wallet } from 'lucide-react';

const templates = {
  'Membership Renewal': 'Hi {name}, your membership at BilzyFit is due for renewal. Renew now to continue your fitness journey! 💪',
  'Membership Expiry': 'Hi {name}, your BilzyFit membership expires soon. Renew today to avoid interruption.',
  'Payment Reminder': 'Hi {name}, this is a friendly reminder that your pending payment of ₹{pending} is due. Please clear it at the earliest.',
  'Birthday': 'Happy Birthday {name}! 🎉 Enjoy a complimentary session at BilzyFit today.',
  'Welcome Message': 'Welcome to BilzyFit, {name}! We are excited to be part of your fitness journey.',
  'Trial Reminder': 'Hi {name}, your trial session at BilzyFit is scheduled. We look forward to seeing you!',
  'Inactive Member': 'We miss you at BilzyFit, {name}! Come back and restart your fitness journey with a special offer.',
  'Promotional Offer': 'Hey {name}, check out our latest offer at BilzyFit. Limited period only!',
};

const channelLabels = ['WhatsApp', 'SMS', 'Email'];

export default function Messaging() {
  const { data, setData } = useData();
  const [search, setSearch] = useState('');
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [channels, setChannels] = useState(new Set(['WhatsApp']));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [audience, setAudience] = useState('all');

  const members = useMemo(() => {
    const term = search.toLowerCase();
    return data.members.filter(
      (m) =>
        m.fullName.toLowerCase().includes(term) ||
        m.mobile.includes(search) ||
        m.memberId.toLowerCase().includes(term)
    );
  }, [data.members, search]);

  const messages = useMemo(() => data.messages || [], [data.messages]);

  const toggleMember = (id) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === members.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(members.map((m) => m.id)));
  };

  const toggleChannel = (c) => {
    setChannels((prev) => {
      const next = new Set(prev);
      if (next.has(c)) next.delete(c);
      else next.add(c);
      return next;
    });
  };

  const selectAudience = (key) => {
    const today = new Date().toISOString().split('T')[0];
    const ids = data.members.filter((member) => {
      const membership = data.memberships.find((item) => item.memberId === member.id);
      if (key === 'active') return member.status === 'active';
      if (key === 'expiring') return membership && membership.expiryDate >= today && membership.expiryDate <= new Date(Date.now() + 7 * 86400000).toISOString().split('T')[0];
      if (key === 'pending') return membership?.pendingAmount > 0;
      if (key === 'inactive') return member.status === 'inactive';
      return true;
    }).map((member) => member.id);
    setAudience(key);
    setSelectedIds(new Set(ids));
  };

  const applyTemplate = (key) => {
    const first = data.members.find((m) => selectedIds.has(m.id)) || data.members[0];
    const membership = first ? data.memberships.find((ms) => ms.memberId === first.id) : null;
    const text = templates[key]
      .replace(/{name}/g, first?.fullName || 'Member')
      .replace(/{pending}/g, membership?.pendingAmount || 0);
    setMessage(text);
  };

  const handleSend = (e) => {
    e.preventDefault();
    if (selectedIds.size === 0 || !message.trim() || channels.size === 0) return;
    setLoading(true);
    const recipients = data.members.filter((m) => selectedIds.has(m.id));
    const { data: next } = addMessage(data, {
      recipients: recipients.map((m) => ({ id: m.id, name: m.fullName, mobile: m.mobile })),
      channels: Array.from(channels),
      content: message,
      status: 'sent',
      type: 'broadcast',
    });
    setData(next);
    setLoading(false);
    setMessage('');
    setSelectedIds(new Set());
  };

  return (
    <div className="page-container">
      <PageHeader title="Messaging" subtitle="Send WhatsApp, SMS and email messages." />

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-base font-semibold text-gray-900">New Message</h3>
          <form onSubmit={handleSend} className="space-y-4">
            <Input
              label="Search Recipients"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, mobile, member ID..."
            />
            <div>
              <p className="mb-2 text-sm font-medium text-gray-700">Quick audience</p>
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All members', icon: Users },
                  { key: 'active', label: 'Active', icon: UserCheck },
                  { key: 'expiring', label: 'Expiring', icon: CalendarClock },
                  { key: 'pending', label: 'Pending dues', icon: Wallet },
                  { key: 'inactive', label: 'Inactive', icon: Users },
                ].map((item) => (
                  <Button key={item.key} type="button" size="sm" variant={audience === item.key ? 'primary' : 'secondary'} icon={item.icon} onClick={() => selectAudience(item.key)}>
                    {item.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="flex items-center justify-between text-sm">
              <label className="flex cursor-pointer items-center gap-2 font-medium text-gray-700">
                <input
                  type="checkbox"
                  checked={members.length > 0 && selectedIds.size === members.length}
                  onChange={toggleAll}
                />
                Select All ({selectedIds.size} selected)
              </label>
            </div>
            <div className="max-h-48 space-y-1 overflow-y-auto rounded-xl border border-gray-200 p-2">
              {members.map((m) => (
                <label
                  key={m.id}
                  className="flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2 hover:bg-gray-50"
                >
                  <input
                    type="checkbox"
                    checked={selectedIds.has(m.id)}
                    onChange={() => toggleMember(m.id)}
                  />
                  <span className="flex-1 text-sm font-medium text-gray-800">{m.fullName}</span>
                  <span className="text-xs text-gray-500">{m.mobile}</span>
                </label>
              ))}
              {members.length === 0 && (
                <p className="py-4 text-center text-sm text-gray-500">No members found.</p>
              )}
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Channel</label>
              <div className="flex flex-wrap gap-3">
                {channelLabels.map((c) => (
                  <label key={c} className="flex cursor-pointer items-center gap-2 text-sm text-gray-700">
                    <input
                      type="checkbox"
                      checked={channels.has(c)}
                      onChange={() => toggleChannel(c)}
                    />
                    {c}
                  </label>
                ))}
              </div>
            </div>

            <Textarea
              label="Message"
              rows={5}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              required
            />

            <div className="flex justify-end">
              <Button icon={Send} disabled={loading || selectedIds.size === 0 || channels.size === 0}>
                {loading ? 'Sending...' : `Send to ${selectedIds.size}`}
              </Button>
            </div>
          </form>
        </Card>

        <div className="space-y-6">
          <Card>
            <h3 className="mb-3 text-base font-semibold text-gray-900">Templates</h3>
            <ul className="space-y-2">
              {Object.keys(templates).map((t) => (
                <li
                  key={t}
                  onClick={() => applyTemplate(t)}
                  className="flex cursor-pointer items-center gap-2 rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-gray-700 hover:bg-primary-50"
                >
                  <MessageSquare className="h-4 w-4 text-primary-600" />
                  {t}
                </li>
              ))}
            </ul>
          </Card>

          <Card>
            <h3 className="mb-3 flex items-center gap-2 text-base font-semibold text-gray-900">
              <Clock className="h-4 w-4" /> Sent History
            </h3>
            <div className="max-h-80 space-y-3 overflow-y-auto">
              {messages.length === 0 && (
                <p className="text-sm text-gray-500">No messages sent yet.</p>
              )}
              {messages.map((msg) => (
                <div key={msg.id} className="rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm">
                  <div className="mb-1 flex items-center justify-between">
                    <span className="font-medium text-gray-800">
                      {msg.recipients?.length || 0} recipients
                    </span>
                    <Badge variant="success" className="text-xs">{msg.status}</Badge>
                  </div>
                  <p className="mb-2 text-gray-600 line-clamp-3">{msg.content}</p>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>{msg.channels?.join(', ')}</span>
                    <span>{new Date(msg.sentAt).toLocaleString('en-IN')}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
