import { useMemo } from 'react';
import { useAuth } from '../../src/context/AuthContext';
import { useData } from '../../src/context/DataContext';

export default function useMemberData(overrideMemberId = null) {
  const { user } = useAuth();
  const { data } = useData();
  const savedId = overrideMemberId || (typeof localStorage !== 'undefined' ? localStorage.getItem('bilzyfit_logged_member_id') : null);
  const member = (savedId && data.members.find((item) => item.id === savedId || item.memberId === savedId))
    || data.members.find((item) => item.fullName === user?.name)
    || data.members[0];
  const memberId = member?.id;

  // Resolve Gym Center specifically for this member based on branch or gymName
  const gymCenter = useMemo(() => {
    if (!member) return null;
    const branchName = member.branch || member.gymName || data.settings?.gymName || 'Star Fitness';
    const matchedBranch = (data.settings?.branches || []).find(
      (b) => b.name?.toLowerCase() === branchName?.toLowerCase() || b.id === member.branch
    );
    const centerTitle = matchedBranch?.name || member.gymName || member.branch || data.settings?.gymName || 'Star Fitness';
    const isStar = centerTitle.toLowerCase().includes('star');

    return {
      name: isStar ? 'Star Fitness' : centerTitle,
      fullName: centerTitle,
      branch: matchedBranch?.name || member.branch || (isStar ? 'Star Fitness Center' : centerTitle),
      city: matchedBranch?.city || (isStar ? 'Noida' : 'Delhi'),
      address: matchedBranch?.address || (isStar ? 'Plot 18, Commercial Hub, Sector 62, Noida, Uttar Pradesh' : (data.settings?.address || 'Main Fitness Hub')),
      phone: matchedBranch?.phone || (isStar ? '+91 98111 22334' : (data.settings?.phone || '+91 98000 12345')),
      whatsapp: matchedBranch?.phone || (isStar ? '+91 98111 22335' : (data.settings?.phone || '+91 98000 12346')),
      email: matchedBranch?.email || (isStar ? 'support@starfitness.com' : (data.settings?.email || 'contact@gym.com')),
      timings: matchedBranch?.timings || '5:00 AM – 11:30 PM',
      logo: matchedBranch?.logo || data.settings?.logo,
    };
  }, [member, data.settings]);

  const membership = data.memberships.find((item) => item.memberId === memberId);
  const attendance = useMemo(
    () => data.attendance.filter((item) => item.memberId === memberId),
    [data.attendance, memberId]
  );
  const payments = useMemo(
    () => data.payments
      .filter((item) => item.memberId === memberId)
      .sort((a, b) => new Date(b.date) - new Date(a.date)),
    [data.payments, memberId]
  );

  // Strictly isolate workouts to this member and their gym center only
  const workouts = useMemo(() => {
    const list = data.workouts.filter((item) => {
      const matchMember = item.assignedTo?.includes(memberId);
      const matchCenter = item.branch && member?.branch && item.branch.toLowerCase() === member.branch.toLowerCase();
      return matchMember || matchCenter;
    });

    if (list.length > 0) return list;

    // Fallback default workout branded for their specific gym center
    const centerTitle = gymCenter?.name || 'Star Fitness';
    return [
      {
        id: `w-${memberId || 'center'}`,
        name: `${centerTitle} Push Strength & Conditioning`,
        description: `Signature muscle hypertrophy & strength routine for ${centerTitle} athletes`,
        exercises: [
          { name: 'Barbell Flat Bench Press', sets: 4, reps: '8-10', rest: '90s' },
          { name: 'Incline Dumbbell Chest Press', sets: 3, reps: '10-12', rest: '75s' },
          { name: 'Cable Chest Fly', sets: 3, reps: '15', rest: '60s' },
          { name: 'Standing Overhead Barbell Press', sets: 4, reps: '8', rest: '90s' },
          { name: 'Cable Tricep Rope Pushdown', sets: 4, reps: '12-15', rest: '60s' },
        ],
      },
    ];
  }, [data.workouts, memberId, member?.branch, gymCenter]);

  // Strictly isolate diets to this member and their gym center only
  const diets = useMemo(() => {
    const list = data.diets.filter((item) => {
      const matchMember = item.assignedTo?.includes(memberId);
      const matchCenter = item.branch && member?.branch && item.branch.toLowerCase() === member.branch.toLowerCase();
      return matchMember || matchCenter;
    });

    if (list.length > 0) return list;

    // Fallback default diet branded for their specific gym center
    const centerTitle = gymCenter?.name || 'Star Fitness';
    return [
      {
        id: `d-${memberId || 'center'}`,
        name: `${centerTitle} Lean Muscle Nutrition`,
        description: `High protein performance meal plan designed by ${centerTitle} dietitians`,
        meals: [
          { type: 'Breakfast', items: 'Oatmeal with whey protein, almonds and banana', calories: 450, protein: 32, carbs: 55, fats: 10 },
          { type: 'Lunch', items: 'Brown rice, grilled chicken breast or paneer & green salad', calories: 650, protein: 48, carbs: 70, fats: 14 },
          { type: 'Evening Snack', items: 'Greek yogurt with berries & boiled eggs', calories: 240, protein: 22, carbs: 18, fats: 6 },
          { type: 'Dinner', items: 'Multigrain roti, dal tadka, sauteed broccoli & tofu/chicken', calories: 520, protein: 38, carbs: 50, fats: 12 },
        ],
      },
    ];
  }, [data.diets, memberId, member?.branch, gymCenter]);

  const presentThisMonth = useMemo(() => {
    const month = new Date().toISOString().slice(0, 7);
    return attendance.filter((item) => item.date.startsWith(month)).length;
  }, [attendance]);

  const daysLeft = membership?.expiryDate
    ? Math.max(0, Math.ceil((new Date(membership.expiryDate) - new Date()) / 86400000))
    : 0;

  return {
    member,
    membership,
    attendance,
    payments,
    workouts,
    diets,
    workout: workouts[0],
    diet: diets[0],
    presentThisMonth,
    daysLeft,
    gymCenter,
  };
}
