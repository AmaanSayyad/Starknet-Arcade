import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:starknet/starknet.dart';

class WalletState {
  final bool isInitialized;
  final bool hasWallet;
  final String? address;
  final String? publicKey;
  final Signer? signer;
  final Provider? provider;
  final Account? account;

  WalletState({
    this.isInitialized = false,
    this.hasWallet = false,
    this.address,
    this.publicKey,
    this.signer,
    this.provider,
    this.account,
  });

  WalletState copyWith({
    bool? isInitialized,
    bool? hasWallet,
    String? address,
    String? publicKey,
    Signer? signer,
    Provider? provider,
    Account? account,
  }) {
    return WalletState(
      isInitialized: isInitialized ?? this.isInitialized,
      hasWallet: hasWallet ?? this.hasWallet,
      address: address ?? this.address,
      publicKey: publicKey ?? this.publicKey,
      signer: signer ?? this.signer,
      provider: provider ?? this.provider,
      account: account ?? this.account,
    );
  }
}

class WalletNotifier extends StateNotifier<WalletState> {
  final FlutterSecureStorage _secureStorage = const FlutterSecureStorage();
  final String _privateKeyKey = 'starknet_arcade_private_key';
  final String _addressKey = 'starknet_arcade_address';

  WalletNotifier() : super(WalletState()) {
    initializeWallet();
  }

  Future<void> initializeWallet() async {
    try {
      final provider = JsonRpcProvider(nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia');
      final privateKey = await _secureStorage.read(key: _privateKeyKey);
      final address = await _secureStorage.read(key: _addressKey);

      if (privateKey != null && address != null) {
        final signer = Signer.fromPrivate(privateKey);
        final account = Account(
          provider: provider,
          address: address,
          signer: signer,
          chainId: StarknetChainId.sepolia,
        );

        state = state.copyWith(
          isInitialized: true,
          hasWallet: true,
          address: address,
          publicKey: signer.publicKey,
          signer: signer,
          provider: provider,
          account: account,
        );
      } else {
        state = state.copyWith(
          isInitialized: true,
          hasWallet: false,
          provider: provider,
        );
      }
    } catch (e) {
      print('Error initializing wallet: $e');
      state = state.copyWith(
        isInitialized: true,
        hasWallet: false,
      );
    }
  }

  Future<void> createWallet() async {
    try {
      final signer = Signer.createRandom();
      final privateKey = signer.privateKey;
      final publicKey = signer.publicKey;
      
      // In a real app, this would deploy a contract for the wallet
      // For demo purposes, we'll use a mock address
      final address = '0x${publicKey.substring(2).padLeft(64, '0')}';

      await _secureStorage.write(key: _privateKeyKey, value: privateKey);
      await _secureStorage.write(key: _addressKey, value: address);

      final provider = state.provider ?? JsonRpcProvider(nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia');
      
      final account = Account(
        provider: provider,
        address: address,
        signer: signer,
        chainId: StarknetChainId.sepolia,
      );

      state = state.copyWith(
        hasWallet: true,
        address: address,
        publicKey: publicKey,
        signer: signer,
        account: account,
      );
    } catch (e) {
      print('Error creating wallet: $e');
    }
  }

  Future<void> importWallet(String privateKey) async {
    try {
      final signer = Signer.fromPrivate(privateKey);
      final publicKey = signer.publicKey;
      
      // In a real app, this would look up the contract address for this key
      // For demo purposes, we'll derive it from the public key
      final address = '0x${publicKey.substring(2).padLeft(64, '0')}';

      await _secureStorage.write(key: _privateKeyKey, value: privateKey);
      await _secureStorage.write(key: _addressKey, value: address);

      final provider = state.provider ?? JsonRpcProvider(nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia');
      
      final account = Account(
        provider: provider,
        address: address,
        signer: signer,
        chainId: StarknetChainId.sepolia,
      );

      state = state.copyWith(
        hasWallet: true,
        address: address,
        publicKey: publicKey,
        signer: signer,
        account: account,
      );
    } catch (e) {
      print('Error importing wallet: $e');
      throw Exception('Invalid private key');
    }
  }

  Future<void> signMessage(String message) async {
    try {
      if (state.account == null) {
        throw Exception('No wallet available');
      }

      final result = await state.account!.signMessage(message);
      print('Signed message: $result');
      return result;
    } catch (e) {
      print('Error signing message: $e');
      throw Exception('Failed to sign message');
    }
  }

  Future<void> sendTransaction({
    required String contractAddress,
    required String entrypoint,
    required List<dynamic> calldata,
  }) async {
    try {
      if (state.account == null) {
        throw Exception('No wallet available');
      }

      final result = await state.account!.execute(
        Call(
          contractAddress: contractAddress,
          entrypoint: entrypoint,
          calldata: calldata,
        ),
      );

      print('Transaction hash: ${result.transactionHash}');
      return result;
    } catch (e) {
      print('Error sending transaction: $e');
      throw Exception('Failed to send transaction');
    }
  }

  Future<void> logout() async {
    await _secureStorage.delete(key: _privateKeyKey);
    await _secureStorage.delete(key: _addressKey);
    
    state = WalletState(
      isInitialized: true,
      hasWallet: false,
      provider: state.provider,
    );
  }
}

final walletProvider = StateNotifierProvider<WalletNotifier, WalletState>((ref) {
  return WalletNotifier();
}); 