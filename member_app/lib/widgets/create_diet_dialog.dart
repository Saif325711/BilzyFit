import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

Future<Meal?> showCreateMealDialog(BuildContext context) {
  return showModalBottomSheet<Meal>(
    context: context,
    isScrollControlled: true,
    backgroundColor: Colors.transparent,
    builder: (ctx) => const _CreateMealModal(),
  );
}

class _CreateMealModal extends StatefulWidget {
  const _CreateMealModal();

  @override
  State<_CreateMealModal> createState() => _CreateMealModalState();
}

class _CreateMealModalState extends State<_CreateMealModal> {
  final _nameController = TextEditingController();
  final _itemsController = TextEditingController();
  final _caloriesController = TextEditingController(text: '350');
  final _proteinController = TextEditingController(text: '30');
  final _carbsController = TextEditingController(text: '40');
  final _fatsController = TextEditingController(text: '10');
  String _selectedMealType = 'Breakfast';
  final String _time = '08:30 AM';

  @override
  void dispose() {
    _nameController.dispose();
    _itemsController.dispose();
    _caloriesController.dispose();
    _proteinController.dispose();
    _carbsController.dispose();
    _fatsController.dispose();
    super.dispose();
  }

  void _saveMeal() {
    final name = _nameController.text.trim();
    if (name.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please enter meal title')),
      );
      return;
    }

    final calories = int.tryParse(_caloriesController.text.trim()) ?? 350;
    final protein = int.tryParse(_proteinController.text.trim()) ?? 0;
    final carbs = int.tryParse(_carbsController.text.trim()) ?? 0;
    final fats = int.tryParse(_fatsController.text.trim()) ?? 0;

    final newMeal = Meal(
      _selectedMealType,
      _itemsController.text.trim().isEmpty ? name : _itemsController.text.trim(),
      calories,
      protein: protein,
      carbs: carbs,
      fats: fats,
      time: _time,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
    );

    Navigator.of(context).pop(newMeal);
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
                      'Log Custom Meal',
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.w800,
                        color: AppTheme.textPrimary,
                        letterSpacing: -0.3,
                      ),
                    ),
                    SizedBox(height: 3),
                    Text(
                      'Track nutrition, calories and macros',
                      style: TextStyle(fontSize: 13, color: AppTheme.textSecondary),
                    ),
                  ],
                ),
                Icon(Icons.restaurant_rounded, color: AppTheme.primary, size: 28),
              ],
            ),

            const SizedBox(height: 20),

            // Meal Name
            Container(
              decoration: AppTheme.neuBox(radius: 16, inset: true),
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
              child: TextField(
                controller: _nameController,
                style: const TextStyle(fontWeight: FontWeight.w600, color: AppTheme.textPrimary),
                decoration: const InputDecoration(
                  icon: Icon(Icons.lunch_dining_rounded, color: AppTheme.primary, size: 20),
                  hintText: 'Meal Name (e.g. Greek Yogurt & Berries)',
                  hintStyle: TextStyle(color: AppTheme.textHint, fontSize: 14),
                  border: InputBorder.none,
                ),
              ),
            ),

            const SizedBox(height: 14),

            // Meal Type Selector
            Row(
              children: [
                Expanded(
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14),
                    decoration: AppTheme.neuBox(radius: 16),
                    child: DropdownButtonHideUnderline(
                      child: DropdownButton<String>(
                        value: _selectedMealType,
                        isExpanded: true,
                        items: ['Breakfast', 'Lunch', 'Post Workout', 'Dinner', 'Snack']
                            .map((t) => DropdownMenuItem(value: t, child: Text(t)))
                            .toList(),
                        onChanged: (v) => setState(() => _selectedMealType = v ?? 'Breakfast'),
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 16, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 2),
                    child: TextField(
                      controller: _caloriesController,
                      keyboardType: TextInputType.number,
                      style: const TextStyle(fontWeight: FontWeight.w700),
                      decoration: const InputDecoration(
                        icon: Icon(Icons.local_fire_department_rounded, color: Color(0xFFFF5252), size: 18),
                        hintText: 'Calories (kcal)',
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            // Macros Row: Protein, Carbs, Fats
            const Text(
              'Macros Breakdown (grams)',
              style: TextStyle(fontSize: 13, fontWeight: FontWeight.w600, color: AppTheme.textSecondary),
            ),
            const SizedBox(height: 8),

            Row(
              children: [
                Expanded(
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 14, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                    child: TextField(
                      controller: _proteinController,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      decoration: const InputDecoration(
                        labelText: 'Protein (g)',
                        labelStyle: TextStyle(fontSize: 11, color: Color(0xFF3B82F6)),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 14, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                    child: TextField(
                      controller: _carbsController,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      decoration: const InputDecoration(
                        labelText: 'Carbs (g)',
                        labelStyle: TextStyle(fontSize: 11, color: Color(0xFFF59E0B)),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
                const SizedBox(width: 8),
                Expanded(
                  child: Container(
                    decoration: AppTheme.neuBox(radius: 14, inset: true),
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 2),
                    child: TextField(
                      controller: _fatsController,
                      keyboardType: TextInputType.number,
                      textAlign: TextAlign.center,
                      decoration: const InputDecoration(
                        labelText: 'Fats (g)',
                        labelStyle: TextStyle(fontSize: 11, color: Color(0xFFEF4444)),
                        border: InputBorder.none,
                      ),
                    ),
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),

            // Save Meal Button
            GestureDetector(
              onTap: _saveMeal,
              child: Container(
                width: double.infinity,
                height: 54,
                decoration: AppTheme.neuButton(radius: 28),
                child: const Center(
                  child: Text(
                    'Save to Today’s Diet Plan',
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
