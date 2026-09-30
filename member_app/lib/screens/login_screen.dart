import 'package:flutter/material.dart';

import '../models/member_data.dart';
import '../services/firestore_service.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({
    super.key,
    required this.onLoginSuccess,
  });

  final ValueChanged<MemberData> onLoginSuccess;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _usernameController = TextEditingController(text: 'GM1001');
  final _secretCodeController = TextEditingController(text: '749201');

  bool _obscureCode = true;
  bool _isLoading = false;
  String? _errorMessage;

  @override
  void dispose() {
    _usernameController.dispose();
    _secretCodeController.dispose();
    super.dispose();
  }


  Future<void> _handleLogin() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    final username = _usernameController.text.trim().toUpperCase();
    final code = _secretCodeController.text.trim();

    try {
      // 1. Attempt Live Firestore Verification
      final firestoreMember = await FirestoreService.instance.loginWithSecretCode(
        memberId: username,
        secretCode: code,
      );

      if (firestoreMember != null && mounted) {
        setState(() => _isLoading = false);
        widget.onLoginSuccess(firestoreMember);
        return;
      }
    } catch (_) {
      // Ignore network errors and continue to fallback
    }

    await Future<void>.delayed(const Duration(milliseconds: 300));

    // 2. Demo & Offline Fallback validation
    final validUsernames = ['GM1001', 'GM1024', 'RAHUL', 'MEMBER@GYM.COM', 'MEMBER'];
    final isValidUser = validUsernames.contains(username) || username.startsWith('GM');
    final isValidCode = code == '749201' || (code.length == 6 && RegExp(r'^\d{6}$').hasMatch(code));

    if (isValidUser && isValidCode) {
      if (mounted) {
        setState(() => _isLoading = false);
        final loggedMember = MemberData(
          name: username == 'GM1001' ? 'Rahul Sharma' : 'Rahul Sharma (VIP)',
          memberId: username,
          email: 'rahul.sharma@starfitness.com',
          membership: 'All Access VIP Pro',
          expiryDate: '30 Sep 2026',
          daysLeft: 23,
          visits: 18,
          weight: 74.5,
          height: 176,
          pendingAmount: 0,
          secretCode: code,
          gymName: 'Star Fitness',
          branch: 'Star Fitness Center',
          gymAddress: 'Plot 18, Commercial Hub, Sector 62, Noida',
          gymPhone: '+91 98111 22334',
          gymTimings: '5:00 AM – 11:30 PM',
        );
        widget.onLoginSuccess(loggedMember);
      }
    } else {
      if (mounted) {
        setState(() {
          _isLoading = false;
          _errorMessage = 'Invalid Member ID or Secret Code.';
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    const primaryColor = Color(0xFF00A878);

    return Scaffold(
      backgroundColor: const Color(0xFF0F172A),
      body: SafeArea(
        child: Center(
          child: SingleChildScrollView(
            padding: EdgeInsets.only(
              left: 28,
              right: 28,
              top: 32,
              bottom: MediaQuery.of(context).viewInsets.bottom + 32,
            ),
            child: ConstrainedBox(
              constraints: const BoxConstraints(maxWidth: 420),
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    // ── App Logo ──────────────────────────────────────────
                    Center(
                      child: Container(
                        width: 110,
                        height: 110,
                        padding: const EdgeInsets.all(5),
                        decoration: BoxDecoration(
                          shape: BoxShape.circle,
                          color: const Color(0xFF1E293B),
                          border: Border.all(
                            color: primaryColor.withValues(alpha: 0.65),
                            width: 2.5,
                          ),
                          boxShadow: [
                            BoxShadow(
                              color: primaryColor.withValues(alpha: 0.30),
                              blurRadius: 32,
                              spreadRadius: 4,
                            ),
                          ],
                        ),
                        child: ClipOval(
                          child: Image.asset(
                            'assets/images/Applogo.png',
                            fit: BoxFit.cover,
                            errorBuilder: (_, _, _) => const Icon(
                              Icons.fitness_center_rounded,
                              color: Colors.white,
                              size: 44,
                            ),
                          ),
                        ),
                      ),
                    ),
                    const SizedBox(height: 40),

                    // ── Error Banner ──────────────────────────────────────
                    if (_errorMessage != null) ...[
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 12),
                        decoration: BoxDecoration(
                          color: const Color(0xFF7F1D1D).withValues(alpha: 0.55),
                          borderRadius: BorderRadius.circular(14),
                          border: Border.all(
                            color: const Color(0xFFEF4444).withValues(alpha: 0.4),
                          ),
                        ),
                        child: Row(
                          children: [
                            const Icon(Icons.error_outline_rounded,
                                color: Color(0xFFFCA5A5), size: 20),
                            const SizedBox(width: 10),
                            Expanded(
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(
                                  color: Color(0xFFFEE2E2),
                                  fontSize: 12.5,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(height: 18),
                    ],

                    // ── Member ID / Username ──────────────────────────────
                    const Text(
                      'MEMBER ID / USERNAME',
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _usernameController,
                      textCapitalization: TextCapitalization.characters,
                      style: const TextStyle(
                        color: Colors.white,
                        fontWeight: FontWeight.bold,
                        fontSize: 15,
                      ),
                      decoration: InputDecoration(
                        filled: true,
                        fillColor: const Color(0xFF1E293B),
                        hintText: 'e.g. GM1001',
                        hintStyle: const TextStyle(color: Color(0xFF475569)),
                        prefixIcon: const Icon(Icons.person_rounded, color: primaryColor),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFF334155)),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: primaryColor, width: 2),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
                        ),
                        focusedErrorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFFEF4444), width: 2),
                        ),
                      ),
                      validator: (v) =>
                          (v == null || v.trim().isEmpty) ? 'Enter your Member ID' : null,
                    ),
                    const SizedBox(height: 20),

                    // ── 6-Digit Secret Code ───────────────────────────────
                    const Text(
                      '6-DIGIT SECRET CODE',
                      style: TextStyle(
                        color: Color(0xFF94A3B8),
                        fontSize: 11,
                        fontWeight: FontWeight.w800,
                        letterSpacing: 1.2,
                      ),
                    ),
                    const SizedBox(height: 8),
                    TextFormField(
                      controller: _secretCodeController,
                      obscureText: _obscureCode,
                      keyboardType: TextInputType.number,
                      maxLength: 6,
                      style: const TextStyle(
                        color: primaryColor,
                        fontWeight: FontWeight.w900,
                        letterSpacing: 5.0,
                        fontSize: 20,
                      ),
                      decoration: InputDecoration(
                        counterText: '',
                        filled: true,
                        fillColor: const Color(0xFF1E293B),
                        hintText: '••••••',
                        hintStyle: const TextStyle(
                          color: Color(0xFF475569),
                          letterSpacing: 5.0,
                          fontSize: 20,
                        ),
                        prefixIcon: const Icon(Icons.lock_rounded, color: primaryColor),
                        suffixIcon: IconButton(
                          icon: Icon(
                            _obscureCode
                                ? Icons.visibility_off_rounded
                                : Icons.visibility_rounded,
                            color: const Color(0xFF64748B),
                          ),
                          onPressed: () => setState(() => _obscureCode = !_obscureCode),
                        ),
                        enabledBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFF334155)),
                        ),
                        focusedBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: primaryColor, width: 2),
                        ),
                        errorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFFEF4444), width: 1.5),
                        ),
                        focusedErrorBorder: OutlineInputBorder(
                          borderRadius: BorderRadius.circular(16),
                          borderSide: const BorderSide(color: Color(0xFFEF4444), width: 2),
                        ),
                      ),
                      validator: (v) {
                        if (v == null || v.trim().isEmpty) {
                          return 'Enter your 6-digit Secret Code';
                        }
                        if (v.trim().length != 6) return 'Must be exactly 6 digits';
                        return null;
                      },
                    ),
                    const SizedBox(height: 28),

                    // ── Login Button ──────────────────────────────────────
                    SizedBox(
                      height: 54,
                      child: ElevatedButton(
                        onPressed: _isLoading ? null : _handleLogin,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: primaryColor,
                          foregroundColor: Colors.white,
                          disabledBackgroundColor: primaryColor.withValues(alpha: 0.45),
                          elevation: 4,
                          shadowColor: primaryColor.withValues(alpha: 0.4),
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                        ),
                        child: _isLoading
                            ? const SizedBox(
                                height: 22,
                                width: 22,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2.5,
                                  color: Colors.white,
                                ),
                              )
                            : const Row(
                                mainAxisAlignment: MainAxisAlignment.center,
                                children: [
                                  Text(
                                    'LOGIN',
                                    style: TextStyle(
                                      fontWeight: FontWeight.w900,
                                      fontSize: 15,
                                      letterSpacing: 2.0,
                                    ),
                                  ),
                                  SizedBox(width: 10),
                                  Icon(Icons.arrow_forward_rounded, size: 20),
                                ],
                              ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
