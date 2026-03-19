import 'dart:convert';
import 'dart:io';
import 'dart:typed_data';
import 'dart:ui';

import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:http/http.dart' as http;
import 'package:path_provider/path_provider.dart';

import 'shared.dart';
import 'secure_viewer_screen.dart';

import 'relay_service.dart';

class DashboardScreen extends StatefulWidget {
  const DashboardScreen({super.key});

  @override
  State<DashboardScreen> createState() => _DashboardScreenState();
}

class _DashboardScreenState extends State<DashboardScreen> {
  // Real-time progress tracking
  double? _streamingProgress;
  String? _streamingFileName;

  final List<PrintJob> _jobs = [
    PrintJob(
      id: '1',
      filename: 'Invoice_March2026.pdf',
      timestamp: '10:24 AM',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _initRelay();
  }

  void _initRelay() {
    final relay = RelayService();
    relay.onProgress = (name, progress) {
      setState(() {
        _streamingFileName = name;
        _streamingProgress = progress;
      });
    };

    relay.onComplete = (name, data) async {
      // Save the streamed data to a temporary file for the viewer
      final dir = await getTemporaryDirectory();
      final file = File('${dir.path}/$name');
      await file.writeAsBytes(data);

      setState(() {
        final newJob = PrintJob(
          id: DateTime.now().millisecondsSinceEpoch.toString(),
          filename: name,
          timestamp: 'Just now',
          filePath: file.path,
        );
        _jobs.insert(0, newJob);
        _streamingProgress = null;
        _streamingFileName = null;
      });
      
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Received new document: $name'),
            backgroundColor: kBlue,
          ),
        );
      }
    };

    // Connect using our demo shop code
    relay.connect('SHOP-7742');
  }

  bool _isLoadingDemo = false;
  PrintJob? _selectedJob;
  Uint8List? _demoBytes;

  Future<void> _openJob(PrintJob job) async {
    setState(() => _isLoadingDemo = true);
    try {
      Uint8List? bytes;
      if (job.filePath != null) {
        bytes = await File(job.filePath!).readAsBytes();
      } else {
        // Load demo PDF from the internet
        if (_demoBytes == null) {
          final response = await http.get(Uri.parse(
              'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf'));
          if (response.statusCode == 200) {
            _demoBytes = response.bodyBytes;
          } else {
            _demoBytes = base64Decode(
                "JVBERi0xLjQKJcOkw7zDtsOfCjEgMCBvYmoKPDwgL1R5cGUgL0NhdGFsb2cgL1BhZ2VzIDIgMCBSID4+CmVuZG9iagoyIDAgb2JqCjw8IC9UeXBlIC9QYWdlcyAvS2lkcyBbIDMgMCBSIF0gL0NvdW50IDEgPj4KZW5kb2JqCjMgMCBvYmoKPDwgL1R5cGUgL1BhZ2UgL1BhcmVudCAyIDAgUiAvUmVzb3VyY2VzIDwgPiAvTWVkaWFCb3ggWyAwIDAgNTk1IDg0MiBdIC9Db250ZW50cyA0IDAgUiA+PgplbmRvYmoKNCAwIG9iago8PCAvTGVuZ3RoIDAgPj4Kc3RyZWFtCgplbmRzdHJlYW0KZW5kb2JqCnhyZWYKMCA1CjAwMDAwMDAwMDAgNjU1MzUgZiAKMDAwMDAwMDAxNSAwMDAwMCBuIAowMDAwMDAwMDY4IDAwMDAwIG4gCjAwMDAwMDAxMjUgMDAwMDAgbiAKMDAwMDAwMDIyMiAwMDAwMCBuIAp0cmFpbGVyCjw8IC9TaXplIDUgL1Jvb3QgMSAwIFIgPj4Kc3RhcnR4cmVmCjI3MQolJUVPRgo=");
          }
        }
        bytes = _demoBytes;
      }

      // Save to temp
      final dir = await getTemporaryDirectory();
      final tempFile = File('${dir.path}/${job.id}_${job.filename}');
      await tempFile.writeAsBytes(bytes!);

      if (mounted) {
        setState(() {
          _isLoadingDemo = false;
          _selectedJob = job;
        });
        await Navigator.of(context).push(
          PageRouteBuilder(
            opaque: false,
            pageBuilder: (context, animation, secondaryAnimation) => SecureViewerScreen(
              job: _selectedJob!,
              pdfPath: tempFile.path,
              onPrintSuccess: () {
                setState(() => _selectedJob!.status = 'printed');
                Navigator.of(context).pop();
              },
              onClose: () => Navigator.of(context).pop(),
            ),
            transitionsBuilder: (context, animation, secondaryAnimation, child) =>
                FadeTransition(opacity: animation, child: child),
          ),
        );
      }
    } catch (e) {
      setState(() => _isLoadingDemo = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Error: $e')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    final pending = _jobs.where((j) => j.status == 'pending').toList();
    final finished = _jobs.where((j) => j.status == 'printed').toList();

    return Container(
      color: const Color(0xFFF3F4F6),
      child: SingleChildScrollView(
        padding: const EdgeInsets.fromLTRB(32, 32, 32, 32),
        child: ConstrainedBox(
          constraints: const BoxConstraints(maxWidth: 1200),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              _buildHeader(),
              const SizedBox(height: 24),

              // Streaming Indicator
              if (_streamingProgress != null)
                Container(
                  padding: const EdgeInsets.all(24),
                  margin: const EdgeInsets.only(bottom: 24),
                  decoration: BoxDecoration(
                    color: kBlue.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(24),
                    border: Border.all(color: kBlue.withOpacity(0.2)),
                  ),
                  child: Row(
                    children: [
                      Container(
                        width: 48,
                        height: 48,
                        decoration: const BoxDecoration(
                            color: Colors.white, shape: BoxShape.circle),
                        child: const Center(
                          child: CircularProgressIndicator(
                            strokeWidth: 3,
                            color: kBlue,
                          ),
                        ),
                      ),
                      const SizedBox(width: 20),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              'Incoming Air-Transfer...',
                              style: GoogleFonts.inter(
                                fontSize: 13,
                                fontWeight: FontWeight.w800,
                                color: kBlue,
                                letterSpacing: 0.5,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              _streamingFileName ?? 'Document',
                              style: GoogleFonts.inter(
                                fontSize: 16,
                                fontWeight: FontWeight.w700,
                                color: Colors.grey.shade900,
                              ),
                            ),
                          ],
                        ),
                      ),
                      const SizedBox(width: 40),
                      Text(
                        '${(_streamingProgress! * 100).toInt()}%',
                        style: GoogleFonts.inter(
                          fontSize: 20,
                          fontWeight: FontWeight.w900,
                          color: kBlue,
                        ),
                      ),
                    ],
                  ),
                ),

              const SizedBox(height: 16),

              // Main 3-col grid (wrapped for responsiveness)
              LayoutBuilder(
                builder: (context, constraints) {
                  final isWide = constraints.maxWidth > 700;
                  if (isWide) {
                    return Row(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Expanded(
                          flex: 2,
                          child: _buildQueue(pending),
                        ),
                        const SizedBox(width: 32),
                        SizedBox(
                          width: 280,
                          child: _buildSidebar(finished),
                        ),
                      ],
                    );
                  }
                  return Column(
                    children: [
                      _buildQueue(pending),
                      const SizedBox(height: 32),
                      _buildSidebar(finished),
                    ],
                  );
                },
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      crossAxisAlignment: CrossAxisAlignment.end,
      children: [
        Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                Container(
                  width: 32,
                  height: 32,
                  decoration: BoxDecoration(
                    color: Colors.black,
                    borderRadius: BorderRadius.circular(6),
                  ),
                  child: const Center(
                    child: Text('SP',
                        style: TextStyle(
                            color: Colors.white,
                            fontSize: 11,
                            fontWeight: FontWeight.w900)),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  'SECUREPRINT DASHBOARD',
                  style: GoogleFonts.inter(
                    fontSize: 18,
                    fontWeight: FontWeight.w900,
                    fontStyle: FontStyle.italic,
                    letterSpacing: -0.5,
                    color: Colors.grey.shade900,
                  ),
                ),
              ],
            ),
            const SizedBox(height: 6),
            RichText(
              text: TextSpan(
                style: GoogleFonts.inter(
                    fontSize: 14, color: Colors.grey.shade500),
                children: [
                  const TextSpan(text: 'Shop Terminal ID: '),
                  TextSpan(
                    text: 'SHOP-7742',
                    style: const TextStyle(
                        color: Colors.black, fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ),
          ],
        ),

        // Live connection badge
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(12),
            border: Border.all(color: Colors.grey.shade200),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withAlpha(10),
                  blurRadius: 8,
                  offset: const Offset(0, 2))
            ],
          ),
          child: Row(
            children: [
              _PulsingDot(color: const Color(0xFF22C55E)),
              const SizedBox(width: 10),
              Text(
                'LIVE CONNECTION',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Colors.grey.shade500,
                  letterSpacing: 1.2,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildQueue(List<PrintJob> pending) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Row(
          children: [
            Text(
              'Print Queue',
              style: GoogleFonts.inter(
                fontSize: 22,
                fontWeight: FontWeight.w700,
                color: Colors.grey.shade900,
              ),
            ),
            const SizedBox(width: 10),
            Container(
              padding:
                  const EdgeInsets.symmetric(horizontal: 10, vertical: 4),
              decoration: BoxDecoration(
                color: kBlue,
                borderRadius: BorderRadius.circular(999),
              ),
              child: Text(
                '${pending.length}',
                style: GoogleFonts.inter(
                  fontSize: 11,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
            ),
          ],
        ),
        const SizedBox(height: 20),

        if (pending.isEmpty)
          _emptyQueue()
        else
          ...pending.map((job) => Padding(
                padding: const EdgeInsets.only(bottom: 16),
                child: _jobCard(job),
              )),
      ],
    );
  }

  Widget _emptyQueue() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.symmetric(vertical: 80),
      decoration: BoxDecoration(
        color: Colors.white.withAlpha(130),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(
            color: Colors.grey.shade200, width: 2,
            style: BorderStyle.solid),
      ),
      child: Column(
        children: [
          Icon(Icons.watch_later_outlined,
              size: 40, color: Colors.grey.shade300),
          const SizedBox(height: 12),
          Text(
            'Waiting for incoming jobs...',
            style: GoogleFonts.inter(
                fontSize: 14, color: Colors.grey.shade400),
          ),
        ],
      ),
    );
  }

  Widget _jobCard(PrintJob job) {
    return AnimatedContainer(
      duration: const Duration(milliseconds: 200),
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: Colors.grey.shade100),
        boxShadow: [
          BoxShadow(
              color: Colors.black.withAlpha(8),
              blurRadius: 16,
              offset: const Offset(0, 4))
        ],
      ),
      child: Row(
        children: [
          Container(
            width: 56,
            height: 56,
            decoration: BoxDecoration(
              color: Colors.grey.shade50,
              borderRadius: BorderRadius.circular(16),
            ),
            child:
                Icon(Icons.print, color: Colors.grey.shade400, size: 28),
          ),
          const SizedBox(width: 20),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  job.filename,
                  style: GoogleFonts.inter(
                    fontSize: 16,
                    fontWeight: FontWeight.w700,
                    color: Colors.grey.shade900,
                  ),
                ),
                const SizedBox(height: 4),
                Row(
                  children: [
                    Icon(Icons.schedule,
                        size: 12, color: Colors.grey.shade400),
                    const SizedBox(width: 4),
                    Text(job.timestamp,
                        style: GoogleFonts.inter(
                            fontSize: 12, color: Colors.grey.shade400)),
                    const SizedBox(width: 12),
                    Icon(Icons.shield_outlined, size: 12, color: kBlue),
                    const SizedBox(width: 4),
                    Text(
                      'ENCRYPTED',
                      style: GoogleFonts.inter(
                        fontSize: 11,
                        fontWeight: FontWeight.w700,
                        color: kBlue,
                        letterSpacing: 0.5,
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
          const SizedBox(width: 16),
          _isLoadingDemo
              ? const SizedBox(
                  width: 24,
                  height: 24,
                  child: CircularProgressIndicator(
                      strokeWidth: 2, color: kBlue))
              : ElevatedButton(
                  onPressed: () => _openJob(job),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.black,
                    foregroundColor: Colors.white,
                    padding: const EdgeInsets.symmetric(
                        horizontal: 24, vertical: 12),
                    shape: const StadiumBorder(),
                    elevation: 0,
                  ),
                  child: Text(
                    'Process & Print',
                    style: GoogleFonts.inter(
                      fontSize: 13,
                      fontWeight: FontWeight.w700,
                    ),
                  ),
                ),
        ],
      ),
    );
  }

  Widget _buildSidebar(List<PrintJob> finished) {
    return Column(
      children: [
        // Terminal Health card (dark)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.black,
            borderRadius: BorderRadius.circular(40),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withAlpha(50),
                  blurRadius: 32,
                  offset: const Offset(0, 8))
            ],
          ),
          child: Stack(
            children: [
              Positioned(
                top: -10,
                right: -10,
                child: Opacity(
                  opacity: 0.08,
                  child: Icon(Icons.shield_outlined,
                      size: 100, color: Colors.white),
                ),
              ),
              Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(
                    'Terminal Health',
                    style: GoogleFonts.inter(
                      fontSize: 18,
                      fontWeight: FontWeight.w700,
                      color: Colors.white,
                    ),
                  ),
                  const SizedBox(height: 24),
                  _healthRow('Memory Buffer', 'Clear',
                      const Color(0xFF4ADE80)),
                  _divider(),
                  _healthRow(
                      'Disk Cache', 'Disabled', const Color(0xFF60A5FA)),
                  _divider(),
                  _healthRow(
                      'Auth Level', 'Level 4', const Color(0xFFA78BFA)),
                ],
              ),
            ],
          ),
        ),
        const SizedBox(height: 24),

        // Daily History card (light)
        Container(
          width: double.infinity,
          padding: const EdgeInsets.all(32),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(40),
            border: Border.all(color: Colors.grey.shade100),
            boxShadow: [
              BoxShadow(
                  color: Colors.black.withAlpha(8),
                  blurRadius: 16,
                  offset: const Offset(0, 4))
            ],
          ),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  const Icon(Icons.task_alt,
                      size: 18, color: Color(0xFF22C55E)),
                  const SizedBox(width: 8),
                  Text(
                    'Daily History',
                    style: GoogleFonts.inter(
                      fontWeight: FontWeight.w700,
                      color: Colors.grey.shade900,
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 16),
              if (finished.isEmpty)
                Text(
                  'No files processed yet today.',
                  style: GoogleFonts.inter(
                    fontSize: 12,
                    fontStyle: FontStyle.italic,
                    color: Colors.grey.shade400,
                  ),
                )
              else
                ConstrainedBox(
                  constraints: const BoxConstraints(maxHeight: 200),
                  child: SingleChildScrollView(
                  child: Column(
                    children: [
                      for (var job in finished)
                        Padding(
                          padding: const EdgeInsets.symmetric(vertical: 8),
                          child: Row(
                            mainAxisAlignment: MainAxisAlignment.spaceBetween,
                            children: [
                              Expanded(
                                child: Text(
                                  job.filename,
                                  overflow: TextOverflow.ellipsis,
                                  style: GoogleFonts.inter(
                                    fontSize: 11,
                                    color: Colors.grey.shade500,
                                  ),
                                ),
                              ),
                              Text(
                                'SHREDDED ✓',
                                style: const TextStyle(
                                  fontFamily: 'monospace',
                                  fontSize: 10,
                                  color: Color(0xFF9CA3AF),
                                ),
                              ),
                            ],
                          ),
                        ),
                    ],
                  ),),
                ),
            ],
          ),
        ),
      ],
    );
  }

  Widget _healthRow(String label, String value, Color valueColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(
            label,
            style: GoogleFonts.inter(
              fontSize: 13,
              fontStyle: FontStyle.italic,
              color: Colors.white.withAlpha(150),
            ),
          ),
          Text(
            value,
            style: const TextStyle(
              fontSize: 13,
              fontFamily: 'monospace',
              color: Color(0xFF4ADE80),
            ),
          ),
        ],
      ),
    );
  }

  Widget _divider() {
    return Divider(color: Colors.white.withAlpha(25), height: 1);
  }
}

/// A pulsing dot indicator
class _PulsingDot extends StatefulWidget {
  final Color color;
  const _PulsingDot({required this.color});

  @override
  State<_PulsingDot> createState() => _PulsingDotState();
}

class _PulsingDotState extends State<_PulsingDot>
    with SingleTickerProviderStateMixin {
  late AnimationController _ctrl;
  late Animation<double> _anim;

  @override
  void initState() {
    super.initState();
    _ctrl = AnimationController(
        vsync: this, duration: const Duration(milliseconds: 1000))
      ..repeat(reverse: true);
    _anim = CurvedAnimation(parent: _ctrl, curve: Curves.easeInOut);
  }

  @override
  void dispose() {
    _ctrl.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return AnimatedBuilder(
      animation: _anim,
      builder: (context, child) => Container(
        width: 8,
        height: 8,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: widget.color.withAlpha(((_anim.value * 100) + 155).toInt()),
        ),
      ),
    );
  }
}
