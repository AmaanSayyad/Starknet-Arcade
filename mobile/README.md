# Starknet Arcade Mobile App

A mobile application for Starknet Arcade built using Flutter and Starknet.dart.

## Overview

This mobile app allows users to:

- Create and manage their Starknet wallet
- Browse and play games from the Starknet Arcade
- Interact with on-chain games using Starknet.dart
- Track scores and achievements across devices

## Technical Implementation

### Starknet.dart Integration

We've implemented Starknet.dart to provide native blockchain integration:

- **Wallet Management**: Create and import Starknet wallets directly in the app
- **Transaction Signing**: Sign and send transactions to interact with game contracts
- **Contract Interaction**: Direct communication with on-chain games including Dojo-powered games
- **State Synchronization**: Real-time updates of game state from Starknet

### Key Features

1. **Native Wallet Experience**
   - No browser extensions needed
   - Biometric authentication for transaction signing
   - QR code scanning for quick connections

2. **Optimized for Mobile Gaming**
   - Touch-optimized UI for game controls
   - Offline support with state synchronization when back online
   - Push notifications for game events and tournament updates

3. **Cross-Platform**
   - Same codebase for iOS and Android
   - Consistent experience across devices
   - Shared wallet between mobile and web apps

## Development Setup

### Prerequisites

- Flutter SDK (3.0.0+)
- Dart SDK (3.0.0+)
- Android Studio or Xcode for emulator/simulator

### Installation

1. Clone the repository
```bash
git clone https://github.com/your-username/starknet-arcade.git
cd starknet-arcade/mobile
```

2. Install dependencies
```bash
flutter pub get
```

3. Run the app
```bash
flutter run
```

## Starknet.dart Usage Examples

### Wallet Creation

```dart
final signer = Signer.createRandom();
final privateKey = signer.privateKey;
final publicKey = signer.publicKey;
// Store privateKey securely
```

### Connect to Starknet

```dart
final provider = JsonRpcProvider(nodeUrl: 'https://api.cartridge.gg/x/starknet/sepolia');
final account = Account(
  provider: provider,
  address: walletAddress,
  signer: signer,
  chainId: StarknetChainId.sepolia,
);
```

### Interact with Game Contracts

```dart
// Execute game move
final result = await account.execute(
  Call(
    contractAddress: gameContractAddress,
    entrypoint: 'make_move',
    calldata: [move.x, move.y],
  ),
);

// Read game state
final state = await provider.call(
  Call(
    contractAddress: gameContractAddress,
    entrypoint: 'get_game_state',
    calldata: [gameId],
  ),
);
```

## Cartridge Controller Integration

Alongside Starknet.dart, we've also integrated the Cartridge Controller for a seamless gaming experience:

```dart
import 'package:starknet/starknet.dart';
import '@cartridge/connector/controller';

// Initialize controller with Starknet.dart
final controller = ControllerConnector({
  provider: starknetProvider,
  signer: starknetSigner,
});

// Connect to Dojo games
await controller.init({
  worldAddress: DOJO_WORLD_ADDRESS
});
```

## Build and Deploy

To build the release version:

```bash
flutter build apk --release  # Android
flutter build ios --release  # iOS
``` 