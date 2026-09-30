import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';
import '../widgets/set_goal_dialog.dart';

class ProgressScreen extends StatefulWidget {
  const ProgressScreen({
    super.key,
    required this.member,
    required this.onRefresh,
    this.initialGoal,
  });

  final MemberData member;
  final Future<void> Function() onRefresh;
  final GoalData? initialGoal;

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen> {
  int _selectedPeriodIndex = 0;
  final List<String> _periods = const ['Week', 'Month', 'Year'];
  late GoalData _goal;

  @override
  void initState() {
    super.initState();
    _goal = widget.initialGoal ?? GoalData.defaultGoal;
  }

  Future<void> _handleSetGoal() async {
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

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: widget.onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Top Bar: "Progress" Title & "Set Goal" Button
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text(
                  'Progress',
                  style: TextStyle(
                    fontSize: 24,
                    fontWeight: FontWeight.w800,
                    color: AppTheme.textPrimary,
                    letterSpacing: -0.4,
                  ),
                ),
                GestureDetector(
                  onTap: _handleSetGoal,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                    decoration: AppTheme.neuButton(radius: 18),
                    child: const Row(
                      children: [
                        Icon(Icons.flag_rounded, color: Colors.white, size: 16),
                        SizedBox(width: 6),
                        Text(
                          'Set Goal',
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

            // Weekly Target Plan Card
            Container(
              padding: const EdgeInsets.all(18),
              decoration: AppTheme.neuBox(radius: 22),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      const Text(
                        'Weekly Target Plan',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.w800,
                          color: AppTheme.textPrimary,
                        ),
                      ),
                      Text(
                        '${_goal.weeklyWorkoutsDone}/${_goal.weeklyWorkoutsTarget} Days Completed',
                        style: const TextStyle(
                          fontSize: 12.5,
                          fontWeight: FontWeight.w700,
                          color: AppTheme.primary,
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 12),
                  // Workout Days Progress Bar
                  ClipRRect(
                    borderRadius: BorderRadius.circular(8),
                    child: LinearProgressIndicator(
                      value: _goal.workoutProgress,
                      minHeight: 10,
                      backgroundColor: AppTheme.shadowDark.withValues(alpha: 0.4),
                      valueColor: const AlwaysStoppedAnimation<Color>(AppTheme.primary),
                    ),
                  ),
                  const SizedBox(height: 16),
                  // Goal Targets Row
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _miniGoalItem(
                        'Weight Goal',
                        '${_goal.currentWeight} ➔ ${_goal.targetWeight} kg',
                        Icons.monitor_weight_rounded,
                        const Color(0xFF3B82F6),
                      ),
                      _miniGoalItem(
                        'Daily Steps',
                        '${_goal.dailyStepsDone} / ${_goal.dailyStepsTarget}',
                        Icons.directions_walk_rounded,
                        const Color(0xFF10B981),
                      ),
                      _miniGoalItem(
                        'Daily Burn',
                        '${_goal.dailyCaloriesBurned} / ${_goal.dailyCaloriesTarget} kcal',
                        Icons.local_fire_department_rounded,
                        const Color(0xFFFF5252),
                      ),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 22),

            // Segmented Period Filter: [Week], [Month], [Year] (Screen 10)
            Container(
              padding: const EdgeInsets.all(4),
              decoration: AppTheme.neuBox(radius: 20, inset: true),
              child: Row(
                children: List.generate(_periods.length, (index) {
                  final isSelected = index == _selectedPeriodIndex;
                  return Expanded(
                    child: GestureDetector(
                      onTap: () => setState(() => _selectedPeriodIndex = index),
                      child: AnimatedContainer(
                        duration: const Duration(milliseconds: 200),
                        padding: const EdgeInsets.symmetric(vertical: 10),
                        decoration: isSelected
                            ? BoxDecoration(
                                gradient: AppTheme.primaryGradient,
                                borderRadius: BorderRadius.circular(16),
                                boxShadow: [
                                  BoxShadow(
                                    color: AppTheme.primary.withValues(alpha: 0.35),
                                    blurRadius: 8,
                                    offset: const Offset(0, 3),
                                  ),
                                ],
                              )
                            : BoxDecoration(
                                borderRadius: BorderRadius.circular(16),
                              ),
                        child: Center(
                          child: Text(
                            _periods[index],
                            style: TextStyle(
                              fontSize: 13,
                              fontWeight: isSelected ? FontWeight.w700 : FontWeight.w600,
                              color: isSelected ? Colors.white : AppTheme.textSecondary,
                            ),
                          ),
                        ),
                      ),
                    ),
                  );
                }),
              ),
            ),

            const SizedBox(height: 24),

            // Smooth Curve Chart Card (Screen 10)
            Container(
              padding: const EdgeInsets.fromLTRB(16, 20, 16, 16),
              decoration: AppTheme.neuBox(radius: 24),
              child: Column(
                children: [
                  SizedBox(
                    height: 160,
                    width: double.infinity,
                    child: CustomPaint(
                      painter: _NeumorphicChartPainter(
                        points: const [0.35, 0.55, 0.40, 0.88, 0.65, 0.75, 0.50],
                        highlightIndex: 3,
                        highlightText: '${_goal.dailyCaloriesBurned} cal',
                      ),
                    ),
                  ),
                  const SizedBox(height: 14),
                  const Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      _DayLabel('Mon'),
                      _DayLabel('Tue'),
                      _DayLabel('Wed'),
                      _DayLabel('Thu', isHighlight: true),
                      _DayLabel('Fri'),
                      _DayLabel('Sat'),
                      _DayLabel('Sun'),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // 2x2 Grid of Neumorphic Stat Cards (Screen 10)
            Row(
              children: [
                Expanded(
                  child: _statCard(
                    icon: Icons.directions_walk_rounded,
                    iconColor: const Color(0xFF10B981),
                    title: 'Steps',
                    value: '${_goal.dailyStepsDone}',
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _statCard(
                    icon: Icons.local_fire_department_rounded,
                    iconColor: const Color(0xFFFF5252),
                    title: 'Calories',
                    value: '${_goal.dailyCaloriesBurned}',
                  ),
                ),
              ],
            ),

            const SizedBox(height: 16),

            Row(
              children: [
                Expanded(
                  child: _statCard(
                    icon: Icons.monitor_weight_rounded,
                    iconColor: const Color(0xFF3B82F6),
                    title: 'Weight',
                    value: '${_goal.currentWeight} kg',
                  ),
                ),
                const SizedBox(width: 16),
                Expanded(
                  child: _statCard(
                    icon: Icons.fitness_center_rounded,
                    iconColor: const Color(0xFF8B5CF6),
                    title: 'Workout',
                    value: '${_goal.weeklyWorkoutsDone} Days',
                  ),
                ),
              ],
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _miniGoalItem(String title, String value, IconData icon, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Icon(icon, color: color, size: 14),
            const SizedBox(width: 4),
            Text(title, style: const TextStyle(fontSize: 11, color: AppTheme.textSecondary)),
          ],
        ),
        const SizedBox(height: 3),
        Text(
          value,
          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: AppTheme.textPrimary),
        ),
      ],
    );
  }

  Widget _statCard({
    required IconData icon,
    required Color iconColor,
    required String title,
    required String value,
  }) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.neuBox(radius: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Container(
            width: 42,
            height: 42,
            decoration: AppTheme.neuCircle(),
            child: Icon(icon, color: iconColor, size: 22),
          ),
          const SizedBox(height: 14),
          Text(
            title,
            style: const TextStyle(
              fontSize: 13,
              fontWeight: FontWeight.w500,
              color: AppTheme.textSecondary,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            value,
            style: const TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.w800,
              color: AppTheme.textPrimary,
              letterSpacing: -0.3,
            ),
          ),
        ],
      ),
    );
  }
}

class _DayLabel extends StatelessWidget {
  const _DayLabel(this.text, {this.isHighlight = false});
  final String text;
  final bool isHighlight;

  @override
  Widget build(BuildContext context) {
    return Text(
      text,
      style: TextStyle(
        fontSize: 12,
        fontWeight: isHighlight ? FontWeight.w700 : FontWeight.w500,
        color: isHighlight ? AppTheme.primary : AppTheme.textSecondary,
      ),
    );
  }
}

class _NeumorphicChartPainter extends CustomPainter {
  _NeumorphicChartPainter({
    required this.points,
    required this.highlightIndex,
    required this.highlightText,
  });

  final List<double> points;
  final int highlightIndex;
  final String highlightText;

  @override
  void paint(Canvas canvas, Size size) {
    final double stepX = size.width / (points.length - 1);
    final path = Path();
    final fillPath = Path();

    final List<Offset> coords = [];
    for (int i = 0; i < points.length; i++) {
      final x = i * stepX;
      final y = size.height - (points[i] * size.height * 0.75) - 10;
      coords.add(Offset(x, y));
    }

    path.moveTo(coords[0].dx, coords[0].dy);
    fillPath.moveTo(coords[0].dx, size.height);
    fillPath.lineTo(coords[0].dx, coords[0].dy);

    for (int i = 0; i < coords.length - 1; i++) {
      final p0 = coords[i];
      final p1 = coords[i + 1];
      final controlX = (p0.dx + p1.dx) / 2;
      path.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
      fillPath.cubicTo(controlX, p0.dy, controlX, p1.dy, p1.dx, p1.dy);
    }

    fillPath.lineTo(coords.last.dx, size.height);
    fillPath.close();

    final fillPaint = Paint()
      ..shader = LinearGradient(
        begin: Alignment.topCenter,
        end: Alignment.bottomCenter,
        colors: [
          AppTheme.primary.withValues(alpha: 0.35),
          AppTheme.primary.withValues(alpha: 0.0),
        ],
      ).createShader(Rect.fromLTWH(0, 0, size.width, size.height));
    canvas.drawPath(fillPath, fillPaint);

    final linePaint = Paint()
      ..color = AppTheme.primary
      ..strokeWidth = 3.5
      ..style = PaintingStyle.stroke
      ..strokeCap = StrokeCap.round;
    canvas.drawPath(path, linePaint);

    final target = coords[highlightIndex];

    final glowPaint = Paint()
      ..color = AppTheme.primary.withValues(alpha: 0.25)
      ..style = PaintingStyle.fill;
    canvas.drawCircle(target, 12, glowPaint);

    final pointPaint = Paint()
      ..color = Colors.white
      ..style = PaintingStyle.fill;
    canvas.drawCircle(target, 6, pointPaint);

    final borderPaint = Paint()
      ..color = AppTheme.primary
      ..strokeWidth = 3
      ..style = PaintingStyle.stroke;
    canvas.drawCircle(target, 6, borderPaint);

    final textSpan = TextSpan(
      text: highlightText,
      style: const TextStyle(
        color: Colors.white,
        fontSize: 10,
        fontWeight: FontWeight.w700,
      ),
    );
    final textPainter = TextPainter(
      text: textSpan,
      textDirection: TextDirection.ltr,
    )..layout();

    final pillWidth = textPainter.width + 16;
    final pillHeight = textPainter.height + 8;
    final pillRect = RRect.fromRectAndRadius(
      Rect.fromCenter(
        center: Offset(target.dx, target.dy - 24),
        width: pillWidth,
        height: pillHeight,
      ),
      const Radius.circular(10),
    );

    final tagPaint = Paint()
      ..shader = AppTheme.primaryGradient.createShader(pillRect.outerRect);
    canvas.drawRRect(pillRect, tagPaint);

    textPainter.paint(
      canvas,
      Offset(target.dx - (textPainter.width / 2), target.dy - 24 - (textPainter.height / 2)),
    );
  }

  @override
  bool shouldRepaint(covariant _NeumorphicChartPainter oldDelegate) => true;
}
