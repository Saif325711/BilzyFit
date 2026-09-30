import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../theme/app_theme.dart';
import 'settings_screen.dart';

class ProfileScreen extends StatelessWidget {
  const ProfileScreen({
    super.key,
    required this.member,
    required this.onRefresh,
    required this.onSignOut,
    this.onNavigateTab,
    this.onOpenPayments,
  });

  final MemberData member;
  final Future<void> Function() onRefresh;
  final VoidCallback onSignOut;
  final ValueChanged<int>? onNavigateTab;
  final VoidCallback? onOpenPayments;

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      color: AppTheme.primary,
      onRefresh: onRefresh,
      child: SingleChildScrollView(
        physics: const AlwaysScrollableScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(20, 8, 20, 24),
        child: Column(
          children: [
            // Top Bar: Settings Icon on Top Right (Screen 11)
            Align(
              alignment: Alignment.topRight,
              child: GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute<void>(
                      builder: (_) => const SettingsScreen(),
                    ),
                  );
                },
                child: Container(
                  width: 44,
                  height: 44,
                  decoration: AppTheme.neuCircle(),
                  child: const Center(
                    child: Icon(
                      Icons.settings_outlined,
                      color: AppTheme.textPrimary,
                      size: 20,
                    ),
                  ),
                ),
              ),
            ),

            const SizedBox(height: 8),

            // Profile Avatar in Neumorphic Circle
            Container(
              width: 96,
              height: 96,
              decoration: AppTheme.neuCircle(),
              padding: const EdgeInsets.all(4),
              child: ClipOval(
                child: Image.network(
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
                  fit: BoxFit.cover,
                  errorBuilder: (context, error, stackTrace) => const Icon(
                    Icons.person,
                    size: 48,
                    color: AppTheme.primary,
                  ),
                ),
              ),
            ),

            const SizedBox(height: 14),

            // User Name
            Text(
              member.name.isNotEmpty ? member.name : 'Saiful Islam',
              style: const TextStyle(
                fontSize: 20,
                fontWeight: FontWeight.w800,
                color: AppTheme.textPrimary,
                letterSpacing: -0.3,
              ),
            ),

            const SizedBox(height: 4),

            // Email
            Text(
              member.email.isNotEmpty ? member.email : 'saiful@example.com',
              style: const TextStyle(
                fontSize: 13,
                color: AppTheme.textSecondary,
                fontWeight: FontWeight.w500,
              ),
            ),

            const SizedBox(height: 24),

            // 3 Mini Stats Row (Workouts, Programs, Weight) in Neumorphic Pill
            Container(
              padding: const EdgeInsets.symmetric(vertical: 16, horizontal: 20),
              decoration: AppTheme.neuBox(radius: 22),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceAround,
                children: [
                  _statItem('12', 'Workouts'),
                  Container(
                    width: 1,
                    height: 28,
                    color: AppTheme.shadowDark.withValues(alpha: 0.5),
                  ),
                  _statItem('5', 'Programs'),
                  Container(
                    width: 1,
                    height: 28,
                    color: AppTheme.shadowDark.withValues(alpha: 0.5),
                  ),
                  _statItem('78 kg', 'Weight'),
                ],
              ),
            ),

            const SizedBox(height: 28),

            // Neumorphic Menu Options List (Screen 11)
            // 1. My Progress
            _menuTile(
              icon: Icons.show_chart_rounded,
              iconColor: const Color(0xFF3B82F6),
              title: 'My Progress',
              onTap: () {
                if (onNavigateTab != null) {
                  onNavigateTab!(2); // Navigate to Stats/Progress
                }
              },
            ),

            const SizedBox(height: 16),

            // 2. My Diet Plan
            _menuTile(
              icon: Icons.calendar_today_rounded,
              iconColor: const Color(0xFF10B981),
              title: 'My Diet Plan',
              onTap: () {
                if (onNavigateTab != null) {
                  onNavigateTab!(1); // Navigate to Workout or Diet
                }
              },
            ),

            const SizedBox(height: 16),

            // 3. Achievements
            _menuTile(
              icon: Icons.emoji_events_rounded,
              iconColor: const Color(0xFFFF5252),
              title: 'Achievements',
              onTap: () {
                ScaffoldMessenger.of(context).showSnackBar(
                  const SnackBar(
                    content: Text('5 Achievement Badges Unlocked! 🏆'),
                  ),
                );
              },
            ),

            const SizedBox(height: 16),

            // 4. Payments & Billing
            _menuTile(
              icon: Icons.receipt_long_rounded,
              iconColor: const Color(0xFF10B981),
              title: 'Payments & Billing',
              onTap: () {
                if (onOpenPayments != null) {
                  onOpenPayments!();
                }
              },
            ),

            const SizedBox(height: 16),

            // 5. Settings
            _menuTile(
              icon: Icons.settings_rounded,
              iconColor: const Color(0xFF8B5CF6),
              title: 'Settings',
              onTap: () {
                Navigator.of(context).push(
                  MaterialPageRoute<void>(
                    builder: (_) => const SettingsScreen(),
                  ),
                );
              },
            ),

            const SizedBox(height: 24),
          ],
        ),
      ),
    );
  }

  Widget _statItem(String value, String label) {
    return Column(
      children: [
        Text(
          value,
          style: const TextStyle(
            fontSize: 16,
            fontWeight: FontWeight.w800,
            color: AppTheme.textPrimary,
          ),
        ),
        const SizedBox(height: 4),
        Text(
          label,
          style: const TextStyle(
            fontSize: 12,
            color: AppTheme.textSecondary,
            fontWeight: FontWeight.w500,
          ),
        ),
      ],
    );
  }

  Widget _menuTile({
    required IconData icon,
    required Color iconColor,
    required String title,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
        decoration: AppTheme.neuBox(radius: 20),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: AppTheme.neuCircle(),
              child: Icon(icon, color: iconColor, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Text(
                title,
                style: const TextStyle(
                  fontSize: 15,
                  fontWeight: FontWeight.w600,
                  color: AppTheme.textPrimary,
                ),
              ),
            ),
            const Icon(
              Icons.chevron_right_rounded,
              color: AppTheme.textSecondary,
              size: 22,
            ),
          ],
        ),
      ),
    );
  }
}
