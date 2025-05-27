#[contract]
mod DojoPlatformer {
    use starknet::get_caller_address;
    use starknet::ContractAddress;
    use array::ArrayTrait;
    use box::BoxTrait;
    use zeroable::Zeroable;
    use traits::Into;
    use traits::TryInto;
    use option::OptionTrait;
    use serde::Serde;

    // Game components
    #[derive(Component, Drop, Serde)]
    struct Position {
        x: u32,
        y: u32,
    }

    #[derive(Component, Drop, Serde)]
    struct Player {
        id: ContractAddress,
        score: u32,
        high_score: u32,
    }

    #[derive(Component, Drop, Serde)]
    struct Platform {
        x: u32,
        y: u32,
        width: u32,
    }

    #[derive(Component, Drop, Serde)]
    struct Collectible {
        x: u32,
        y: u32,
        value: u32,
        collected: bool,
    }

    // Game events
    #[event]
    fn PlayerMoved(player_id: ContractAddress, new_x: u32, new_y: u32) {}

    #[event]
    fn ScoreUpdated(player_id: ContractAddress, new_score: u32) {}

    #[event]
    fn HighScoreUpdated(player_id: ContractAddress, new_high_score: u32) {}

    #[event]
    fn CollectibleCollected(player_id: ContractAddress, collectible_id: u32, value: u32) {}

    // Storage
    struct Storage {
        player_positions: LegacyMap::<ContractAddress, Position>,
        player_data: LegacyMap::<ContractAddress, Player>,
        platforms: LegacyMap::<u32, Platform>,
        collectibles: LegacyMap::<u32, Collectible>,
        platform_count: u32,
        collectible_count: u32,
    }

    // Initialize game with platforms and collectibles
    #[external]
    fn initialize_game() {
        // Add initial platforms
        add_platform(100, 300, 200);
        add_platform(400, 250, 150);
        add_platform(600, 350, 180);
        add_platform(800, 200, 220);
        
        // Add collectibles
        add_collectible(150, 250, 10);
        add_collectible(450, 200, 20);
        add_collectible(680, 300, 15);
        add_collectible(850, 150, 30);
    }

    // Register a new player
    #[external]
    fn register_player() {
        let player_address = get_caller_address();
        let current_player = player_data::read(player_address);
        
        // Only register if player doesn't exist
        if current_player.id.is_zero() {
            // Set initial position
            player_positions::write(
                player_address, 
                Position { x: 50, y: 300 }
            );
            
            // Initialize player data
            player_data::write(
                player_address,
                Player { 
                    id: player_address,
                    score: 0,
                    high_score: 0
                }
            );
        }
    }

    // Move player horizontally
    #[external]
    fn move_player(x_direction: i32) {
        let player_address = get_caller_address();
        let position = player_positions::read(player_address);
        
        // Calculate new position (ensure no negative values with unsigned ints)
        let new_x = if x_direction < 0 && position.x > 10 {
            position.x - 10
        } else if x_direction > 0 {
            position.x + 10
        } else {
            position.x
        };
        
        // Update position
        player_positions::write(
            player_address,
            Position { x: new_x, y: position.y }
        );
        
        // Emit event
        PlayerMoved(player_address, new_x, position.y);
        
        // Check for collectibles
        check_collectibles(player_address, new_x, position.y);
    }

    // Player jump action
    #[external]
    fn jump() {
        let player_address = get_caller_address();
        let position = player_positions::read(player_address);
        
        // Jump logic (simplistic - just move up then back down)
        // In a real implementation, this would use proper physics
        
        // Move up
        let jump_height = position.y - 100;
        player_positions::write(
            player_address,
            Position { x: position.x, y: jump_height }
        );
        
        // Emit jumped event
        PlayerMoved(player_address, position.x, jump_height);
        
        // Check for collectibles
        check_collectibles(player_address, position.x, jump_height);
        
        // Update score for jump action
        add_score(player_address, 10);
    }

    // Internal function to add a platform
    fn add_platform(x: u32, y: u32, width: u32) {
        let platform_id = platform_count::read();
        
        platforms::write(
            platform_id,
            Platform { x, y, width }
        );
        
        platform_count::write(platform_id + 1);
    }

    // Internal function to add a collectible
    fn add_collectible(x: u32, y: u32, value: u32) {
        let collectible_id = collectible_count::read();
        
        collectibles::write(
            collectible_id,
            Collectible { x, y, value, collected: false }
        );
        
        collectible_count::write(collectible_id + 1);
    }

    // Check if player has collected any collectibles
    fn check_collectibles(player_address: ContractAddress, x: u32, y: u32) {
        let collectible_count = collectible_count::read();
        
        // Check each collectible
        let mut i: u32 = 0;
        while i < collectible_count {
            let collectible = collectibles::read(i);
            
            // Skip if already collected
            if !collectible.collected {
                // Simple collision detection
                if x >= collectible.x - 20 && x <= collectible.x + 20 &&
                   y >= collectible.y - 20 && y <= collectible.y + 20 {
                    // Mark as collected
                    collectibles::write(
                        i,
                        Collectible { 
                            x: collectible.x, 
                            y: collectible.y, 
                            value: collectible.value, 
                            collected: true 
                        }
                    );
                    
                    // Add to score
                    add_score(player_address, collectible.value);
                    
                    // Emit collection event
                    CollectibleCollected(player_address, i, collectible.value);
                }
            }
            
            i += 1;
        }
    }

    // Add to player's score
    fn add_score(player_address: ContractAddress, points: u32) {
        let player = player_data::read(player_address);
        let new_score = player.score + points;
        
        // Update score
        player_data::write(
            player_address,
            Player { 
                id: player.id,
                score: new_score,
                high_score: if new_score > player.high_score { new_score } else { player.high_score }
            }
        );
        
        // Emit score event
        ScoreUpdated(player_address, new_score);
        
        // Emit high score event if needed
        if new_score > player.high_score {
            HighScoreUpdated(player_address, new_score);
        }
    }

    // View function to get player position
    #[view]
    fn get_player_position(player_address: ContractAddress) -> Position {
        player_positions::read(player_address)
    }

    // View function to get player data
    #[view]
    fn get_player_data(player_address: ContractAddress) -> Player {
        player_data::read(player_address)
    }

    // View function to get all platforms
    #[view]
    fn get_all_platforms() -> Array<Platform> {
        let platform_count = platform_count::read();
        let mut platforms_array = ArrayTrait::new();
        
        let mut i: u32 = 0;
        while i < platform_count {
            platforms_array.append(platforms::read(i));
            i += 1;
        }
        
        platforms_array
    }

    // View function to get collectibles
    #[view]
    fn get_collectibles() -> Array<Collectible> {
        let collectible_count = collectible_count::read();
        let mut collectibles_array = ArrayTrait::new();
        
        let mut i: u32 = 0;
        while i < collectible_count {
            collectibles_array.append(collectibles::read(i));
            i += 1;
        }
        
        collectibles_array
    }
} 