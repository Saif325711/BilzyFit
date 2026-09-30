import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

// ── design constants ───────────────────────────────────────────────────────
class _C {
  static const primary     = AppTheme.primary;
  static const textDark    = Color(0xFF101828);
  static const textGray    = Color(0xFF667085);
  static const orange      = Color(0xFFF97316);
  static const r24         = Radius.circular(24);
  static const shadow = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 14, offset: Offset(0, 4)),
  ];
}

// ══════════════════════════════════════════════════════════════════════════
//  ProgressScreen  — drop-in replacement for _progressPage()
// ══════════════════════════════════════════════════════════════════════════
class ProgressScreen extends StatefulWidget {
  const ProgressScreen({
    super.key,
    required this.member,
    required this.onRefresh,
  });

  final MemberData member;
  final Future<void> Function() onRefresh;

  @override
  State<ProgressScreen> createState() => _ProgressScreenState();
}

class _ProgressScreenState extends State<ProgressScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tab;
  double _currentWeight = 72.0;
  final List<({String exercise, String weight, String reps, String date})> _prs = [
    (exercise: 'Bench Press', weight: '100 kg', reps: '1 rep', date: '3 days ago'),
    (exercise: 'Barbell Squat', weight: '140 kg', reps: '3 reps', date: 'Last week'),
    (exercise: 'Deadlift', weight: '160 kg', reps: '1 rep', date: '2 weeks ago'),
    (exercise: 'Pull-ups', weight: 'Bodyweight + 15 kg', reps: '8 reps', date: '10 days ago'),
  ];

  @override
  void initState() {
    super.initState();
    _currentWeight = widget.member.weight > 0 ? widget.member.weight : 72.0;
    _tab = TabController(length: 3, vsync: this);
    _tab.addListener(() => setState(() {}));
  }

  @override
  void dispose() {
    _tab.dispose();
    super.dispose();
  }

  void _showLogWeightDialog() {
    final controller = TextEditingController(text: _currentWeight.toStringAsFixed(1));
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        title: const Text('Log Current Weight', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 18)),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('Keep track of your body recomposition journey.', style: TextStyle(fontSize: 12, color: _C.textGray)),
              const SizedBox(height: 16),
              TextField(
                controller: controller,
                keyboardType: const TextInputType.numberWithOptions(decimal: true),
                decoration: InputDecoration(
                  labelText: 'Weight (kg)',
                  suffixText: 'kg',
                  prefixIcon: const Icon(Icons.monitor_weight_outlined, color: _C.primary),
                  filled: true,
                  fillColor: const Color(0xFFF8FAFC),
                  border: OutlineInputBorder(borderRadius: BorderRadius.circular(14)),
                ),
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(ctx),
            child: const Text('Cancel', style: TextStyle(color: _C.textGray, fontWeight: FontWeight.w700)),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: _C.primary,
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
            ),
            onPressed: () {
              final val = double.tryParse(controller.text.trim());
              if (val != null && val > 0) {
                setState(() => _currentWeight = val);
              }
              Navigator.pop(ctx);
            },
            child: const Text('Save Entry', style: TextStyle(fontWeight: FontWeight.w800)),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: _C.primary,
      onRefresh: widget.onRefresh,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          // 1. Top Brand Header + Progress Greeting
          SliverToBoxAdapter(
            child: _ProgressHeader(member: widget.member),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 2. Main Consistency / Attendance Hero Ring Card
          const SliverToBoxAdapter(
            child: _ConsistencyHeroCard(
              visitsThisMonth: 18,
              totalTargetVisits: 24,
              streakDays: 5,
              totalHours: '28.5 hrs',
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 18)),

          // 3. Tabs + Log Weight Quick Action Button
          SliverToBoxAdapter(
            child: _ProgressTabs(
              ctrl: _tab,
              onLogWeight: _showLogWeightDialog,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 14)),

          // 4. Tab Content
          SliverToBoxAdapter(
            child: _tabContent(),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }

  Widget _tabContent() {
    switch (_tab.index) {
      case 1:
        return _BodyCompositionTab(
          weight: _currentWeight,
          height: widget.member.height > 0 ? widget.member.height : 178,
          onLogWeight: _showLogWeightDialog,
        );
      case 2:
        return _PersonalRecordsTab(prs: _prs);
      default:
        return const _ConsistencyOverviewTab();
    }
  }
}

// ── PROGRESS HEADER ────────────────────────────────────────────────────────
class _ProgressHeader extends StatelessWidget {
  const _ProgressHeader({required this.member});
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

        // Greeting & Trophy Card
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
                      color: const Color(0xFF0EA5E9).withValues(alpha: 0.08),
                    ),
                  ),
                ),

                // Trophy achievement visual on the right
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
                            Text('🏆', style: TextStyle(fontSize: 38)),
                            SizedBox(height: 4),
                            Text(
                              'Top 10% Gym',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: _C.primary,
                              ),
                            ),
                            Text(
                              'Consistency Index',
                              style: TextStyle(
                                fontSize: 8.5,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF059669),
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
                                text: 'Progress',
                                style: TextStyle(color: _C.primary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 5),
                        const Text(
                          'Track consistency & transformation 📈',
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

// ── CONSISTENCY HERO CARD (ATTENDANCE RING + STATS) ─────────────────────────
class _ConsistencyHeroCard extends StatelessWidget {
  const _ConsistencyHeroCard({
    required this.visitsThisMonth,
    required this.totalTargetVisits,
    required this.streakDays,
    required this.totalHours,
  });

  final int visitsThisMonth;
  final int totalTargetVisits;
  final int streakDays;
  final String totalHours;

  @override
  Widget build(BuildContext context) {
    final progress = (visitsThisMonth / totalTargetVisits).clamp(0.0, 1.0);

    return Container(
      padding: const EdgeInsets.all(20),
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        children: [
          Row(
            children: [
              // Circular Attendance Ring
              SizedBox(
                width: 104,
                height: 104,
                child: Stack(
                  alignment: Alignment.center,
                  children: [
                    SizedBox(
                      width: 104,
                      height: 104,
                      child: CircularProgressIndicator(
                        value: progress,
                        strokeWidth: 10,
                        backgroundColor: const Color(0xFFF1F5F9),
                        color: _C.primary,
                        strokeCap: StrokeCap.round,
                      ),
                    ),
                    Column(
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Text(
                          '$visitsThisMonth',
                          style: const TextStyle(
                            fontSize: 28,
                            fontWeight: FontWeight.w900,
                            color: _C.textDark,
                            height: 1.0,
                          ),
                        ),
                        const SizedBox(height: 2),
                        const Text(
                          'VISITS',
                          style: TextStyle(
                            fontSize: 9.5,
                            fontWeight: FontWeight.w800,
                            letterSpacing: 1.2,
                            color: _C.textGray,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 20),

              // Summary Info
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              const Icon(Icons.local_fire_department_rounded,
                                  color: _C.orange, size: 14),
                              const SizedBox(width: 3),
                              Text(
                                '$streakDays Day Streak',
                                style: const TextStyle(
                                  fontSize: 10.5,
                                  fontWeight: FontWeight.w800,
                                  color: Color(0xFFB45309),
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 6),
                    const Text(
                      'Outstanding Consistency!',
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.w800,
                        color: _C.textDark,
                      ),
                    ),
                    const SizedBox(height: 3),
                    Text(
                      'You have completed ${(progress * 100).toInt()}% of your monthly attendance goal.',
                      style: const TextStyle(fontSize: 11.5, color: _C.textGray, height: 1.3),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 3 Metric Badges
          Row(
            children: [
              _metricPill('📅 Goal', '$visitsThisMonth / $totalTargetVisits days',
                  const Color(0xFFDCFCE7), const Color(0xFF15803D)),
              const SizedBox(width: 8),
              _metricPill('⏱ Gym Time', totalHours,
                  const Color(0xFFE0F2FE), const Color(0xFF0369A1)),
              const SizedBox(width: 8),
              _metricPill('⚡ Level', 'Beast Mode',
                  const Color(0xFFEDE9FE), const Color(0xFF6D28D9)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _metricPill(String label, String value, Color bg, Color fg) {
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
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: fg),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w900, color: fg),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ── PROGRESS TABS ──────────────────────────────────────────────────────────
class _ProgressTabs extends StatelessWidget {
  const _ProgressTabs({required this.ctrl, required this.onLogWeight});
  final TabController ctrl;
  final VoidCallback  onLogWeight;

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
              labelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700),
              unselectedLabelStyle: const TextStyle(fontSize: 11, fontWeight: FontWeight.w500),
              tabs: const [
                Tab(text: 'Consistency'),
                Tab(text: 'Body Metrics'),
                Tab(text: 'PRs & Strength'),
              ],
            ),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: onLogWeight,
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
                  'Log Entry',
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

// ── TAB 1: CONSISTENCY OVERVIEW TAB ─────────────────────────────────────────
class _ConsistencyOverviewTab extends StatelessWidget {
  const _ConsistencyOverviewTab();

  @override
  Widget build(BuildContext context) {
    const weeklyData = [
      (week: 'Week 1', days: '5 / 6 Days', percent: 0.83, color: Color(0xFF10B981)),
      (week: 'Week 2', days: '4 / 6 Days', percent: 0.67, color: Color(0xFF0EA5E9)),
      (week: 'Week 3', days: '5 / 6 Days', percent: 0.83, color: Color(0xFF10B981)),
      (week: 'Week 4 (Current)', days: '4 / 4 Days', percent: 1.0, color: Color(0xFFF59E0B)),
    ];

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
            'Weekly Attendance Breakdown',
            style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _C.textDark),
          ),
          const SizedBox(height: 4),
          const Text(
            'Consistency breakdown for September 2026',
            style: TextStyle(fontSize: 12, color: _C.textGray),
          ),
          const SizedBox(height: 16),

          ...weeklyData.map((w) {
            return Padding(
              padding: const EdgeInsets.only(bottom: 12),
              child: Column(
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(w.week, style: const TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700, color: _C.textDark)),
                      Text(w.days, style: TextStyle(fontSize: 12, fontWeight: FontWeight.w800, color: w.color)),
                    ],
                  ),
                  const SizedBox(height: 6),
                  ClipRRect(
                    borderRadius: BorderRadius.circular(6),
                    child: LinearProgressIndicator(
                      value: w.percent,
                      minHeight: 7,
                      backgroundColor: const Color(0xFFF1F5F9),
                      color: w.color,
                    ),
                  ),
                ],
              ),
            );
          }),

          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF0FDF4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFBBF7D0)),
            ),
            child: const Row(
              children: [
                Text('🔥', style: TextStyle(fontSize: 20)),
                SizedBox(width: 10),
                Expanded(
                  child: Text(
                    'You are in the top 10% of regular gym goers this month! Maintaining this pace accelerates metabolic conditioning by 28%.',
                    style: TextStyle(fontSize: 11, color: Color(0xFF166534), height: 1.3),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── TAB 2: BODY COMPOSITION TAB ────────────────────────────────────────────
class _BodyCompositionTab extends StatelessWidget {
  const _BodyCompositionTab({
    required this.weight,
    required this.height,
    required this.onLogWeight,
  });

  final double weight;
  final int height;
  final VoidCallback onLogWeight;

  @override
  Widget build(BuildContext context) {
    final heightInMeters = height / 100.0;
    final bmi = (weight / (heightInMeters * heightInMeters)).toStringAsFixed(1);

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Body Composition', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _C.textDark)),
                  SizedBox(height: 2),
                  Text('Physical metrics & transformation', style: TextStyle(fontSize: 12, color: _C.textGray)),
                ],
              ),
              OutlinedButton.icon(
                onPressed: onLogWeight,
                icon: const Icon(Icons.edit_outlined, size: 14),
                label: const Text('Update', style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800)),
                style: OutlinedButton.styleFrom(
                  foregroundColor: _C.primary,
                  side: BorderSide(color: _C.primary.withValues(alpha: 0.3)),
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                ),
              ),
            ],
          ),
          const SizedBox(height: 18),

          // 3 Big Metric Cards
          Row(
            children: [
              _metricBox('Weight', '${weight.toStringAsFixed(1)} kg', '-4.5 kg down', const Color(0xFF10B981)),
              const SizedBox(width: 8),
              _metricBox('Height', '$height cm', 'Standard', const Color(0xFF0EA5E9)),
              const SizedBox(width: 8),
              _metricBox('BMI', bmi, 'Healthy Range', const Color(0xFFF59E0B)),
            ],
          ),
          const SizedBox(height: 18),

          // Transformation Progress Card
          Container(
            padding: const EdgeInsets.all(14),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Goal: 70.0 kg', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: _C.textDark)),
                    Text('88% Target Reached', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: _C.primary)),
                  ],
                ),
                const SizedBox(height: 8),
                ClipRRect(
                  borderRadius: BorderRadius.circular(6),
                  child: const LinearProgressIndicator(
                    value: 0.88,
                    minHeight: 8,
                    backgroundColor: Color(0xFFE2E8F0),
                    color: _C.primary,
                  ),
                ),
                const SizedBox(height: 10),
                const Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text('Start: 76.5 kg', style: TextStyle(fontSize: 11, color: _C.textGray, fontWeight: FontWeight.w600)),
                    Text('Current: 72.0 kg', style: TextStyle(fontSize: 11, color: _C.primary, fontWeight: FontWeight.w800)),
                    Text('Goal: 70.0 kg', style: TextStyle(fontSize: 11, color: _C.textGray, fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _metricBox(String label, String value, String sub, Color badgeColor) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: const Color(0xFFF8FAFC),
          borderRadius: BorderRadius.circular(16),
          border: Border.all(color: const Color(0xFFE2E8F0)),
        ),
        child: Column(
          children: [
            Text(label, style: const TextStyle(fontSize: 11, color: _C.textGray, fontWeight: FontWeight.w600)),
            const SizedBox(height: 4),
            Text(value, style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w900, color: _C.textDark)),
            const SizedBox(height: 4),
            Container(
              padding: const EdgeInsets.symmetric(horizontal: 5, vertical: 2),
              decoration: BoxDecoration(
                color: badgeColor.withValues(alpha: 0.12),
                borderRadius: BorderRadius.circular(6),
              ),
              child: Text(
                sub,
                style: TextStyle(fontSize: 8.5, fontWeight: FontWeight.w800, color: badgeColor),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── TAB 3: PERSONAL RECORDS (PRS & STRENGTH) ───────────────────────────────
class _PersonalRecordsTab extends StatelessWidget {
  const _PersonalRecordsTab({required this.prs});
  final List<({String exercise, String weight, String reps, String date})> prs;

  @override
  Widget build(BuildContext context) {
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
          const Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Personal Records (PRs)', style: TextStyle(fontSize: 16, fontWeight: FontWeight.w800, color: _C.textDark)),
                  SizedBox(height: 2),
                  Text('Your all-time best gym lifts', style: TextStyle(fontSize: 12, color: _C.textGray)),
                ],
              ),
              Text('🏋️‍♂️', style: TextStyle(fontSize: 24)),
            ],
          ),
          const SizedBox(height: 16),

          ...prs.map((item) {
            return Container(
              margin: const EdgeInsets.only(bottom: 10),
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(color: const Color(0xFFE2E8F0)),
              ),
              child: Row(
                children: [
                  Container(
                    width: 38,
                    height: 38,
                    decoration: BoxDecoration(
                      color: const Color(0xFFFEF3C7),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Text('🥇', style: TextStyle(fontSize: 18)),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(item.exercise, style: const TextStyle(fontWeight: FontWeight.w800, fontSize: 13.5, color: _C.textDark)),
                        const SizedBox(height: 2),
                        Text(item.date, style: const TextStyle(fontSize: 10, color: _C.textGray)),
                      ],
                    ),
                  ),
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.end,
                    children: [
                      Text(item.weight, style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w900, color: _C.primary)),
                      Text(item.reps, style: const TextStyle(fontSize: 10, color: _C.textGray, fontWeight: FontWeight.w600)),
                    ],
                  ),
                ],
              ),
            );
          }),
        ],
      ),
    );
  }
}
