import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

// ── design constants ───────────────────────────────────────────────────────
class _C {
  static const primary     = AppTheme.primary;
  static const primarySoft = Color(0xFFE8F7F2);
  static const textDark    = Color(0xFF101828);
  static const textGray    = Color(0xFF667085);
  static const orange      = Color(0xFFF97316);
  static const skyBlue     = Color(0xFF0EA5E9);
  static const r24         = Radius.circular(24);
  static const shadow = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 14, offset: Offset(0, 4)),
  ];
}

// ── default rich diet plan ─────────────────────────────────────────────────
const _defaultDietPlan = DietPlan(
  'Balanced Muscle Fuel',
  'High protein, lean carb nutrition plan',
  [
    Meal(
      'Breakfast',
      'Rolled Oats (60g), 4 Boiled Eggs, Almonds & Banana',
      450,
      protein: 34,
      carbs: 52,
      fats: 12,
    ),
    Meal(
      'Lunch',
      'Grilled Chicken / Paneer (150g), Brown Rice & Broccoli',
      620,
      protein: 46,
      carbs: 60,
      fats: 16,
    ),
    Meal(
      'Evening Snack',
      'Greek Yogurt with Chia Seeds, Apple & Whey Scoop',
      260,
      protein: 24,
      carbs: 28,
      fats: 6,
    ),
    Meal(
      'Dinner',
      'Tofu / Fish / Cottage Cheese, Sauteed Veggies & 2 Rotis',
      510,
      protein: 38,
      carbs: 45,
      fats: 14,
    ),
  ],
);

// ══════════════════════════════════════════════════════════════════════════
//  DietScreen  — drop-in replacement for _dietPage()
// ══════════════════════════════════════════════════════════════════════════
class DietScreen extends StatefulWidget {
  const DietScreen({
    super.key,
    required this.member,
    required this.diets,
    required this.loading,
    required this.onRefresh,
    required this.onCreateDiet,
  });

  final MemberData           member;
  final List<DietPlan>       diets;
  final bool                 loading;
  final Future<void> Function() onRefresh;
  final VoidCallback         onCreateDiet;

  @override
  State<DietScreen> createState() => _DietScreenState();
}

class _DietScreenState extends State<DietScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tab;
  final Set<String> _eatenMeals = {'Breakfast'};
  int _waterGlasses = 8; // 8 * 250ml = 2000ml

  @override
  void initState() {
    super.initState();
    _tab = TabController(length: 3, vsync: this);
    _tab.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  void _toggleMeal(String type) {
    setState(() {
      if (_eatenMeals.contains(type)) {
        _eatenMeals.remove(type);
      } else {
        _eatenMeals.add(type);
      }
    });
  }

  void _adjustWater(int delta) {
    setState(() {
      _waterGlasses = (_waterGlasses + delta).clamp(0, 16);
    });
  }

  @override
  Widget build(BuildContext context) {
    final activePlans = widget.diets.isNotEmpty
        ? widget.diets
        : [_defaultDietPlan];

    final plan = activePlans.first;
    final totalCals = plan.totalCalories;
    final totalProtein = plan.meals.fold(0, (sum, m) => sum + m.protein);
    final totalCarbs = plan.meals.fold(0, (sum, m) => sum + m.carbs);
    final totalFats = plan.meals.fold(0, (sum, m) => sum + m.fats);

    // Eaten calculations
    final eatenCals = plan.meals
        .where((m) => _eatenMeals.contains(m.type))
        .fold(0, (sum, m) => sum + m.calories);

    return RefreshIndicator(
      color: _C.primary,
      onRefresh: widget.onRefresh,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          // 1. Top brand bar & Hero nutrition card
          SliverToBoxAdapter(
            child: _DietHeader(member: widget.member),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 2. Daily Calorie & Macro Target Progress Card
          SliverToBoxAdapter(
            child: _MacroProgressCard(
              eatenCalories: eatenCals,
              targetCalories: totalCals,
              protein: totalProtein,
              carbs: totalCarbs,
              fats: totalFats,
              waterLiters: (_waterGlasses * 0.25).toStringAsFixed(1),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 18)),

          // 3. Tabs + Create Diet Button
          SliverToBoxAdapter(
            child: _DietTabs(
              ctrl: _tab,
              onCreate: widget.onCreateDiet,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 14)),

          // 4. Tab Content
          SliverToBoxAdapter(
            child: _tabContent(plan, activePlans),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }

  Widget _tabContent(DietPlan currentPlan, List<DietPlan> allPlans) {
    switch (_tab.index) {
      case 1:
        return _MacroBreakdownTab(plan: currentPlan);
      case 2:
        return _HydrationTab(
          glasses: _waterGlasses,
          onAdjust: _adjustWater,
        );
      default:
        return _MealsListTab(
          plan: currentPlan,
          eatenMeals: _eatenMeals,
          onToggleMeal: _toggleMeal,
          onCreate: widget.onCreateDiet,
        );
    }
  }
}

// ── DIET HEADER ────────────────────────────────────────────────────────────
class _DietHeader extends StatelessWidget {
  const _DietHeader({required this.member});
  final MemberData member;

  @override
  Widget build(BuildContext context) {
    final first = member.name.split(' ').firstOrNull ?? member.name;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Top App Bar: Brand Logo & Action Buttons
        Padding(
          padding: const EdgeInsets.only(bottom: 12, top: 2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              // bilzyfit brand
              Row(
                children: [
                  ClipRRect(
                    borderRadius: BorderRadius.circular(10),
                    child: Image.asset(
                      'assets/images/Applogo.png',
                      width: 38,
                      height: 38,
                      fit: BoxFit.cover,
                      errorBuilder: (_, _, _) => const SizedBox.shrink(),
                    ),
                  ),
                  const SizedBox(width: 8),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      RichText(
                        text: const TextSpan(
                          children: [
                            TextSpan(
                              text: 'bilzy',
                              style: TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.5,
                                color: Color(0xFF101828),
                              ),
                            ),
                            TextSpan(
                              text: 'fit',
                              style: TextStyle(
                                fontSize: 26,
                                fontWeight: FontWeight.w900,
                                letterSpacing: -0.5,
                                color: _C.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 2),
                      const Text(
                        'TRAIN  •  TRACK  •  TRANSFORM',
                        style: TextStyle(
                          fontSize: 8.5,
                          fontWeight: FontWeight.w700,
                          letterSpacing: 2.2,
                          color: Color(0xFF94A3B8),
                        ),
                      ),
                    ],
                  ),
                ],
              ),

              // Action buttons (Bell + QR)
              Row(
                children: [
                  _iconBtn(
                    Icons.notifications_none_rounded,
                    const Color(0xFFF1F5F9),
                    const Color(0xFF475569),
                  ),
                  const SizedBox(width: 10),
                  _iconBtn(
                    Icons.qr_code_2_rounded,
                    _C.primary,
                    Colors.white,
                    shadow: const [
                      BoxShadow(
                        color: Color(0x3300A878),
                        blurRadius: 10,
                        offset: Offset(0, 4),
                      ),
                    ],
                  ),
                ],
              ),
            ],
          ),
        ),

        // Greeting & Nutrition Card
        Container(
          width: double.infinity,
          height: 146,
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(_C.r24),
            boxShadow: _C.shadow,
          ),
          child: ClipRRect(
            borderRadius: const BorderRadius.all(_C.r24),
            child: Stack(
              children: [
                // Soft organic green backdrop circles
                Positioned(
                  right: -20,
                  top: -20,
                  child: Container(
                    width: 180,
                    height: 180,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: _C.primary.withValues(alpha: 0.12),
                    ),
                  ),
                ),
                Positioned(
                  right: 90,
                  bottom: -15,
                  child: Container(
                    width: 110,
                    height: 110,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: const Color(0xFF10B981).withValues(alpha: 0.08),
                    ),
                  ),
                ),

                // Healthy nutrition visual on the right
                Positioned(
                  right: 12,
                  top: 14,
                  bottom: 14,
                  width: 140,
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: _C.primary.withValues(alpha: 0.2),
                      ),
                    ),
                    child: const Center(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('🥗', style: TextStyle(fontSize: 42)),
                            SizedBox(height: 4),
                            Text(
                              '100% Clean',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: _C.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ),
                ),

                // Left text content
                Positioned(
                  left: 20,
                  top: 20,
                  bottom: 20,
                  right: 160,
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    alignment: Alignment.centerLeft,
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Hi, $first 👋',
                          style: const TextStyle(
                            color: _C.textGray,
                            fontSize: 14,
                            fontWeight: FontWeight.w600,
                          ),
                        ),
                        const SizedBox(height: 4),
                        RichText(
                          text: const TextSpan(
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.w900,
                              letterSpacing: -0.5,
                              color: _C.textDark,
                            ),
                            children: [
                              TextSpan(text: 'My '),
                              TextSpan(
                                text: 'Diet Plan',
                                style: TextStyle(color: _C.primary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 5),
                        const Text(
                          'Eat clean, fuel your gains 🥗',
                          style: TextStyle(
                            color: _C.textGray,
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }

  static Widget _iconBtn(IconData icon, Color bg, Color fg,
      {List<BoxShadow> shadow = const []}) {
    return Container(
      width: 44,
      height: 44,
      decoration: BoxDecoration(
        color: bg,
        shape: BoxShape.circle,
        boxShadow: shadow,
      ),
      child: Icon(icon, color: fg, size: 22),
    );
  }
}

// ── MACRO PROGRESS CARD ────────────────────────────────────────────────────
class _MacroProgressCard extends StatelessWidget {
  const _MacroProgressCard({
    required this.eatenCalories,
    required this.targetCalories,
    required this.protein,
    required this.carbs,
    required this.fats,
    required this.waterLiters,
  });

  final int eatenCalories;
  final int targetCalories;
  final int protein;
  final int carbs;
  final int fats;
  final String waterLiters;

  @override
  Widget build(BuildContext context) {
    final progress = (eatenCalories / (targetCalories > 0 ? targetCalories : 1))
        .clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Row 1: Calorie Summary & Progress Bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'Daily Calorie Target',
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: _C.textGray,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Row(
                    crossAxisAlignment: CrossAxisAlignment.baseline,
                    textBaseline: TextBaseline.alphabetic,
                    children: [
                      Text(
                        '$eatenCalories',
                        style: const TextStyle(
                          fontSize: 24,
                          fontWeight: FontWeight.w900,
                          color: _C.textDark,
                        ),
                      ),
                      Text(
                        ' / $targetCalories kcal',
                        style: const TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.w600,
                          color: _C.textGray,
                        ),
                      ),
                    ],
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                decoration: BoxDecoration(
                  color: _C.primarySoft,
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    const Icon(Icons.local_fire_department_rounded,
                        color: _C.orange, size: 16),
                    const SizedBox(width: 4),
                    Text(
                      '${(progress * 100).toInt()}% Done',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: _C.primary,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Calorie linear indicator
          ClipRRect(
            borderRadius: BorderRadius.circular(8),
            child: LinearProgressIndicator(
              value: progress,
              minHeight: 8,
              backgroundColor: const Color(0xFFF1F5F9),
              color: _C.primary,
            ),
          ),
          const SizedBox(height: 16),

          // Row 2: 3 Macros + Water Intake
          Row(
            children: [
              _macroPill('🍗 Protein', '${protein}g', const Color(0xFFDCFCE7),
                  const Color(0xFF15803D)),
              const SizedBox(width: 8),
              _macroPill('🌾 Carbs', '${carbs}g', const Color(0xFFE0F2FE),
                  const Color(0xFF0369A1)),
              const SizedBox(width: 8),
              _macroPill('🥑 Fats', '${fats}g', const Color(0xFFFEF3C7),
                  const Color(0xFFB45309)),
              const SizedBox(width: 8),
              _macroPill('💧 Water', '${waterLiters}L', const Color(0xFFEDE9FE),
                  const Color(0xFF6D28D9)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _macroPill(String label, String value, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: TextStyle(
                fontSize: 10,
                fontWeight: FontWeight.w700,
                color: fg,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: fg,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── DIET TABS ──────────────────────────────────────────────────────────────
class _DietTabs extends StatelessWidget {
  const _DietTabs({required this.ctrl, required this.onCreate});
  final TabController ctrl;
  final VoidCallback  onCreate;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        Expanded(
          child: Container(
            height: 38,
            decoration: BoxDecoration(
              color: const Color(0xFFF2F4F7),
              borderRadius: BorderRadius.circular(12),
            ),
            child: TabBar(
              controller: ctrl,
              indicator: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(10),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x14000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              indicatorSize: TabBarIndicatorSize.tab,
              dividerColor: Colors.transparent,
              labelColor: _C.primary,
              unselectedLabelColor: _C.textGray,
              labelStyle: const TextStyle(
                  fontSize: 11, fontWeight: FontWeight.w700),
              unselectedLabelStyle: const TextStyle(
                  fontSize: 11, fontWeight: FontWeight.w500),
              tabs: const [
                Tab(text: "Today's Meals"),
                Tab(text: 'Macros'),
                Tab(text: 'Hydration'),
              ],
            ),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: onCreate,
          child: Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
            decoration: BoxDecoration(
              color: _C.primary,
              borderRadius: BorderRadius.circular(18),
              boxShadow: const [
                BoxShadow(
                  color: Color(0x3300A878),
                  blurRadius: 8,
                  offset: Offset(0, 3),
                ),
              ],
            ),
            child: const Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.add, color: Colors.white, size: 14),
                SizedBox(width: 4),
                Text(
                  'Create Diet',
                  style: TextStyle(
                    color: Colors.white,
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── MEALS LIST TAB ─────────────────────────────────────────────────────────
class _MealsListTab extends StatelessWidget {
  const _MealsListTab({
    required this.plan,
    required this.eatenMeals,
    required this.onToggleMeal,
    required this.onCreate,
  });

  final DietPlan plan;
  final Set<String> eatenMeals;
  final ValueChanged<String> onToggleMeal;
  final VoidCallback onCreate;

  static const _mealIcons = {
    'Breakfast': '🥞',
    'Lunch': '🥗',
    'Snack': '🍎',
    'Dinner': '🥩',
  };

  static const _mealTimes = {
    'Breakfast': '8:00 AM – 9:00 AM',
    'Lunch': '1:00 PM – 2:00 PM',
    'Snack': '5:00 PM – 6:00 PM',
    'Dinner': '8:30 PM – 9:30 PM',
  };

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        children: [
          // Header info
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 18, 14),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Container(
                  width: 48,
                  height: 48,
                  decoration: const BoxDecoration(
                    color: _C.primarySoft,
                    borderRadius: BorderRadius.all(Radius.circular(14)),
                  ),
                  child: const Center(
                    child: Text('🥗', style: TextStyle(fontSize: 24)),
                  ),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        plan.name,
                        style: const TextStyle(
                          color: _C.textDark,
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        plan.description,
                        style: const TextStyle(
                          color: _C.textGray,
                          fontSize: 12,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        plan.source == 'member'
                            ? 'Created by you'
                            : 'Recommended by Nutritionist',
                        style: const TextStyle(
                          color: _C.primary,
                          fontSize: 11,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ],
                  ),
                ),
                Container(
                  padding:
                      const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: Text(
                    '${plan.totalCalories} kcal',
                    style: const TextStyle(
                      fontSize: 11,
                      fontWeight: FontWeight.w800,
                      color: Color(0xFFB45309),
                    ),
                  ),
                ),
              ],
            ),
          ),

          Container(height: 1, color: const Color(0xFFF2F4F7)),

          // Meals Items
          Padding(
            padding: const EdgeInsets.all(14),
            child: Column(
              children: [
                for (int i = 0; i < plan.meals.length; i++) ...[
                  _mealCard(plan.meals[i], i),
                  if (i < plan.meals.length - 1) const SizedBox(height: 10),
                ],
              ],
            ),
          ),

          // Add Meal Button
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 0, 14, 16),
            child: GestureDetector(
              onTap: onCreate,
              child: Container(
                padding: const EdgeInsets.symmetric(vertical: 13),
                decoration: BoxDecoration(
                  color: const Color(0xFFF0FDF4),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(
                    color: _C.primary.withValues(alpha: .25),
                  ),
                ),
                child: const Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(Icons.add_circle_outline,
                        color: _C.primary, size: 18),
                    SizedBox(width: 7),
                    Text(
                      'Customize Meal Plan',
                      style: TextStyle(
                        color: _C.primary,
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _mealCard(Meal meal, int index) {
    final isEaten = eatenMeals.contains(meal.type);
    final emoji = _mealIcons[meal.type] ?? '🍽️';
    final time = _mealTimes[meal.type] ?? 'Scheduled Meal';

    return InkWell(
      onTap: () => onToggleMeal(meal.type),
      borderRadius: BorderRadius.circular(18),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: isEaten ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(18),
          border: Border.all(
            color: isEaten
                ? _C.primary.withValues(alpha: 0.3)
                : const Color(0xFFE2E8F0),
          ),
        ),
        child: Row(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Emoji badge
            Container(
              width: 44,
              height: 44,
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x0A000000),
                    blurRadius: 4,
                    offset: Offset(0, 2),
                  ),
                ],
              ),
              child: Center(
                child: Text(emoji, style: const TextStyle(fontSize: 22)),
              ),
            ),
            const SizedBox(width: 12),

            // Meal info
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        meal.type,
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w800,
                          color: isEaten ? _C.primary : _C.textDark,
                          decoration: isEaten
                              ? TextDecoration.lineThrough
                              : TextDecoration.none,
                        ),
                      ),
                      Text(
                        '${meal.calories} kcal',
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w800,
                          color: _C.orange,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    time,
                    style: const TextStyle(fontSize: 10, color: _C.textGray),
                  ),
                  const SizedBox(height: 5),
                  Text(
                    meal.items,
                    style: const TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w500,
                      color: Color(0xFF334155),
                      height: 1.3,
                    ),
                  ),
                  if (meal.protein > 0 || meal.carbs > 0) ...[
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _tag('P: ${meal.protein}g', const Color(0xFFDCFCE7),
                            const Color(0xFF15803D)),
                        const SizedBox(width: 6),
                        _tag('C: ${meal.carbs}g', const Color(0xFFE0F2FE),
                            const Color(0xFF0369A1)),
                        const SizedBox(width: 6),
                        _tag('F: ${meal.fats}g', const Color(0xFFFEF3C7),
                            const Color(0xFFB45309)),
                      ],
                    ),
                  ],
                ],
              ),
            ),

            // Checkbox
            Padding(
              padding: const EdgeInsets.only(left: 8, top: 2),
              child: Container(
                width: 24,
                height: 24,
                decoration: BoxDecoration(
                  color: isEaten ? _C.primary : Colors.white,
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isEaten ? _C.primary : const Color(0xFFCBD5E1),
                    width: 2,
                  ),
                ),
                child: isEaten
                    ? const Icon(Icons.check, size: 14, color: Colors.white)
                    : null,
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _tag(String label, Color bg, Color fg) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
      decoration: BoxDecoration(
        color: bg,
        borderRadius: BorderRadius.circular(6),
      ),
      child: Text(
        label,
        style: TextStyle(
          fontSize: 9,
          fontWeight: FontWeight.w700,
          color: fg,
        ),
      ),
    );
  }
}

// ── MACRO BREAKDOWN TAB ────────────────────────────────────────────────────
class _MacroBreakdownTab extends StatelessWidget {
  const _MacroBreakdownTab({required this.plan});
  final DietPlan plan;

  @override
  Widget build(BuildContext context) {
    final totalProtein = plan.meals.fold(0, (sum, m) => sum + m.protein);
    final totalCarbs = plan.meals.fold(0, (sum, m) => sum + m.carbs);
    final totalFats = plan.meals.fold(0, (sum, m) => sum + m.fats);

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Nutrient Distribution',
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.w800,
              color: _C.textDark,
            ),
          ),
          const SizedBox(height: 4),
          const Text(
            'Optimized for lean muscle building and recovery',
            style: TextStyle(fontSize: 12, color: _C.textGray),
          ),
          const SizedBox(height: 18),
          _macroBar('Protein (Muscle repair)', totalProtein, 180,
              const Color(0xFF10B981)),
          const SizedBox(height: 14),
          _macroBar('Carbohydrates (Workout energy)', totalCarbs, 240,
              const Color(0xFF0EA5E9)),
          const SizedBox(height: 14),
          _macroBar(
              'Healthy Fats (Hormone balance)', totalFats, 70, const Color(0xFFF59E0B)),
          const SizedBox(height: 20),
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: const Row(
              children: [
                Text('💡', style: TextStyle(fontSize: 22)),
                SizedBox(width: 12),
                Expanded(
                  child: Text(
                    'Consume 1.8g – 2.2g of protein per kg of bodyweight to maximize muscle protein synthesis.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF475569)),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _macroBar(String label, int current, int target, Color color) {
    final progress = (current / (target > 0 ? target : 1)).clamp(0.0, 1.0);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(label,
                style: const TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w600,
                    color: _C.textDark)),
            Text('$current / ${target}g',
                style: TextStyle(
                    fontSize: 12,
                    fontWeight: FontWeight.w800,
                    color: color)),
          ],
        ),
        const SizedBox(height: 6),
        ClipRRect(
          borderRadius: BorderRadius.circular(6),
          child: LinearProgressIndicator(
            value: progress,
            minHeight: 8,
            backgroundColor: const Color(0xFFF1F5F9),
            color: color,
          ),
        ),
      ],
    );
  }
}

// ── HYDRATION TAB ──────────────────────────────────────────────────────────
class _HydrationTab extends StatelessWidget {
  const _HydrationTab({
    required this.glasses,
    required this.onAdjust,
  });

  final int glasses;
  final ValueChanged<int> onAdjust;

  @override
  Widget build(BuildContext context) {
    const targetGlasses = 12; // 3.0 Liters
    final liters = (glasses * 0.25).toStringAsFixed(1);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        children: [
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                'Water Intake Tracker',
                style: TextStyle(
                  fontSize: 16,
                  fontWeight: FontWeight.w800,
                  color: _C.textDark,
                ),
              ),
              Text(
                'Goal: 3.0 Liters',
                style: TextStyle(
                  fontSize: 12,
                  fontWeight: FontWeight.w700,
                  color: _C.skyBlue,
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          // Big Water Circle Display
          Container(
            width: 120,
            height: 120,
            decoration: BoxDecoration(
              shape: BoxShape.circle,
              color: const Color(0xFFF0F9FF),
              border: Border.all(color: const Color(0xFFBAE6FD), width: 3),
            ),
            child: Center(
              child: Column(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  const Text('💧', style: TextStyle(fontSize: 28)),
                  Text(
                    '$liters L',
                    style: const TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w900,
                      color: Color(0xFF0284C7),
                    ),
                  ),
                  Text(
                    '$glasses / $targetGlasses glasses',
                    style: const TextStyle(fontSize: 9, color: _C.textGray),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 20),

          // Adjust buttons
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              OutlinedButton.icon(
                onPressed: () => onAdjust(-1),
                style: OutlinedButton.styleFrom(
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                ),
                icon: const Icon(Icons.remove, size: 16),
                label: const Text('-250ml',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w700)),
              ),
              const SizedBox(width: 14),
              ElevatedButton.icon(
                onPressed: () => onAdjust(1),
                style: ElevatedButton.styleFrom(
                  backgroundColor: _C.skyBlue,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(14)),
                  padding:
                      const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
                ),
                icon: const Icon(Icons.add, size: 16),
                label: const Text('+250ml Glass',
                    style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800)),
              ),
            ],
          ),
          const SizedBox(height: 18),

          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFEFF6FF),
              borderRadius: BorderRadius.circular(14),
            ),
            child: const Text(
              '⚡ Optimal hydration increases workout stamina by up to 15% and prevents muscle cramps.',
              style: TextStyle(fontSize: 11, color: Color(0xFF1E40AF)),
              textAlign: TextAlign.center,
            ),
          ),
        ],
      ),
    );
  }
}
