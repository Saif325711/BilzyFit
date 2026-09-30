import 'package:flutter/material.dart';
import '../theme/app_theme.dart';
import 'member_shell.dart';

class OnboardingScreen extends StatefulWidget {
  const OnboardingScreen({
    super.key,
    this.onFinish,
  });

  final VoidCallback? onFinish;

  @override
  State<OnboardingScreen> createState() => _OnboardingScreenState();
}

class _OnboardingScreenState extends State<OnboardingScreen> {
  int _currentPage = 0;

  final List<({String title, String subtitle, IconData icon})> _pages = const [
    (
      title: 'Build a Healthier You',
      subtitle: 'Track workouts, stay consistent and achieve your goals.',
      icon: Icons.fitness_center_rounded,
    ),
    (
      title: 'Personalized Diet Plans',
      subtitle: 'Nutritious meals tailored to power your daily workouts.',
      icon: Icons.restaurant_rounded,
    ),
    (
      title: 'Monitor Real Progress',
      subtitle: 'Visual statistics and analytics to keep you motivated.',
      icon: Icons.show_chart_rounded,
    ),
  ];

  void _proceedToApp() {
    if (widget.onFinish != null) {
      widget.onFinish!();
      return;
    }
    Navigator.of(context).pushReplacement(
      MaterialPageRoute<void>(
        builder: (_) => const MemberShell(),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final page = _pages[_currentPage];

    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 16),
          child: Column(
            children: [
              // Top Bar with Skip Button
              Align(
                alignment: Alignment.topRight,
                child: MouseRegion(
                  cursor: SystemMouseCursors.click,
                  child: GestureDetector(
                    behavior: HitTestBehavior.opaque,
                    onTap: _proceedToApp,
                    child: Container(
                      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 10),
                      child: const Text(
                        'Skip',
                        style: TextStyle(
                          color: AppTheme.textSecondary,
                          fontSize: 16,
                          fontWeight: FontWeight.w600,
                        ),
                      ),
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              // Central Visual: Neumorphic Circle Plate with Floating Badges
              Center(
                child: SizedBox(
                  width: 290,
                  height: 290,
                  child: Stack(
                    alignment: Alignment.center,
                    children: [
                      // Large Neumorphic Outer Dish
                      Container(
                        width: 260,
                        height: 260,
                        decoration: AppTheme.neuCircle(),
                      ),

                      // Inner Sunken Plate
                      Container(
                        width: 200,
                        height: 200,
                        decoration: AppTheme.neuCircle(inset: true),
                        child: Center(
                          child: Container(
                            width: 130,
                            height: 130,
                            decoration: BoxDecoration(
                              gradient: AppTheme.primaryGradient,
                              shape: BoxShape.circle,
                              boxShadow: [
                                BoxShadow(
                                  color: AppTheme.primary.withValues(alpha: 0.35),
                                  blurRadius: 20,
                                  offset: const Offset(0, 8),
                                ),
                              ],
                            ),
                            child: Icon(
                              page.icon,
                              size: 64,
                              color: Colors.white,
                            ),
                          ),
                        ),
                      ),

                      // Floating Badge 1: Dumbbell (Top Left)
                      Positioned(
                        top: 15,
                        left: 20,
                        child: _floatingNeuBadge(
                          icon: Icons.fitness_center_rounded,
                          color: const Color(0xFF6C63FF),
                        ),
                      ),

                      // Floating Badge 2: Heart Pulse (Top Right)
                      Positioned(
                        top: 25,
                        right: 15,
                        child: _floatingNeuBadge(
                          icon: Icons.favorite_rounded,
                          color: const Color(0xFFFF5252),
                        ),
                      ),

                      // Floating Badge 3: Water Droplet (Bottom Right)
                      Positioned(
                        bottom: 35,
                        right: 25,
                        child: _floatingNeuBadge(
                          icon: Icons.water_drop_rounded,
                          color: const Color(0xFF00B0FF),
                        ),
                      ),

                      // Floating Badge 4: Flame Calories (Bottom Left)
                      Positioned(
                        bottom: 30,
                        left: 20,
                        child: _floatingNeuBadge(
                          icon: Icons.local_fire_department_rounded,
                          color: const Color(0xFFFF9100),
                        ),
                      ),
                    ],
                  ),
                ),
              ),

              const SizedBox(height: 36),

              // Title Headline
              Text(
                page.title,
                textAlign: TextAlign.center,
                style: const TextStyle(
                  fontSize: 26,
                  fontWeight: FontWeight.w800,
                  color: AppTheme.textPrimary,
                  letterSpacing: -0.5,
                ),
              ),

              const SizedBox(height: 12),

              // Subtitle
              Padding(
                padding: const EdgeInsets.symmetric(horizontal: 20),
                child: Text(
                  page.subtitle,
                  textAlign: TextAlign.center,
                  style: const TextStyle(
                    fontSize: 15,
                    color: AppTheme.textSecondary,
                    height: 1.45,
                  ),
                ),
              ),

              const SizedBox(height: 28),

              // Page Dots Indicator (Clickable to switch page)
              Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: List.generate(3, (index) {
                  final isActive = index == _currentPage;
                  return GestureDetector(
                    onTap: () => setState(() => _currentPage = index),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      margin: const EdgeInsets.symmetric(horizontal: 4),
                      width: isActive ? 28 : 8,
                      height: 8,
                      decoration: BoxDecoration(
                        color: isActive ? AppTheme.primary : AppTheme.shadowDark,
                        borderRadius: BorderRadius.circular(4),
                      ),
                    ),
                  );
                }),
              ),

              const SizedBox(height: 36),

              // Get Started Button - Immediately Navigates to App/Login
              MouseRegion(
                cursor: SystemMouseCursors.click,
                child: GestureDetector(
                  behavior: HitTestBehavior.opaque,
                  onTap: _proceedToApp,
                  child: Container(
                    width: double.infinity,
                    height: 56,
                    decoration: AppTheme.neuButton(radius: 28),
                    child: const Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          'Get Started',
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 16,
                            fontWeight: FontWeight.w700,
                            letterSpacing: 0.3,
                          ),
                        ),
                        SizedBox(width: 8),
                        Icon(
                          Icons.arrow_forward_rounded,
                          color: Colors.white,
                          size: 20,
                        ),
                      ],
                    ),
                  ),
                ),
              ),

              const SizedBox(height: 16),
            ],
          ),
        ),
      ),
    );
  }

  Widget _floatingNeuBadge({required IconData icon, required Color color}) {
    return Container(
      width: 44,
      height: 44,
      decoration: AppTheme.neuCircle(),
      child: Center(
        child: Icon(icon, size: 22, color: color),
      ),
    );
  }
}
