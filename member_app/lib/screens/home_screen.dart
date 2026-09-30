import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';
import 'workout_details_screen.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({
    super.key,
    required this.member,
    required this.onNavigate,
    required this.onOpenDrawer,
    required this.onRefresh,
    this.goal,
    this.onSetGoal,
  });

  final MemberData member;
  final ValueChanged<int> onNavigate;
  final VoidCallback onOpenDrawer;
  final Future<void> Function() onRefresh;
  final GoalData? goal;
  final VoidCallback? onSetGoal;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // 1. Top Bar: Grid Drawer Menu, Greeting, Profile Avatar (Screen 5)
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                GestureDetector(
                  onTap: onOpenDrawer,
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: AppTheme.neuBox(radius: 14),
                    child: const Center(
                      child: Icon(
                        Icons.grid_view_rounded,
                        color: AppTheme.textPrimary,
                        size: 20,
                      ),
                    ),
                  ),
                ),
                Expanded(
                  child: Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        const Text(
                          'Good Morning,',
                          style: TextStyle(
                            fontSize: 13,
                            color: AppTheme.textSecondary,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          '${member.name.split(' ').first} 👋',
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
                // Avatar
                GestureDetector(
                  onTap: () => onNavigate(3), // Navigate to Profile tab
                  child: Container(
                    width: 44,
                    height: 44,
                    decoration: AppTheme.neuCircle(),
                    padding: const EdgeInsets.all(2.5),
                    child: ClipOval(
                      child: Image.network(
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.person,
                          color: AppTheme.primary,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // 2. Today's Progress Card (Screen 5)
            Container(
              padding: const EdgeInsets.all(20),
              decoration: AppTheme.neuBox(radius: 24),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            "Today's Progress",
                            style: TextStyle(
                              fontSize: 14,
                              fontWeight: FontWeight.w600,
                              color: AppTheme.textSecondary,
                            ),
                          ),
                          const SizedBox(height: 8),
                          const Text(
                            '78%',
                            style: TextStyle(
                              fontSize: 32,
                              fontWeight: FontWeight.w900,
                              color: AppTheme.textPrimary,
                              letterSpacing: -0.5,
                            ),
                          ),
                        ],
                      ),
                      // Circular Progress Arc
                      SizedBox(
                        width: 72,
                        height: 72,
                        child: Stack(
                          alignment: Alignment.center,
                          children: [
                            CircularProgressIndicator(
                              value: 0.78,
                              strokeWidth: 8,
                              backgroundColor: AppTheme.shadowDark.withValues(alpha: 0.5),
                              valueColor: const AlwaysStoppedAnimation<Color>(
                                AppTheme.primary,
                              ),
                              strokeCap: StrokeCap.round,
                            ),
                            const Icon(
                              Icons.bolt_rounded,
                              color: AppTheme.primary,
                              size: 26,
                            ),
                          ],
                        ),
                      ),
                    ],
                  ),

                  const SizedBox(height: 20),

                  // Divider line
                  Container(
                    height: 1,
                    color: AppTheme.shadowDark.withValues(alpha: 0.4),
                  ),

                  const SizedBox(height: 16),

                  // 3 Metrics: Steps, Calories, Distance
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _metricStat(
                        value: '${goal?.dailyStepsDone ?? 8430}',
                        unit: 'Steps',
                        icon: Icons.directions_walk_rounded,
                        color: const Color(0xFF10B981),
                      ),
                      _metricStat(
                        value: '${goal?.dailyCaloriesBurned ?? 420}',
                        unit: 'Calories',
                        icon: Icons.local_fire_department_rounded,
                        color: const Color(0xFFFF5252),
                      ),
                      _metricStat(
                        value: '1.2',
                        unit: 'Km',
                        icon: Icons.place_rounded,
                        color: const Color(0xFF6C63FF),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // 3. Quick Action Icons Row: Workout, Diet Plan, Set Goal, More
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                _quickActionButton(
                  icon: Icons.fitness_center_rounded,
                  label: 'Workout',
                  color: const Color(0xFF6C63FF),
                  onTap: () => onNavigate(1),
                ),
                _quickActionButton(
                  icon: Icons.apple_rounded,
                  label: 'Diet Plan',
                  color: const Color(0xFFFF5252),
                  onTap: () => onNavigate(2),
                ),
                _quickActionButton(
                  icon: Icons.flag_rounded,
                  label: 'Set Goal',
                  color: const Color(0xFF10B981),
                  onTap: () {
                    if (onSetGoal != null) {
                      onSetGoal!();
                    } else {
                      onNavigate(3);
                    }
                  },
                ),
                _quickActionButton(
                  icon: Icons.more_horiz_rounded,
                  label: 'More',
                  color: const Color(0xFF8B5CF6),
                  onTap: onOpenDrawer,
                ),
              ],
            ),

            const SizedBox(height: 28),

            // 4. Upcoming Workout Section (Screen 5)
            const Text(
              'Upcoming Workout',
              style: TextStyle(
                fontSize: 18,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
                letterSpacing: -0.3,
              ),
            ),

            const SizedBox(height: 14),

            // Upcoming Workout Card
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const WorkoutDetailsScreen(
                      title: 'Full Body Training',
                      duration: '30 min',
                      level: 'Beginner',
                      calories: '320',
                      exercisesCount: '8',
                      rating: '4.8',
                    ),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: AppTheme.neuBox(radius: 20),
                child: Row(
                  children: [
                    // Muscle Fitness Thumbnail
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        width: 68,
                        height: 68,
                        color: const Color(0xFF2A2D4A),
                        child: Image.network(
                          'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=300&auto=format&fit=crop&q=80',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Center(
                            child: Icon(
                              Icons.fitness_center_rounded,
                              color: Colors.white,
                              size: 28,
                            ),
                          ),
                        ),
                      ),
                    ),

                    const SizedBox(width: 16),

                    // Title & Duration
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          const Text(
                            'Full Body Training',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Today • 30 min',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),

                    // Play Button with Purple Gradient & Glow
                    Container(
                      width: 44,
                      height: 44,
                      decoration: BoxDecoration(
                        gradient: AppTheme.primaryGradient,
                        shape: BoxShape.circle,
                        boxShadow: [
                          BoxShadow(
                            color: AppTheme.primary.withValues(alpha: 0.4),
                            blurRadius: 10,
                            offset: const Offset(0, 4),
                          ),
                        ],
                      ),
                      child: const Center(
                        child: Icon(
                          Icons.play_arrow_rounded,
                          color: Colors.white,
                          size: 24,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 16),

            // Secondary Card: Chest & Triceps
            GestureDetector(
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const WorkoutDetailsScreen(
                      title: 'Chest & Triceps',
                      duration: '25 min',
                      level: 'Intermediate',
                      calories: '280',
                      exercisesCount: '6',
                      rating: '4.7',
                    ),
                  ),
                );
              },
              child: Container(
                padding: const EdgeInsets.all(14),
                decoration: AppTheme.neuBox(radius: 20),
                child: Row(
                  children: [
                    ClipRRect(
                      borderRadius: BorderRadius.circular(16),
                      child: Container(
                        width: 68,
                        height: 68,
                        color: const Color(0xFF2A2D4A),
                        child: Image.network(
                          'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=300&auto=format&fit=crop&q=80',
                          fit: BoxFit.cover,
                          errorBuilder: (context, error, stackTrace) => const Center(
                            child: Icon(
                              Icons.fitness_center_rounded,
                              color: Colors.white,
                              size: 28,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(width: 16),
                    const Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            'Chest & Triceps',
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.w700,
                              color: AppTheme.textPrimary,
                            ),
                          ),
                          SizedBox(height: 4),
                          Text(
                            'Tomorrow • 25 min',
                            style: TextStyle(
                              fontSize: 13,
                              color: AppTheme.textSecondary,
                              fontWeight: FontWeight.w500,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Container(
                      width: 44,
                      height: 44,
                      decoration: AppTheme.neuCircle(),
                      child: const Center(
                        child: Icon(
                          Icons.play_arrow_rounded,
                          color: AppTheme.primary,
                          size: 22,
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _metricStat({
    required String value,
    required String unit,
    required IconData icon,
    required Color color,
  }) {
    return Row(
      children: [
        Icon(icon, size: 18, color: color),
        const SizedBox(width: 6),
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              value,
              style: const TextStyle(
                fontSize: 15,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
              ),
            ),
            Text(
              unit,
              style: const TextStyle(
                fontSize: 11,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ),
      ],
    );
  }

  Widget _quickActionButton({
    required IconData icon,
    required String label,
    required Color color,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Column(
        children: [
          Container(
            width: 58,
            height: 58,
            decoration: AppTheme.neuBox(radius: 20),
            child: Center(
              child: Icon(icon, color: color, size: 24),
            ),
          ),
          const SizedBox(height: 8),
          Text(
            label,
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.w600,
              color: AppTheme.textPrimary,
            ),
          ),
        ],
      ),
    );
  }
}
