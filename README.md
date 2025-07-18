# 🚀 Space Shooter Game

A classic 2D space shooter built with p5.js featuring fast-paced action, multiple enemy types, power-ups, and progressive difficulty.

## 🎮 Game Features

### Core Gameplay
- **Smooth Player Movement**: Control your spaceship with arrow keys
- **Weapon System**: Fire bullets with spacebar (rate-limited to prevent spam)
- **Multiple Enemy Types**: 3 distinct enemy types with unique behaviors
- **Power-Up System**: Collect special abilities to enhance your gameplay
- **Progressive Difficulty**: Game becomes more challenging over time
- **Particle Effects**: Explosions, hit effects, and visual feedback
- **Starfield Background**: Animated scrolling stars for space atmosphere

### Enemy Types

#### 🟢 Basic Enemy
- **Health**: 1 hit to destroy
- **Speed**: Moderate (3 pixels/frame)
- **Points**: 10
- **Behavior**: Moves straight down

#### 🔴 Fast Enemy
- **Health**: 1 hit to destroy
- **Speed**: Fast (6 pixels/frame)
- **Points**: 20
- **Behavior**: Moves in a sinusoidal wobble pattern
- **Spawn Time**: After 30 seconds

#### ⚫ Heavy Enemy
- **Health**: 3 hits to destroy
- **Speed**: Slow (2 pixels/frame)
- **Points**: 50
- **Behavior**: Large armored ship with health indicator
- **Spawn Time**: After 1 minute
- **Special**: Shows damage with visual feedback

### Power-Ups

#### ⚡ Triple Shot (Blue)
- **Duration**: 10 seconds
- **Effect**: Fires 3 bullets in a spread pattern
- **Spawn Chance**: 5% on enemy destruction

#### ⚡ Speed Boost (Yellow)
- **Duration**: 10 seconds
- **Effect**: Increases movement speed by 50%
- **Spawn Chance**: 5% on enemy destruction

#### 🛡 Shield (Green)
- **Duration**: 15 seconds
- **Effect**: Absorbs one enemy collision
- **Spawn Chance**: 3% on enemy destruction
- **Visual**: Green glow around player ship

## 🎯 Controls

| Control | Action |
|---------|--------|
| **Arrow Keys** | Move spaceship (Up, Down, Left, Right) |
| **Spacebar** | Fire bullets |
| **R Key** | Restart game (when game over) |

## 🏆 Scoring System

- **Basic Enemy**: +10 points
- **Fast Enemy**: +20 points
- **Heavy Enemy**: +50 points
- **Power-Up Collection**: +100 points
- **High Score**: Automatically saved and persists across sessions

## 🎲 Game Mechanics

### Difficulty Progression
- **Every 30 seconds**: Enemy spawn rate increases by reducing spawn interval
- **After 30 seconds**: Fast enemies begin spawning
- **After 1 minute**: Heavy enemies begin spawning
- **Continuous**: Enemy speeds gradually increase

### Collision System
- **Rectangular hitboxes** for all game objects
- **Player**: 50x50 pixels
- **Enemies**: Varies by type (40x40 for basic, 60x60 for heavy)
- **Bullets**: 8x15 pixels

### Visual Effects
- **Explosion particles** when enemies are destroyed
- **Hit effects** when bullets connect
- **Sparkle effects** when collecting power-ups
- **Engine glow** animation on player ship
- **Bullet trails** for enhanced visual feedback
- **Shield break effects** when shield absorbs damage

## 🛠 Technical Details

### Built With
- **p5.js**: Main game framework
- **HTML5 Canvas**: 800x600 pixel game area
- **JavaScript ES6**: Modern JavaScript features
- **Local Storage**: High score persistence

### Performance Optimizations
- **60 FPS** frame rate cap
- **Object cleanup**: Automatic removal of off-screen objects
- **Efficient collision detection**: Rectangular overlap checking
- **Memory management**: Particle system with automatic cleanup

### File Structure
```
├── index.html      # Main HTML file with game UI
├── classes.js      # Game object classes (Player, Enemy, Bullet, etc.)
├── game.js         # Main game loop and logic
└── README.md       # This file
```

## 🚀 Getting Started

1. **Clone or download** the game files
2. **Open `index.html`** in a modern web browser
3. **Start playing** immediately - no installation required!

### Browser Requirements
- Any modern web browser with JavaScript enabled
- Supports Chrome, Firefox, Safari, Edge
- Mobile browsers supported (with touch controls)

## 🎮 How to Play

1. **Objective**: Survive as long as possible while destroying enemies
2. **Movement**: Use arrow keys to avoid enemies and position for shots
3. **Shooting**: Hold spacebar to continuously fire (rate-limited)
4. **Power-Ups**: Collect glowing orbs for temporary abilities
5. **Survival**: Avoid enemy collisions (unless you have a shield)
6. **Scoring**: Destroy enemies and collect power-ups for points

### Tips for High Scores
- **Prioritize survival** over aggressive shooting
- **Collect power-ups** for score bonuses and abilities
- **Focus on heavy enemies** for maximum points
- **Use triple shot efficiently** when collected
- **Stay mobile** - don't stay in one place too long

## 🔄 Game States

### Playing State
- Active gameplay with all mechanics enabled
- Real-time score tracking and power-up timers
- Continuous difficulty progression

### Game Over State
- Triggered by player-enemy collision (without shield)
- Displays final score and high score
- Option to restart with 'R' key

## 🎨 Visual Design

### Color Scheme
- **Background**: Deep space blue/black with stars
- **Player Ship**: Blue with orange engine glow
- **Enemies**: Green (basic), Red (fast), Gray (heavy)
- **Power-Ups**: Blue (triple shot), Yellow (speed), Green (shield)
- **UI**: Cyan accents with white text

### Art Style
- **Minimalist geometric shapes** for easy recognition
- **Bright particle effects** for visual impact
- **Glowing effects** for power-ups and special abilities
- **Clean UI design** with clear information hierarchy

## 🌟 Future Enhancement Ideas

- **Sound effects** and background music
- **More enemy types** with unique patterns
- **Boss battles** at certain intervals
- **Weapon upgrades** beyond power-ups
- **Multiplayer support** for competitive play
- **Mobile-optimized controls** with virtual joystick
- **Achievements system** for additional goals

---

**Enjoy the game and aim for the high score!** 🎯🚀