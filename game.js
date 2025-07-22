// Game variables
let player;
let enemies = [];
let bullets = [];
let powerUps = [];
let particles = [];
let stars = [];

// Game state
let gameState = 'playing'; // 'playing', 'gameOver'
let score = 0;
let highScore = 0;
let gameTime = 0;
let enemySpawnTimer = 0;
let enemySpawnInterval = 120; // frames
let difficultyTimer = 0;
let difficultyInterval = 1800; // 30 seconds at 60fps

// Game settings
const CANVAS_WIDTH = 800;
const CANVAS_HEIGHT = 600;
const STAR_COUNT = 100;

function setup() {
    createCanvas(CANVAS_WIDTH, CANVAS_HEIGHT);
    frameRate(60);
    
    // Load high score from localStorage
    highScore = localStorage.getItem('spaceShooterHighScore') || 0;
    
    initGame();
}

function initGame() {
    // Initialize player
    player = new Player(CANVAS_WIDTH / 2 - 25, CANVAS_HEIGHT - 80);
    
    // Clear arrays
    enemies = [];
    bullets = [];
    powerUps = [];
    particles = [];
    stars = [];
    
    // Create starfield
    for (let i = 0; i < STAR_COUNT; i++) {
        stars.push(new Star());
    }
    
    // Reset game state
    gameState = 'playing';
    score = 0;
    gameTime = 0;
    enemySpawnTimer = 0;
    difficultyTimer = 0;
    enemySpawnInterval = 120;
}

function draw() {
    // Background
    background(5, 5, 15);
    
    // Update and render stars
    updateStars();
    
    if (gameState === 'playing') {
        updateGame();
        renderGame();
        updateDifficulty();
    } else if (gameState === 'gameOver') {
        renderGameOver();
    }
    
    // UI
    renderUI();
}

function updateGame() {
    gameTime++;
    
    // Update player
    player.update();
    
    // Spawn enemies
    spawnEnemies();
    
    // Update enemies
    updateEnemies();
    
    // Update bullets
    updateBullets();
    
    // Update power-ups
    updatePowerUps();
    
    // Update particles
    updateParticles();
    
    // Check collisions
    checkCollisions();
    
    // Remove off-screen objects
    cleanupObjects();
}

function renderGame() {
    // Render all game objects
    player.render();
    
    enemies.forEach(enemy => enemy.render());
    bullets.forEach(bullet => bullet.render());
    powerUps.forEach(powerUp => powerUp.render());
    particles.forEach(particle => particle.render());
}

function updateStars() {
    stars.forEach(star => {
        star.update();
        star.render();
    });
}

function spawnEnemies() {
    enemySpawnTimer++;
    
    if (enemySpawnTimer >= enemySpawnInterval) {
        enemySpawnTimer = 0;
        
        let enemyType = 'basic';
        let rand = random();
        
        // Determine enemy type based on game time
        if (gameTime > 3600) { // After 1 minute
            if (rand < 0.1) enemyType = 'heavy';
            else if (rand < 0.4) enemyType = 'fast';
        } else if (gameTime > 1800) { // After 30 seconds
            if (rand < 0.3) enemyType = 'fast';
        }
        
        let x = random(50, CANVAS_WIDTH - 50);
        enemies.push(new Enemy(x, -50, enemyType));
    }
}

function updateEnemies() {
    for (let i = enemies.length - 1; i >= 0; i--) {
        enemies[i].update();
        
        // Check if enemy hit player
        if (checkCollision(player, enemies[i])) {
            if (player.isShielded) {
                // Shield absorbs hit
                player.isShielded = false;
                player.shieldTimer = 0;
                
                // Create shield break effect
                createExplosion(enemies[i].x + enemies[i].width / 2, 
                              enemies[i].y + enemies[i].height / 2, 
                              [0, 255, 255], 15);
                
                enemies.splice(i, 1);
            } else {
                // Game over
                gameState = 'gameOver';
                
                // Save high score
                if (score > highScore) {
                    highScore = score;
                    localStorage.setItem('spaceShooterHighScore', highScore);
                }
            }
        }
        // Remove enemies that are off-screen
        else if (enemies[i].y > CANVAS_HEIGHT + 50) {
            enemies.splice(i, 1);
        }
    }
}

function updateBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        bullets[i].update();
        
        if (bullets[i].isOffScreen()) {
            bullets.splice(i, 1);
        }
    }
}

function updatePowerUps() {
    for (let i = powerUps.length - 1; i >= 0; i--) {
        powerUps[i].update();
        
        // Check collision with player
        if (checkCollision(player, powerUps[i])) {
            // Apply power-up effect
            switch (powerUps[i].type) {
                case 'tripleShot':
                    player.activateTripleShot();
                    break;
                case 'speedBoost':
                    player.activateSpeedBoost();
                    break;
                case 'shield':
                    player.activateShield();
                    break;
            }
            
            // Score bonus
            score += 100;
            
            // Create collection effect
            createSparkle(powerUps[i].x + powerUps[i].width / 2, 
                         powerUps[i].y + powerUps[i].height / 2);
            
            powerUps.splice(i, 1);
        }
        // Remove if off-screen
        else if (powerUps[i].isOffScreen()) {
            powerUps.splice(i, 1);
        }
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }
}

function checkCollisions() {
    // Bullet-enemy collisions
    for (let i = bullets.length - 1; i >= 0; i--) {
        for (let j = enemies.length - 1; j >= 0; j--) {
            if (checkCollision(bullets[i], enemies[j])) {
                // Create hit effect
                createHitEffect(bullets[i].x, bullets[i].y);
                
                // Damage enemy
                let destroyed = enemies[j].takeDamage();
                
                // Remove bullet
                bullets.splice(i, 1);
                
                if (destroyed) {
                    // Add score
                    score += enemies[j].points;
                    
                    // Create explosion
                    createExplosion(enemies[j].x + enemies[j].width / 2, 
                                  enemies[j].y + enemies[j].height / 2, 
                                  enemies[j].color, 10);
                    
                    // Chance to spawn power-up
                    spawnPowerUp(enemies[j].x + enemies[j].width / 2, 
                               enemies[j].y + enemies[j].height / 2);
                    
                    // Remove enemy
                    enemies.splice(j, 1);
                }
                
                break;
            }
        }
    }
}

function checkCollision(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}

function spawnPowerUp(x, y) {
    let rand = random();
    let powerUpType;
    
    if (rand < 0.05) { // 5% chance for triple shot
        powerUpType = 'tripleShot';
    } else if (rand < 0.10) { // 5% chance for speed boost
        powerUpType = 'speedBoost';
    } else if (rand < 0.13) { // 3% chance for shield
        powerUpType = 'shield';
    } else {
        return; // No power-up
    }
    
    powerUps.push(new PowerUp(x - 15, y, powerUpType));
}

function createExplosion(x, y, color, particleCount) {
    for (let i = 0; i < particleCount; i++) {
        let vx = random(-5, 5);
        let vy = random(-5, 5);
        particles.push(new Particle(x, y, vx, vy, color, 60));
    }
}

function createHitEffect(x, y) {
    for (let i = 0; i < 5; i++) {
        let vx = random(-3, 3);
        let vy = random(-3, 3);
        particles.push(new Particle(x, y, vx, vy, [255, 255, 255], 30));
    }
}

function createSparkle(x, y) {
    for (let i = 0; i < 15; i++) {
        let vx = random(-4, 4);
        let vy = random(-4, 4);
        particles.push(new Particle(x, y, vx, vy, [255, 255, 0], 45));
    }
}

function updateDifficulty() {
    difficultyTimer++;
    
    if (difficultyTimer >= difficultyInterval) {
        difficultyTimer = 0;
        
        // Increase difficulty
        if (enemySpawnInterval > 30) {
            enemySpawnInterval = max(30, enemySpawnInterval - 10);
        }
        
        // Increase enemy speeds slightly
        enemies.forEach(enemy => {
            enemy.speed = min(enemy.speed * 1.05, enemy.speed + 0.5);
        });
    }
}

function cleanupObjects() {
    // Remove off-screen bullets
    bullets = bullets.filter(bullet => !bullet.isOffScreen());
    
    // Remove off-screen power-ups
    powerUps = powerUps.filter(powerUp => !powerUp.isOffScreen());
    
    // Remove off-screen enemies
    enemies = enemies.filter(enemy => enemy.y < CANVAS_HEIGHT + 100);
}

function renderUI() {
    // Score
    fill(255);
    textAlign(LEFT);
    textSize(24);
    text(`Score: ${score}`, 20, 30);
    
    // High Score
    textSize(18);
    text(`High Scores: ${highScore}`, 20, 55);
    
    // Power-up indicators
    let indicatorY = 80;
    textSize(14);
    
    if (player && player.tripleShot) {
        fill(0, 0, 255);
        text(`Triple Shot: ${Math.ceil(player.tripleShotTimer / 60)}s`, 20, indicatorY);
        indicatorY += 20;
    }
    
    if (player && player.speedBoost) {
        fill(255, 255, 0);
        text(`Speed Boost: ${Math.ceil(player.speedBoostTimer / 60)}s`, 20, indicatorY);
        indicatorY += 20;
    }
    
    if (player && player.isShielded) {
        fill(0, 255, 0);
        text(`Shield: ${Math.ceil(player.shieldTimer / 60)}s`, 20, indicatorY);
        indicatorY += 20;
    }
    
    // Game time
    fill(255);
    textAlign(RIGHT);
    textSize(16);
    let minutes = Math.floor(gameTime / 3600);
    let seconds = Math.floor((gameTime % 3600) / 60);
    text(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`, CANVAS_WIDTH - 20, 30);
}

function renderGameOver() {
    // Darken background
    fill(0, 0, 0, 150);
    rect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Game Over text
    fill(255, 0, 0);
    textAlign(CENTER);
    textSize(48);
    text('GAME OVER', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 80);
    
    // Final score
    fill(255);
    textSize(32);
    text(`Final Score: ${score}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 - 20);
    
    // High score
    if (score === highScore && score > 0) {
        fill(255, 255, 0);
        textSize(24);
        text('NEW HIGH SCORE!', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    } else {
        fill(200);
        textSize(20);
        text(`High Score: ${highScore}`, CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 20);
    }
    
    // Restart instruction
    fill(255);
    textSize(18);
    text('Press R to Restart', CANVAS_WIDTH / 2, CANVAS_HEIGHT / 2 + 60);
    
    // Continue updating particles for visual effect
    updateParticles();
    particles.forEach(particle => particle.render());
}

function keyPressed() {
    if (key === 'r' || key === 'R' || key === 'a') {
        if (gameState === 'gameOver') {
            initGame();
        }
    }
}

// Touch support for mobile (optional enhancement)
function touchStarted() {
    if (gameState === 'gameOver') {
        initGame();
    }
    return false;
}
