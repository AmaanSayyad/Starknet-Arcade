import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:starknet_arcade_mobile/screens/splash_screen.dart';
import 'package:starknet_arcade_mobile/providers/wallet_provider.dart';

void main() {
  runApp(
    const ProviderScope(
      child: StarknetArcadeApp(),
    ),
  );
}

class StarknetArcadeApp extends ConsumerWidget {
  const StarknetArcadeApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    return MaterialApp(
      title: 'Starknet Arcade',
      debugShowCheckedModeBanner: false,
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF6E56CF),
          brightness: Brightness.dark,
          background: const Color(0xFF0A0A0D),
          surface: const Color(0xFF1A1A23),
        ),
        scaffoldBackgroundColor: const Color(0xFF0A0A0D),
        textTheme: GoogleFonts.interTextTheme(
          ThemeData.dark().textTheme,
        ),
        useMaterial3: true,
        appBarTheme: const AppBarTheme(
          backgroundColor: Colors.transparent,
          elevation: 0,
          centerTitle: true,
        ),
        elevatedButtonTheme: ElevatedButtonThemeData(
          style: ElevatedButton.styleFrom(
            foregroundColor: Colors.white,
            backgroundColor: const Color(0xFF6E56CF),
            elevation: 0,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            padding: const EdgeInsets.symmetric(
              horizontal: 24,
              vertical: 16,
            ),
          ),
        ),
        cardTheme: CardTheme(
          color: const Color(0xFF1A1A23),
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(16),
            side: const BorderSide(
              color: Color(0xFF2A2A35),
              width: 1,
            ),
          ),
          elevation: 0,
        ),
      ),
      home: const SplashScreen(),
    );
  }
} 