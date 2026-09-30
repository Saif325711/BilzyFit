import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

class AppTheme {
  // Primary brand color - indigo/violet from FitTrack Neumorphism design
  static const primary = Color(0xFF5B5FC7);
  static const primaryLight = Color(0xFF7B7FE8);
  static const primaryDark = Color(0xFF4347A8);
  static const accent = Color(0xFF6C63FF);

  // Neumorphism background - soft light blue-gray
  static const background = Color(0xFFE8ECF2);
  static const surface = Color(0xFFEFF3F8);

  // Neumorphism shadow colors
  static const shadowLight = Color(0xFFFFFFFF);
  static const shadowDark = Color(0xFFC5CDD9);

  // Text colors
  static const textPrimary = Color(0xFF1E293B);
  static const textSecondary = Color(0xFF64748B);
  static const textHint = Color(0xFF94A3B8);

  // Accent and status colors
  static const orange = Color(0xFFFF7A59);
  static const green = Color(0xFF10B981);
  static const red = Color(0xFFEF4444);
  static const yellow = Color(0xFFF59E0B);

  // Gradient
  static const gradientStart = Color(0xFF6C63FF);
  static const gradientEnd = Color(0xFF5B5FC7);

  static LinearGradient get primaryGradient => const LinearGradient(
        colors: [gradientStart, gradientEnd],
        begin: Alignment.topLeft,
        end: Alignment.bottomRight,
      );

  // Standard Neumorphic convex box
  static BoxDecoration neuBox({
    double radius = 20,
    bool inset = false,
    Color? color,
    Border? border,
  }) {
    final bg = color ?? background;
    return BoxDecoration(
      color: bg,
      borderRadius: BorderRadius.circular(radius),
      border: border,
      boxShadow: inset
          ? [
              BoxShadow(
                color: shadowDark.withValues(alpha: 0.65),
                offset: const Offset(3, 3),
                blurRadius: 6,
                spreadRadius: 0,
              ),
              BoxShadow(
                color: shadowLight.withValues(alpha: 0.95),
                offset: const Offset(-3, -3),
                blurRadius: 6,
                spreadRadius: 0,
              ),
            ]
          : [
              BoxShadow(
                color: shadowDark.withValues(alpha: 0.70),
                offset: const Offset(5, 5),
                blurRadius: 12,
                spreadRadius: 0,
              ),
              BoxShadow(
                color: shadowLight.withValues(alpha: 0.95),
                offset: const Offset(-5, -5),
                blurRadius: 12,
                spreadRadius: 0,
              ),
            ],
    );
  }

  // Neumorphic circle decoration
  static BoxDecoration neuCircle({
    bool inset = false,
    Color? color,
    Border? border,
  }) {
    final bg = color ?? background;
    return BoxDecoration(
      color: bg,
      shape: BoxShape.circle,
      border: border,
      boxShadow: inset
          ? [
              BoxShadow(
                color: shadowDark.withValues(alpha: 0.65),
                offset: const Offset(3, 3),
                blurRadius: 6,
                spreadRadius: 0,
              ),
              BoxShadow(
                color: shadowLight.withValues(alpha: 0.95),
                offset: const Offset(-3, -3),
                blurRadius: 6,
                spreadRadius: 0,
              ),
            ]
          : [
              BoxShadow(
                color: shadowDark.withValues(alpha: 0.70),
                offset: const Offset(5, 5),
                blurRadius: 12,
                spreadRadius: 0,
              ),
              BoxShadow(
                color: shadowLight.withValues(alpha: 0.95),
                offset: const Offset(-5, -5),
                blurRadius: 12,
                spreadRadius: 0,
              ),
            ],
    );
  }

  // Neumorphic Primary Button decoration with gradient and soft purple glow
  static BoxDecoration neuButton({double radius = 28}) {
    return BoxDecoration(
      gradient: primaryGradient,
      borderRadius: BorderRadius.circular(radius),
      boxShadow: [
        BoxShadow(
          color: primary.withValues(alpha: 0.45),
          offset: const Offset(0, 8),
          blurRadius: 18,
          spreadRadius: 0,
        ),
        BoxShadow(
          color: shadowLight,
          offset: const Offset(-2, -2),
          blurRadius: 6,
          spreadRadius: 0,
        ),
      ],
    );
  }

  static ThemeData get light {
    return ThemeData(
      useMaterial3: true,
      colorScheme: ColorScheme.fromSeed(
        seedColor: primary,
        brightness: Brightness.light,
      ).copyWith(primary: primary, surface: background),
      scaffoldBackgroundColor: background,
      fontFamily: 'Roboto',
      appBarTheme: const AppBarTheme(
        backgroundColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        systemOverlayStyle: SystemUiOverlayStyle.dark,
        titleTextStyle: TextStyle(
          color: textPrimary,
          fontSize: 20,
          fontWeight: FontWeight.w700,
        ),
        iconTheme: IconThemeData(color: textPrimary),
      ),
      cardTheme: CardThemeData(
        elevation: 0,
        margin: EdgeInsets.zero,
        color: background,
        surfaceTintColor: Colors.transparent,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.all(Radius.circular(20)),
        ),
      ),
    );
  }
}
