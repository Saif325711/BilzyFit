import 'package:flutter/material.dart';

import '../models/member_data.dart';
import '../services/member_sync_service.dart';
import '../theme/app_theme.dart';
import '../widgets/member_plan_editors.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import 'workout_screen.dart';
import 'diet_screen.dart';
import 'progress_screen.dart';
import 'payment_screen.dart';
import 'profile_screen.dart';

class MemberShell extends StatefulWidget {
  const MemberShell({super.key});

  @override
  State<MemberShell> createState() => _MemberShellState();
}

class _MemberShellState extends State<MemberShell> {
  int currentIndex = 0;
  bool _isLoggedIn = false;
  MemberData member = MemberData.demo;
  List<WorkoutPlan> memberWorkouts = workoutPlans;
  List<DietPlan> memberDiets = dietPlans;
  bool workoutLoading = true;
  bool dietLoading = true;

  @override
  void initState() {
    super.initState();
    _loadMemberWorkouts();
  }

  Future<void> _loadMemberWorkouts() async {
    try {
      final plans = await const MemberSyncService().fetchMemberPlans(
        workspaceId: 'demo-workspace',
        memberEmail: member.email,
      );
      if (mounted) {
        setState(() {
          memberWorkouts = plans.workouts;
          memberDiets = plans.diets;
        });
      }
    } on Exception {
      // Keep the bundled plan available when the gym server is offline.
    } finally {
      if (mounted) setState(() => workoutLoading = false);
      if (mounted) setState(() => dietLoading = false);
    }
  }

  Future<void> _createWorkout() async {
    final plan = await showWorkoutEditor(context);
    if (plan == null) return;
    setState(() => memberWorkouts = [plan, ...memberWorkouts]);
    try {
      await const MemberSyncService().publishPlan(
        workspaceId: 'demo-workspace',
        memberEmail: member.email,
        memberName: member.name,
        workout: plan,
      );
      if (mounted) _showMessage('Workout saved and synced with Bilzy Fit.');
    } on Exception {
      if (mounted) _showMessage('Workout saved on this device. Sync server is offline.');
    }
  }

  Future<void> _createDiet() async {
    final plan = await showDietEditor(context);
    if (plan == null) return;
    setState(() => memberDiets = [plan, ...memberDiets]);
    try {
      await const MemberSyncService().publishPlan(
        workspaceId: 'demo-workspace',
        memberEmail: member.email,
        memberName: member.name,
        diet: plan,
      );
      if (mounted) _showMessage('Diet saved and synced with Bilzy Fit.');
    } on Exception {
      if (mounted) _showMessage('Diet saved on this device. Sync server is offline.');
    }
  }

  void _showMessage(String message) {
    ScaffoldMessenger.of(context)
      ..hideCurrentSnackBar()
      ..showSnackBar(SnackBar(content: Text(message)));
  }

  void selectTab(int index) => setState(() => currentIndex = index);

  @override
  Widget build(BuildContext context) {
    if (!_isLoggedIn) {
      return LoginScreen(
        onLoginSuccess: (loggedMember) {
          setState(() {
            member = loggedMember;
            _isLoggedIn = true;
          });
        },
      );
    }

    final workoutPage = WorkoutScreen(
      member: member,
      workouts: memberWorkouts,
      loading: workoutLoading,
      onRefresh: _loadMemberWorkouts,
      onCreateWorkout: _createWorkout,
    );

    final dietPage = DietScreen(
      member: member,
      diets: memberDiets,
      loading: dietLoading,
      onRefresh: _loadMemberWorkouts,
      onCreateDiet: _createDiet,
    );

    final progressPage = ProgressScreen(
      member: member,
      onRefresh: _loadMemberWorkouts,
    );

    final paymentPage = PaymentScreen(
      member: member,
      payments: paymentHistory,
      onRefresh: _loadMemberWorkouts,
    );

    final profilePage = ProfileScreen(
      member: member,
      onRefresh: _loadMemberWorkouts,
      onSignOut: () {
        setState(() {
          _isLoggedIn = false;
        });
      },
    );

    final homePage = HomeScreen(
      member: member,
      onNavigate: selectTab,
      onShowCheckIn: _showCheckIn,
      onRefresh: _loadMemberWorkouts,
    );

    final pages = [
      homePage,
      workoutPage,
      dietPage,
      progressPage,
      paymentPage,
      profilePage,
    ];

    return Scaffold(
      backgroundColor: const Color(0xFFF7F9F8),
      body: SafeArea(
        child: Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 620),
            child: Padding(
              padding: const EdgeInsets.fromLTRB(16, 16, 16, 8),
              child: pages[currentIndex],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _PremiumNavBar(
        selectedIndex: currentIndex,
        onTap: selectTab,
      ),
    );
  }

  // _homePage() replaced by HomeScreen widget (see home_screen.dart)
  // _dietPage() replaced by DietScreen widget (see diet_screen.dart)
  // _progressPage() replaced by ProgressScreen widget (see progress_screen.dart)
  // _paymentsPage() replaced by PaymentScreen widget (see payment_screen.dart)
  // _profilePage() replaced by ProfileScreen widget (see profile_screen.dart)







  void _showCheckIn() {
    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      showDragHandle: true,
      backgroundColor: Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
      ),
      builder: (context) => SafeArea(
        top: false,
        child: SingleChildScrollView(
          padding: const EdgeInsets.fromLTRB(24, 8, 24, 32),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const Align(
                alignment: Alignment.centerLeft,
                child: Text(
                  'Quick check-in',
                  style: TextStyle(fontSize: 21, fontWeight: FontWeight.w800),
                ),
              ),
              const SizedBox(height: 5),
              const Align(
                alignment: Alignment.centerLeft,
                child: Text('Show this code at reception'),
              ),
              const SizedBox(height: 20),
              Container(
                width: 200,
                height: 200,
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  border: Border.all(
                    color: AppTheme.primary.withValues(alpha: .15),
                    width: 8,
                  ),
                  borderRadius: BorderRadius.circular(20),
                ),
                child: const Icon(Icons.qr_code_2, size: 140),
              ),
              const SizedBox(height: 14),
              Text(
                member.memberId,
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
              const SizedBox(height: 5),
              const Text(
                'This code identifies your active membership.',
                style: TextStyle(color: Colors.black54),
                textAlign: TextAlign.center,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _PremiumNavBar extends StatelessWidget {
  const _PremiumNavBar({
    required this.selectedIndex,
    required this.onTap,
  });

  final int selectedIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    const items = [
      (icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home'),
      (icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: 'Workout'),
      (icon: Icons.restaurant_outlined, activeIcon: Icons.restaurant_rounded, label: 'Diet'),
      (icon: Icons.show_chart_rounded, activeIcon: Icons.show_chart_rounded, label: 'Progress'),
      (icon: Icons.credit_card_outlined, activeIcon: Icons.credit_card_rounded, label: 'Payments'),
      (icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: 'Profile'),
    ];

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        border: Border(
          top: BorderSide(color: Color(0xFFF1F5F9), width: 1),
        ),
        boxShadow: [
          BoxShadow(
            color: Color(0x0F000000),
            blurRadius: 16,
            offset: Offset(0, -4),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 4, vertical: 6),
          child: Row(
            children: List.generate(items.length, (i) {
              final item = items[i];
              final isSelected = selectedIndex == i;
              return Expanded(
                child: InkWell(
                  onTap: () => onTap(i),
                  borderRadius: BorderRadius.circular(16),
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 2, vertical: 4),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                          decoration: BoxDecoration(
                            color: isSelected ? const Color(0xFFD1FAE5) : Colors.transparent,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: Icon(
                            isSelected ? item.activeIcon : item.icon,
                            size: 20,
                            color: isSelected ? AppTheme.primary : const Color(0xFF94A3B8),
                          ),
                        ),
                        const SizedBox(height: 2),
                        FittedBox(
                          fit: BoxFit.scaleDown,
                          child: Text(
                            item.label,
                            style: TextStyle(
                              fontSize: 10,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                              color: isSelected ? AppTheme.primary : const Color(0xFF64748B),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              );
            }),
          ),
        ),
      ),
    );
  }
}

