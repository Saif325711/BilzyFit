import 'package:flutter/material.dart';

import '../models/member_data.dart';
import '../theme/app_theme.dart';

Future<WorkoutPlan?> showWorkoutEditor(BuildContext context) {
  return showDialog<WorkoutPlan>(
    context: context,
    builder: (_) => const _WorkoutEditorDialog(),
  );
}

Future<DietPlan?> showDietEditor(BuildContext context) {
  return showDialog<DietPlan>(
    context: context,
    builder: (_) => const _DietEditorDialog(),
  );
}

class _WorkoutEditorDialog extends StatefulWidget {
  const _WorkoutEditorDialog();

  @override
  State<_WorkoutEditorDialog> createState() => _WorkoutEditorDialogState();
}

class _WorkoutEditorDialogState extends State<_WorkoutEditorDialog> {
  final name = TextEditingController();
  final description = TextEditingController();
  String focus = 'Strength';
  final exercises = <Map<String, TextEditingController>>[
    _exerciseControllers(),
  ];

  @override
  void dispose() {
    name.dispose();
    description.dispose();
    for (final exercise in exercises) {
      for (final controller in exercise.values) {
        controller.dispose();
      }
    }
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 560, maxHeight: 720),
        child: Column(
          children: [
            Container(
              padding: const EdgeInsets.fromLTRB(22, 22, 18, 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF064E3B), Color(0xFF059669)],
                ),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .16),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Icon(Icons.fitness_center_rounded, color: Colors.white, size: 28),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('Build your workout', style: TextStyle(color: Colors.white, fontSize: 21, fontWeight: FontWeight.w800)),
                        SizedBox(height: 4),
                        Text('Create a plan that fits your goals', style: TextStyle(color: Color(0xCCFFFFFF), fontSize: 13)),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 8),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    TextField(
                      controller: name,
                      decoration: _inputDecoration('Workout name', Icons.edit_outlined),
                    ),
                    const SizedBox(height: 12),
                    TextField(
                      controller: description,
                      decoration: _inputDecoration('Short goal or description', Icons.notes_outlined),
                    ),
                    const SizedBox(height: 18),
                    const Text('Training focus', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800)),
                    const SizedBox(height: 9),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: ['Strength', 'Chest', 'Back + Biceps', 'Legs', 'Full body']
                          .map(
                            (item) => ChoiceChip(
                              label: Text(item),
                              selected: focus == item,
                              onSelected: (_) => setState(() => focus = item),
                              selectedColor: AppTheme.primary.withValues(alpha: .16),
                              labelStyle: TextStyle(
                                color: focus == item ? AppTheme.primary : Colors.black54,
                                fontWeight: FontWeight.w700,
                              ),
                              side: BorderSide(color: focus == item ? AppTheme.primary : Colors.black12),
                            ),
                          )
                          .toList(),
                    ),
                    const SizedBox(height: 22),
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text('Exercises', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800)),
                        Text('${exercises.length} added', style: TextStyle(color: Colors.grey.shade600, fontSize: 12)),
                      ],
                    ),
                    const SizedBox(height: 10),
                    ...exercises.asMap().entries.map((entry) => _exerciseFields(entry.key, entry.value)),
                    OutlinedButton.icon(
                      onPressed: () => setState(() => exercises.add(_exerciseControllers())),
                      icon: const Icon(Icons.add),
                      label: const Text('Add another exercise'),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 48),
                        side: BorderSide(color: AppTheme.primary.withValues(alpha: .35)),
                        foregroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
            Padding(
              padding: const EdgeInsets.fromLTRB(20, 10, 20, 18),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(minimumSize: const Size(0, 52), shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15))),
                      child: const Text('Cancel'),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: FilledButton.icon(
                      onPressed: _save,
                      icon: const Icon(Icons.check_rounded),
                      label: const Text('Save workout'),
                      style: FilledButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        minimumSize: const Size(0, 52),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(15)),
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _exerciseFields(int index, Map<String, TextEditingController> fields) {
    return Card(
      elevation: 0,
      margin: const EdgeInsets.only(bottom: 10),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(18),
        side: BorderSide(color: Colors.grey.shade200),
      ),
      color: const Color(0xFFFBFDFC),
      child: Padding(
        padding: const EdgeInsets.fromLTRB(14, 10, 14, 14),
        child: Column(
          children: [
            Row(
              children: [
                Container(
                  width: 28,
                  height: 28,
                  alignment: Alignment.center,
                  decoration: BoxDecoration(
                    color: AppTheme.primary.withValues(alpha: .12),
                    borderRadius: BorderRadius.circular(9),
                  ),
                  child: Text('${index + 1}', style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w800)),
                ),
                const SizedBox(width: 9),
                const Expanded(child: Text('Exercise details', style: TextStyle(fontWeight: FontWeight.w700))),
                if (exercises.length > 1)
                  IconButton(
                    onPressed: () {
                      for (final controller in fields.values) {
                        controller.dispose();
                      }
                      setState(() => exercises.removeAt(index));
                    },
                    icon: const Icon(Icons.delete_outline, color: Colors.red),
                  ),
              ],
            ),
            TextField(controller: fields['name'], decoration: _inputDecoration('Exercise name', Icons.directions_run_outlined)),
            Row(
              children: [
                Expanded(child: TextField(controller: fields['sets'], keyboardType: TextInputType.number, decoration: _inputDecoration('Sets', Icons.repeat))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: fields['reps'], decoration: _inputDecoration('Reps', Icons.numbers))),
                const SizedBox(width: 8),
                Expanded(child: TextField(controller: fields['rest'], decoration: _inputDecoration('Rest', Icons.timer_outlined))),
              ],
            ),
          ],
        ),
      ),
    );
  }

  void _save() {
    final valid = exercises
        .where((item) => item['name']!.text.trim().isNotEmpty)
        .map((item) => WorkoutExercise(
              item['name']!.text.trim(),
              int.tryParse(item['sets']!.text) ?? 0,
              '${item['reps']!.text.trim()}${item['rest']!.text.trim().isEmpty ? '' : ' · Rest ${item['rest']!.text.trim()}'}',
            ))
        .toList();
    if (name.text.trim().isEmpty || valid.isEmpty) return;
    Navigator.pop(
      context,
      WorkoutPlan('$focus · ${name.text.trim()}', description.text.trim(), valid, source: 'member'),
    );
  }

  InputDecoration _inputDecoration(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      prefixIcon: Icon(icon, size: 19),
      filled: true,
      fillColor: const Color(0xFFF8FAFC),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: BorderSide(color: Colors.grey.shade200),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(14),
        borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
      ),
    );
  }
}

class _DietEditorDialog extends StatefulWidget {
  const _DietEditorDialog();

  @override
  State<_DietEditorDialog> createState() => _DietEditorDialogState();
}

class _DietEditorDialogState extends State<_DietEditorDialog> {
  final name = TextEditingController(text: 'High Protein Clean Diet');
  final description = TextEditingController(text: 'Optimized for lean muscle recovery');
  final targetCalories = TextEditingController(text: '2100');
  String dietGoal = 'Muscle Gain';
  final meals = <Map<String, TextEditingController>>[
    _mealControllersPreset('Breakfast', 'Rolled Oats (60g), 4 Boiled Eggs, Almonds & Banana', '450', '34'),
    _mealControllersPreset('Lunch', 'Grilled Chicken / Paneer (150g), Brown Rice & Steamed Broccoli', '620', '46'),
    _mealControllersPreset('Snack', 'Greek Yogurt with Chia Seeds, Apple & Whey Scoop', '260', '24'),
    _mealControllersPreset('Dinner', 'Tofu / Fish / Cottage Cheese, Sauteed Veggies & 2 Rotis', '510', '38'),
  ];

  @override
  void dispose() {
    name.dispose();
    description.dispose();
    targetCalories.dispose();
    for (final meal in meals) {
      for (final controller in meal.values) {
        controller.dispose();
      }
    }
    super.dispose();
  }

  int get _totalPlannedCalories => meals.fold(
      0, (sum, m) => sum + (int.tryParse(m['calories']!.text.trim()) ?? 0));

  int get _totalPlannedProtein => meals.fold(
      0, (sum, m) => sum + (int.tryParse(m['protein']!.text.trim()) ?? 0));

  @override
  Widget build(BuildContext context) {
    final target = int.tryParse(targetCalories.text.trim()) ?? 2100;
    final total = _totalPlannedCalories;

    return Dialog(
      insetPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 24),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(28)),
      child: ConstrainedBox(
        constraints: const BoxConstraints(maxWidth: 580, maxHeight: 760),
        child: Column(
          children: [
            // Top Premium Emerald Gradient Header
            Container(
              padding: const EdgeInsets.fromLTRB(22, 22, 18, 20),
              decoration: const BoxDecoration(
                gradient: LinearGradient(
                  colors: [Color(0xFF064E3B), Color(0xFF059669)],
                ),
                borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
              ),
              child: Row(
                children: [
                  Container(
                    padding: const EdgeInsets.all(12),
                    decoration: BoxDecoration(
                      color: Colors.white.withValues(alpha: .18),
                      borderRadius: BorderRadius.circular(16),
                    ),
                    child: const Text('🥗', style: TextStyle(fontSize: 26)),
                  ),
                  const SizedBox(width: 14),
                  const Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Build Nutrition Plan',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 21,
                            fontWeight: FontWeight.w800,
                            letterSpacing: -0.3,
                          ),
                        ),
                        SizedBox(height: 3),
                        Text(
                          'Tailor macros, meals & daily calories',
                          style: TextStyle(
                            color: Color(0xCCFFFFFF),
                            fontSize: 12.5,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  IconButton(
                    onPressed: () => Navigator.pop(context),
                    icon: const Icon(Icons.close, color: Colors.white),
                  ),
                ],
              ),
            ),

            // Scrollable Content
            Expanded(
              child: SingleChildScrollView(
                padding: const EdgeInsets.fromLTRB(20, 18, 20, 12),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Diet Goal Chips
                    const Text(
                      'Nutrition Goal',
                      style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: [
                        'Muscle Gain',
                        'Fat Loss',
                        'Lean Bulk',
                        'Maintenance',
                        'Clean Eating',
                      ].map((item) {
                        final isSelected = dietGoal == item;
                        return ChoiceChip(
                          label: Text(item),
                          selected: isSelected,
                          onSelected: (_) => setState(() {
                            dietGoal = item;
                            if (item == 'Fat Loss') targetCalories.text = '1800';
                            if (item == 'Muscle Gain') targetCalories.text = '2400';
                            if (item == 'Lean Bulk') targetCalories.text = '2600';
                            if (item == 'Maintenance') targetCalories.text = '2100';
                          }),
                          selectedColor: AppTheme.primary.withValues(alpha: .16),
                          labelStyle: TextStyle(
                            color: isSelected ? AppTheme.primary : const Color(0xFF475569),
                            fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                            fontSize: 12,
                          ),
                          side: BorderSide(
                            color: isSelected ? AppTheme.primary : const Color(0xFFE2E8F0),
                          ),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 18),

                    // Plan Name
                    TextField(
                      controller: name,
                      decoration: _inputDec('Diet plan name', Icons.restaurant_menu_rounded),
                    ),
                    const SizedBox(height: 12),

                    // Description
                    TextField(
                      controller: description,
                      decoration: _inputDec('Goal or notes', Icons.notes_rounded),
                    ),
                    const SizedBox(height: 16),

                    // Daily Calories + Calorie Presets
                    Row(
                      children: [
                        Expanded(
                          child: TextField(
                            controller: targetCalories,
                            keyboardType: TextInputType.number,
                            onChanged: (_) => setState(() {}),
                            decoration: _inputDec('Daily Target (kcal)', Icons.local_fire_department_rounded),
                          ),
                        ),
                        const SizedBox(width: 8),
                        IconButton.filledTonal(
                          tooltip: 'Auto Calculate',
                          onPressed: _calculateCalories,
                          style: IconButton.styleFrom(
                            backgroundColor: AppTheme.primary.withValues(alpha: 0.12),
                            foregroundColor: AppTheme.primary,
                            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                            padding: const EdgeInsets.all(12),
                          ),
                          icon: const Icon(Icons.calculate_rounded),
                        ),
                      ],
                    ),
                    const SizedBox(height: 8),

                    // Quick Calorie Preset Chips
                    Wrap(
                      spacing: 6,
                      children: ['1800', '2100', '2400', '2800'].map((cal) {
                        return ActionChip(
                          label: Text('$cal kcal'),
                          onPressed: () => setState(() => targetCalories.text = cal),
                          labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
                          backgroundColor: const Color(0xFFF1F5F9),
                          side: BorderSide.none,
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 18),

                    // Real-time Macro & Calorie Bar
                    Container(
                      padding: const EdgeInsets.all(12),
                      decoration: BoxDecoration(
                        color: const Color(0xFFF8FAFC),
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(color: const Color(0xFFE2E8F0)),
                      ),
                      child: Column(
                        children: [
                          Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Text(
                                'Planned: $total kcal',
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.w800,
                                  color: total > target ? Colors.red.shade700 : AppTheme.primary,
                                ),
                              ),
                              Text(
                                'Target: $target kcal',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: Color(0xFF64748B)),
                              ),
                              Text(
                                'Protein: ${_totalPlannedProtein}g',
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: Color(0xFF0369A1)),
                              ),
                            ],
                          ),
                          const SizedBox(height: 6),
                          ClipRRect(
                            borderRadius: BorderRadius.circular(6),
                            child: LinearProgressIndicator(
                              value: (total / (target > 0 ? target : 1)).clamp(0.0, 1.0),
                              minHeight: 6,
                              backgroundColor: const Color(0xFFE2E8F0),
                              color: AppTheme.primary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 20),

                    // Meals Header
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Text(
                          'Daily Meals',
                          style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800),
                        ),
                        Text(
                          '${meals.length} meals configured',
                          style: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B), fontWeight: FontWeight.w500),
                        ),
                      ],
                    ),
                    const SizedBox(height: 10),

                    // Meal Cards List
                    ...meals.asMap().entries.map((entry) => _mealFields(entry.key, entry.value)),

                    // Add Meal Button
                    OutlinedButton.icon(
                      onPressed: () => setState(() => meals.add(_mealControllers())),
                      icon: const Icon(Icons.add, size: 18),
                      label: const Text('Add Another Meal'),
                      style: OutlinedButton.styleFrom(
                        minimumSize: const Size(double.infinity, 46),
                        side: BorderSide(color: AppTheme.primary.withValues(alpha: .35), width: 1.5),
                        foregroundColor: AppTheme.primary,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        textStyle: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13),
                      ),
                    ),
                  ],
                ),
              ),
            ),

            // Footer Actions
            Container(
              padding: const EdgeInsets.fromLTRB(20, 12, 20, 18),
              decoration: const BoxDecoration(
                border: Border(top: BorderSide(color: Color(0xFFF1F5F9))),
              ),
              child: Row(
                children: [
                  Expanded(
                    child: OutlinedButton(
                      onPressed: () => Navigator.pop(context),
                      style: OutlinedButton.styleFrom(
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        side: const BorderSide(color: Color(0xFFCBD5E1)),
                      ),
                      child: const Text('Cancel', style: TextStyle(fontWeight: FontWeight.w700, color: Color(0xFF475569))),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    flex: 2,
                    child: ElevatedButton(
                      onPressed: _save,
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primary,
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(vertical: 14),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                        elevation: 2,
                      ),
                      child: const Text('Save Diet Plan', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 14)),
                    ),
                  ),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _mealFields(int index, Map<String, TextEditingController> fields) {
    const mealSuggestions = ['Breakfast', 'Lunch', 'Snack', 'Dinner', 'Post-Workout'];

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: const Color(0xFFF8FAFC),
        borderRadius: BorderRadius.circular(18),
        border: Border.all(color: const Color(0xFFE2E8F0)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 26,
                height: 26,
                alignment: Alignment.center,
                decoration: BoxDecoration(
                  color: AppTheme.primary.withValues(alpha: .14),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: Text(
                  '${index + 1}',
                  style: const TextStyle(color: AppTheme.primary, fontWeight: FontWeight.w800, fontSize: 12),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Text(
                  fields['type']!.text.isNotEmpty ? fields['type']!.text : 'Meal ${index + 1}',
                  style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: Color(0xFF1E293B)),
                ),
              ),
              if (meals.length > 1)
                IconButton(
                  onPressed: () {
                    for (final controller in fields.values) {
                      controller.dispose();
                    }
                    setState(() => meals.removeAt(index));
                  },
                  icon: const Icon(Icons.delete_outline_rounded, color: Colors.red, size: 20),
                  padding: EdgeInsets.zero,
                  constraints: const BoxConstraints(),
                ),
            ],
          ),
          const SizedBox(height: 6),

          // Meal Type Quick Chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            child: Row(
              children: mealSuggestions.map((m) {
                final isCurrent = fields['type']!.text == m;
                return Padding(
                  padding: const EdgeInsets.only(right: 5),
                  child: InkWell(
                    onTap: () => setState(() => fields['type']!.text = m),
                    borderRadius: BorderRadius.circular(8),
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isCurrent ? AppTheme.primary.withValues(alpha: 0.15) : Colors.white,
                        borderRadius: BorderRadius.circular(8),
                        border: Border.all(color: isCurrent ? AppTheme.primary : const Color(0xFFCBD5E1)),
                      ),
                      child: Text(
                        m,
                        style: TextStyle(
                          fontSize: 10,
                          fontWeight: isCurrent ? FontWeight.w800 : FontWeight.w600,
                          color: isCurrent ? AppTheme.primary : const Color(0xFF475569),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
          const SizedBox(height: 8),

          // Food items field
          TextField(
            controller: fields['items'],
            decoration: _inputDec('Food items (e.g. 4 Eggs, Oats & Milk)', Icons.restaurant_rounded),
            style: const TextStyle(fontSize: 12.5),
          ),
          const SizedBox(height: 8),

          // Calories & Protein
          Row(
            children: [
              Expanded(
                child: TextField(
                  controller: fields['calories'],
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                  decoration: _inputDec('Calories (kcal)', Icons.local_fire_department_outlined),
                  style: const TextStyle(fontSize: 12.5),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: TextField(
                  controller: fields['protein'],
                  keyboardType: TextInputType.number,
                  onChanged: (_) => setState(() {}),
                  decoration: _inputDec('Protein (g)', Icons.fitness_center_rounded),
                  style: const TextStyle(fontSize: 12.5),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  InputDecoration _inputDec(String label, IconData icon) {
    return InputDecoration(
      labelText: label,
      labelStyle: const TextStyle(fontSize: 11.5, color: Color(0xFF64748B)),
      prefixIcon: Icon(icon, size: 18, color: AppTheme.primary),
      filled: true,
      fillColor: Colors.white,
      contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
      ),
      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(12),
        borderSide: const BorderSide(color: AppTheme.primary, width: 1.5),
      ),
    );
  }

  Future<void> _calculateCalories() async {
    final values = await showDialog<List<int>>(
      context: context,
      builder: (context) => const _CalorieCalculatorDialog(),
    );
    if (values == null) return;
    final calories = ((10 * values[0]) + (6.25 * values[1]) - (5 * values[2]) + 5) * 1.35;
    targetCalories.text = calories.round().toString();
    setState(() {});
  }

  void _save() {
    final valid = meals
        .where((item) =>
            item['type']!.text.trim().isNotEmpty && item['items']!.text.trim().isNotEmpty)
        .map((item) => Meal(
              item['type']!.text.trim(),
              item['items']!.text.trim(),
              int.tryParse(item['calories']!.text.trim()) ?? 0,
              protein: int.tryParse(item['protein']!.text.trim()) ?? 0,
            ))
        .toList();
    if (name.text.trim().isEmpty || valid.isEmpty) return;
    Navigator.pop(
      context,
      DietPlan('$dietGoal · ${name.text.trim()}', description.text.trim(), valid, source: 'member'),
    );
  }
}

Map<String, TextEditingController> _mealControllersPreset(
    String type, String items, String calories, String protein) =>
    {
      'type': TextEditingController(text: type),
      'items': TextEditingController(text: items),
      'calories': TextEditingController(text: calories),
      'protein': TextEditingController(text: protein),
    };

class _CalorieCalculatorDialog extends StatefulWidget {
  const _CalorieCalculatorDialog();

  @override
  State<_CalorieCalculatorDialog> createState() => _CalorieCalculatorDialogState();
}

class _CalorieCalculatorDialogState extends State<_CalorieCalculatorDialog> {
  final age = TextEditingController(text: '25');
  final weight = TextEditingController(text: '70');
  final height = TextEditingController(text: '170');

  @override
  void dispose() {
    age.dispose();
    weight.dispose();
    height.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AlertDialog(
      title: const Text('Calculate daily calories'),
      content: SingleChildScrollView(
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: [
            TextField(controller: age, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Age')),
            TextField(controller: weight, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Weight (kg)')),
            TextField(controller: height, keyboardType: TextInputType.number, decoration: const InputDecoration(labelText: 'Height (cm)')),
          ],
        ),
      ),
      actions: [
        TextButton(onPressed: () => Navigator.pop(context), child: const Text('Cancel')),
        FilledButton(
          onPressed: () => Navigator.pop(context, [
            int.tryParse(weight.text) ?? 70,
            int.tryParse(height.text) ?? 170,
            int.tryParse(age.text) ?? 25,
          ]),
          child: const Text('Use calories'),
        ),
      ],
    );
  }
}

Map<String, TextEditingController> _exerciseControllers() => {
      'name': TextEditingController(),
      'sets': TextEditingController(text: '3'),
      'reps': TextEditingController(text: '10'),
      'rest': TextEditingController(text: '60s'),
    };

Map<String, TextEditingController> _mealControllers() => {
      'type': TextEditingController(),
      'items': TextEditingController(),
      'calories': TextEditingController(text: '0'),
      'protein': TextEditingController(text: '0'),
    };
