import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';
import '../widgets/create_diet_dialog.dart';

class DietScreen extends StatefulWidget {
  const DietScreen({
    super.key,
    required this.member,
    required this.diets,
    required this.loading,
    required this.onRefresh,
    required this.onCreateDiet,
  });

  final MemberData member;
  final List<DietPlan> diets;
  final bool loading;
  final Future<void> Function() onRefresh;
  final VoidCallback onCreateDiet;

  @override
  State<DietScreen> createState() => _DietScreenState();
}

class _DietScreenState extends State<DietScreen> {
  int _selectedFilterIndex = 0;
  final List<String> _filters = const [
    'All',
    'Trainer Recommended',
    'My Meals',
    'Muscle Gain',
    'Weight Loss',
  ];

  late List<Meal> _allMeals;

  @override
  void initState() {
    super.initState();
    _allMeals = [
      const Meal(
        'Breakfast',
        'High Protein Oatmeal with Whey & Eggs',
        420,
        protein: 34,
        carbs: 55,
        fats: 10,
        time: '08:30 AM',
        image: 'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=300&auto=format&fit=crop&q=80',
      ),
      const Meal(
        'Lunch',
        'Chicken Salad Bowl with Quinoa',
        450,
        protein: 42,
        carbs: 35,
        fats: 12,
        time: '01:00 PM',
        image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=300&auto=format&fit=crop&q=80',
      ),
      const Meal(
        'Post Workout',
        'Whey Isolate Protein Shake',
        220,
        protein: 28,
        carbs: 10,
        fats: 4,
        time: '04:30 PM',
        image: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=300&auto=format&fit=crop&q=80',
      ),
      const Meal(
        'Dinner',
        'Grilled Herb Chicken with Broccoli',
        380,
        protein: 40,
        carbs: 15,
        fats: 14,
        time: '08:00 PM',
        image: 'https://images.unsplash.com/photo-1532550907401-a500c9a57435?w=300&auto=format&fit=crop&q=80',
      ),
    ];
  }

  Future<void> _handleCreateMeal() async {
    final newMeal = await showCreateMealDialog(context);
    if (newMeal != null && mounted) {
      setState(() {
        _allMeals.insert(0, newMeal);
        _selectedFilterIndex = 2; // Switch to "My Meals"
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('"${newMeal.items}" added to your diet tracker! 🥗'),
          backgroundColor: AppTheme.primary,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final activeFilter = _filters[_selectedFilterIndex];
    final filteredMeals = _allMeals.where((m) {
      if (activeFilter == 'All') return true;
      if (activeFilter == 'Trainer Recommended') return m.protein >= 30;
      if (activeFilter == 'My Meals') return m.time == '08:30 AM' && m.protein < 30 || m.fats <= 10;
      if (activeFilter == 'Muscle Gain') return m.protein >= 35;
      if (activeFilter == 'Weight Loss') return m.calories <= 400;
      return true;
    }).toList();

    final totalCalories = filteredMeals.fold(0, (sum, m) => sum + m.calories);
    final totalProtein = filteredMeals.fold(0, (sum, m) => sum + m.protein);

    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: widget.onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar: "Diet Plan" & "+ Add Meal" Button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Diet Plan',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                    letterSpacing: -0.4,
                  ),
                ),
                GestureDetector(
                  onTap: _handleCreateMeal,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                    decoration: AppTheme.neuButton(radius: 20),
                    child: const Row(
                      children: [
                        Icon(Icons.add, color: Colors.white, size: 16),
                        SizedBox(width: 4),
                        Text(
                          'Add Meal',
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
              ],
            ),

            const SizedBox(height: 18),

            // Daily Nutrition Summary Bar
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
              decoration: AppTheme.neuBox(radius: 20),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _macroSummary('Calories', '$totalCalories kcal', const Color(0xFFFF5252)),
                  Container(width: 1, height: 26, color: AppTheme.shadowDark.withValues(alpha: 0.5)),
                  _macroSummary('Protein', '${totalProtein}g', const Color(0xFF3B82F6)),
                  Container(width: 1, height: 26, color: AppTheme.shadowDark.withValues(alpha: 0.5)),
                  _macroSummary('Plan Target', '2,200 kcal', const Color(0xFF10B981)),
                ],
              ),
            ),

            const SizedBox(height: 20),

            // Filter Pills
            SizedBox(
              height: 40,
              child: ListView.separated(
                scrollDirection: Axis.horizontal,
                itemCount: _filters.length,
                separatorBuilder: (context, index) => const SizedBox(width: 10),
                itemBuilder: (context, index) {
                  final isSelected = index == _selectedFilterIndex;
                  return GestureDetector(
                    onTap: () => setState(() => _selectedFilterIndex = index),
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
                          _filters[index],
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

            // Meal Cards List
            ...filteredMeals.map((meal) {
              return Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: AppTheme.neuBox(radius: 20),
                  child: Row(
                    children: [
                      // Meal Photo
                      ClipRRect(
                        borderRadius: BorderRadius.circular(16),
                        child: Container(
                          width: 68,
                          height: 68,
                          color: const Color(0xFFE2E8F0),
                          child: Image.network(
                            meal.image,
                            fit: BoxFit.cover,
                            errorBuilder: (context, error, stackTrace) => const Center(
                              child: Icon(
                                Icons.restaurant_rounded,
                                color: AppTheme.primary,
                                size: 26,
                              ),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(width: 14),

                      // Title, Timing & Macros Info
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                Text(
                                  meal.type,
                                  style: const TextStyle(
                                    fontSize: 11,
                                    fontWeight: FontWeight.w700,
                                    color: AppTheme.primary,
                                  ),
                                ),
                                Text(
                                  meal.time,
                                  style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
                                ),
                              ],
                            ),
                            const SizedBox(height: 3),
                            Text(
                              meal.items,
                              style: const TextStyle(
                                fontSize: 14,
                                fontWeight: FontWeight.w700,
                                color: AppTheme.textPrimary,
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Text(
                              '${meal.calories} kcal • ${meal.protein}g P • ${meal.carbs}g C • ${meal.fats}g F',
                              style: const TextStyle(
                                fontSize: 12,
                                color: AppTheme.textSecondary,
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ],
                        ),
                      ),

                      // Right Arrow Chevron Icon
                      Container(
                        width: 36,
                        height: 36,
                        decoration: AppTheme.neuCircle(),
                        child: const Center(
                          child: Icon(
                            Icons.chevron_right_rounded,
                            color: AppTheme.textSecondary,
                            size: 20,
                          ),
                        ),
                      ),
                    ],
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

  Widget _macroSummary(String label, String value, Color color) {
    return Column(
      children: [
        Text(
          value,
          style: TextStyle(
            fontSize: 14,
            fontWeight: FontWeight.w800,
            color: color,
          ),
        ),
        const SizedBox(height: 2),
        Text(
          label,
          style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary),
        ),
      ],
    );
  }
}
