import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/member_data.dart';
import '../services/member_sync_service.dart';
import '../theme/app_theme.dart';
import '../widgets/app_drawer.dart';
import '../widgets/create_workout_dialog.dart';
import '../widgets/create_diet_dialog.dart';
import '../widgets/set_goal_dialog.dart';
import 'diet_screen.dart';
import 'home_screen.dart';
import 'login_screen.dart';
import 'payment_screen.dart';
import 'profile_screen.dart';
import 'progress_screen.dart';
import 'workout_screen.dart';

class MemberShell extends StatefulWidget {
  const MemberShell({super.key});

  @override
  State<MemberShell> createState() => _MemberShellState();
}

class _MemberShellState extends State<MemberShell> {
  final GlobalKey<ScaffoldState> _scaffoldKey = GlobalKey<ScaffoldState>();
  int currentIndex = 0;
  bool _isLoggedIn = false;
  MemberData member = MemberData.demo;
  List<WorkoutPlan> memberWorkouts = List.from(workoutPlans);
  List<DietPlan> memberDiets = List.from(dietPlans);
  List<Payment> memberPayments = List.from(paymentHistory);
  GoalData _goal = GoalData.defaultGoal;

  bool workoutLoading = false;
  bool dietLoading = false;

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
      // Offline fallback
    }
  }

  Future<void> _createWorkout() async {
    final plan = await showCreateWorkoutDialog(context);
    if (plan == null) return;
    setState(() => memberWorkouts = [plan, ...memberWorkouts]);
  }

  Future<void> _createDiet() async {
    final meal = await showCreateMealDialog(context);
    if (meal == null) return;
    final plan = DietPlan(
      meal.items,
      'Custom meal added by you.',
      [meal],
      source: 'custom',
    );
    setState(() => memberDiets = [plan, ...memberDiets]);
  }

  Future<void> _openSetGoalDialog() async {
    final newGoal = await showSetGoalDialog(context, _goal);
    if (newGoal != null && mounted) {
      setState(() => _goal = newGoal);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Fitness Goal & Weekly Targets Updated! 🎯'),
          backgroundColor: AppTheme.primary,
        ),
      );
    }
  }

  void _openPaymentsScreen() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => PaymentScreen(
          member: member,
          payments: memberPayments,
          onRefresh: _loadMemberWorkouts,
        ),
      ),
    );
  }

  void selectTab(int index) => setState(() => currentIndex = index);

  void _openDrawer() {
    _scaffoldKey.currentState?.openDrawer();
  }

  void _openDietScreen() {
    Navigator.of(context).push(
      MaterialPageRoute<void>(
        builder: (_) => Scaffold(
          backgroundColor: AppTheme.background,
          appBar: AppBar(
            backgroundColor: Colors.transparent,
            elevation: 0,
            leading: GestureDetector(
              onTap: () => Navigator.of(context).pop(),
              child: Container(
                margin: const EdgeInsets.all(8),
                decoration: AppTheme.neuCircle(),
                child: const Icon(
                  Icons.arrow_back_rounded,
                  color: AppTheme.textPrimary,
                  size: 20,
                ),
              ),
            ),
          ),
          body: SafeArea(
            child: Align(
              alignment: Alignment.topCenter,
              child: ConstrainedBox(
                constraints: const BoxConstraints(maxWidth: 480),
                child: SizedBox(
                  width: double.infinity,
                  height: double.infinity,
                  child: DietScreen(
                    member: member,
                    diets: memberDiets,
                    loading: dietLoading,
                    onRefresh: _loadMemberWorkouts,
                    onCreateDiet: _createDiet,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    SystemChrome.setSystemUIOverlayStyle(const SystemUiOverlayStyle(
      statusBarColor: Colors.transparent,
      statusBarIconBrightness: Brightness.dark,
    ));

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

    final pages = [
      HomeScreen(
        member: member,
        goal: _goal,
        onSetGoal: _openSetGoalDialog,
        onNavigate: (index) {
          if (index == 2) {
            _openDietScreen();
          } else {
            selectTab(index);
          }
        },
        onOpenDrawer: _openDrawer,
        onRefresh: _loadMemberWorkouts,
      ),
      WorkoutScreen(
        member: member,
        workouts: memberWorkouts,
        loading: workoutLoading,
        onRefresh: _loadMemberWorkouts,
        onCreateWorkout: _createWorkout,
      ),
      ProgressScreen(
        member: member,
        initialGoal: _goal,
        onRefresh: _loadMemberWorkouts,
      ),
      ProfileScreen(
        member: member,
        onRefresh: _loadMemberWorkouts,
        onSignOut: () => setState(() => _isLoggedIn = false),
        onNavigateTab: selectTab,
        onOpenPayments: _openPaymentsScreen,
      ),
    ];

    return Scaffold(
      key: _scaffoldKey,
      backgroundColor: AppTheme.background,
      drawer: AppDrawer(
        member: member,
        currentIndex: currentIndex,
        onSelectTab: (index) {
          if (index == 2) {
            _openDietScreen();
          } else if (index < pages.length) {
            selectTab(index);
          }
        },
        onOpenPayments: _openPaymentsScreen,
        onSetGoal: _openSetGoalDialog,
        onSignOut: () => setState(() => _isLoggedIn = false),
      ),
      body: SafeArea(
        child: Align(
          alignment: Alignment.topCenter,
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 480),
            child: SizedBox(
              width: double.infinity,
              height: double.infinity,
              child: pages[currentIndex],
            ),
          ),
        ),
      ),
      bottomNavigationBar: _NeuBottomNavBar(
        selectedIndex: currentIndex,
        onTap: selectTab,
      ),
    );
  }
}

// ─── 4-Tab Neumorphism Bottom Navigation Bar ─────────────────────────────────

class _NeuBottomNavBar extends StatelessWidget {
  const _NeuBottomNavBar({
    required this.selectedIndex,
    required this.onTap,
  });

  final int selectedIndex;
  final ValueChanged<int> onTap;

  @override
  Widget build(BuildContext context) {
    const items = [
      _NavItem(icon: Icons.home_outlined, activeIcon: Icons.home_rounded, label: 'Home'),
      _NavItem(icon: Icons.fitness_center_outlined, activeIcon: Icons.fitness_center_rounded, label: 'Workout'),
      _NavItem(icon: Icons.bar_chart_rounded, activeIcon: Icons.bar_chart_rounded, label: 'Stats'),
      _NavItem(icon: Icons.person_outline_rounded, activeIcon: Icons.person_rounded, label: 'Profile'),
    ];

    return Container(
      decoration: BoxDecoration(
        color: AppTheme.background,
        boxShadow: [
          BoxShadow(
            color: AppTheme.shadowDark.withValues(alpha: 0.65),
            blurRadius: 18,
            offset: const Offset(0, -6),
          ),
          const BoxShadow(
            color: AppTheme.shadowLight,
            blurRadius: 10,
            offset: Offset(0, -2),
          ),
        ],
      ),
      child: SafeArea(
        top: false,
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Row(
            children: List.generate(items.length, (i) {
              final item = items[i];
              final isSelected = selectedIndex == i;
              return Expanded(
                child: GestureDetector(
                  onTap: () => onTap(i),
                  behavior: HitTestBehavior.opaque,
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    curve: Curves.easeInOut,
                    margin: const EdgeInsets.symmetric(horizontal: 6),
                    padding: const EdgeInsets.symmetric(vertical: 8),
                    decoration: isSelected
                        ? BoxDecoration(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                          )
                        : BoxDecoration(
                            color: Colors.transparent,
                            borderRadius: BorderRadius.circular(16),
                          ),
                    child: Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(
                          isSelected ? item.activeIcon : item.icon,
                          size: 24,
                          color: isSelected ? AppTheme.primary : AppTheme.textHint,
                        ),
                        const SizedBox(height: 4),
                        Text(
                          item.label,
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w500,
                            color: isSelected ? AppTheme.primary : AppTheme.textHint,
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

class _NavItem {
  final IconData icon;
  final IconData activeIcon;
  final String label;
  const _NavItem({required this.icon, required this.activeIcon, required this.label});
}
