import 'package:flutter/material.dart';
import 'package:firebase_core/firebase_core.dart';
import 'firebase_options.dart';
import 'screens/onboarding_screen.dart';
import 'services/firestore_service.dart';
import 'theme/app_theme.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  try {
    await Firebase.initializeApp(
      options: DefaultFirebaseOptions.currentPlatform,
    );
    await FirestoreService.instance.initialize();
  } catch (e) {
    debugPrint('Firebase init notice: $e');
  }
  runApp(const BilzyFitMemberApp());
}

class BilzyFitMemberApp extends StatelessWidget {
  const BilzyFitMemberApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'FitTrack Member',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light,
      home: const MemberSplashScreen(),
    );
  }
}

class MemberSplashScreen extends StatefulWidget {
  const MemberSplashScreen({super.key});

  @override
  State<MemberSplashScreen> createState() => _MemberSplashScreenState();
}

class _MemberSplashScreenState extends State<MemberSplashScreen>
    with SingleTickerProviderStateMixin {
  late final AnimationController _controller;
  late final Animation<double> _fadeAnimation;
  late final Animation<double> _scaleAnimation;

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      vsync: this,
      duration: const Duration(milliseconds: 1200),
    );

    _fadeAnimation = CurvedAnimation(
      parent: _controller,
      curve: Curves.easeOutCubic,
    );

    _scaleAnimation = Tween<double>(begin: 0.85, end: 1.0).animate(
      CurvedAnimation(
        parent: _controller,
        curve: Curves.easeOutBack,
      ),
    );

    _controller.forward();

    // After splash delay, navigate to OnboardingScreen (Screen 2)
    Future<void>.delayed(const Duration(milliseconds: 2400), () {
      if (mounted) {
        Navigator.of(context).pushReplacement(
          PageRouteBuilder<void>(
            pageBuilder: (context, animation, secondaryAnimation) =>
                const OnboardingScreen(),
            transitionsBuilder: (context, animation, secondaryAnimation, child) {
              return FadeTransition(opacity: animation, child: child);
            },
            transitionDuration: const Duration(milliseconds: 500),
          ),
        );
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppTheme.background,
      body: SafeArea(
        child: Stack(
          alignment: Alignment.center,
          children: [
            // Ambient soft background floating neumorphic bubbles
            Positioned(
              top: 50,
              left: -40,
              child: Container(
                width: 150,
                height: 150,
                decoration: AppTheme.neuCircle(),
              ),
            ),
            Positioned(
              top: 100,
              right: -30,
              child: Container(
                width: 110,
                height: 110,
                decoration: AppTheme.neuCircle(),
              ),
            ),
            Positioned(
              bottom: 80,
              right: -40,
              child: Container(
                width: 170,
                height: 170,
                decoration: AppTheme.neuCircle(),
              ),
            ),
            Positioned(
              bottom: 120,
              left: -30,
              child: Container(
                width: 120,
                height: 120,
                decoration: AppTheme.neuCircle(),
              ),
            ),

            // Center Content: Logo, Title, Subtitle, Progress Pill
            Center(
              child: FadeTransition(
                opacity: _fadeAnimation,
                child: ScaleTransition(
                  scale: _scaleAnimation,
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      // Large Neumorphic Outer Dish with 3D Dumbbell (Screen 1)
                      Container(
                        width: 190,
                        height: 190,
                        decoration: AppTheme.neuCircle(),
                        child: Center(
                          child: Container(
                            width: 140,
                            height: 140,
                            decoration: AppTheme.neuCircle(inset: true),
                            child: Center(
                              child: Container(
                                width: 90,
                                height: 90,
                                decoration: BoxDecoration(
                                  gradient: AppTheme.primaryGradient,
                                  shape: BoxShape.circle,
                                  boxShadow: [
                                    BoxShadow(
                                      color: AppTheme.primary.withValues(alpha: 0.45),
                                      blurRadius: 18,
                                      offset: const Offset(0, 6),
                                    ),
                                  ],
                                ),
                                child: const Center(
                                  child: Icon(
                                    Icons.fitness_center_rounded,
                                    size: 46,
                                    color: Colors.white,
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),

                      const SizedBox(height: 38),

                      // FitTrack Title
                      const Text(
                        'FitTrack',
                        style: TextStyle(
                          fontSize: 32,
                          fontWeight: FontWeight.w900,
                          color: AppTheme.textPrimary,
                          letterSpacing: -0.6,
                        ),
                      ),

                      const SizedBox(height: 8),

                      // Subtitle
                      const Text(
                        'Your Personal Fitness Companion',
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.w500,
                          color: AppTheme.textSecondary,
                        ),
                      ),

                      const SizedBox(height: 48),

                      // Neumorphic Mini Progress Pill Bar
                      Container(
                        width: 70,
                        height: 6,
                        decoration: BoxDecoration(
                          color: AppTheme.background,
                          borderRadius: BorderRadius.circular(3),
                          boxShadow: [
                            BoxShadow(
                              color: AppTheme.shadowDark.withValues(alpha: 0.7),
                              offset: const Offset(2, 2),
                              blurRadius: 4,
                            ),
                            const BoxShadow(
                              color: AppTheme.shadowLight,
                              offset: Offset(-2, -2),
                              blurRadius: 4,
                            ),
                          ],
                        ),
                        alignment: Alignment.centerLeft,
                        child: Container(
                          width: 38,
                          height: 6,
                          decoration: BoxDecoration(
                            gradient: AppTheme.primaryGradient,
                            borderRadius: BorderRadius.circular(3),
                          ),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
