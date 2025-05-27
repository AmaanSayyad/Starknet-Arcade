import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:starknet_arcade_mobile/providers/wallet_provider.dart';
import 'package:starknet_arcade_mobile/screens/home_screen.dart';
import 'package:flutter_animate/flutter_animate.dart';

class WalletSetupScreen extends ConsumerStatefulWidget {
  const WalletSetupScreen({super.key});

  @override
  ConsumerState<WalletSetupScreen> createState() => _WalletSetupScreenState();
}

class _WalletSetupScreenState extends ConsumerState<WalletSetupScreen> {
  final TextEditingController _privateKeyController = TextEditingController();
  bool _isCreatingWallet = false;
  bool _isImportingWallet = false;
  String? _errorMessage;

  @override
  void dispose() {
    _privateKeyController.dispose();
    super.dispose();
  }

  Future<void> _createWallet() async {
    setState(() {
      _isCreatingWallet = true;
      _errorMessage = null;
    });

    try {
      await ref.read(walletProvider.notifier).createWallet();
      
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to create wallet: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isCreatingWallet = false;
        });
      }
    }
  }

  Future<void> _importWallet() async {
    if (_privateKeyController.text.isEmpty) {
      setState(() {
        _errorMessage = 'Please enter a private key';
      });
      return;
    }

    setState(() {
      _isImportingWallet = true;
      _errorMessage = null;
    });

    try {
      await ref.read(walletProvider.notifier).importWallet(_privateKeyController.text);
      
      if (mounted) {
        Navigator.of(context).pushReplacement(
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Failed to import wallet: ${e.toString()}';
      });
    } finally {
      if (mounted) {
        setState(() {
          _isImportingWallet = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Wallet Setup'),
      ),
      body: SingleChildScrollView(
        child: Padding(
          padding: const EdgeInsets.all(24.0),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              // Header
              Container(
                padding: const EdgeInsets.symmetric(vertical: 32),
                child: Column(
                  children: [
                    Icon(
                      Icons.account_balance_wallet,
                      size: 64,
                      color: Theme.of(context).colorScheme.primary,
                    ).animate()
                      .fadeIn(duration: 500.ms)
                      .scale(delay: 200.ms),
                    const SizedBox(height: 16),
                    Text(
                      'Set Up Your Starknet Wallet',
                      style: Theme.of(context).textTheme.headlineSmall?.copyWith(
                        fontWeight: FontWeight.bold,
                      ),
                      textAlign: TextAlign.center,
                    ),
                    const SizedBox(height: 8),
                    Text(
                      'Create a new wallet or import an existing one to start playing games on Starknet',
                      style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                        color: Colors.white70,
                      ),
                      textAlign: TextAlign.center,
                    ),
                  ],
                ),
              ).animate()
                .fadeIn(duration: 500.ms)
                .moveY(begin: 20, end: 0, duration: 500.ms, curve: Curves.easeOutQuad),

              const SizedBox(height: 32),
              
              // Create Wallet Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.add_circle_outline,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Create New Wallet',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Generate a new Starknet wallet to use with Starknet Arcade. This will create a new account for you on the Starknet network.',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _isCreatingWallet ? null : _createWallet,
                        child: _isCreatingWallet
                            ? const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                      valueColor: AlwaysStoppedAnimation<Color>(Colors.white),
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  Text('Creating Wallet...'),
                                ],
                              )
                            : const Text('Create New Wallet'),
                      ),
                    ],
                  ),
                ),
              ).animate()
                .fadeIn(delay: 200.ms, duration: 500.ms)
                .moveY(begin: 20, end: 0, delay: 200.ms, duration: 500.ms, curve: Curves.easeOutQuad),

              const SizedBox(height: 24),

              // Import Wallet Card
              Card(
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      Row(
                        children: [
                          Icon(
                            Icons.file_download_outlined,
                            color: Theme.of(context).colorScheme.primary,
                          ),
                          const SizedBox(width: 12),
                          Text(
                            'Import Existing Wallet',
                            style: Theme.of(context).textTheme.titleMedium?.copyWith(
                              fontWeight: FontWeight.bold,
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 16),
                      Text(
                        'Already have a Starknet wallet? Import it using your private key to access your existing account.',
                        style: Theme.of(context).textTheme.bodyMedium?.copyWith(
                          color: Colors.white70,
                        ),
                      ),
                      const SizedBox(height: 24),
                      TextFormField(
                        controller: _privateKeyController,
                        decoration: InputDecoration(
                          labelText: 'Private Key',
                          hintText: 'Enter your Starknet private key',
                          border: OutlineInputBorder(
                            borderRadius: BorderRadius.circular(12),
                          ),
                          filled: true,
                          fillColor: Colors.grey.shade900,
                        ),
                        obscureText: true,
                        style: const TextStyle(fontFamily: 'monospace'),
                      ),
                      const SizedBox(height: 24),
                      ElevatedButton(
                        onPressed: _isImportingWallet ? null : _importWallet,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.transparent,
                          foregroundColor: Theme.of(context).colorScheme.primary,
                          side: BorderSide(
                            color: Theme.of(context).colorScheme.primary,
                          ),
                        ),
                        child: _isImportingWallet
                            ? const Row(
                                mainAxisSize: MainAxisSize.min,
                                children: [
                                  SizedBox(
                                    width: 20,
                                    height: 20,
                                    child: CircularProgressIndicator(
                                      strokeWidth: 2,
                                    ),
                                  ),
                                  SizedBox(width: 12),
                                  Text('Importing Wallet...'),
                                ],
                              )
                            : const Text('Import Wallet'),
                      ),
                    ],
                  ),
                ),
              ).animate()
                .fadeIn(delay: 400.ms, duration: 500.ms)
                .moveY(begin: 20, end: 0, delay: 400.ms, duration: 500.ms, curve: Curves.easeOutQuad),

              // Error message
              if (_errorMessage != null) ...[
                const SizedBox(height: 24),
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: Colors.red.shade900.withOpacity(0.3),
                    borderRadius: BorderRadius.circular(12),
                    border: Border.all(color: Colors.red.shade800),
                  ),
                  child: Text(
                    _errorMessage!,
                    style: const TextStyle(color: Colors.white),
                  ),
                ).animate()
                  .fadeIn(duration: 300.ms)
                  .shakeX(amount: 5, count: 3),
              ],
            ],
          ),
        ),
      ),
    );
  }
} 