import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:starknet_arcade_mobile/screens/home_screen.dart';
import 'package:starknet_arcade_mobile/screens/wallet_setup_screen.dart';
import 'package:starknet_arcade_mobile/providers/wallet_provider.dart';
import 'package:animated_text_kit/animated_text_kit.dart';
import 'package:flutter_animate/flutter_animate.dart';

class SplashScreen extends ConsumerStatefulWidget {
  const SplashScreen({super.key});

  @override
  ConsumerState<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends ConsumerState<SplashScreen> {
  @override
  void initState() {
    super.initState();
    _navigateToNextScreen();
  }

  void _navigateToNextScreen() async {
    // Wait for the animation to complete
    await Future.delayed(const Duration(seconds: 3));

    if (!mounted) return;

    final walletState = ref.read(walletProvider);
    if (walletState.isInitialized) {
      if (walletState.hasWallet) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } else {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const WalletSetupScreen()),
        );
      }
    } else {
      // If wallet is not yet initialized, wait a bit more
      await Future.delayed(const Duration(seconds: 1));
      if (mounted) {
        _navigateToNextScreen();
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Container(
        decoration: const BoxDecoration(
          gradient: LinearGradient(
            begin: Alignment.topCenter,
            end: Alignment.bottomCenter,
            colors: [
              Color(0xFF0A0A0D),
              Color(0xFF1A1A2F),
            ],
          ),
        ),
        child: Center(
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              // Logo
              Container(
                width: 120,
                height: 120,
                decoration: BoxDecoration(
                  color: const Color(0xFF6E56CF).withOpacity(0.2),
                  borderRadius: BorderRadius.circular(30),
                ),
                child: Center(
                  child: Icon(
                    Icons.sports_esports,
                    size: 60,
                    color: Colors.white,
                  ).animate()
                    .fadeIn(duration: 500.ms)
                    .scale(delay: 200.ms),
                ),
              ).animate()
                .fadeIn(duration: 600.ms)
                .moveY(begin: 20, end: 0, delay: 300.ms, curve: Curves.easeOutQuad),
              
              const SizedBox(height: 24),
              
              // App Name
              DefaultTextStyle(
                style: const TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
                child: AnimatedTextKit(
                  animatedTexts: [
                    TypewriterAnimatedText(
                      'Starknet Arcade',
                      speed: const Duration(milliseconds: 150),
                    ),
                  ],
                  totalRepeatCount: 1,
                ),
              ),
              
              const SizedBox(height: 8),
              
              // Tagline
              Text(
                'Games powered by Starknet',
                style: TextStyle(
                  fontSize: 16,
                  color: Colors.white.withOpacity(0.7),
                ),
              ).animate()
                .fadeIn(delay: 1000.ms, duration: 500.ms),
              
              const SizedBox(height: 48),
              
              // Loading indicator
              CircularProgressIndicator(
                valueColor: AlwaysStoppedAnimation<Color>(
                  Theme.of(context).colorScheme.primary,
                ),
              ).animate()
                .fadeIn(delay: 600.ms, duration: 500.ms),
            ],
          ),
        ),
      ),
    );
  }
} 