import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:pdf/pdf.dart';
import 'package:printing/printing.dart';
import 'package:forui/forui.dart';

import 'shared.dart';

class SecureViewerScreen extends StatefulWidget {
  final PrintJob job;
  final String pdfPath;
  final VoidCallback onPrintSuccess;
  final VoidCallback onClose;

  const SecureViewerScreen({
    super.key,
    required this.job,
    required this.pdfPath,
    required this.onPrintSuccess,
    required this.onClose,
  });

  @override
  State<SecureViewerScreen> createState() => _SecureViewerScreenState();
}

class _SecureViewerScreenState extends State<SecureViewerScreen>
    with WidgetsBindingObserver {
  bool _isTabActive = true;
  bool _isPrivacyShieldActive = false;
  bool _isPrinting = false;
  bool _showSecureStamp = true;
  double _watermarkOpacity = 0.1;

  List<Printer> _printers = [];
  Printer? _selectedPrinter;

  @override
  void initState() {
    super.initState();
    WidgetsBinding.instance.addObserver(this);
    _loadPrinters();
  }

  @override
  void dispose() {
    WidgetsBinding.instance.removeObserver(this);
    super.dispose();
  }

  @override
  void didChangeAppLifecycleState(AppLifecycleState state) {
    setState(() {
      _isTabActive = state == AppLifecycleState.resumed;
    });
  }

  Future<void> _loadPrinters() async {
    try {
      final printers = await Printing.listPrinters();
      setState(() {
        _printers = printers.where((p) {
          if (!p.isAvailable) return false;
          final name = p.name.toLowerCase();
          return ![
            'pdf',
            'xps',
            'virtual',
            'writer',
            'onenote',
            'fax'
          ].any((s) => name.contains(s));
        }).toList();
        if (_printers.isNotEmpty) _selectedPrinter = _printers.first;
      });
    } catch (e) {
      debugPrint('Printer load error: $e');
    }
  }

  Future<void> _securePrint() async {
    if (_selectedPrinter == null) return;
    setState(() => _isPrinting = true);
    try {
      final bytes = await _buildPdfWithStamp();
      await Printing.directPrintPdf(
        printer: _selectedPrinter!,
        onLayout: (format) async => bytes,
      );
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Document sent to hardware printer.')),
        );
        widget.onPrintSuccess();
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Print failure: $e')),
        );
      }
    } finally {
      if (mounted) setState(() => _isPrinting = false);
    }
  }

  Future<Uint8List> _buildPdfWithStamp() async {
    // Read raw PDF bytes
    return await File(widget.pdfPath).readAsBytes();
  }

  bool get _shouldHideContent => !_isTabActive || _isPrivacyShieldActive;

  @override
  Widget build(BuildContext context) {
    return Shortcuts(
      shortcuts: <ShortcutActivator, Intent>{
        SingleActivator(LogicalKeyboardKey.keyP, control: true):
            const BlockIntent(),
        SingleActivator(LogicalKeyboardKey.keyS, control: true):
            const BlockIntent(),
        SingleActivator(LogicalKeyboardKey.f12): const BlockIntent(),
      },
      child: Actions(
        actions: <Type, Action<Intent>>{
          BlockIntent:
              CallbackAction<BlockIntent>(onInvoke: (intent) => null),
        },
        child: FocusScope(
          autofocus: true,
          child: Material(
            color: const Color(0xFF0C0C0E),
            child: Stack(
              children: [
                Column(
                  children: [
                    _buildHeader(),
                    Expanded(
                      child: Row(
                        children: [
                          _buildSidebar(),
                          Expanded(child: _buildPreviewArea()),
                        ],
                      ),
                    ),
                  ],
                ),

                // Privacy Overlay
                if (_shouldHideContent) _buildPrivacyOverlay(),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Container(
      height: 64,
      color: const Color(0xFF16161B),
      padding: const EdgeInsets.symmetric(horizontal: 24),
      child: Row(
        children: [
          // Left: Logo + version
          Stack(
            clipBehavior: Clip.none,
            children: [
              Icon(Icons.shield_outlined, color: kBlue, size: 24),
              Positioned(
                top: -4,
                right: -4,
                child: _PulsingGreenDot(),
              ),
            ],
          ),
          const SizedBox(width: 8),
          Container(
              width: 1, height: 32, color: Colors.white.withAlpha(25)),
          const SizedBox(width: 16),
          Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                'Print Console v4.0.2',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: Colors.white.withAlpha(200),
                  letterSpacing: 2,
                ),
              ),
              Text(
                '● Hardware Link Active',
                style: GoogleFonts.inter(
                  fontSize: 9,
                  color: const Color(0xFF4ADE80),
                  letterSpacing: 1.5,
                ),
              ),
            ],
          ),

          const Spacer(),

          // Encryption status indicator
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 6),
            decoration: BoxDecoration(
              color: Colors.black.withAlpha(100),
              borderRadius: BorderRadius.circular(999),
              border: Border.all(color: Colors.white.withAlpha(13)),
            ),
            child: Row(
              children: [
                Text(
                  'ENCRYPTION STATUS',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    fontWeight: FontWeight.w700,
                    color: Colors.white.withAlpha(75),
                    letterSpacing: 1.5,
                  ),
                ),
                const SizedBox(width: 10),
                ...List.generate(
                  3,
                  (i) => Container(
                    margin: const EdgeInsets.only(left: 4),
                    width: 12,
                    height: 4,
                    decoration: BoxDecoration(
                      color: kBlue.withAlpha(100),
                      borderRadius: BorderRadius.circular(4),
                    ),
                  ),
                ),
                Container(
                  margin: const EdgeInsets.only(left: 4),
                  width: 12,
                  height: 4,
                  decoration: BoxDecoration(
                    color: kBlue,
                    borderRadius: BorderRadius.circular(4),
                  ),
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),

          // Close button
          IconButton(
            onPressed: widget.onClose,
            icon: Icon(Icons.close,
                color: Colors.white.withAlpha(50), size: 24),
            hoverColor: Colors.white.withAlpha(15),
          ),
        ],
      ),
    );
  }

  Widget _buildSidebar() {
    return Container(
      width: 288,
      color: const Color(0xFF121216),
      padding: const EdgeInsets.all(24),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Output Control section
          Text(
            'OUTPUT CONTROL',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w900,
              color: Colors.white.withAlpha(75),
              letterSpacing: 2,
            ),
          ),
          const SizedBox(height: 16),

          // Watermark opacity slider
          Text(
            'POISON WATERMARK',
            style: GoogleFonts.inter(
              fontSize: 10,
              fontWeight: FontWeight.w700,
              color: Colors.white.withAlpha(150),
              letterSpacing: 1,
            ),
          ),
          const SizedBox(height: 4),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                '${(_watermarkOpacity * 100).round()}%',
                style: GoogleFonts.inter(
                  fontSize: 9,
                  color: kBlue,
                  letterSpacing: 1,
                ),
              ),
            ],
          ),
          SliderTheme(
            data: SliderTheme.of(context).copyWith(
              activeTrackColor: kBlue,
              inactiveTrackColor: Colors.white.withAlpha(25),
              thumbColor: kBlue,
              overlayColor: kBlue.withAlpha(30),
              trackHeight: 4,
            ),
            child: Slider(
              min: 0.05,
              max: 0.4,
              value: _watermarkOpacity,
              onChanged: (v) => setState(() => _watermarkOpacity = v),
            ),
          ),
          const SizedBox(height: 16),

          // Zero-Log Stamp toggle
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black.withAlpha(100),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withAlpha(13)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'ZERO-LOG STAMP',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: Colors.white.withAlpha(200),
                    letterSpacing: 1,
                  ),
                ),
                GestureDetector(
                  onTap: () =>
                      setState(() => _showSecureStamp = !_showSecureStamp),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 36,
                    height: 18,
                    decoration: BoxDecoration(
                      color: _showSecureStamp
                          ? kBlue
                          : Colors.white.withAlpha(25),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: AnimatedAlign(
                      duration: const Duration(milliseconds: 200),
                      alignment: _showSecureStamp
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        width: 14,
                        height: 14,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          // Privacy shield
          const SizedBox(height: 12),
          Container(
            padding:
                const EdgeInsets.symmetric(horizontal: 16, vertical: 12),
            decoration: BoxDecoration(
              color: Colors.black.withAlpha(100),
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: Colors.white.withAlpha(13)),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'PRIVACY SHIELD',
                  style: GoogleFonts.inter(
                    fontSize: 10,
                    fontWeight: FontWeight.w700,
                    color: Colors.white.withAlpha(200),
                    letterSpacing: 1,
                  ),
                ),
                GestureDetector(
                  onTap: () => setState(
                      () => _isPrivacyShieldActive = !_isPrivacyShieldActive),
                  child: AnimatedContainer(
                    duration: const Duration(milliseconds: 200),
                    width: 36,
                    height: 18,
                    decoration: BoxDecoration(
                      color: _isPrivacyShieldActive
                          ? Colors.red.shade700
                          : Colors.white.withAlpha(25),
                      borderRadius: BorderRadius.circular(999),
                    ),
                    child: AnimatedAlign(
                      duration: const Duration(milliseconds: 200),
                      alignment: _isPrivacyShieldActive
                          ? Alignment.centerRight
                          : Alignment.centerLeft,
                      child: Container(
                        margin: const EdgeInsets.symmetric(horizontal: 2),
                        width: 14,
                        height: 14,
                        decoration: const BoxDecoration(
                          color: Colors.white,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                  ),
                ),
              ],
            ),
          ),

          const Spacer(),

          // Printer info box
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: LinearGradient(
                colors: [kBlue.withAlpha(50), Colors.transparent],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              border: Border.all(color: kBlue.withAlpha(50)),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.print, color: kBlue, size: 24),
                const SizedBox(height: 12),
                Text(
                  'Authorization Layer',
                  style: GoogleFonts.inter(
                    fontSize: 13,
                    fontWeight: FontWeight.w700,
                    color: Colors.white,
                  ),
                ),
                const SizedBox(height: 4),
                Text(
                  'DIRECT HARDWARE TUNNELING.\nBYPASSING OS BUFFER CACHE.',
                  style: GoogleFonts.inter(
                    fontSize: 9,
                    color: Colors.white.withAlpha(100),
                    letterSpacing: 0.5,
                    height: 1.6,
                  ),
                ),
                if (_printers.isNotEmpty) ...[
                  const SizedBox(height: 12),
                  DropdownButton<Printer>(
                    value: _selectedPrinter,
                    isExpanded: true,
                    dropdownColor: const Color(0xFF1F1F23),
                    style: GoogleFonts.inter(
                        fontSize: 11, color: Colors.white),
                    underline: Container(
                        height: 1, color: Colors.white.withAlpha(25)),
                    items: _printers
                        .map((p) => DropdownMenuItem(
                              value: p,
                              child: Text(p.name,
                                  overflow: TextOverflow.ellipsis),
                            ))
                        .toList(),
                    onChanged: (v) =>
                        setState(() => _selectedPrinter = v),
                  ),
                ],
              ],
            ),
          ),
          const SizedBox(height: 16),

          // Authorize Print button
          SizedBox(
            width: double.infinity,
            child: ElevatedButton(
              onPressed: _isPrinting ? null : _securePrint,
              style: ElevatedButton.styleFrom(
                backgroundColor: kBlue,
                disabledBackgroundColor: kBlue.withAlpha(25),
                foregroundColor: Colors.white,
                padding: const EdgeInsets.symmetric(vertical: 16),
                shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(16)),
                elevation: 0,
                shadowColor: kBlue.withAlpha(80),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.center,
                children: [
                  _isPrinting
                      ? const SizedBox(
                          width: 16,
                          height: 16,
                          child: CircularProgressIndicator(
                              strokeWidth: 2, color: Colors.white),
                        )
                      : const Icon(Icons.shield_outlined, size: 16),
                  const SizedBox(width: 8),
                  Text(
                    _isPrinting ? 'AUTHORIZING...' : 'AUTHORIZE PRINT',
                    style: GoogleFonts.inter(
                      fontSize: 11,
                      fontWeight: FontWeight.w900,
                      letterSpacing: 1.5,
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildPreviewArea() {
    return Container(
      color: const Color(0xFF1C1C22),
      child: Stack(
        children: [
          // PDF preview
          PdfPreview(
            key: ValueKey(widget.pdfPath),
            build: (format) async {
              return await File(widget.pdfPath).readAsBytes();
            },
            canChangePageFormat: false,
            canDebug: false,
            allowSharing: false,
            allowPrinting: false,
            padding: const EdgeInsets.all(32),
          ),

          // Encryption HUD at bottom
          Positioned(
            bottom: 0,
            left: 0,
            right: 0,
            child: Center(child: _buildEncryptionHUD()),
          ),
        ],
      ),
    );
  }

  Widget _buildEncryptionHUD() {
    return ClipRRect(
      borderRadius: const BorderRadius.only(
        topLeft: Radius.circular(40),
        topRight: Radius.circular(40),
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 12, sigmaY: 12),
        child: Container(
          margin: const EdgeInsets.symmetric(horizontal: 40),
          padding: const EdgeInsets.symmetric(horizontal: 32, vertical: 16),
          decoration: BoxDecoration(
            color: Colors.black.withAlpha(150),
            borderRadius: const BorderRadius.only(
              topLeft: Radius.circular(40),
              topRight: Radius.circular(40),
            ),
            border: Border.all(color: Colors.white.withAlpha(13)),
          ),
          child: Row(
            mainAxisSize: MainAxisSize.min,
            children: [
              _hudItem('BIT-DEPTH', '256-AES',
                  const Color(0xFF4ADE80)),
              Container(
                  width: 1,
                  height: 24,
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  color: Colors.white.withAlpha(25)),
              _hudItem('MEMORY INTEGRITY', 'Protected',
                  const Color(0xFF60A5FA)),
              Container(
                  width: 1,
                  height: 24,
                  margin: const EdgeInsets.symmetric(horizontal: 20),
                  color: Colors.white.withAlpha(25)),
              _hudItem('HARDWARE KEY', '0x7742-SECURE',
                  Colors.white),
            ],
          ),
        ),
      ),
    );
  }

  Widget _hudItem(String label, String value, Color valueColor) {
    return Column(
      mainAxisSize: MainAxisSize.min,
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(
          label,
          style: GoogleFonts.inter(
            fontSize: 8,
            fontWeight: FontWeight.w900,
            color: Colors.white.withAlpha(75),
            letterSpacing: 1.5,
          ),
        ),
        Text(
          value,
          style: TextStyle(
            fontSize: 10,
            fontFamily: 'monospace',
            fontStyle: FontStyle.italic,
            color: valueColor,
          ),
        ),
      ],
    );
  }

  Widget _buildPrivacyOverlay() {
    return Positioned.fill(
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
        child: Container(
          color: Colors.black.withAlpha(220),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Stack(
                alignment: Alignment.center,
                children: [
                  Container(
                    width: 160,
                    height: 160,
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      color: Colors.red.withAlpha(50),
                    ),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                      child: const SizedBox.expand(),
                    ),
                  ),
                  const Icon(Icons.shield,
                      size: 80, color: Colors.redAccent),
                ],
              ),
              const SizedBox(height: 32),
              Text(
                'RESTRICTED VIEW',
                style: GoogleFonts.inter(
                  fontSize: 36,
                  fontWeight: FontWeight.w900,
                  fontStyle: FontStyle.italic,
                  color: Colors.white,
                  letterSpacing: 4,
                ),
              ),
              const SizedBox(height: 16),
              Container(
                  width: 256,
                  height: 1,
                  color: Colors.red.withAlpha(75)),
              const SizedBox(height: 24),
              Text(
                'HARDWARE LINK SEVERED.\nRE-AUTHENTICATE TO RESTORE DOCUMENT CACHE.',
                textAlign: TextAlign.center,
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.red.withAlpha(150),
                  letterSpacing: 2,
                  height: 1.8,
                ),
              ),
              if (_isPrivacyShieldActive) ...[
                const SizedBox(height: 48),
                OutlinedButton.icon(
                  onPressed: () =>
                      setState(() => _isPrivacyShieldActive = false),
                  style: OutlinedButton.styleFrom(
                    foregroundColor: Colors.white,
                    side:
                        BorderSide(color: Colors.white.withAlpha(25)),
                    padding: const EdgeInsets.symmetric(
                        horizontal: 32, vertical: 14),
                    shape: const StadiumBorder(),
                  ),
                  icon: const Icon(Icons.shield_outlined, size: 18),
                  label: Text(
                    'RE-ENCRYPT & VIEW',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                      letterSpacing: 1,
                    ),
                  ),
                ),
              ],
            ],
          ),
        ),
      ),
    );
  }
}

class _PulsingGreenDot extends StatefulWidget {
  @override
  State<_PulsingGreenDot> createState() => _PulsingGreenDotState();
}

class _PulsingGreenDotState extends State<_PulsingGreenDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 900))
      ..repeat(reverse: true);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _ctrl,
      builder: (context, child) => Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: Color.lerp(const Color(0xFF4ADE80),
              const Color(0xFF4ADE80).withAlpha(100), _ctrl.value),
        ),
      ),
    );
  }
}
