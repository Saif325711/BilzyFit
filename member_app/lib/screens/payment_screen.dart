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
//  PaymentScreen  — drop-in replacement for _paymentsPage()
// ══════════════════════════════════════════════════════════════════════════
class PaymentScreen extends StatefulWidget {
  const PaymentScreen({
    super.key,
    required this.member,
    required this.payments,
    required this.onRefresh,
  });

  final MemberData member;
  final List<Payment> payments;
  final Future<void> Function() onRefresh;

  @override
  State<PaymentScreen> createState() => _PaymentScreenState();
}

class _PaymentScreenState extends State<PaymentScreen> {
  late List<Payment> _paymentList;
  String _activeFilter = 'All';

  @override
  void initState() {
    super.initState();
    _paymentList = List.from(widget.payments);
  }

  void _showRenewModal() {
    int selectedDuration = 1; // 1, 3, 12 months
    String selectedMethod = 'UPI';

    showModalBottomSheet<void>(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (ctx) => StatefulBuilder(
        builder: (context, setModalState) {
          final int amount = selectedDuration == 1
              ? 2499
              : selectedDuration == 3
                  ? 6499
                  : 19999;

          return SafeArea(
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
                              'Renew Membership',
                              style: TextStyle(
                                fontSize: 18,
                                fontWeight: FontWeight.w800,
                                color: _C.textDark,
                              ),
                            ),
                            SizedBox(height: 2),
                            Text(
                              'Choose membership duration & payment mode',
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
                    const SizedBox(height: 18),

                    // Duration Options
                    const Text(
                      'Select Duration',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: _C.textDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _planOption(
                          title: '1 Month',
                          price: '₹2,499',
                          badge: 'Standard',
                          selected: selectedDuration == 1,
                          onTap: () => setModalState(() => selectedDuration = 1),
                        ),
                        const SizedBox(width: 8),
                        _planOption(
                          title: '3 Months',
                          price: '₹6,499',
                          badge: 'Save 15%',
                          selected: selectedDuration == 3,
                          onTap: () => setModalState(() => selectedDuration = 3),
                        ),
                        const SizedBox(width: 8),
                        _planOption(
                          title: '12 Months',
                          price: '₹19,999',
                          badge: 'VIP 35% OFF',
                          selected: selectedDuration == 12,
                          onTap: () => setModalState(() => selectedDuration = 12),
                        ),
                      ],
                    ),
                    const SizedBox(height: 16),

                    // Payment Mode Selection
                    const Text(
                      'Payment Method',
                      style: TextStyle(
                        fontSize: 12,
                        fontWeight: FontWeight.w700,
                        color: _C.textDark,
                      ),
                    ),
                    const SizedBox(height: 8),
                    Row(
                      children: [
                        _methodPill(
                          label: 'UPI (GPay / PhonePe)',
                          icon: Icons.qr_code_rounded,
                          selected: selectedMethod == 'UPI',
                          onTap: () => setModalState(() => selectedMethod = 'UPI'),
                        ),
                        const SizedBox(width: 8),
                        _methodPill(
                          label: 'Card',
                          icon: Icons.credit_card_rounded,
                          selected: selectedMethod == 'Card',
                          onTap: () => setModalState(() => selectedMethod = 'Card'),
                        ),
                      ],
                    ),
                    const SizedBox(height: 20),

                    // Pay Button
                    SizedBox(
                      width: double.infinity,
                      height: 50,
                      child: ElevatedButton(
                        style: ElevatedButton.styleFrom(
                          backgroundColor: _C.primary,
                          foregroundColor: Colors.white,
                          shape: RoundedRectangleBorder(
                            borderRadius: BorderRadius.circular(16),
                          ),
                          elevation: 2,
                        ),
                        onPressed: () {
                          Navigator.pop(ctx);
                          _processPayment(amount.toDouble(), selectedMethod);
                        },
                        child: Text(
                          'Pay ₹$amount & Activate Plan',
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  void _processPayment(double amount, String method) {
    final now = DateTime.now();
    final dayStr = now.day.toString().padLeft(2, '0');
    final months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    final dateStr = '$dayStr ${months[now.month - 1]} ${now.year}';

    final newPayment = Payment(amount, dateStr, method);
    setState(() {
      _paymentList.insert(0, newPayment);
    });

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        backgroundColor: const Color(0xFF065F46),
        behavior: SnackBarBehavior.floating,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
        content: Row(
          children: [
            const Icon(Icons.check_circle_rounded, color: Colors.white),
            const SizedBox(width: 10),
            Expanded(
              child: Text(
                'Payment of ₹${amount.toInt()} successful! Membership renewed.',
                style: const TextStyle(fontWeight: FontWeight.w700),
              ),
            ),
          ],
        ),
      ),
    );
  }

  void _showReceiptDialog(Payment payment) {
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
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  RichText(
                    text: const TextSpan(
                      children: [
                        TextSpan(
                          text: 'bilzy',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: _C.textDark,
                          ),
                        ),
                        TextSpan(
                          text: 'fit',
                          style: TextStyle(
                            fontSize: 20,
                            fontWeight: FontWeight.w900,
                            color: _C.primary,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                    decoration: BoxDecoration(
                      color: const Color(0xFFDCFCE7),
                      borderRadius: BorderRadius.circular(8),
                    ),
                    child: const Text(
                      'PAID & VERIFIED',
                      style: TextStyle(
                        fontSize: 9.5,
                        fontWeight: FontWeight.w800,
                        color: Color(0xFF15803D),
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 14),
              const Text(
                'TAX INVOICE / RECEIPT',
                style: TextStyle(
                  fontSize: 10,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 1.5,
                  color: _C.textGray,
                ),
              ),
              const SizedBox(height: 6),
              Text(
                '₹${payment.amount.toStringAsFixed(0)}',
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w900,
                  color: _C.textDark,
                ),
              ),
              const SizedBox(height: 12),
              const Divider(),
              const SizedBox(height: 10),

              _receiptRow('Member Name', widget.member.name),
              _receiptRow('Member ID', widget.member.memberId),
              _receiptRow('Date & Time', payment.date),
              _receiptRow('Payment Mode', payment.method),
              _receiptRow('Transaction ID', 'TXN_BF_${payment.amount.toInt()}_941'),
              _receiptRow('GSTIN (BilzyFit)', '07AABCB2104F1Z4'),

              const SizedBox(height: 16),
              SizedBox(
                width: double.infinity,
                child: ElevatedButton.icon(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: _C.primary,
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                  ),
                  onPressed: () {
                    Navigator.pop(ctx);
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Receipt downloaded successfully.')),
                    );
                  },
                  icon: const Icon(Icons.download_rounded, size: 16),
                  label: const Text('Download PDF Invoice', style: TextStyle(fontWeight: FontWeight.w700)),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _receiptRow(String label, String value) {
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

  Widget _planOption({
    required String title,
    required String price,
    required String badge,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(10),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC),
            border: Border.all(
              color: selected ? _C.primary : const Color(0xFFE2E8F0),
              width: selected ? 1.5 : 1,
            ),
            borderRadius: BorderRadius.circular(14),
          ),
          child: Column(
            children: [
              Text(
                badge,
                style: TextStyle(
                  fontSize: 8.5,
                  fontWeight: FontWeight.w800,
                  color: selected ? _C.primary : _C.textGray,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: _C.textDark,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                price,
                style: const TextStyle(
                  fontSize: 12.5,
                  fontWeight: FontWeight.w900,
                  color: _C.primary,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _methodPill({
    required String label,
    required IconData icon,
    required bool selected,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 8),
          decoration: BoxDecoration(
            color: selected ? const Color(0xFFF0FDF4) : const Color(0xFFF8FAFC),
            border: Border.all(
              color: selected ? _C.primary : const Color(0xFFE2E8F0),
              width: selected ? 1.5 : 1,
            ),
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, size: 16, color: selected ? _C.primary : _C.textGray),
              const SizedBox(width: 6),
              Flexible(
                child: Text(
                  label,
                  style: TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: selected ? _C.primary : _C.textDark,
                  ),
                  maxLines: 1,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
            ],
          ),
        ),
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
            child: _PaymentHeader(member: widget.member),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 2. Digital Membership Card (Black Metal VIP Pass)
          SliverToBoxAdapter(
            child: _DigitalMembershipCard(
              member: widget.member,
              onRenew: _showRenewModal,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 16)),

          // 3. Outstanding Balance & Billing Overview Card
          SliverToBoxAdapter(
            child: _BillingStatusCard(
              member: widget.member,
              onPayNow: _showRenewModal,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 18)),

          // 4. Quick Action Tiles
          SliverToBoxAdapter(
            child: _QuickActionTiles(
              onRenew: _showRenewModal,
              onInvoices: () => setState(() => _activeFilter = 'Invoices'),
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 18)),

          // 5. Payment & Invoices History Header with Filter Chips
          SliverToBoxAdapter(
            child: _PaymentHistorySection(
              payments: _paymentList,
              activeFilter: _activeFilter,
              onFilterChange: (f) => setState(() => _activeFilter = f),
              onSelectReceipt: _showReceiptDialog,
            ),
          ),
          const SliverToBoxAdapter(child: SizedBox(height: 32)),
        ],
      ),
    );
  }
}

// ── PAYMENT HEADER ─────────────────────────────────────────────────────────
class _PaymentHeader extends StatelessWidget {
  const _PaymentHeader({required this.member});
  final MemberData member;

  @override
  Widget build(BuildContext context) {
    final first = member.name.split(' ').firstOrNull ?? member.name;

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        // Brand logo & top actions
        Padding(
          padding: const EdgeInsets.only(bottom: 12, top: 2),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
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

        // Greeting & VIP Status Card
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
                      color: const Color(0xFF0EA5E9).withValues(alpha: 0.08),
                    ),
                  ),
                ),

                // VIP Member Card on the right
                Positioned(
                  right: 12,
                  top: 14,
                  bottom: 14,
                  width: 140,
                  child: Container(
                    decoration: BoxDecoration(
                      color: const Color(0xFFECFDF5),
                      borderRadius: BorderRadius.circular(24),
                      border: Border.all(
                        color: _C.primary.withValues(alpha: 0.2),
                      ),
                    ),
                    child: const Center(
                      child: FittedBox(
                        fit: BoxFit.scaleDown,
                        child: Column(
                          mainAxisAlignment: MainAxisAlignment.center,
                          children: [
                            Text('💳', style: TextStyle(fontSize: 36)),
                            SizedBox(height: 4),
                            Text(
                              'VIP Member',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: _C.primary,
                              ),
                            ),
                            Text(
                              'Active & Verified',
                              style: TextStyle(
                                fontSize: 8.5,
                                fontWeight: FontWeight.w600,
                                color: Color(0xFF059669),
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
                  right: 160,
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
                                text: 'Payments',
                                style: TextStyle(color: _C.primary),
                              ),
                            ],
                          ),
                        ),
                        const SizedBox(height: 5),
                        const Text(
                          'Active Plan · Auto-renew & Invoices 💳',
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

// ── DIGITAL MEMBERSHIP CARD (OBSIDIAN BLACK METAL PASS) ────────────────────
class _DigitalMembershipCard extends StatelessWidget {
  const _DigitalMembershipCard({
    required this.member,
    required this.onRenew,
  });

  final MemberData member;
  final VoidCallback onRenew;

  @override
  Widget build(BuildContext context) {
    return Container(
      height: 200,
      width: double.infinity,
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        gradient: const LinearGradient(
          colors: [
            Color(0xFF0F172A),
            Color(0xFF1E293B),
            Color(0xFF0A2E23),
          ],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        boxShadow: const [
          BoxShadow(
            color: Color(0x33000000),
            blurRadius: 16,
            offset: Offset(0, 6),
          ),
        ],
      ),
      child: Stack(
        children: [
          // Background ambient circular glow
          Positioned(
            right: -30,
            bottom: -30,
            child: Container(
              width: 160,
              height: 160,
              decoration: BoxDecoration(
                shape: BoxShape.circle,
                color: _C.primary.withValues(alpha: 0.18),
              ),
            ),
          ),

          Padding(
            padding: const EdgeInsets.all(20),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                // Top row: Brand + Chip + Status
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Container(
                          width: 34,
                          height: 24,
                          decoration: BoxDecoration(
                            color: const Color(0xFFF59E0B).withValues(alpha: 0.8),
                            borderRadius: BorderRadius.circular(6),
                          ),
                          child: const Icon(
                            Icons.contactless_rounded,
                            color: Colors.black87,
                            size: 16,
                          ),
                        ),
                        const SizedBox(width: 10),
                        const Text(
                          'bilzyfit VIP PASS',
                          style: TextStyle(
                            fontSize: 12,
                            fontWeight: FontWeight.w900,
                            letterSpacing: 1.5,
                            color: Colors.white70,
                          ),
                        ),
                      ],
                    ),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: const Color(0xFF10B981).withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(color: const Color(0xFF10B981)),
                      ),
                      child: const Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(Icons.circle, color: Color(0xFF10B981), size: 6),
                          SizedBox(width: 4),
                          Text(
                            'ACTIVE',
                            style: TextStyle(
                              fontSize: 9,
                              fontWeight: FontWeight.w900,
                              color: Color(0xFF6EE7B7),
                              letterSpacing: 0.8,
                            ),
                          ),
                        ],
                      ),
                    ),
                  ],
                ),

                // Middle: Plan Name & Member ID
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      member.membership.toUpperCase(),
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.w900,
                        color: Colors.white,
                        letterSpacing: 0.5,
                      ),
                    ),
                    const SizedBox(height: 2),
                    Text(
                      'MEMBER ID: ${member.memberId}',
                      style: const TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w600,
                        color: Colors.white54,
                        letterSpacing: 1.2,
                      ),
                    ),
                  ],
                ),

                // Bottom row: Member Name + Expiry + Renew Button
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  crossAxisAlignment: CrossAxisAlignment.end,
                  children: [
                    Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          member.name,
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          'Valid until: ${member.expiryDate} (${member.daysLeft}d left)',
                          style: const TextStyle(
                            fontSize: 10,
                            color: Colors.white60,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                    GestureDetector(
                      onTap: onRenew,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
                        decoration: BoxDecoration(
                          color: _C.primary,
                          borderRadius: BorderRadius.circular(14),
                          boxShadow: const [
                            BoxShadow(
                              color: Color(0x4D00A878),
                              blurRadius: 8,
                              offset: Offset(0, 3),
                            ),
                          ],
                        ),
                        child: const Text(
                          'Renew Plan',
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w800,
                            color: Colors.white,
                          ),
                        ),
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}

// ── BILLING STATUS CARD ───────────────────────────────────────────────────
class _BillingStatusCard extends StatelessWidget {
  const _BillingStatusCard({
    required this.member,
    required this.onPayNow,
  });

  final MemberData member;
  final VoidCallback onPayNow;

  @override
  Widget build(BuildContext context) {
    final hasDue = member.pendingAmount > 0;

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
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  const Text(
                    'OUTSTANDING BALANCE',
                    style: TextStyle(
                      fontSize: 10,
                      fontWeight: FontWeight.w800,
                      letterSpacing: 1.2,
                      color: _C.textGray,
                    ),
                  ),
                  const SizedBox(height: 4),
                  Text(
                    '₹${member.pendingAmount.toStringAsFixed(0)}',
                    style: TextStyle(
                      fontSize: 26,
                      fontWeight: FontWeight.w900,
                      color: hasDue ? const Color(0xFFDC2626) : _C.textDark,
                    ),
                  ),
                ],
              ),
              if (hasDue)
                ElevatedButton(
                  style: ElevatedButton.styleFrom(
                    backgroundColor: const Color(0xFFDC2626),
                    foregroundColor: Colors.white,
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
                  onPressed: onPayNow,
                  child: const Text('Pay Due Now', style: TextStyle(fontWeight: FontWeight.w800)),
                )
              else
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                  decoration: BoxDecoration(
                    color: const Color(0xFFDCFCE7),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Icon(Icons.check_circle_rounded, color: Color(0xFF15803D), size: 14),
                      SizedBox(width: 4),
                      Text(
                        'Up to Date',
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.w800,
                          color: Color(0xFF15803D),
                        ),
                      ),
                    ],
                  ),
                ),
            ],
          ),
          const SizedBox(height: 6),
          Text(
            hasDue
                ? 'Please clear outstanding balance to keep access uninterrupted.'
                : 'Your membership is active. Next scheduled renewal is on ${member.expiryDate}.',
            style: const TextStyle(fontSize: 11.5, color: _C.textGray, height: 1.3),
          ),
          const SizedBox(height: 14),

          // 3 Metric Pills
          Row(
            children: [
              _metricPill('🗓 Status', 'Active (${member.daysLeft}d left)',
                  const Color(0xFFDCFCE7), const Color(0xFF15803D)),
              const SizedBox(width: 8),
              _metricPill('💵 Rate', '₹2,499 / mo',
                  const Color(0xFFE0F2FE), const Color(0xFF0369A1)),
              const SizedBox(width: 8),
              _metricPill('🛡 Plan', 'All Zones & Spa',
                  const Color(0xFFEDE9FE), const Color(0xFF6D28D9)),
            ],
          ),
        ],
      ),
    );
  }

  Widget _metricPill(String label, String value, Color bg, Color fg) {
    return Expanded(
      child: Container(
        padding: const EdgeInsets.symmetric(vertical: 8, horizontal: 4),
        decoration: BoxDecoration(
          color: bg,
          borderRadius: BorderRadius.circular(14),
        ),
        child: Column(
          children: [
            Text(
              label,
              style: TextStyle(fontSize: 10, fontWeight: FontWeight.w700, color: fg),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
            const SizedBox(height: 2),
            Text(
              value,
              style: TextStyle(fontSize: 11, fontWeight: FontWeight.w900, color: fg),
              maxLines: 1,
              overflow: TextOverflow.ellipsis,
            ),
          ],
        ),
      ),
    );
  }
}

// ── QUICK ACTION TILES ─────────────────────────────────────────────────────
class _QuickActionTiles extends StatelessWidget {
  const _QuickActionTiles({
    required this.onRenew,
    required this.onInvoices,
  });

  final VoidCallback onRenew;
  final VoidCallback onInvoices;

  @override
  Widget build(BuildContext context) {
    return Row(
      children: [
        _tile(
          title: 'Quick Renew',
          subtitle: 'Instant Extend',
          icon: Icons.autorenew_rounded,
          color: _C.primary,
          bg: const Color(0xFFECFDF5),
          onTap: onRenew,
        ),
        const SizedBox(width: 10),
        _tile(
          title: 'Tax Invoices',
          subtitle: 'GST Receipts',
          icon: Icons.receipt_long_rounded,
          color: const Color(0xFF0284C7),
          bg: const Color(0xFFF0F9FF),
          onTap: onInvoices,
        ),
        const SizedBox(width: 10),
        _tile(
          title: 'VIP Upgrade',
          subtitle: 'Save 35%',
          icon: Icons.star_rounded,
          color: const Color(0xFFD97706),
          bg: const Color(0xFFFFFBEB),
          onTap: onRenew,
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
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.symmetric(vertical: 14, horizontal: 10),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
            boxShadow: _C.shadow,
          ),
          child: Column(
            children: [
              Container(
                width: 36,
                height: 36,
                decoration: BoxDecoration(
                  color: bg,
                  shape: BoxShape.circle,
                ),
                child: Icon(icon, color: color, size: 20),
              ),
              const SizedBox(height: 8),
              Text(
                title,
                style: const TextStyle(
                  fontSize: 11,
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
                  fontSize: 9.5,
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
    );
  }
}

// ── PAYMENT HISTORY SECTION ───────────────────────────────────────────────
class _PaymentHistorySection extends StatelessWidget {
  const _PaymentHistorySection({
    required this.payments,
    required this.activeFilter,
    required this.onFilterChange,
    required this.onSelectReceipt,
  });

  final List<Payment> payments;
  final String activeFilter;
  final ValueChanged<String> onFilterChange;
  final ValueChanged<Payment> onSelectReceipt;

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
                    'Payment History',
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.w800,
                      color: _C.textDark,
                    ),
                  ),
                  SizedBox(height: 2),
                  Text(
                    'Receipts & billing transactions',
                    style: TextStyle(fontSize: 12, color: _C.textGray),
                  ),
                ],
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                decoration: BoxDecoration(
                  color: const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(10),
                ),
                child: Text(
                  '${payments.length} Records',
                  style: const TextStyle(
                    fontSize: 11,
                    fontWeight: FontWeight.w700,
                    color: _C.textGray,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Filter Chips
          Row(
            children: ['All', 'Completed', 'Invoices'].map((filter) {
              final isSel = activeFilter == filter;
              return Padding(
                padding: const EdgeInsets.only(right: 8),
                child: GestureDetector(
                  onTap: () => onFilterChange(filter),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 5),
                    decoration: BoxDecoration(
                      color: isSel ? _C.primary : const Color(0xFFF1F5F9),
                      borderRadius: BorderRadius.circular(10),
                    ),
                    child: Text(
                      filter,
                      style: TextStyle(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: isSel ? Colors.white : _C.textGray,
                      ),
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
          const SizedBox(height: 14),

          // Payment Items List
          if (payments.isEmpty)
            const Padding(
              padding: EdgeInsets.symmetric(vertical: 20),
              child: Center(
                child: Text('No payment records found.', style: TextStyle(color: _C.textGray)),
              ),
            )
          else
            ...payments.map((p) {
              return Container(
                margin: const EdgeInsets.only(bottom: 10),
                padding: const EdgeInsets.all(12),
                decoration: BoxDecoration(
                  color: const Color(0xFFF8FAFC),
                  borderRadius: BorderRadius.circular(16),
                  border: Border.all(color: const Color(0xFFE2E8F0)),
                ),
                child: Row(
                  children: [
                    Container(
                      width: 40,
                      height: 40,
                      decoration: BoxDecoration(
                        color: const Color(0xFFDCFCE7),
                        borderRadius: BorderRadius.circular(12),
                      ),
                      child: const Center(
                        child: Icon(Icons.check_circle_rounded, color: Color(0xFF16A34A), size: 22),
                      ),
                    ),
                    const SizedBox(width: 12),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            '₹${p.amount.toStringAsFixed(0)}',
                            style: const TextStyle(
                              fontSize: 15,
                              fontWeight: FontWeight.w900,
                              color: _C.textDark,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            '${p.date} · via ${p.method}',
                            style: const TextStyle(fontSize: 11, color: _C.textGray),
                          ),
                        ],
                      ),
                    ),
                    InkWell(
                      onTap: () => onSelectReceipt(p),
                      borderRadius: BorderRadius.circular(10),
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 6),
                        decoration: BoxDecoration(
                          color: Colors.white,
                          border: Border.all(color: const Color(0xFFCBD5E1)),
                          borderRadius: BorderRadius.circular(10),
                        ),
                        child: const Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(Icons.receipt_rounded, size: 13, color: _C.primary),
                            SizedBox(width: 4),
                            Text(
                              'Receipt',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.w800,
                                color: _C.primary,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),
                  ],
                ),
              );
            }),
        ],
      ),
    );
  }
}
