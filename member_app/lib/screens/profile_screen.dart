import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
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
//  ProfileScreen  — drop-in replacement for _profilePage()
// ══════════════════════════════════════════════════════════════════════════
class ProfileScreen extends StatefulWidget {
  const ProfileScreen({
    super.key,
    required this.member,
    required this.onRefresh,
    this.onSignOut,
  });

  final MemberData member;
  final Future<void> Function() onRefresh;
  final VoidCallback? onSignOut;

  @override
  State<ProfileScreen> createState() => _ProfileScreenState();
}

class _ProfileScreenState extends State<ProfileScreen> {
  late String _name;
  late String _phone;
  late String _email;
  late String _goal;
  late String _emergencyContact;
  bool _workoutReminders = true;
  bool _dietAlerts = true;

  @override
  void initState() {
    super.initState();
    _name = widget.member.name;
    _phone = '+91 98765 43210';
    _email = widget.member.email;
    _goal = 'Muscle Hypertrophy & Fat Loss';
    _emergencyContact = 'Ananya Sharma (+91 98765 11223)';
  }

  void _showEditProfileDialog() {
    final nameCtrl = TextEditingController(text: _name);
    final phoneCtrl = TextEditingController(text: _phone);
    final goalCtrl = TextEditingController(text: _goal);
    final emergencyCtrl = TextEditingController(text: _emergencyContact);

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => SafeArea(
        top: false,
        child: Container(
          decoration: const BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.vertical(top: Radius.circular(28)),
          ),
          padding: EdgeInsets.fromLTRB(
            20,
            20,
            20,
            MediaQuery.of(ctx).viewInsets.bottom + 24,
          ),
          child: SingleChildScrollView(
            physics: const ClampingScrollPhysics(),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Center(
                  child: Container(
                    width: 44,
                    height: 4,
                    decoration: BoxDecoration(
                      color: const Color(0xFFE2E8F0),
                      borderRadius: BorderRadius.circular(2),
                    ),
                  ),
                ),
                const SizedBox(height: 16),
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    const Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          'Edit Member Profile',
                          style: TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w800,
                            color: _C.textDark,
                          ),
                        ),
                        SizedBox(height: 2),
                        Text(
                          'Update personal details & emergency contacts',
                          style: TextStyle(fontSize: 12, color: _C.textGray),
                        ),
                      ],
                    ),
                    IconButton(
                      icon: const Icon(Icons.close, color: _C.textGray),
                      onPressed: () => Navigator.pop(ctx),
                    ),
                  ],
                ),
                const SizedBox(height: 16),

                _inputField('Full Name', nameCtrl, Icons.person_outline_rounded),
                const SizedBox(height: 10),
                _inputField('Phone Number', phoneCtrl, Icons.phone_outlined),
                const SizedBox(height: 10),
                _inputField('Primary Fitness Goal', goalCtrl, Icons.track_changes_rounded),
                const SizedBox(height: 10),
                _inputField('Emergency Contact', emergencyCtrl, Icons.contact_emergency_outlined),

                const SizedBox(height: 20),
                SizedBox(
                  width: double.infinity,
                  height: 48,
                  child: ElevatedButton(
                    style: ElevatedButton.styleFrom(
                      backgroundColor: _C.primary,
                      foregroundColor: Colors.white,
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    ),
                    onPressed: () {
                      setState(() {
                        _name = nameCtrl.text.trim().isNotEmpty ? nameCtrl.text.trim() : _name;
                        _phone = phoneCtrl.text.trim().isNotEmpty ? phoneCtrl.text.trim() : _phone;
                        _goal = goalCtrl.text.trim().isNotEmpty ? goalCtrl.text.trim() : _goal;
                        _emergencyContact = emergencyCtrl.text.trim().isNotEmpty ? emergencyCtrl.text.trim() : _emergencyContact;
                      });
                      Navigator.pop(ctx);
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('Profile updated successfully!'),
                          behavior: SnackBarBehavior.floating,
                        ),
                      );
                    },
                    child: const Text('Save Changes', style: TextStyle(fontWeight: FontWeight.w800)),
                  ),
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _inputField(String label, TextEditingController ctrl, IconData icon) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _C.textDark)),
        const SizedBox(height: 4),
        TextField(
          controller: ctrl,
          style: const TextStyle(fontSize: 13, fontWeight: FontWeight.w600),
          decoration: InputDecoration(
            prefixIcon: Icon(icon, color: _C.primary, size: 18),
            filled: true,
            fillColor: const Color(0xFFF8FAFC),
            contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
            enabledBorder: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: const BorderSide(color: Color(0xFFE2E8F0)),
            ),
          ),
        ),
      ],
    );
  }

  void _showHelpDesk() {
    showDialog<void>(
      context: context,
      builder: (ctx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(24)),
        contentPadding: const EdgeInsets.all(22),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Container(
                    width: 40,
                    height: 40,
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(12),
                    ),
                    child: const Center(
                      child: Icon(Icons.support_agent_rounded, color: _C.primary, size: 22),
                    ),
                  ),
                  const SizedBox(width: 12),
                  const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Front Desk Support', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                      Text('Reception & Support Hub', style: TextStyle(color: _C.textGray, fontSize: 11)),
                    ],
                  ),
                ],
              ),
              const SizedBox(height: 16),
              Text(
                'Need assistance with ${widget.member.gymName} trainer, locker, or subscription?',
                style: const TextStyle(fontSize: 12, color: _C.textGray),
              ),
              const SizedBox(height: 14),
              _supportRow('📍 Center', widget.member.gymAddress),
              _supportRow('📞 Phone', widget.member.gymPhone),
              _supportRow('💬 WhatsApp', widget.member.gymPhone),
              _supportRow('⏰ Working Hours', widget.member.gymTimings),
              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _C.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () => Navigator.pop(ctx),
                  icon: const Icon(Icons.chat_bubble_outline_rounded, size: 16),
                  label: const Text('Contact via WhatsApp', style: TextStyle(fontWeight: FontWeight.w800)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _supportRow(String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: const TextStyle(fontSize: 11, color: _C.textGray)),
          Text(value, style: const TextStyle(fontSize: 11, fontWeight: FontWeight.w700, color: _C.textDark)),
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
          // 1. Top Brand Header
          SliverToBoxAdapter(
            child: _ProfileBrandHeader(
              gymName: widget.member.gymName,
              branch: widget.member.branch,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 2. Athlete Hero Card with Avatar & VIP Status
          SliverToBoxAdapter(
            child: _AthleteHeroCard(
              name: _name,
              email: _email,
              memberId: widget.member.memberId,
              membership: widget.member.membership,
              onEdit: _showEditProfileDialog,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 3. Stats Trio (Workouts, Streak, Hours)
          const SliverToBoxAdapter(
            child: _ProfileStatsTrio(),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 4. Personal & Physical Info Card
          SliverToBoxAdapter(
            child: _PersonalInfoCard(
              phone: _phone,
              goal: _goal,
              emergency: _emergencyContact,
              weight: widget.member.weight,
              height: widget.member.height,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 5. Assigned Trainer & Locker Card
          SliverToBoxAdapter(
            child: _TrainerAndLockerCard(
              gymName: widget.member.gymName,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 6. Preferences & Reminders
          SliverToBoxAdapter(
            child: _PreferencesCard(
              workoutReminders: _workoutReminders,
              dietAlerts: _dietAlerts,
              onToggleWorkout: (v) => setState(() => _workoutReminders = v),
              onToggleDiet: (v) => setState(() => _dietAlerts = v),
              onOpenHelp: _showHelpDesk,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 7. Member App Security & Secret Code Card
          SliverToBoxAdapter(
            child: _MemberAppCredentialsCard(
              memberId: widget.member.memberId,
              secretCode: widget.member.secretCode,
              gymName: widget.member.gymName,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 8. Sign Out / Switch Account Button
          SliverToBoxAdapter(
            child: _SignOutCard(
              onSignOut: () {
                showDialog<void>(
                  context: context,
                  builder: (ctx) => AlertDialog(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
                    title: const Text('Sign Out', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 16)),
                    content: const Text(
                      'Are you sure you want to sign out of the BilzyFit Member App? You will need your Member ID & Secret Code to log back in.',
                      style: TextStyle(fontSize: 12.5),
                    ),
                    actions: [
                      TextButton(
                        onPressed: () => Navigator.pop(ctx),
                        child: const Text('Cancel', style: TextStyle(color: _C.textGray)),
                      ),
                      ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: const Color(0xFFEF4444),
                          foregroundColor: Colors.white,
                        ),
                        onPressed: () {
                          Navigator.pop(ctx);
                          widget.onSignOut?.call();
                        },
                        child: const Text('Sign Out'),
                      ),
                    ],
                  ),
                );
              },
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

// ── PROFILE BRAND HEADER ───────────────────────────────────────────────────
class _ProfileBrandHeader extends StatelessWidget {
  const _ProfileBrandHeader({
    this.gymName = 'Star Fitness',
    this.branch = 'Star Fitness Center',
  });

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
                    child: const Icon(Icons.person_rounded, color: _C.primary, size: 22),
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
                        child: const Text('PROFILE', style: TextStyle(color: Color(0xFF15803D), fontSize: 9, fontWeight: FontWeight.w900)),
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

// ── ATHLETE HERO CARD ──────────────────────────────────────────────────────
class _AthleteHeroCard extends StatelessWidget {
  const _AthleteHeroCard({
    required this.name,
    required this.email,
    required this.memberId,
    required this.membership,
    required this.onEdit,
  });

  final String name;
  final String email;
  final String memberId;
  final String membership;
  final VoidCallback onEdit;

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
        children: [
          Row(
            children: [
              // Avatar with verified badge
              Stack(
                children: [
                  Container(
                    width: 68,
                    height: 68,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: const LinearGradient(
                        colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      border: Border.all(color: _C.primary, width: 2.5),
                    ),
                    child: Center(
                      child: Text(
                        name.isNotEmpty ? name[0] : 'A',
                        style: const TextStyle(
                          fontSize: 28,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                        ),
                      ),
                    ),
                  ),
                  Positioned(
                    bottom: 0,
                    right: 0,
                    child: Container(
                      width: 20,
                      height: 20,
                      decoration: const BoxDecoration(
                        color: _C.primary,
                        shape: BoxShape.circle,
                      ),
                      child: const Icon(Icons.check, color: Colors.white, size: 13),
                    ),
                  ),
                ],
              ),
              const SizedBox(width: 16),

              // Name, Email, and Membership Badge
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Row(
                      children: [
                        Flexible(
                          child: Text(
                            name,
                            style: const TextStyle(
                              fontSize: 18,
                              fontWeight: FontWeight.w900,
                              color: _C.textDark,
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                          decoration: BoxDecoration(
                            color: const Color(0xFFFEF3C7),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Text(
                            'PRO',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFFB45309),
                            ),
                          ),
                        ),
                      ],
                    ),
                    const SizedBox(height: 2),
                    Text(
                      email,
                      style: const TextStyle(fontSize: 11.5, color: _C.textGray),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFFECFDF5),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        '🏆 $membership · ID: $memberId',
                        style: const TextStyle(
                          fontSize: 10,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF047857),
                        ),
                      ),
                    ),
                  ],
                ),
              ),

              // Edit Profile Button
              IconButton(
                icon: const Icon(Icons.edit_outlined, color: _C.primary, size: 20),
                onPressed: onEdit,
                tooltip: 'Edit Profile',
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── PROFILE STATS TRIO ─────────────────────────────────────────────────────
class _ProfileStatsTrio extends StatelessWidget {
  const _ProfileStatsTrio();

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _statBox('🏋️‍♂️ 142', 'Workouts Done', const Color(0xFFDCFCE7), const Color(0xFF15803D)),
        const SizedBox(width: 8),
        _statBox('🔥 5 Days', 'Active Streak', const Color(0xFFFEF3C7), const Color(0xFFB45309)),
        const SizedBox(width: 8),
        _statBox('⏱ 128.5 hrs', 'Total Gym Time', const Color(0xFFE0F2FE), const Color(0xFF0369A1)),
      ],
    );
  }

  Widget _statBox(String value, String label, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 6),
        decoration: BoxDecoration(
          color: Colors.white,
          borderRadius: BorderRadius.circular(18),
          boxShadow: _C.shadow,
        ),
        child: Column(
          children: [
            Text(
              value,
              style: TextStyle(
                fontSize: 13,
                fontWeight: FontWeight.w900,
                color: fg,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              label,
              style: const TextStyle(
                fontSize: 9.5,
                fontWeight: FontWeight.w600,
                color: _C.textGray,
              ),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ── PERSONAL & PHYSICAL INFO CARD ──────────────────────────────────────────
class _PersonalInfoCard extends StatelessWidget {
  const _PersonalInfoCard({
    required this.phone,
    required this.goal,
    required this.emergency,
    required this.weight,
    required this.height,
  });

  final String phone;
  final String goal;
  final String emergency;
  final double weight;
  final int height;

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
          const Text(
            'Personal & Physical Details',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: _C.textDark),
          ),
          const SizedBox(height: 2),
          const Text('Your athletic profile data', style: TextStyle(fontSize: 11, color: _C.textGray)),
          const SizedBox(height: 14),

          _row('Phone Number', phone, Icons.phone_rounded),
          _row('Primary Goal', goal, Icons.flag_rounded),
          _row('Body Metrics', '${weight.toStringAsFixed(1)} kg · $height cm', Icons.monitor_weight_rounded),
          _row('Blood Group', 'O+ Positive', Icons.bloodtype_rounded),
          _row('Emergency Contact', emergency, Icons.emergency_rounded),
          _row('Home Branch', 'BilzyFit Main Hub · Floor 2', Icons.fitness_center_rounded),
        ],
      ),
    );
  }

  Widget _row(String label, String value, IconData icon) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 10),
      child: Row(
        children: [
          Container(
            width: 32,
            height: 32,
            decoration: BoxDecoration(
              color: const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(10),
            ),
            child: Icon(icon, size: 16, color: _C.primary),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(label, style: const TextStyle(fontSize: 10, color: _C.textGray, fontWeight: FontWeight.w600)),
                Text(value, style: const TextStyle(fontSize: 12, fontWeight: FontWeight.w700, color: _C.textDark)),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── TRAINER & LOCKER CARD ──────────────────────────────────────────────────
class _TrainerAndLockerCard extends StatelessWidget {
  const _TrainerAndLockerCard({this.gymName = 'Star Fitness'});

  final String gymName;

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
          Text(
            '$gymName Facilities & Trainer',
            style: const TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: _C.textDark),
          ),
          Text('Assigned coach & privileges at $gymName', style: const TextStyle(fontSize: 11, color: _C.textGray)),
          const SizedBox(height: 14),

          // Assigned Trainer
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
                  width: 42,
                  height: 42,
                  decoration: BoxDecoration(
                    color: const Color(0xFFE0F2FE),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Center(
                    child: Text('🥊', style: TextStyle(fontSize: 20)),
                  ),
                ),
                const SizedBox(width: 12),
                const Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Coach Vikram Singh', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 13, color: _C.textDark)),
                      Text('Senior Strength & Conditioning Specialist', style: TextStyle(fontSize: 10, color: _C.textGray)),
                    ],
                  ),
                ),
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                  decoration: BoxDecoration(
                    color: _C.primary,
                    borderRadius: BorderRadius.circular(10),
                  ),
                  child: const Text('Message', style: TextStyle(color: Colors.white, fontSize: 10.5, fontWeight: FontWeight.w800)),
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Locker & RFID
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('LOCKER ASSIGNED', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: _C.textGray)),
                      SizedBox(height: 2),
                      Text('L-042 (Zone A)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: _C.textDark)),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 8),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: const Color(0xFFF8FAFC),
                    borderRadius: BorderRadius.circular(16),
                    border: Border.all(color: const Color(0xFFE2E8F0)),
                  ),
                  child: const Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('BIOMETRIC ACCESS', style: TextStyle(fontSize: 9, fontWeight: FontWeight.w800, color: _C.textGray)),
                      SizedBox(height: 2),
                      Text('Card #8841-A (Active)', style: TextStyle(fontSize: 13, fontWeight: FontWeight.w900, color: Color(0xFF16A34A))),
                    ],
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

// ── PREFERENCES & REMINDERS ────────────────────────────────────────────────
class _PreferencesCard extends StatelessWidget {
  const _PreferencesCard({
    required this.workoutReminders,
    required this.dietAlerts,
    required this.onToggleWorkout,
    required this.onToggleDiet,
    required this.onOpenHelp,
  });

  final bool workoutReminders;
  final bool dietAlerts;
  final ValueChanged<bool> onToggleWorkout;
  final ValueChanged<bool> onToggleDiet;
  final VoidCallback onOpenHelp;

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
          const Text(
            'App Preferences & Support',
            style: TextStyle(fontSize: 15, fontWeight: FontWeight.w800, color: _C.textDark),
          ),
          const SizedBox(height: 2),
          const Text('Custom notifications and gym help desk', style: TextStyle(fontSize: 11, color: _C.textGray)),
          const SizedBox(height: 10),

          // Workout reminder toggle
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            activeThumbColor: _C.primary,
            title: const Text('Workout Push Reminders', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
            subtitle: const Text('Daily alert for scheduled training session', style: TextStyle(fontSize: 10.5, color: _C.textGray)),
            value: workoutReminders,
            onChanged: onToggleWorkout,
          ),
          const Divider(height: 1),

          // Diet alert toggle
          SwitchListTile(
            contentPadding: EdgeInsets.zero,
            dense: true,
            activeThumbColor: _C.primary,
            title: const Text('Meal & Water Hydration Alerts', style: TextStyle(fontSize: 12.5, fontWeight: FontWeight.w700)),
            subtitle: const Text('Timed notifications to drink water & eat clean', style: TextStyle(fontSize: 10.5, color: _C.textGray)),
            value: dietAlerts,
            onChanged: onToggleDiet,
          ),
          const Divider(height: 1),
          const SizedBox(height: 12),

          // Help desk trigger
          InkWell(
            onTap: onOpenHelp,
            borderRadius: BorderRadius.circular(14),
            child: Container(
              padding: const EdgeInsets.all(12),
              decoration: BoxDecoration(
                color: const Color(0xFFF0FDF4),
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: const Color(0xFFBBF7D0)),
              ),
              child: const Row(
                children: [
                  Icon(Icons.headset_mic_rounded, color: _C.primary, size: 20),
                  SizedBox(width: 10),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text('BilzyFit Front Desk Help', style: TextStyle(fontWeight: FontWeight.w800, fontSize: 12, color: Color(0xFF166534))),
                        Text('Get immediate support from our gym reception', style: TextStyle(fontSize: 10, color: Color(0xFF15803D))),
                      ],
                    ),
                  ),
                  Icon(Icons.chevron_right_rounded, color: _C.primary),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }
}

// ── MEMBER APP CREDENTIALS CARD ────────────────────────────────────────────
class _MemberAppCredentialsCard extends StatefulWidget {
  const _MemberAppCredentialsCard({
    required this.memberId,
    required this.secretCode,
    this.gymName = 'Star Fitness',
  });

  final String memberId;
  final String secretCode;
  final String gymName;

  @override
  State<_MemberAppCredentialsCard> createState() => _MemberAppCredentialsCardState();
}

class _MemberAppCredentialsCardState extends State<_MemberAppCredentialsCard> {
  bool _revealed = false;

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF0F172A), Color(0xFF1E293B)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: const BorderRadius.all(_C.r24),
        border: Border.all(color: const Color(0xFF334155)),
        boxShadow: _C.shadow,
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 38,
                height: 38,
                decoration: BoxDecoration(
                  color: _C.primary.withValues(alpha: 0.2),
                  borderRadius: BorderRadius.circular(12),
                  border: Border.all(color: _C.primary.withValues(alpha: 0.4)),
                ),
                child: const Icon(Icons.key_rounded, color: Color(0xFF34D399), size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      '${widget.gymName} Credentials',
                      style: const TextStyle(fontSize: 14, fontWeight: FontWeight.w800, color: Colors.white),
                    ),
                    Text(
                      'Secret code issued by ${widget.gymName}',
                      style: const TextStyle(fontSize: 10.5, color: Color(0xFF94A3B8)),
                    ),
                  ],
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: const Color(0xFF065F46),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text('ACTIVE', style: TextStyle(color: Color(0xFF6EE7B7), fontSize: 9, fontWeight: FontWeight.w900)),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Code display block
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
            decoration: BoxDecoration(
              color: Colors.black.withValues(alpha: 0.4),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: Colors.white.withValues(alpha: 0.08)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text('SECRET CODE', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 9, fontWeight: FontWeight.w800, letterSpacing: 1.0)),
                    const SizedBox(height: 2),
                    Text(
                      _revealed ? widget.secretCode : '••••••',
                      style: const TextStyle(
                        color: Color(0xFF34D399),
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 4.0,
                        fontFamily: 'monospace',
                      ),
                    ),
                  ],
                ),
                Row(
                  children: [
                    TextButton(
                      style: TextButton.styleFrom(
                        foregroundColor: const Color(0xFFCBD5E1),
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
                        backgroundColor: Colors.white.withValues(alpha: 0.08),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                      ),
                      onPressed: () => setState(() => _revealed = !_revealed),
                      child: Text(_revealed ? 'Hide' : 'Reveal', style: const TextStyle(fontSize: 11, fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(width: 8),
                    IconButton(
                      icon: const Icon(Icons.copy_rounded, color: Color(0xFF34D399), size: 18),
                      tooltip: 'Copy Code',
                      onPressed: () {
                        Clipboard.setData(ClipboardData(text: widget.secretCode));
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(
                            content: Text('Secret code copied to clipboard!'),
                            behavior: SnackBarBehavior.floating,
                            duration: Duration(seconds: 2),
                          ),
                        );
                      },
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(height: 10),

          // Invoice tip
          Row(
            children: [
              const Icon(Icons.info_outline_rounded, color: Color(0xFF64748B), size: 14),
              const SizedBox(width: 6),
              Expanded(
                child: Text(
                  'This code & QR code are printed on your ${widget.gymName} fee invoice. It grants access strictly to this center.',
                  style: const TextStyle(color: Color(0xFF94A3B8), fontSize: 10.5, height: 1.3),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}

// ── SIGN OUT CARD ──────────────────────────────────────────────────────────
class _SignOutCard extends StatelessWidget {
  const _SignOutCard({required this.onSignOut});

  final VoidCallback onSignOut;

  @override
  Widget build(BuildContext context) {
    return InkWell(
      onTap: onSignOut,
      borderRadius: const BorderRadius.all(_C.r24),
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 14),
        decoration: BoxDecoration(
          color: const Color(0xFFFEF2F2),
          borderRadius: const BorderRadius.all(_C.r24),
          border: Border.all(color: const Color(0xFFFECACA)),
        ),
        child: const Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.logout_rounded, color: Color(0xFFDC2626), size: 18),
            SizedBox(width: 8),
            Text(
              'Sign Out / Switch Account',
              style: TextStyle(
                color: Color(0xFFDC2626),
                fontSize: 13,
                fontWeight: FontWeight.w800,
              ),
            ),
          ],
        ),
      ),
    );
  }
}

