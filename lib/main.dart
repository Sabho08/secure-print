import 'package:flutter/material.dart';
import 'package:forui/forui.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'login_screen.dart';
import 'shared.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Initialize Supabase
  await Supabase.initialize(
    url: kSupabaseUrl,
    anonKey: kSupabaseAnonKey,
  );
  
  runApp(const Application());
}

class Application extends StatelessWidget {
  const Application({super.key});

  @override
  Widget build(BuildContext context) {
    final fTheme = FThemes.neutral.light;

    return MaterialApp(
      title: 'SecurePrint',
      debugShowCheckedModeBanner: false,
      supportedLocales: FLocalizations.supportedLocales,
      localizationsDelegates: FLocalizations.localizationsDelegates,
      theme: fTheme.toApproximateMaterialTheme().copyWith(
            textTheme: GoogleFonts.interTextTheme(
                fTheme.toApproximateMaterialTheme().textTheme),
          ),
      builder: (context, child) => FTheme(
        data: fTheme,
        child: FToaster(
          child: FTooltipGroup(child: child!),
        ),
      ),
      // Start on Login screen — navigates to Dashboard after auth
      home: const LoginScreen(),
    );
  }
}
