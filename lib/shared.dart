import 'dart:ui';
import 'package:flutter/widgets.dart';

const kBlue = Color(0xFF409FFF);

// --- SUPABASE CONFIGURATION ---
// Replace these with your actual keys from Supabase Dashboard -> Settings -> API
const kSupabaseUrl = 'https://ntmbkkxmjekuppqxqxdl.supabase.co';
const kSupabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im50bWJra3htamVrdXBwcXhxeGRsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MjEzNjIsImV4cCI6MjA4OTQ5NzM2Mn0.HtZDsdFRBN3wS4EKA7VAIjS79lB9Y1Vgg97R9e0-HKU';

class PrintJob {
  final String id;
  final String filename;
  final String timestamp;
  String status; // 'pending' | 'printed'
  final String? filePath;

  PrintJob({
    required this.id,
    required this.filename,
    required this.timestamp,
    this.status = 'pending',
    this.filePath,
  });
}

class BlockIntent extends Intent {
  const BlockIntent();
}
