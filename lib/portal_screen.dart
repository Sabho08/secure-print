import 'dart:io';
import 'dart:ui';

import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

import 'shared.dart';

class PortalScreen extends StatefulWidget {
  const PortalScreen({super.key});

  @override
  State<PortalScreen> createState() => _PortalScreenState();
}

class _PortalScreenState extends State<PortalScreen>
    with SingleTickerProviderStateMixin {
  // 'select' | 'ready' | 'uploading' | 'done'
  String _stage = 'select';
  File? _file;
  String _fileName = '';
  double _fileSize = 0;

  late AnimationController _fadeCtrl;
  late Animation<double> _fadeAnim;

  @override
  void initState() {
    super.initState();
    _fadeCtrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 350));
    _fadeAnim = CurvedAnimation(parent: _fadeCtrl, curve: Curves.easeOut);
    _fadeCtrl.forward();
  }

  @override
  void dispose() {
    _fadeCtrl.dispose();
    super.dispose();
  }

  void _goToStage(String stage) {
    _fadeCtrl.reverse().then((_) {
      setState(() => _stage = stage);
      _fadeCtrl.forward();
    });
  }

  Future<void> _pickFile() async {
    final result = await FilePicker.platform.pickFiles(
      type: FileType.custom,
      allowedExtensions: ['pdf'],
    );
    if (result != null && result.files.single.path != null) {
      _file = File(result.files.single.path!);
      _fileName = result.files.single.name;
      _fileSize = (_file!.lengthSync()) / (1024 * 1024);
      _goToStage('ready');
    }
  }

  Future<void> _upload() async {
    _goToStage('uploading');
    await Future.delayed(const Duration(seconds: 2));
    _goToStage('done');
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      height: double.infinity,
      color: const Color(0xFFF7F9FA),
      child: Stack(
        children: [
          // Background blobs
          Positioned(
            top: -120,
            left: -120,
            child: _blob(400, kBlue.withAlpha(25)),
          ),
          Positioned(
            bottom: -100,
            right: -100,
            child: _blob(300, Colors.purple.withAlpha(20)),
          ),

          // Centered card
          Center(
            child: FadeTransition(
              opacity: _fadeAnim,
              child: _buildCard(),
            ),
          ),

          // Bottom-left headline (shown on large screens)
          Positioned(
            bottom: 40,
            left: 40,
            child: _buildHeadline(),
          ),
        ],
      ),
    );
  }

  Widget _blob(double size, Color color) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color,
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 80, sigmaY: 80),
        child: const SizedBox.expand(),
      ),
    );
  }

  Widget _buildCard() {
    return Container(
      width: 320,
      padding: const EdgeInsets.all(32),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(32),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withAlpha(25),
            blurRadius: 64,
            offset: const Offset(0, 24),
          ),
        ],
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // Header row
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: const BoxDecoration(
                  color: kBlue,
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.upload, color: Colors.white, size: 24),
              ),
              Text(
                'SecurePrint',
                style: GoogleFonts.inter(
                  fontSize: 13,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey.shade400,
                ),
              ),
            ],
          ),
          const SizedBox(height: 24),

          // Content area (animated stages)
          AnimatedSwitcher(
            duration: const Duration(milliseconds: 250),
            child: _buildStageContent(),
          ),

          const SizedBox(height: 24),

          // Footer info
          Container(
            padding: const EdgeInsets.only(top: 16),
            decoration: BoxDecoration(
              border: Border(
                top: BorderSide(color: Colors.grey.shade100),
              ),
            ),
            child: Row(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Icon(Icons.info_outline,
                    size: 12, color: Colors.grey.shade400),
                const SizedBox(width: 6),
                Expanded(
                  child: Text(
                    'Files are stored temporarily and encrypted. Zero-footprint guaranteed.',
                    style: GoogleFonts.inter(
                      fontSize: 10,
                      color: Colors.grey.shade400,
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildStageContent() {
    switch (_stage) {
      case 'select':
        return _buildSelectStage();
      case 'ready':
        return _buildReadyStage();
      case 'uploading':
        return _buildUploadingStage();
      case 'done':
        return _buildDoneStage();
      default:
        return const SizedBox();
    }
  }

  Widget _buildSelectStage() {
    return GestureDetector(
      key: const ValueKey('select'),
      onTap: _pickFile,
      child: MouseRegion(
        cursor: SystemMouseCursors.click,
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 48),
          decoration: BoxDecoration(
            color: Colors.transparent,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: Colors.grey.shade200,
              width: 2,
              style: BorderStyle.solid,
            ),
          ),
          child: Column(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: Colors.grey.shade100,
                  shape: BoxShape.circle,
                ),
                child:
                    Icon(Icons.upload, color: Colors.grey.shade400, size: 20),
              ),
              const SizedBox(height: 16),
              Text(
                'Add your files',
                style: GoogleFonts.inter(
                  fontSize: 18,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey.shade900,
                ),
              ),
              const SizedBox(height: 4),
              Text(
                'PDF up to 10MB',
                style: GoogleFonts.inter(
                  fontSize: 12,
                  color: Colors.grey.shade400,
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildReadyStage() {
    return Column(
      key: const ValueKey('ready'),
      children: [
        // File row
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            color: Colors.grey.shade50,
            borderRadius: BorderRadius.circular(12),
          ),
          child: Row(
            children: [
              Container(
                width: 40,
                height: 40,
                decoration: BoxDecoration(
                  color: kBlue.withAlpha(25),
                  borderRadius: BorderRadius.circular(8),
                ),
                child:
                    const Icon(Icons.description, color: kBlue, size: 20),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      _fileName,
                      overflow: TextOverflow.ellipsis,
                      style: GoogleFonts.inter(
                        fontSize: 13,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    Text(
                      '${_fileSize.toStringAsFixed(2)} MB  •  Ready',
                      style: GoogleFonts.inter(
                        fontSize: 10,
                        color: Colors.grey.shade400,
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 20),

        // Transfer button
        SizedBox(
          width: double.infinity,
          child: ElevatedButton(
            onPressed: _upload,
            style: ElevatedButton.styleFrom(
              backgroundColor: kBlue,
              foregroundColor: Colors.white,
              padding: const EdgeInsets.symmetric(vertical: 16),
              shape: const StadiumBorder(),
              elevation: 0,
              shadowColor: kBlue.withAlpha(80),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                const Icon(Icons.upload, size: 18),
                const SizedBox(width: 8),
                Text(
                  'Transfer to Shop',
                  style: GoogleFonts.inter(
                    fontSize: 14,
                    fontWeight: FontWeight.w700,
                  ),
                ),
              ],
            ),
          ),
        ),
        const SizedBox(height: 12),

        // Cancel
        TextButton(
          onPressed: () => _goToStage('select'),
          child: Text(
            'CANCEL',
            style: GoogleFonts.inter(
              fontSize: 11,
              fontWeight: FontWeight.w700,
              color: Colors.grey.shade400,
              letterSpacing: 2,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildUploadingStage() {
    return Column(
      key: const ValueKey('uploading'),
      children: [
        const SizedBox(height: 32),
        const CircularProgressIndicator(
          color: kBlue,
          strokeWidth: 3,
        ),
        const SizedBox(height: 20),
        Text(
          'Uploading securely...',
          style: GoogleFonts.inter(
            fontSize: 14,
            fontWeight: FontWeight.w600,
            color: Colors.grey.shade600,
          ),
        ),
        const SizedBox(height: 32),
      ],
    );
  }

  Widget _buildDoneStage() {
    return Column(
      key: const ValueKey('done'),
      children: [
        const SizedBox(height: 16),
        Container(
          width: 80,
          height: 80,
          decoration: const BoxDecoration(
            color: Color(0xFF22C55E),
            shape: BoxShape.circle,
          ),
          child: const Icon(Icons.check_circle,
              color: Colors.white, size: 40),
        ),
        const SizedBox(height: 16),
        Text(
          "You're done!",
          style: GoogleFonts.inter(
            fontSize: 22,
            fontWeight: FontWeight.w700,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 8),
        Text(
          'The shopkeeper has received your document for secure printing.',
          style: GoogleFonts.inter(
            fontSize: 13,
            color: Colors.grey.shade500,
          ),
          textAlign: TextAlign.center,
        ),
        const SizedBox(height: 24),
        TextButton(
          onPressed: () {
            setState(() {
              _file = null;
              _fileName = '';
            });
            _goToStage('select');
          },
          child: Text(
            'Send another file',
            style: GoogleFonts.inter(
              fontSize: 14,
              fontWeight: FontWeight.w700,
              color: kBlue,
            ),
          ),
        ),
        const SizedBox(height: 8),
      ],
    );
  }

  Widget _buildHeadline() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        RichText(
          text: TextSpan(
            style: GoogleFonts.inter(
              fontSize: 48,
              fontWeight: FontWeight.w900,
              color: Colors.grey.shade900,
              height: 1.1,
            ),
            children: [
              const TextSpan(text: 'SecurePrint\n'),
              TextSpan(
                text: 'Zero-Footprint.',
                style: TextStyle(color: kBlue),
              ),
            ],
          ),
        ),
        const SizedBox(height: 16),
        SizedBox(
          width: 380,
          child: Text(
            'Upload documents safely. We never save them to disk.\nOnce printed, they vanish forever.',
            style: GoogleFonts.inter(
              fontSize: 14,
              color: Colors.grey.shade400,
              height: 1.6,
            ),
          ),
        ),
      ],
    );
  }
}
