import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScanLine, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../context/DataContext';
import { recordAttendance } from '../data/services';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Avatar from '../components/ui/Avatar';

export default function QRCheckIn() {
  const { data, setData } = useData();
  const navigate = useNavigate();
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);

  const activeMembers = data.members.filter((m) => m.status === 'active');

  const simulateScan = () => {
    setScanning(true);
    setResult(null);
    setTimeout(() => {
      const member = activeMembers[Math.floor(Math.random() * activeMembers.length)];
      const membership = data.memberships.find((m) => m.memberId === member.id);
      const expired = membership?.expiryDate < new Date().toISOString().split('T')[0];
      if (expired) {
        setResult({ type: 'error', member, message: 'Membership expired. Please renew.' });
      } else {
        const { data: next } = recordAttendance(data, member.id);
        setData(next);
        setResult({ type: 'success', member, message: 'Check-in successful!' });
      }
      setScanning(false);
    }, 1500);
  };

  return (
    <div className="page-container">
      <div className="mx-auto max-w-xl">
        <Card className="text-center">
          <h1 className="text-xl font-bold text-gray-900">QR Check-in</h1>
          <p className="mt-1 text-sm text-gray-500">
            Point the camera at the member QR code or simulate a scan.
          </p>

          <div className="relative mx-auto mt-6 flex h-64 w-64 items-center justify-center rounded-xl border-2 border-dashed border-gray-300 bg-gray-50">
            {scanning ? (
              <div className="absolute inset-0 flex animate-pulse items-center justify-center rounded-xl bg-primary-50/50">
                <ScanLine className="h-12 w-12 text-primary-600" />
              </div>
            ) : (
              <ScanLine className="h-16 w-16 text-gray-300" />
            )}
            <div className="absolute inset-x-4 top-1/2 h-0.5 -translate-y-1/2 bg-primary-500/70" />
          </div>

          <Button
            onClick={simulateScan}
            disabled={scanning}
            className="mt-6"
            icon={ScanLine}
          >
            {scanning ? 'Scanning...' : 'Simulate Scan'}
          </Button>

          {result && (
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-4 text-left shadow-sm">
              <div className="flex items-start gap-4">
                <Avatar name={result.member.fullName} size="lg" />
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-gray-900">{result.member.fullName}</h3>
                    {result.type === 'success' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <XCircle className="h-5 w-5 text-red-600" />
                    )}
                  </div>
                  <p className="text-sm text-gray-500">{result.member.memberId}</p>
                  <Badge
                    variant={result.type === 'success' ? 'success' : 'danger'}
                    className="mt-2"
                  >
                    {result.message}
                  </Badge>
                </div>
              </div>
            </div>
          )}

          <Button
            variant="ghost"
            onClick={() => navigate('/attendance')}
            className="mt-4"
          >
            Back to Attendance
          </Button>
        </Card>
      </div>
    </div>
  );
}
