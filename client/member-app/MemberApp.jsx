import { useState } from 'react';
import CheckInModal from './components/CheckInModal';
import MemberBottomNav from './components/MemberBottomNav';
import MemberDiet from './components/MemberDiet';
import MemberHome from './components/MemberHome';
import MemberLogin from './components/MemberLogin';
import MemberPayments from './components/MemberPayments';
import MemberProfile from './components/MemberProfile';
import MemberProgress from './components/MemberProgress';
import MemberWorkout from './components/MemberWorkout';
import useMemberData from './hooks/useMemberData';

export default function MemberApp({ initialTab = 'workout' }) {
  const [activeTab, setActiveTab] = useState(initialTab);
  const [showQR, setShowQR] = useState(false);
  const [loggedMemberId, setLoggedMemberId] = useState(() => {
    return localStorage.getItem('bilzyfit_logged_member_id');
  });

  const memberData = useMemberData(loggedMemberId);
  const { member } = memberData;

  const navigate = (tab) => {
    setShowQR(false);
    setActiveTab(tab);
  };

  const handleLogin = (authenticatedMember) => {
    const id = authenticatedMember.id || authenticatedMember.memberId;
    localStorage.setItem('bilzyfit_logged_member_id', id);
    setLoggedMemberId(id);
    setActiveTab(initialTab || 'home');
  };

  const handleLogout = () => {
    localStorage.removeItem('bilzyfit_logged_member_id');
    setLoggedMemberId(null);
  };

  // If not logged in or member not found for ID, show login interface
  if (!loggedMemberId || !member) {
    return (
      <MemberLogin
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F9F8] flex justify-center px-3 py-4 sm:px-4">
      <div className="w-full max-w-md pb-24">

        {/* Tab views */}
        {activeTab === 'home' && (
          <MemberHome {...memberData} onNavigate={navigate} onShowQR={() => setShowQR(true)} />
        )}
        {activeTab === 'workout' && (
          <MemberWorkout
            workouts={memberData.workouts}
            workout={memberData.workout}
            onShowQR={() => setShowQR(true)}
          />
        )}
        {activeTab === 'diet' && (
          <MemberDiet
            diets={memberData.diets}
            diet={memberData.diet}
            onShowQR={() => setShowQR(true)}
          />
        )}
        {activeTab === 'progress' && (
          <MemberProgress
            member={member}
            attendance={memberData.attendance}
            presentThisMonth={memberData.presentThisMonth}
            onShowQR={() => setShowQR(true)}
          />
        )}
        {activeTab === 'payments' && (
          <MemberPayments
            member={member}
            membership={memberData.membership}
            payments={memberData.payments}
            daysLeft={memberData.daysLeft}
            onShowQR={() => setShowQR(true)}
          />
        )}
        {activeTab === 'profile' && (
          <MemberProfile
            member={member}
            membership={memberData.membership}
            attendance={memberData.attendance}
            daysLeft={memberData.daysLeft}
            gymCenter={memberData.gymCenter}
            onShowQR={() => setShowQR(true)}
            onNavigate={navigate}
            onLogout={handleLogout}
          />
        )}

        {/* QR Check-in modal */}
        {showQR && (
          <CheckInModal
            member={member}
            gymCenter={memberData.gymCenter}
            onClose={() => setShowQR(false)}
          />
        )}

        {/* Bottom navigation */}
        <MemberBottomNav activeTab={activeTab} onNavigate={navigate} />
      </div>
    </div>
  );
}

