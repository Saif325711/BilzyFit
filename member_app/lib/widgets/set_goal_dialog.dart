import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

Future<GoalData?> showSetGoalDialog(BuildContext context, GoalData currentGoal) {
  return showModalBottomSheet<GoalData>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => _SetGoalModal(initialGoal: currentGoal),
  );
}

class _SetGoalModal extends StatefulWidget {
  const _SetGoalModal({required this.initialGoal});
  final GoalData initialGoal;

  @override
  State<_SetGoalModal> createState() => _SetGoalModalState();
}

class _SetGoalModalState extends State<_SetGoalModal> {
  late double _targetWeight;
  late int _weeklyWorkouts;
  late int _dailySteps;
  late int _dailyCalories;
  late int _targetWeeks;

  @override
  void initState() {
    super.initState();
    _targetWeight = widget.initialGoal.targetWeight;
    _weeklyWorkouts = widget.initialGoal.weeklyWorkoutsTarget;
    _dailySteps = widget.initialGoal.dailyStepsTarget;
    _dailyCalories = widget.initialGoal.dailyCaloriesTarget;
    _targetWeeks = widget.initialGoal.targetWeeks;
  }

  void _saveGoal() {
    final updated = GoalData(
      targetWeight: _targetWeight,
      currentWeight: widget.initialGoal.currentWeight,
      weeklyWorkoutsTarget: _weeklyWorkouts,
      weeklyWorkoutsDone: widget.initialGoal.weeklyWorkoutsDone,
      dailyStepsTarget: _dailySteps,
      dailyStepsDone: widget.initialGoal.dailyStepsDone,
      dailyCaloriesTarget: _dailyCalories,
      dailyCaloriesBurned: widget.initialGoal.dailyCaloriesBurned,
      targetWeeks: _targetWeeks,
    );
    Navigator.of(context).pop(updated);
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: AppTheme.background,
        borderRadius: BorderRadius.vertical(top: Radius.circular(32)),
      ),
      padding: EdgeInsets.fromLTRB(
        22,
        16,
        22,
        MediaQuery.of(context).viewInsets.bottom + 24,
      ),
      child: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Drag handle
            Center(
              child: Container(
                width: 44,
                height: 5,
                decoration: BoxDecoration(
                  color: AppTheme.shadowDark,
                  borderRadius: BorderRadius.circular(3),
                ),
              ),
            ),
            const SizedBox(height: 18),

            // Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Set Fitness Goal',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'Personalize your weekly & daily targets',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
                Container(
                  width: 40,
                  height: 40,
                  decoration: AppTheme.neuCircle(),
                  child: const Center(
                    child: Icon(Icons.flag_rounded, color: AppTheme.primary, size: 20),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // 1. Target Weight (kg)
            _goalSliderCard(
              title: 'Target Weight',
              valueDisplay: '${_targetWeight.toStringAsFixed(1)} kg',
              subtitle: 'Current: ${widget.initialGoal.currentWeight} kg',
              icon: Icons.monitor_weight_rounded,
              iconColor: const Color(0xFF3B82F6),
              slider: Slider(
                value: _targetWeight,
                min: 50,
                max: 120,
                divisions: 140,
                activeColor: AppTheme.primary,
                inactiveColor: AppTheme.shadowDark,
                onChanged: (v) => setState(() => _targetWeight = v),
              ),
            ),

            const SizedBox(height: 16),

            // 2. Weekly Workouts
            _goalSliderCard(
              title: 'Weekly Workouts Target',
              valueDisplay: '$_weeklyWorkouts Days / Week',
              subtitle: 'Recommended: 4 - 6 days for optimal results',
              icon: Icons.fitness_center_rounded,
              iconColor: const Color(0xFF8B5CF6),
              slider: Slider(
                value: _weeklyWorkouts.toDouble(),
                min: 1,
                max: 7,
                divisions: 6,
                activeColor: AppTheme.primary,
                inactiveColor: AppTheme.shadowDark,
                onChanged: (v) => setState(() => _weeklyWorkouts = v.round()),
              ),
            ),

            const SizedBox(height: 16),

            // 3. Daily Steps Target
            _goalSliderCard(
              title: 'Daily Steps Goal',
              valueDisplay: '$_dailySteps Steps',
              subtitle: 'Burns approx ${(_dailySteps * 0.04).round()} calories',
              icon: Icons.directions_walk_rounded,
              iconColor: const Color(0xFF10B981),
              slider: Slider(
                value: _dailySteps.toDouble(),
                min: 4000,
                max: 20000,
                divisions: 32,
                activeColor: AppTheme.primary,
                inactiveColor: AppTheme.shadowDark,
                onChanged: (v) => setState(() => _dailySteps = (v / 500).round() * 500),
              ),
            ),

            const SizedBox(height: 16),

            // 4. Daily Calorie Burn Target
            _goalSliderCard(
              title: 'Daily Calorie Burn Target',
              valueDisplay: '$_dailyCalories kcal',
              subtitle: 'Active workout + cardio burn',
              icon: Icons.local_fire_department_rounded,
              iconColor: const Color(0xFFFF5252),
              slider: Slider(
                value: _dailyCalories.toDouble(),
                min: 200,
                max: 1200,
                divisions: 20,
                activeColor: AppTheme.primary,
                inactiveColor: AppTheme.shadowDark,
                onChanged: (v) => setState(() => _dailyCalories = (v / 50).round() * 50),
              ),
            ),

            const SizedBox(height: 28),

            // Save Goal Button
            GestureDetector(
              onTap: _saveGoal,
              child: Container(
                width: double.infinity,
                height: 54,
                decoration: AppTheme.neuButton(radius: 28),
                child: const Center(
                  child: Text(
                    'Save Goal & Update Tracker',
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 16,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 0.3,
                    ),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _goalSliderCard({
    required String title,
    required String valueDisplay,
    required String subtitle,
    required IconData icon,
    required Color iconColor,
    required Widget slider,
  }) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 14, 16, 8),
      decoration: AppTheme.neuBox(radius: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Container(
                    width: 34,
                    height: 34,
                    decoration: AppTheme.neuCircle(),
                    child: Icon(icon, color: iconColor, size: 18),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                ],
              ),
              Text(
                valueDisplay,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.primary,
                ),
              ),
            ],
          ),
          slider,
          Padding(
            padding: const EdgeInsets.only(left: 6, bottom: 6),
            child: Text(
              subtitle,
              style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
            ),
          ),
        ],
      ),
    );
  }
}
