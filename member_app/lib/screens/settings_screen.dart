import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool _notifications = true;
  bool _darkMode = false;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Top Bar with Back Button and Title
              Row(
                children: [
                  GestureDetector(
                    onTap: () => Navigator.of(context).pop(),
                    child: Container(
                      width: 44,
                      height: 44,
                      decoration: AppTheme.neuCircle(),
                      child: const Icon(
                        Icons.arrow_back_rounded,
                        color: AppTheme.textPrimary,
                        size: 20,
                      ),
                    ),
                  ),
                  const SizedBox(width: 18),
                  const Text(
                    'Settings',
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.w800,
                      color: AppTheme.textPrimary,
                      letterSpacing: -0.3,
                    ),
                  ),
                ],
              ),

              const SizedBox(height: 28),

              // Setting Items List
              Expanded(
                child: ListView(
                  children: [
                    // 1. Notifications
                    _settingItem(
                      icon: Icons.notifications_outlined,
                      title: 'Notifications',
                      trailing: Switch(
                        value: _notifications,
                        activeThumbColor: Colors.white,
                        activeTrackColor: AppTheme.primary,
                        inactiveThumbColor: AppTheme.textSecondary,
                        inactiveTrackColor: AppTheme.shadowDark,
                        onChanged: (v) => setState(() => _notifications = v),
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 2. Dark Mode
                    _settingItem(
                      icon: Icons.dark_mode_outlined,
                      title: 'Dark Mode',
                      trailing: Switch(
                        value: _darkMode,
                        activeThumbColor: Colors.white,
                        activeTrackColor: AppTheme.primary,
                        inactiveThumbColor: AppTheme.textSecondary,
                        inactiveTrackColor: AppTheme.shadowDark,
                        onChanged: (v) {
                          setState(() => _darkMode = v);
                          ScaffoldMessenger.of(context).showSnackBar(
                            SnackBar(
                              content: Text(
                                _darkMode
                                    ? 'Dark Mode activated'
                                    : 'Light Neumorphism activated',
                              ),
                              duration: const Duration(seconds: 1),
                            ),
                          );
                        },
                      ),
                    ),
                    const SizedBox(height: 16),

                    // 3. Language
                    _settingItem(
                      icon: Icons.language_rounded,
                      title: 'Language',
                      subtitle: 'English',
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        color: AppTheme.textSecondary,
                        size: 22,
                      ),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Selected language: English')),
                        );
                      },
                    ),
                    const SizedBox(height: 16),

                    // 4. Privacy & Security
                    _settingItem(
                      icon: Icons.shield_outlined,
                      title: 'Privacy & Security',
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        color: AppTheme.textSecondary,
                        size: 22,
                      ),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Your gym data is encrypted.')),
                        );
                      },
                    ),
                    const SizedBox(height: 16),

                    // 5. Help & Support
                    _settingItem(
                      icon: Icons.help_outline_rounded,
                      title: 'Help & Support',
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        color: AppTheme.textSecondary,
                        size: 22,
                      ),
                      onTap: () {
                        ScaffoldMessenger.of(context).showSnackBar(
                          const SnackBar(content: Text('Support email: support@bilzyfit.com')),
                        );
                      },
                    ),
                    const SizedBox(height: 16),

                    // 6. About App
                    _settingItem(
                      icon: Icons.info_outline_rounded,
                      title: 'About App',
                      subtitle: 'Version 1.0.0',
                      trailing: const Icon(
                        Icons.chevron_right_rounded,
                        color: AppTheme.textSecondary,
                        size: 22,
                      ),
                      onTap: () {
                        showAboutDialog(
                          context: context,
                          applicationName: 'FitTrack by BilzyFit',
                          applicationVersion: '1.0.0',
                          applicationLegalese: '© 2026 BilzyFit Technologies',
                        );
                      },
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _settingItem({
    required IconData icon,
    required String title,
    String? subtitle,
    Widget? trailing,
    VoidCallback? onTap,
  }) {
    return GestureDetector(
      onTap: onTap,
      child: Container(
        padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 14),
        decoration: AppTheme.neuBox(radius: 20),
        child: Row(
          children: [
            Container(
              width: 40,
              height: 40,
              decoration: AppTheme.neuCircle(),
              child: Icon(icon, color: AppTheme.primary, size: 20),
            ),
            const SizedBox(width: 16),
            Expanded(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    title,
                    style: const TextStyle(
                      fontSize: 15,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.textPrimary,
                    ),
                  ),
                  if (subtitle != null) ...[
                    const SizedBox(height: 2),
                    Text(
                      subtitle,
                      style: const TextStyle(
                        fontSize: 12,
                        color: AppTheme.textSecondary,
                      ),
                    ),
                  ],
                ],
              ),
            ),
            ?trailing,
          ],
        ),
      ),
    );
  }
}
