import 'package:flutter/material.dart';
import '../models/member_data.dart';
import '../screens/payment_screen.dart';
import '../screens/settings_screen.dart';
import '../theme/app_theme.dart';

class AppDrawer extends StatelessWidget {
  const AppDrawer({
    super.key,
    required this.member,
    required this.currentIndex,
    required this.onSelectTab,
    required this.onSignOut,
    this.onOpenPayments,
    this.onSetGoal,
  });

  final MemberData member;
  final int currentIndex;
  final ValueChanged<int> onSelectTab;
  final VoidCallback onSignOut;
  final VoidCallback? onOpenPayments;
  final VoidCallback? onSetGoal;

  @override
  Widget build(BuildContext context) {
    return Drawer(
      backgroundColor: AppTheme.background,
      elevation: 16,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.horizontal(right: Radius.circular(32)),
      ),
      child: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Header: Avatar, Name, Email, Close 'X' Button
              Row(
                crossAxisAlignment: CrossAxisAlignment.center,
                children: [
                  Container(
                    width: 52,
                    height: 52,
                    decoration: AppTheme.neuCircle(),
                    padding: const EdgeInsets.all(3),
                    child: ClipOval(
                      child: Image.network(
                        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
                        fit: BoxFit.cover,
                        errorBuilder: (context, error, stackTrace) => const Icon(
                          Icons.person,
                          color: AppTheme.primary,
                          size: 30,
                        ),
                      ),
                    ),
                  ),
                  const SizedBox(width: 14),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          member.name.isNotEmpty ? member.name : 'Saiful Islam',
                          style: const TextStyle(
                            fontSize: 16,
                            fontWeight: FontWeight.w800,
                            color: AppTheme.textPrimary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                        const SizedBox(height: 2),
                        Text(
                          member.email.isNotEmpty ? member.email : 'saiful@example.com',
                          style: const TextStyle(
                            fontSize: 12,
                            color: AppTheme.textSecondary,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ],
                    ),
                  ),
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 36,
                      height: 36,
                      decoration: AppTheme.neuCircle(),
                      child: const Icon(
                        Icons.close_rounded,
                        size: 18,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Drawer Nav Items
              Expanded(
                child: ListView(
                  padding: EdgeInsets.zero,
                  children: [
                    _drawerItem(
                      context,
                      icon: Icons.home_rounded,
                      label: 'Home',
                      isActive: currentIndex == 0,
                      onTap: () {
                        Navigator.of(context).pop();
                        onSelectTab(0);
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.fitness_center_rounded,
                      label: 'Workouts & Plans',
                      isActive: currentIndex == 1,
                      onTap: () {
                        Navigator.of(context).pop();
                        onSelectTab(1);
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.restaurant_rounded,
                      label: 'Diet Plan',
                      isActive: currentIndex == 2,
                      onTap: () {
                        Navigator.of(context).pop();
                        onSelectTab(2);
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.show_chart_rounded,
                      label: 'Progress & Weekly Goals',
                      isActive: currentIndex == 3,
                      onTap: () {
                        Navigator.of(context).pop();
                        onSelectTab(3);
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.receipt_long_rounded,
                      label: 'Payments & Invoices',
                      isActive: false,
                      onTap: () {
                        Navigator.of(context).pop();
                        if (onOpenPayments != null) {
                          onOpenPayments!();
                        } else {
                          Navigator.of(context).push(
                            MaterialPageRoute<void>(
                              builder: (_) => PaymentScreen(
                                member: member,
                                payments: paymentHistory,
                                onRefresh: () async {},
                              ),
                            ),
                          );
                        }
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.flag_rounded,
                      label: 'Set a Fitness Goal',
                      isActive: false,
                      onTap: () {
                        Navigator.of(context).pop();
                        if (onSetGoal != null) {
                          onSetGoal!();
                        }
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.star_outline_rounded,
                      label: 'Achievements',
                      isActive: false,
                      onTap: () {
                        Navigator.of(context).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('5 Badges Earned! ⭐')),
                        );
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.settings_outlined,
                      label: 'Settings',
                      isActive: false,
                      onTap: () {
                        Navigator.of(context).pop();
                        Navigator.of(context).push(
                          MaterialPageRoute<void>(
                            builder: (_) => const SettingsScreen(),
                          ),
                        );
                      },
                    ),
                    const SizedBox(height: 6),
                    _drawerItem(
                      context,
                      icon: Icons.help_outline_rounded,
                      label: 'Help & Support',
                      isActive: false,
                      onTap: () {
                        Navigator.of(context).pop();
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Support email: support@bilzyfit.com')),
                        );
                      },
                    ),
                  ],
                ),
              ),

              // Bottom: Logout Button
              GestureDetector(
                onTap: () {
                  Navigator.of(context).pop();
                  onSignOut();
                },
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 14),
                  decoration: BoxDecoration(
                    color: const Color(0xFFFEE2E2).withValues(alpha: 0.5),
                    borderRadius: BorderRadius.circular(16),
                  ),
                  child: const Row(
                    children: [
                      Icon(
                        Icons.logout_rounded,
                        color: Color(0xFFEF4444),
                        size: 20,
                      ),
                      SizedBox(width: 14),
                      Text(
                        'Logout',
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.w700,
                          color: Color(0xFFEF4444),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(height: 8),
            ],
          ),
        ),
      ),
    );
  }

  Widget _drawerItem(
    BuildContext context, {
    required IconData icon,
    required String label,
    required bool isActive,
    required VoidCallback onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: AnimatedContainer(
        duration: const Duration(milliseconds: 200),
        padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
        decoration: isActive
            ? BoxDecoration(
                gradient: AppTheme.primaryGradient,
                borderRadius: BorderRadius.circular(16),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primary.withValues(alpha: 0.35),
                    offset: const Offset(0, 4),
                    blurRadius: 10,
                  ),
                ],
              )
            : BoxDecoration(
                borderRadius: BorderRadius.circular(16),
              ),
        child: Row(
          children: [
            Icon(
              icon,
              size: 20,
              color: isActive ? Colors.white : AppTheme.textSecondary,
            ),
            const SizedBox(width: 14),
            Text(
              label,
              style: TextStyle(
                fontSize: 14.5,
                fontWeight: isActive ? FontWeight.w700 : FontWeight.w500,
                color: isActive ? Colors.white : AppTheme.textPrimary,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
