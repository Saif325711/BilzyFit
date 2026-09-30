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
  static const mintBlue    = Color(0xFF38BDF8);
  static const r20         = Radius.circular(20);
  static const r24         = Radius.circular(24);
  static const shadow = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 12, offset: Offset(0, 4)),
  ];
}

// ── exercise metadata ──────────────────────────────────────────────────────
typedef _ExMeta = ({String muscle, String type, List<String> tags});

_ExMeta _meta(String name) {
  const m = <String, _ExMeta>{
    'Barbell Bench Press':    (muscle: 'Chest',   type: 'Compound',  tags: ['Strength', 'Barbell']),
    'Incline Dumbbell Press': (muscle: 'Chest',   type: 'Compound',  tags: ['Strength', 'Dumbbell']),
    'Cable Chest Fly':        (muscle: 'Chest',   type: 'Isolation', tags: ['Hypertrophy', 'Cable']),
    'Tricep Rope Pushdown':   (muscle: 'Triceps', type: 'Isolation', tags: ['Hypertrophy', 'Cable']),
  };
  return m[name] ?? (muscle: 'Compound', type: 'Strength', tags: ['Strength']);
}

Color _tagColor(String t) {
  switch (t) {
    case 'Strength':    return const Color(0xFFD1FAE5);
    case 'Hypertrophy': return const Color(0xFFEDE9FE);
    case 'Barbell':     return const Color(0xFFDBEAFE);
    case 'Dumbbell':    return const Color(0xFFFEF3C7);
    case 'Cable':       return const Color(0xFFFFEDD5);
    default:            return const Color(0xFFF3F4F6);
  }
}

Color _tagText(String t) {
  switch (t) {
    case 'Strength':    return const Color(0xFF065F46);
    case 'Hypertrophy': return const Color(0xFF5B21B6);
    case 'Barbell':     return const Color(0xFF1E40AF);
    case 'Dumbbell':    return const Color(0xFF92400E);
    case 'Cable':       return const Color(0xFFC2410C);
    default:            return const Color(0xFF374151);
  }
}

// ══════════════════════════════════════════════════════════════════════════
//  WorkoutScreen  — drop-in replacement for _workoutPage()
// ══════════════════════════════════════════════════════════════════════════
class WorkoutScreen extends StatefulWidget {
  const WorkoutScreen({
    super.key,
    required this.member,
    required this.workouts,
    required this.loading,
    required this.onRefresh,
    required this.onCreateWorkout,
  });

  final MemberData           member;
  final List<WorkoutPlan>    workouts;
  final bool                 loading;
  final Future<void> Function() onRefresh;
  final VoidCallback         onCreateWorkout;

  @override
  State<WorkoutScreen> createState() => _WorkoutScreenState();
}

class _WorkoutScreenState extends State<WorkoutScreen>
    with SingleTickerProviderStateMixin {
  late final TabController _tab;

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

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: _C.primary,
      onRefresh: widget.onRefresh,
      child: CustomScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        slivers: [
          SliverToBoxAdapter(child: _Header(member: widget.member)),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),
          const SliverToBoxAdapter(child: _WeeklyStats()),
          const SliverToBoxAdapter(child: SizedBox(height: 20)),
          SliverToBoxAdapter(
            child: _Tabs(ctrl: _tab, onCreate: widget.onCreateWorkout),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 14)),
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
      case 1:  return const _MuscleGroupsTab();
      case 2:  return const _HistoryTab();
      default: return _MyPlanTab(
                 workouts: widget.workouts,
                 loading:  widget.loading,
                 onCreate: widget.onCreateWorkout,
               );
    }
  }
}

// ── HEADER ─────────────────────────────────────────────────────────────────
class _Header extends StatelessWidget {
  const _Header({required this.member});
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

        // Greeting & Athlete Banner Card
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
                      color: _C.primary.withValues(alpha: 0.08),
                    ),
                  ),
                ),

                // Athlete banner image on the right
                const Positioned(
                  right: -10,
                  bottom: 0,
                  top: 0,
                  width: 165,
                  child: _BannerAthleteImage(),
                ),

                // Left text content
                Positioned(
                  left: 20,
                  top: 20,
                  bottom: 20,
                  right: 155,
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
                                text: 'Workout',
                                style: TextStyle(color: _C.primary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 5),
                        const Text(
                          'Stay consistent, get stronger 💪',
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

class _BannerAthleteImage extends StatelessWidget {
  const _BannerAthleteImage();

  @override
  Widget build(BuildContext context) {
    return Image.asset(
      'assets/images/banner.png',
      fit: BoxFit.cover,
      alignment: Alignment.topCenter,
      errorBuilder: (context, error, stackTrace) {
        return Image.network(
          'banner.png',
          fit: BoxFit.cover,
          alignment: Alignment.topCenter,
          errorBuilder: (context, error, stackTrace) {
            return Image.network(
              '/assets/images/banner.png',
              fit: BoxFit.cover,
              alignment: Alignment.topCenter,
              errorBuilder: (context, error, stackTrace) {
                return Image.network(
                  'assets/assets/images/banner.png',
                  fit: BoxFit.cover,
                  alignment: Alignment.topCenter,
                  errorBuilder: (context, error, stackTrace) {
                    return Image.network(
                      'http://localhost:5173/src/assets/banner.png',
                      fit: BoxFit.cover,
                      alignment: Alignment.topCenter,
                      errorBuilder: (context, error, stackTrace) => const SizedBox(),
                    );
                  },
                );
              },
            );
          },
        );
      },
    );
  }
}

// ── WEEKLY STATS ───────────────────────────────────────────────────────────
class _WeeklyStats extends StatelessWidget {
  const _WeeklyStats();

  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: IntrinsicHeight(
        child: Row(
          children: [
            _Stat(
              icon: Icons.calendar_today_rounded,
              iconBg: _C.primarySoft,
              iconFg: _C.primary,
              top: 'This Week',
              value: '4 / 6',
              sub: 'Workouts',
            ),
            _vDiv(),
            _Stat(
              icon: Icons.local_fire_department_rounded,
              iconBg: const Color(0xFFFFF3E8),
              iconFg: _C.orange,
              value: '630',
              sub: 'Calories',
            ),
            _vDiv(),
            _Stat(
              icon: Icons.timer_rounded,
              iconBg: const Color(0xFFE8F6FD),
              iconFg: _C.mintBlue,
              value: '2h 15m',
              sub: 'Total Time',
            ),
          ],
        ),
      ),
    );
  }

  Widget _vDiv() => Container(
        width: 1,
        margin: const EdgeInsets.symmetric(vertical: 16),
        color: const Color(0xFFF2F4F7),
      );
}

class _Stat extends StatelessWidget {
  const _Stat({
    required this.icon,
    required this.iconBg,
    required this.iconFg,
    this.top,
    required this.value,
    required this.sub,
  });
  final IconData icon;
  final Color iconBg, iconFg;
  final String? top, value, sub;

  @override
  Widget build(BuildContext context) {
    return Expanded(
      child: Padding(
        padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 10),
        child: Row(
          children: [
            Container(
              width: 38,
              height: 38,
              decoration:
                  BoxDecoration(color: iconBg, shape: BoxShape.circle),
              child: Icon(icon, color: iconFg, size: 18),
            ),
            const SizedBox(width: 8),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  if (top != null)
                    Text(top!,
                        style: const TextStyle(
                            color: _C.textGray,
                            fontSize: 10,
                            fontWeight: FontWeight.w500)),
                  if (top != null) const SizedBox(height: 1),
                  Text(value!,
                      style: const TextStyle(
                          color: _C.textDark,
                          fontSize: 16,
                          fontWeight: FontWeight.w800)),
                  Text(sub!,
                      style: const TextStyle(
                          color: _C.textGray, fontSize: 10)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── TABS BAR ───────────────────────────────────────────────────────────────
class _Tabs extends StatelessWidget {
  const _Tabs({required this.ctrl, required this.onCreate});
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
                Tab(text: 'My Plan'),
                Tab(text: 'Muscle Groups'),
                Tab(text: 'History'),
              ],
            ),
          ),
        ),
        const SizedBox(width: 10),
        GestureDetector(
          onTap: onCreate,
          child: Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 12, vertical: 9),
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
                Text('Create',
                    style: TextStyle(
                        color: Colors.white,
                        fontSize: 11,
                        fontWeight: FontWeight.w700)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

// ── MY PLAN TAB ────────────────────────────────────────────────────────────
class _MyPlanTab extends StatelessWidget {
  const _MyPlanTab({
    required this.workouts,
    required this.loading,
    required this.onCreate,
  });
  final List<WorkoutPlan> workouts;
  final bool loading;
  final VoidCallback onCreate;

  @override
  Widget build(BuildContext context) {
    if (loading) {
      return const Center(
        child: Padding(
          padding: EdgeInsets.all(40),
          child: CircularProgressIndicator(color: _C.primary),
        ),
      );
    }
    if (workouts.isEmpty) {
      return _EmptyWorkout(onCreate: onCreate);
    }
    return Column(
      children: [
        for (int i = 0; i < workouts.length; i++) ...[
          _PlanCard(plan: workouts[i], onCreate: onCreate),
          if (i < workouts.length - 1) const SizedBox(height: 14),
        ],
      ],
    );
  }
}

// ── PLAN CARD ──────────────────────────────────────────────────────────────
class _PlanCard extends StatelessWidget {
  const _PlanCard({required this.plan, required this.onCreate});
  final WorkoutPlan  plan;
  final VoidCallback onCreate;

  @override
  Widget build(BuildContext context) {
    final estMin = (plan.exercises.length * 8 + 20).clamp(20, 120);
    final isTrainer = plan.source != 'member';

    return Container(
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: Column(
        children: [
          // header
          Padding(
            padding: const EdgeInsets.fromLTRB(18, 18, 14, 14),
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
                  child: const Icon(Icons.fitness_center_rounded,
                      color: _C.primary, size: 24),
                ),
                const SizedBox(width: 14),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(plan.name,
                          style: const TextStyle(
                              color: _C.textDark,
                              fontSize: 16,
                              fontWeight: FontWeight.w800)),
                      const SizedBox(height: 2),
                      Text(plan.description,
                          style: const TextStyle(
                              color: _C.textGray, fontSize: 12)),
                      const SizedBox(height: 4),
                      Text(
                        isTrainer
                            ? 'Recommended by Trainer'
                            : 'Created by you',
                        style: TextStyle(
                            color: _C.primary.withValues(alpha: .85),
                            fontSize: 11,
                            fontWeight: FontWeight.w600),
                      ),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    const Icon(Icons.more_vert,
                        color: _C.textGray, size: 20),
                    const SizedBox(height: 6),
                    Row(
                      children: [
                        const Icon(Icons.bar_chart_rounded,
                            color: _C.primary, size: 14),
                        const SizedBox(width: 3),
                        Text('$estMin–${estMin + 15} min',
                            style: const TextStyle(
                                color: _C.textGray, fontSize: 11)),
                      ],
                    ),
                  ],
                ),
              ],
            ),
          ),

          Container(height: 1, color: const Color(0xFFF2F4F7)),

          // exercises
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 12, 14, 4),
            child: Column(
              children: [
                for (int i = 0; i < plan.exercises.length; i++) ...[
                  _ExCard(exercise: plan.exercises[i], index: i),
                  if (i < plan.exercises.length - 1)
                    const SizedBox(height: 8),
                ],
              ],
            ),
          ),

          // add exercise
          Padding(
            padding: const EdgeInsets.fromLTRB(14, 8, 14, 14),
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
                    Text('Add Exercise',
                        style: TextStyle(
                            color: _C.primary,
                            fontSize: 13,
                            fontWeight: FontWeight.w700)),
                  ],
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── EXERCISE CARD ──────────────────────────────────────────────────────────
class _ExCard extends StatelessWidget {
  const _ExCard({required this.exercise, required this.index});
  final WorkoutExercise exercise;
  final int index;

  @override
  Widget build(BuildContext context) {
    final meta  = _meta(exercise.name);
    final label = '${exercise.sets} × ${exercise.reps.replaceAll(' reps', '')}';

    return Material(
      color: Colors.transparent,
      child: InkWell(
        borderRadius: BorderRadius.circular(18),
        onTap: () {},
        child: Ink(
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            border: Border.all(color: const Color(0xFFF2F4F7)),
          ),
          child: Padding(
            padding: const EdgeInsets.all(10),
            child: Row(
              children: [
                // number
                Container(
                  width: 32, height: 32,
                  decoration: const BoxDecoration(
                    color: _C.primary, shape: BoxShape.circle),
                  child: Center(
                    child: Text('${index + 1}',
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 13,
                            fontWeight: FontWeight.w800)),
                  ),
                ),
                const SizedBox(width: 10),

                // thumbnail
                Container(
                  width: 58, height: 56,
                  decoration: BoxDecoration(
                    color: const Color(0xFF1A1A2E),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: const Icon(Icons.fitness_center_rounded,
                      color: Color(0xFF4ADE80), size: 24),
                ),
                const SizedBox(width: 12),

                // name + tags
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(exercise.name,
                          style: const TextStyle(
                              color: _C.textDark,
                              fontSize: 13,
                              fontWeight: FontWeight.w700)),
                      const SizedBox(height: 3),
                      Text('${meta.muscle} • ${meta.type}',
                          style: const TextStyle(
                              color: _C.textGray, fontSize: 11)),
                      const SizedBox(height: 5),
                      Wrap(
                        spacing: 5,
                        children: meta.tags.map((tag) {
                          return Container(
                            padding: const EdgeInsets.symmetric(
                                horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: _tagColor(tag),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Text(tag,
                                style: TextStyle(
                                    color: _tagText(tag),
                                    fontSize: 9,
                                    fontWeight: FontWeight.w700)),
                          );
                        }).toList(),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 8),

                // sets × reps
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(label,
                        style: const TextStyle(
                            color: _C.textDark,
                            fontSize: 14,
                            fontWeight: FontWeight.w800)),
                    const Text('reps',
                        style:
                            TextStyle(color: _C.textGray, fontSize: 10)),
                  ],
                ),
                const SizedBox(width: 6),
                const Icon(Icons.chevron_right_rounded,
                    color: Color(0xFFD0D5DD), size: 20),
              ],
            ),
          ),
        ),
      ),
    );
  }
}

// ── MUSCLE GROUPS ──────────────────────────────────────────────────────────
class _MuscleGroupsTab extends StatelessWidget {
  const _MuscleGroupsTab();

  @override
  Widget build(BuildContext context) {
    const groups = [
      ('Chest',     Color(0xFFFF6B8A), Color(0xFFE91E7A), Icons.self_improvement_rounded),
      ('Back',      Color(0xFF667EEA), Color(0xFF764BA2), Icons.airline_seat_flat_rounded),
      ('Legs',      Color(0xFFF7971E), Color(0xFFFFD200), Icons.directions_run_rounded),
      ('Shoulders', Color(0xFF7F7FD5), Color(0xFF91EAE4), Icons.sports_handball_rounded),
      ('Arms',      Color(0xFF11998E), Color(0xFF38EF7D), Icons.fitness_center_rounded),
      ('Core',      Color(0xFF36D1DC), Color(0xFF5B86E5), Icons.rotate_90_degrees_ccw_rounded),
      ('Cardio',    Color(0xFFFF416C), Color(0xFFFF4B2B), Icons.directions_bike_rounded),
      ('Full Body', Color(0xFF8E2DE2), Color(0xFF4A00E0), Icons.accessibility_new_rounded),
    ];

    return GridView.count(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisCount: 2,
      crossAxisSpacing: 12,
      mainAxisSpacing: 12,
      childAspectRatio: 1.5,
      children: groups.map((g) {
        final (label, c1, c2, icon) = g;
        return Container(
          decoration: BoxDecoration(
            gradient: LinearGradient(
              colors: [c1, c2],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(20),
            boxShadow: [
              BoxShadow(
                color: c1.withValues(alpha: .30),
                blurRadius: 12,
                offset: const Offset(0, 4),
              ),
            ],
          ),
          child: Stack(
            children: [
              Positioned(
                right: -10, top: -10,
                child: Opacity(
                  opacity: .12,
                  child: Icon(icon, color: Colors.white, size: 70),
                ),
              ),
              Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Icon(icon, color: Colors.white, size: 24),
                    const Spacer(),
                    Text(label,
                        style: const TextStyle(
                            color: Colors.white,
                            fontSize: 15,
                            fontWeight: FontWeight.w800)),
                  ],
                ),
              ),
            ],
          ),
        );
      }).toList(),
    );
  }
}

// ── HISTORY TAB ────────────────────────────────────────────────────────────
class _HistoryTab extends StatelessWidget {
  const _HistoryTab();

  @override
  Widget build(BuildContext context) {
    const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
    const done = [true, false, true, true, false, true, false];
    const history = [
      ('Push Day Strength', 'Today',      '52 min', 320),
      ('Leg Day',           'Yesterday',  '48 min', 410),
      ('Pull Day',          '2 days ago', '44 min', 295),
    ];

    return Column(
      children: [
        Container(
          padding: const EdgeInsets.all(18),
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.all(_C.r24),
            boxShadow: _C.shadow,
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text('This Week',
                  style: TextStyle(
                      color: _C.textGray,
                      fontSize: 11,
                      fontWeight: FontWeight.w600)),
              const SizedBox(height: 14),
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: List.generate(7, (i) {
                  return Column(
                    children: [
                      Container(
                        width: 36, height: 36,
                        decoration: BoxDecoration(
                          color: done[i]
                              ? _C.primary
                              : const Color(0xFFF2F4F7),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          done[i]
                              ? Icons.check_rounded
                              : Icons.remove_rounded,
                          color: done[i]
                              ? Colors.white
                              : const Color(0xFFD0D5DD),
                          size: 16,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(days[i],
                          style: TextStyle(
                              color: done[i] ? _C.primary : _C.textGray,
                              fontSize: 10,
                              fontWeight: FontWeight.w600)),
                    ],
                  );
                }),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        for (final h in history) ...[
          Container(
            padding: const EdgeInsets.all(16),
            decoration: const BoxDecoration(
              color: Colors.white,
              borderRadius: BorderRadius.all(_C.r20),
              boxShadow: _C.shadow,
            ),
            child: Row(
              children: [
                Container(
                  width: 44, height: 44,
                  decoration: const BoxDecoration(
                    color: _C.primarySoft, shape: BoxShape.circle),
                  child: const Icon(Icons.check_circle_rounded,
                      color: _C.primary, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(h.$1,
                          style: const TextStyle(
                              color: _C.textDark,
                              fontWeight: FontWeight.w700,
                              fontSize: 13)),
                      Text(h.$2,
                          style: const TextStyle(
                              color: _C.textGray, fontSize: 11)),
                    ],
                  ),
                ),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Text(h.$3,
                        style: const TextStyle(
                            color: _C.textDark,
                            fontWeight: FontWeight.w700,
                            fontSize: 13)),
                    Text('${h.$4} cal',
                        style: const TextStyle(
                            color: _C.orange,
                            fontSize: 11,
                            fontWeight: FontWeight.w600)),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),
        ],
      ],
    );
  }
}

// ── EMPTY STATE ────────────────────────────────────────────────────────────
class _EmptyWorkout extends StatelessWidget {
  const _EmptyWorkout({required this.onCreate});
  final VoidCallback onCreate;

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 48, horizontal: 24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.all(_C.r24),
        border: Border.all(
            color: _C.primary.withValues(alpha: .15)),
      ),
      child: Column(
        children: [
          Container(
            width: 64, height: 64,
            decoration: const BoxDecoration(
              color: _C.primarySoft, shape: BoxShape.circle),
            child: const Icon(Icons.fitness_center_rounded,
                color: _C.primary, size: 32),
          ),
          const SizedBox(height: 16),
          const Text('No workout plan yet',
              style: TextStyle(
                  color: _C.textDark,
                  fontSize: 16,
                  fontWeight: FontWeight.w800)),
          const SizedBox(height: 6),
          const Text(
            'Your trainer will assign one soon,\nor create your own plan.',
            textAlign: TextAlign.center,
            style:
                TextStyle(color: _C.textGray, fontSize: 13, height: 1.5),
          ),
          const SizedBox(height: 22),
          GestureDetector(
            onTap: onCreate,
            child: Container(
              padding: const EdgeInsets.symmetric(
                  horizontal: 24, vertical: 13),
              decoration: BoxDecoration(
                color: _C.primary,
                borderRadius: BorderRadius.circular(20),
                boxShadow: const [
                  BoxShadow(
                    color: Color(0x3300A878),
                    blurRadius: 10,
                    offset: Offset(0, 4),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add, color: Colors.white, size: 18),
                  SizedBox(width: 8),
                  Text('Create My Workout',
                      style: TextStyle(
                          color: Colors.white,
                          fontSize: 14,
                          fontWeight: FontWeight.w700)),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}
