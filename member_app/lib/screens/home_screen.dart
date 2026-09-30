import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';

// ── design constants ───────────────────────────────────────────────────────
class _C {
  static const primary  = AppTheme.primary;
  static const textDark = Color(0xFF101828);
  static const textGray = Color(0xFF667085);
  static const r24      = Radius.circular(24);
  static const shadow   = [
    BoxShadow(color: Color(0x0A000000), blurRadius: 14, offset: Offset(0, 4)),
  ];
}

// ══════════════════════════════════════════════════════════════════════════
//  HomeScreen — drop-in replacement for _homePage()
// ══════════════════════════════════════════════════════════════════════════
class HomeScreen extends StatefulWidget {
  const HomeScreen({
    super.key,
    required this.member,
    required this.onNavigate,
    required this.onShowCheckIn,
    required this.onRefresh,
  });

  final MemberData member;
  final ValueChanged<int> onNavigate;
  final VoidCallback onShowCheckIn;
  final Future<void> Function() onRefresh;

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _waterGlasses = 6;

  void _addWater() {
    setState(() {
      if (_waterGlasses < 12) _waterGlasses++;
    });
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text('Hydration logged: $_waterGlasses / 8 glasses (+250ml) 💧'),
        duration: const Duration(seconds: 1),
        behavior: SnackBarBehavior.floating,
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
          // 1. Top Brand Header (Gym Center + Bell + QR)
          SliverToBoxAdapter(
            child: _HomeBrandHeader(
              onShowCheckIn: widget.onShowCheckIn,
              gymName: widget.member.gymName,
              branch: widget.member.branch,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 2. Dynamic Hero Command Banner
          SliverToBoxAdapter(
            child: _HeroCommandBanner(
              member: widget.member,
              onStartWorkout: () => widget.onNavigate(1),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 3. 4-Pillar Quick Action Launchpad
          SliverToBoxAdapter(
            child: _QuickLaunchpad(
              onCheckIn: widget.onShowCheckIn,
              onWorkout: () => widget.onNavigate(1),
              onDiet: () => widget.onNavigate(2),
              onPayments: () => widget.onNavigate(4),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 4. Daily Fitness Snapshot & Rings Card
          SliverToBoxAdapter(
            child: _DailySnapshotCard(
              member: widget.member,
              onViewProgress: () => widget.onNavigate(3),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 5. Today's Routine Preview (Push Day Strength)
          SliverToBoxAdapter(
            child: _RoutinePreviewCard(
              onOpenWorkout: () => widget.onNavigate(1),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 6. Nutrition & Quick Hydration Card
          SliverToBoxAdapter(
            child: _NutritionHydrationCard(
              glasses: _waterGlasses,
              onAddWater: _addWater,
              onOpenDiet: () => widget.onNavigate(2),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 7. Live Gym Occupancy & Club Notice
          SliverToBoxAdapter(
            child: _GymTrafficCard(gymName: widget.member.gymName),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

// ── HOME BRAND HEADER ──────────────────────────────────────────────────────
class _HomeBrandHeader extends StatelessWidget {
  const _HomeBrandHeader({
    required this.onShowCheckIn,
    this.gymName = 'Star Fitness',
    this.branch = 'Star Fitness Center',
  });

  final VoidCallback onShowCheckIn;
  final String gymName;
  final String branch;

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 12, top: 2),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Row(
            children: [
              ClipRRect(
                borderRadius: BorderRadius.circular(12),
                child: Image.asset(
                  'assets/images/Applogo.png',
                  width: 42,
                  height: 42,
                  fit: BoxFit.cover,
                  errorBuilder: (_, _, _) => Container(
                    width: 42,
                    height: 42,
                    decoration: BoxDecoration(
                      color: _C.primary.withValues(alpha: 0.15),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Icon(Icons.fitness_center_rounded, color: _C.primary, size: 22),
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(
                        gymName.toUpperCase(),
                        style: const TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          letterSpacing: 0.5,
                          color: Color(0xFF101828),
                        ),
                      ),
                      const SizedBox(width: 6),
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                        decoration: BoxDecoration(
                          color: const Color(0xFFDCFCE7),
                          borderRadius: BorderRadius.circular(6),
                        ),
                        child: const Text('MEMBER', style: TextStyle(color: Color(0xFF15803D), fontSize: 9, fontWeight: FontWeight.w900)),
                      ),
                    ],
                  ),
                  const SizedBox(height: 2),
                  Text(
                    branch.toUpperCase(),
                    style: const TextStyle(
                      fontSize: 8.5,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.5,
                      color: _C.primary,
                    ),
                  ),
                ],
              ),
            ],
          ),
          Row(
            children: [
              _iconBtn(
                Icons.notifications_none_rounded,
                const Color(0xFFF1F5F9),
                const Color(0xFF475569),
              ),
              const SizedBox(width: 10),
              GestureDetector(
                onTap: onShowCheckIn,
                child: _iconBtn(
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
              ),
            ],
          ),
        ],
      ),
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

// ── HERO COMMAND BANNER ────────────────────────────────────────────────────
class _HeroCommandBanner extends StatelessWidget {
  const _HeroCommandBanner({
    required this.member,
    required this.onStartWorkout,
  });

  final MemberData member;
  final VoidCallback onStartWorkout;

  @override
  Widget build(BuildContext context) {
    final first = member.name.split(' ').firstOrNull ?? member.name;

    return Container(
      width: double.infinity,
      height: 154,
      decoration: const BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.all(_C.r24),
        boxShadow: _C.shadow,
      ),
      child: ClipRRect(
        borderRadius: const BorderRadius.all(_C.r24),
        child: Stack(
          children: [
            // Background ambient shapes
            Positioned(
              right: -25,
              top: -25,
              child: Container(
                width: 190,
                height: 190,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _C.primary.withValues(alpha: 0.12),
                ),
              ),
            ),
            Positioned(
              right: 85,
              bottom: -20,
              child: Container(
                width: 110,
                height: 110,
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: const Color(0xFFF97316).withValues(alpha: 0.08),
                ),
              ),
            ),

            // Right side visual badge
            Positioned(
              right: 12,
              top: 14,
              bottom: 14,
              width: 136,
              child: Container(
                decoration: BoxDecoration(
                  gradient: const LinearGradient(
                    colors: [Color(0xFFECFDF5), Color(0xFFF0FDF4)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                  borderRadius: BorderRadius.circular(22),
                  border: Border.all(color: _C.primary.withValues(alpha: 0.2)),
                ),
                child: Center(
                  child: FittedBox(
                    fit: BoxFit.scaleDown,
                    child: Column(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text('🔥', style: TextStyle(fontSize: 34)),
                        const SizedBox(height: 4),
                        const Text(
                          'Ready to Train?',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: _C.primary,
                          ),
                        ),
                        const SizedBox(height: 5),
                        GestureDetector(
                          onTap: onStartWorkout,
                          child: Container(
                            padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                            decoration: BoxDecoration(
                              color: _C.primary,
                              borderRadius: BorderRadius.circular(10),
                            ),
                            child: const Text(
                              'Start Now →',
                              style: TextStyle(
                                fontSize: 9.5,
                                fontWeight: FontWeight.w900,
                                color: Colors.white,
                              ),
                            ),
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
              right: 156,
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      'Welcome back, $first 👋',
                      style: const TextStyle(
                        color: _C.textGray,
                        fontSize: 13,
                        fontWeight: FontWeight.w600,
                      ),
                    ),
                    const SizedBox(height: 3),
                    RichText(
                      text: const TextSpan(
                        style: TextStyle(
                          fontSize: 22,
                          fontWeight: FontWeight.w900,
                          letterSpacing: -0.5,
                          color: _C.textDark,
                        ),
                        children: [
                          TextSpan(text: 'Push Day '),
                          TextSpan(
                            text: 'Strength',
                            style: TextStyle(color: _C.primary),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'Week 4 · 5 Exercises on schedule today',
                      style: TextStyle(
                        color: _C.textGray,
                        fontSize: 11,
                        fontWeight: FontWeight.w500,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 7, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFFEF3C7),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: const Text(
                        '⚡ Goal: 75% Completed',
                        style: TextStyle(
                          fontSize: 9.5,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFFB45309),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}

// ── 4-PILLAR QUICK LAUNCHPAD ───────────────────────────────────────────────
class _QuickLaunchpad extends StatelessWidget {
  const _QuickLaunchpad({
    required this.onCheckIn,
    required this.onWorkout,
    required this.onDiet,
    required this.onPayments,
  });

  final VoidCallback onCheckIn;
  final VoidCallback onWorkout;
  final VoidCallback onDiet;
  final VoidCallback onPayments;

  @override
  Widget build(BuildContext context) {
    return GridView.count(
      crossAxisCount: 2,
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      crossAxisSpacing: 10,
      mainAxisSpacing: 10,
      childAspectRatio: 1.45,
      children: [
        _tile(
          title: 'Quick Check-in',
          subtitle: 'Scan Entry QR',
          icon: Icons.qr_code_2_rounded,
          color: _C.primary,
          bg: const Color(0xFFECFDF5),
          onTap: onCheckIn,
        ),
        _tile(
          title: 'My Workout',
          subtitle: 'Push Strength',
          icon: Icons.fitness_center_rounded,
          color: const Color(0xFFF97316),
          bg: const Color(0xFFFFF7ED),
          onTap: onWorkout,
        ),
        _tile(
          title: 'Meal Plan',
          subtitle: '1,840 kcal Clean',
          icon: Icons.restaurant_rounded,
          color: const Color(0xFF10B981),
          bg: const Color(0xFFF0FDF4),
          onTap: onDiet,
        ),
        _tile(
          title: 'VIP Pass',
          subtitle: 'Active · 23d left',
          icon: Icons.credit_card_rounded,
          color: const Color(0xFF7C3AED),
          bg: const Color(0xFFF5F3FF),
          onTap: onPayments,
        ),
      ],
    );
  }

  Widget _tile({
    required String title,
    required String subtitle,
    required IconData icon,
    required Color color,
    required Color bg,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: _C.shadow,
        ),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: BoxDecoration(
                color: bg,
                borderRadius: BorderRadius.circular(12),
              ),
              child: Icon(icon, color: color, size: 22),
            ),
            const SizedBox(width: 10),
            Expanded(
              child: FittedBox(
                fit: BoxFit.scaleDown,
                alignment: Alignment.centerLeft,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Text(
                      title,
                      style: const TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w800,
                        color: _C.textDark,
                      ),
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                    ),
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: TextStyle(
                        fontSize: 10,
                        fontWeight: FontWeight.w600,
                        color: color,
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
    );
  }
}

// ── DAILY SNAPSHOT & RINGS CARD ────────────────────────────────────────────
class _DailySnapshotCard extends StatelessWidget {
  const _DailySnapshotCard({
    required this.member,
    required this.onViewProgress,
  });

  final MemberData member;
  final VoidCallback onViewProgress;

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Today\'s Snapshot',
                    style: TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w800,
                      color: _C.textDark,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'September monthly metrics',
                    style: TextStyle(fontSize: 11, color: _C.textGray),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onViewProgress,
                child: const Row(
                  children: [
                    Text(
                      'View All',
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        color: _C.primary,
                      ),
                    ),
                    SizedBox(width: 2),
                    Icon(Icons.chevron_right_rounded, size: 16, color: _C.primary),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // 3 Metric Stat Blocks
          Row(
            children: [
              _metricBlock(
                label: 'Gym Visits',
                value: '${member.visits}',
                sub: '18 / 24 Days',
                color: const Color(0xFF10B981),
                bg: const Color(0xFFECFDF5),
              ),
              const SizedBox(width: 8),
              _metricBlock(
                label: 'Current Weight',
                value: '${member.weight}',
                sub: '-4.5 kg down',
                color: const Color(0xFF0284C7),
                bg: const Color(0xFFF0F9FF),
              ),
              const SizedBox(width: 8),
              _metricBlock(
                label: 'Active Streak',
                value: '5d',
                sub: 'Top 10% Club',
                color: const Color(0xFFD97706),
                bg: const Color(0xFFFFFBEB),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget _metricBlock({
    required String label,
    required String value,
    required String sub,
    required Color color,
    required Color bg,
  }) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(16),
        ),
        child: FittedBox(
          fit: BoxFit.scaleDown,
          child: Column(
            children: [
              Text(
                label,
                style: TextStyle(fontSize: 9.5, fontWeight: FontWeight.w700, color: color),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
              const SizedBox(height: 4),
              Text(
                value,
                style: TextStyle(fontSize: 18, fontWeight: FontWeight.w900, color: color),
              ),
              const SizedBox(height: 2),
              Text(
                sub,
                style: const TextStyle(fontSize: 9, fontWeight: FontWeight.w600, color: _C.textDark),
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

// ── ROUTINE PREVIEW CARD ───────────────────────────────────────────────────
class _RoutinePreviewCard extends StatelessWidget {
  const _RoutinePreviewCard({required this.onOpenWorkout});
  final VoidCallback onOpenWorkout;

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Today\'s Session',
                style: TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w800,
                  color: _C.textDark,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFFFFF7ED),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  '45 Mins · 5 Exercises',
                  style: TextStyle(
                    fontSize: 9.5,
                    fontWeight: FontWeight.w800,
                    color: Color(0xFFC2410C),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Interactive session preview
          Container(
            padding: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: const Color(0xFFF8FAFC),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: const Color(0xFFE2E8F0)),
            ),
            child: Row(
              children: [
                Container(
                  width: 44,
                  height: 44,
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEF3C7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: Text('🏋️‍♂️', style: TextStyle(fontSize: 22)),
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        'Push Day · Chest & Shoulders',
                        style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: _C.textDark),
                      ),
                      SizedBox(height: 2),
                      Text(
                        'Bench Press, Dumbbell Incline, Overhead Press...',
                        style: TextStyle(fontSize: 10.5, color: _C.textGray),
                        maxLines: 1,
                        overflow: TextOverflow.ellipsis,
                      ),
                    ],
                  ),
                ),
                GestureDetector(
                  onTap: onOpenWorkout,
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                    decoration: BoxDecoration(
                      color: _C.primary,
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: const Text(
                      'View Plan',
                      style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.w800),
                    ),
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

// ── NUTRITION & HYDRATION CARD ─────────────────────────────────────────────
class _NutritionHydrationCard extends StatelessWidget {
  const _NutritionHydrationCard({
    required this.glasses,
    required this.onAddWater,
    required this.onOpenDiet,
  });

  final int glasses;
  final VoidCallback onAddWater;
  final VoidCallback onOpenDiet;

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
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text(
                'Fuel & Hydration',
                style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: _C.textDark),
              ),
              GestureDetector(
                onTap: onOpenDiet,
                child: const Text(
                  'Meal Plan →',
                  style: TextStyle(fontSize: 11, fontWeight: FontWeight.w800, color: _C.primary),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // Calories bar
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              const Text('Daily Calories', style: TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: _C.textDark)),
              RichText(
                text: const TextSpan(
                  children: [
                    TextSpan(text: '1,450', style: TextStyle(fontSize: 12, fontWeight: FontWeight.w900, color: _C.primary)),
                    TextSpan(text: ' / 1,840 kcal', style: TextStyle(fontSize: 11, color: _C.textGray)),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 6),
          ClipRRect(
            borderRadius: BorderRadius.circular(6),
            child: const LinearProgressIndicator(
              value: 0.78,
              minHeight: 8,
              backgroundColor: Color(0xFFF1F5F9),
              color: _C.primary,
            ),
          ),
          const SizedBox(height: 14),

          // Water glasses row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Text('💧', style: TextStyle(fontSize: 16)),
                  const SizedBox(width: 6),
                  Text(
                    'Hydration: $glasses / 8 Glasses (${(glasses * 0.25).toStringAsFixed(1)}L)',
                    style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w700, color: _C.textDark),
                  ),
                ],
              ),
              GestureDetector(
                onTap: onAddWater,
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(8),
                  ),
                  child: const Text(
                    '+ 1 Glass',
                    style: TextStyle(fontSize: 10, fontWeight: FontWeight.w800, color: Color(0xFF0284C7)),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── GYM TRAFFIC CARD ───────────────────────────────────────────────────────
class _GymTrafficCard extends StatelessWidget {
  const _GymTrafficCard({this.gymName = 'Star Fitness'});

  final String gymName;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: const Color(0xFFF0FDF4),
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: const Color(0xFFBBF7D0)),
      ),
      child: Row(
        children: [
          const Text('🟢', style: TextStyle(fontSize: 16)),
          const SizedBox(width: 10),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Live Traffic at $gymName: Moderate (38 Athletes)',
                  style: const TextStyle(fontSize: 11.5, fontWeight: FontWeight.w800, color: Color(0xFF166534)),
                ),
                const SizedBox(height: 2),
                Text(
                  'Optimal time to train at $gymName! Free weights and squat racks are available.',
                  style: const TextStyle(fontSize: 10, color: Color(0xFF15803D)),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
