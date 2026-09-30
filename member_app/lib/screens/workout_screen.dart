import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';
import '../widgets/create_workout_dialog.dart';
import 'workout_details_screen.dart';

class WorkoutScreen extends StatefulWidget {
  const WorkoutScreen({
    super.key,
    required this.member,
    required this.workouts,
    required this.loading,
    required this.onRefresh,
    required this.onCreateWorkout,
  });

  final MemberData member;
  final List<WorkoutPlan> workouts;
  final bool loading;
  final Future<void> Function() onRefresh;
  final VoidCallback onCreateWorkout;

  @override
  State<WorkoutScreen> createState() => _WorkoutScreenState();
}

class _WorkoutScreenState extends State<WorkoutScreen> {
  int _selectedCategoryIndex = 0;
  final List<String> _categories = const [
    'All',
    'Trainer Recommended',
    'My Workouts',
    'Strength',
    'Cardio',
    'Yoga',
  ];

  late List<WorkoutPlan> _allWorkouts;

  @override
  void initState() {
    super.initState();
    _allWorkouts = List.from(widget.workouts);
  }

  @override
  void didUpdateWidget(covariant WorkoutScreen oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.workouts != oldWidget.workouts) {
      _allWorkouts = List.from(widget.workouts);
    }
  }

  Future<void> _handleCreateWorkout() async {
    final newPlan = await showCreateWorkoutDialog(context);
    if (newPlan != null && mounted) {
      setState(() {
        _allWorkouts.insert(0, newPlan);
        _selectedCategoryIndex = 2; // Switch to "My Workouts"
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('"${newPlan.name}" saved to your workout library! 💪'),
          backgroundColor: AppTheme.primary,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final selectedCategory = _categories[_selectedCategoryIndex];
    final filteredWorkouts = _allWorkouts.where((w) {
      if (selectedCategory == 'All') return true;
      if (selectedCategory == 'Trainer Recommended') return w.isTrainerRecommended;
      if (selectedCategory == 'My Workouts') return !w.isTrainerRecommended;
      return w.category == selectedCategory;
    }).toList();

    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: widget.onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar: "Workouts" Title & "+ Create" Button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Workouts',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                    letterSpacing: -0.4,
                  ),
                ),
                Row(
                  children: [
                    // "+ Create" Button
                    GestureDetector(
                      onTap: _handleCreateWorkout,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        decoration: AppTheme.neuButton(radius: 20),
                        child: const Row(
                          children: [
                            Icon(Icons.add, color: Colors.white, size: 16),
                            SizedBox(width: 4),
                            Text(
                              'Create',
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 13,
                                fontWeight: FontWeight.w700,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                    const SizedBox(width: 10),
                    // Search Button
                    Container(
                      width: 42,
                      height: 42,
                      decoration: AppTheme.neuCircle(),
                      child: const Center(
                        child: Icon(
                          Icons.search_rounded,
                          color: AppTheme.textPrimary,
                          size: 20,
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),

            const SizedBox(height: 20),

            // Category Filter Pills
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _categories.length,
                separatorBuilder: (context, index) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final isSelected = index == _selectedCategoryIndex;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedCategoryIndex = index),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 200),
                      padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 8),
                      decoration: isSelected
                          ? BoxDecoration(
                              gradient: AppTheme.primaryGradient,
                              borderRadius: BorderRadius.circular(20),
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primary.withValues(alpha: 0.4),
                                  blurRadius: 10,
                                  offset: const Offset(0, 4),
                                ),
                              ],
                            )
                          : AppTheme.neuBox(radius: 20),
                      child: Center(
                        child: Text(
                          _categories[index],
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                            color: isSelected ? Colors.white : AppTheme.textSecondary,
                          ),
                        ),
                      ),
                    ),
                  );
                },
              ),
            ),

            const SizedBox(height: 22),

            // Workout Cards List
            if (filteredWorkouts.isEmpty)
              Container(
                width: double.infinity,
                padding: const EdgeInsets.all(32),
                decoration: AppTheme.neuBox(radius: 20),
                child: Column(
                  children: [
                    const Icon(Icons.fitness_center_rounded, size: 48, color: AppTheme.textHint),
                    const SizedBox(height: 12),
                    Text(
                      selectedCategory == 'My Workouts'
                          ? 'No custom workouts yet'
                          : 'No workouts in this category',
                      style: const TextStyle(fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Tap "+ Create" to build your own routine',
                      style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
              )
            else
              ...filteredWorkouts.map((workout) {
                return Padding(
                  padding: const EdgeInsets.only(bottom: 16),
                  child: GestureDetector(
                    onTap: () {
                      Navigator.of(context).push(
                        MaterialPageRoute<void>(
                          builder: (_) => WorkoutDetailsScreen(
                            title: workout.name,
                            duration: workout.duration,
                            level: workout.level,
                            calories: workout.calories,
                            exercisesCount: '${workout.exercises.length}',
                            rating: workout.rating,
                            imageUrl: workout.image,
                            description: workout.description,
                          ),
                        ),
                      );
                    },
                    child: Container(
                      padding: const EdgeInsets.all(12),
                      decoration: AppTheme.neuBox(radius: 20),
                      child: Row(
                        children: [
                          // Workout Thumbnail
                          ClipRRect(
                            borderRadius: BorderRadius.circular(16),
                            child: Container(
                              width: 68,
                              height: 68,
                              color: const Color(0xFF2A2D4A),
                              child: Image.network(
                                workout.image,
                                fit: BoxFit.cover,
                                errorBuilder: (context, error, stackTrace) => const Center(
                                  child: Icon(
                                    Icons.fitness_center_rounded,
                                    color: Colors.white,
                                    size: 26,
                                  ),
                                ),
                              ),
                            ),
                          ),

                          const SizedBox(width: 14),

                          // Title, Badge & Subtitle Info
                          Expanded(
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Container(
                                  margin: const EdgeInsets.only(bottom: 4),
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                                  decoration: BoxDecoration(
                                    color: workout.isTrainerRecommended
                                        ? const Color(0xFFEDE9FE)
                                        : const Color(0xFFE2E8F0),
                                    borderRadius: BorderRadius.circular(6),
                                  ),
                                  child: Text(
                                    workout.isTrainerRecommended
                                        ? '⚡ ${workout.trainerName}'
                                        : '★ ${workout.category}',
                                    style: TextStyle(
                                      fontSize: 10,
                                      fontWeight: FontWeight.w700,
                                      color: workout.isTrainerRecommended
                                          ? const Color(0xFF6D28D9)
                                          : AppTheme.textSecondary,
                                    ),
                                  ),
                                ),
                                Text(
                                  workout.name,
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 15,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.textPrimary,
                                  ),
                                ),
                                const SizedBox(height: 4),
                                Text(
                                  '${workout.duration} • ${workout.level} • ${workout.calories} kcal',
                                  maxLines: 1,
                                  overflow: TextOverflow.ellipsis,
                                  style: const TextStyle(
                                    fontSize: 12.5,
                                    color: AppTheme.textSecondary,
                                    fontWeight: FontWeight.w500,
                                  ),
                                ),
                              ],
                            ),
                          ),

                          // Neumorphic Play Button
                          Container(
                            width: 40,
                            height: 40,
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
                );
              }),

            const SizedBox(height: 20),
          ],
        ),
      ),
    );
  }
}
