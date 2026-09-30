import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

Future<WorkoutPlan?> showCreateWorkoutDialog(BuildContext context) {
  return showModalBottomSheet<WorkoutPlan>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => const _CreateWorkoutModal(),
  );
}

class _CreateWorkoutModal extends StatefulWidget {
  const _CreateWorkoutModal();

  @override
  State<_CreateWorkoutModal> createState() => _CreateWorkoutModalState();
}

class _CreateWorkoutModalState extends State<_CreateWorkoutModal> {
  final _titleController = TextEditingController();
  final _descController = TextEditingController();
  String _selectedCategory = 'Strength';
  String _selectedLevel = 'Beginner';
  int _durationMin = 30;

  final List<WorkoutExercise> _exercises = [
    const WorkoutExercise('Dumbbell Bench Press', 3, '12 reps'),
    const WorkoutExercise('Overhead Press', 3, '10 reps'),
  ];

  final _exerciseNameController = TextEditingController();
  final _setsController = TextEditingController(text: '3');
  final _repsController = TextEditingController(text: '12 reps');

  @override
  void dispose() {
    _titleController.dispose();
    _descController.dispose();
    _exerciseNameController.dispose();
    _setsController.dispose();
    _repsController.dispose();
    super.dispose();
  }

  void _addExercise() {
    final name = _exerciseNameController.text.trim();
    if (name.isEmpty) return;
    final sets = int.tryParse(_setsController.text.trim()) ?? 3;
    final reps = _repsController.text.trim().isEmpty ? '12 reps' : _repsController.text.trim();

    setState(() {
      _exercises.add(WorkoutExercise(name, sets, reps));
      _exerciseNameController.clear();
    });
  }

  void _saveWorkout() {
    final title = _titleController.text.trim();
    if (title.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter a workout title')),
      );
      return;
    }

    final newWorkout = WorkoutPlan(
      title,
      _descController.text.trim().isEmpty
          ? 'Custom workout routine created by you.'
          : _descController.text.trim(),
      List.from(_exercises),
      duration: '$_durationMin min',
      level: _selectedLevel,
      category: _selectedCategory,
      calories: '${_durationMin * 10}',
      rating: '5.0',
      isTrainerRecommended: false,
      trainerName: 'My Routine',
      source: 'custom',
      image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400&auto=format&fit=crop&q=80',
    );

    Navigator.of(context).pop(newWorkout);
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

            const Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      'Create Custom Workout',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'Build and save your custom exercise routine',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
                Icon(Icons.add_circle_outline_rounded, color: AppTheme.primary, size: 28),
              ],
            ),

            const SizedBox(height: 20),

            // Workout Title Field
            Container(
              decoration: AppTheme.neuBox(radius: 16, inset: true),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: TextField(
                controller: _titleController,
                style: const TextStyle(fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                decoration: const InputDecoration(
                  icon: Icon(Icons.fitness_center_rounded, color: AppTheme.primary, size: 20),
                  hintText: 'Workout Title (e.g. Chest & Triceps Blast)',
                  hintStyle: TextStyle(color: AppTheme.textHint, fontSize: 14),
                  border: InputBorder.none,
                ),
              ),
            ),

            const SizedBox(height: 14),

            // Category & Level Pickers
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: AppTheme.neuBox(radius: 16),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedCategory,
                        isExpanded: true,
                        items: ['Strength', 'Cardio', 'HIIT', 'Yoga']
                            .map((c) => DropdownMenuItem(value: c, child: Text(c)))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedCategory = v ?? 'Strength'),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12),
                    decoration: AppTheme.neuBox(radius: 16),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedLevel,
                        isExpanded: true,
                        items: ['Beginner', 'Intermediate', 'Advanced']
                            .map((l) => DropdownMenuItem(value: l, child: Text(l)))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedLevel = v ?? 'Beginner'),
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Duration Slider
            Container(
              padding: const EdgeInsets.all(14),
              decoration: AppTheme.neuBox(radius: 16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Target Duration',
                        style: TextStyle(fontWeight: FontWeight.w600, fontSize: 13),
                      ),
                      Text(
                        '$_durationMin min',
                        style: const TextStyle(fontWeight: FontWeight.w800, color: AppTheme.primary),
                      ),
                    ],
                  ),
                  Slider(
                    value: _durationMin.toDouble(),
                    min: 15,
                    max: 90,
                    divisions: 15,
                    activeColor: AppTheme.primary,
                    inactiveColor: AppTheme.shadowDark,
                    onChanged: (v) => setState(() => _durationMin = v.round()),
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Exercises Header
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Exercises (${_exercises.length})',
                  style: const TextStyle(fontWeight: FontWeight.w700, fontSize: 15),
                ),
                const Text(
                  'Add multiple exercises',
                  style: TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                ),
              ],
            ),

            const SizedBox(height: 10),

            // Exercises Chips List
            ..._exercises.asMap().entries.map((entry) {
              final idx = entry.key;
              final ex = entry.value;
              return Container(
                margin: const EdgeInsets.only(bottom: 8),
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: AppTheme.neuBox(radius: 14),
                child: Row(
                  children: [
                    Container(
                      width: 26,
                      height: 26,
                      decoration: AppTheme.neuCircle(),
                      child: Center(
                        child: Text(
                          '${idx + 1}',
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700),
                        ),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Text(
                        ex.name,
                        style: const TextStyle(fontWeight: FontWeight.w600, fontSize: 14),
                      ),
                    ),
                    Text(
                      '${ex.sets} sets × ${ex.reps}',
                      style: const TextStyle(fontSize: 12, color: AppTheme.textSecondary),
                    ),
                    IconButton(
                      icon: const Icon(Icons.close_rounded, size: 18, color: Colors.red),
                      onPressed: () => setState(() => _exercises.removeAt(idx)),
                    ),
                  ],
                ),
              );
            }),

            const SizedBox(height: 10),

            // Quick Add Exercise Row
            Row(
              children: [
                Expanded(
                  flex: 3,
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 14, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 2),
                    child: TextField(
                      controller: _exerciseNameController,
                      decoration: const InputDecoration(
                        hintText: 'New Exercise Name',
                        hintStyle: TextStyle(fontSize: 12, color: AppTheme.textHint),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  flex: 1,
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 14, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 2),
                    child: TextField(
                      controller: _setsController,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      decoration: const InputDecoration(
                        hintText: 'Sets',
                        hintStyle: TextStyle(fontSize: 12, color: AppTheme.textHint),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                GestureDetector(
                  onTap: _addExercise,
                  child: Container(
                    width: 42,
                    height: 42,
                    decoration: AppTheme.neuCircle(),
                    child: const Icon(Icons.add, color: AppTheme.primary, size: 22),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 26),

            // Save Workout Button
            GestureDetector(
              onTap: _saveWorkout,
              child: Container(
                width: double.infinity,
                height: 54,
                decoration: AppTheme.neuButton(radius: 28),
                child: const Center(
                  child: Text(
                    'Save Workout to My Plans',
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
}
