// Player class
class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 50;
        this.height = 50;
        this.speed = 5;
        this.baseSpeed = 5;
        this.health = 1;
        this.isShielded = false;
        this.shieldTimer = 0;
        this.tripleShot = false;
        this.tripleShotTimer = 0;
        this.speedBoost = false;
        this.speedBoostTimer = 0;
        this.lastShot = 0;
        this.shootCooldown = 10; // frames
    }

    update() {
        // Handle movement
        if (keyIsDown(LEFT_ARROW) && this.x > 0) {
            this.x -= this.speed;
        }
        if (keyIsDown(RIGHT_ARROW) && this.x < width - this.width) {
            this.x += this.speed;
        }
        if (keyIsDown(UP_ARROW) && this.y > 0) {
            this.y -= this.speed;
        }
        if (keyIsDown(DOWN_ARROW) && this.y < height - this.height) {
            this.y += this.speed;
        }

        // Handle shooting
        if (keyIsDown(32) && frameCount - this.lastShot > this.shootCooldown) { // Spacebar
            this.shoot();
            this.lastShot = frameCount;
        }

        // Update power-up timers
        this.updatePowerUps();
    }

    updatePowerUps() {
        // Triple shot timer
        if (this.tripleShot) {
            this.tripleShotTimer--;
            if (this.tripleShotTimer <= 0) {
                this.tripleShot = false;
            }
        }

        // Speed boost timer
        if (this.speedBoost) {
            this.speedBoostTimer--;
            if (this.speedBoostTimer <= 0) {
                this.speedBoost = false;
                this.speed = this.baseSpeed;
            }
        }

        // Shield timer
        if (this.isShielded) {
            this.shieldTimer--;
            if (this.shieldTimer <= 0) {
                this.isShielded = false;
            }
        }
    }

    shoot() {
        if (this.tripleShot) {
            // Triple shot pattern
            bullets.push(new Bullet(this.x + this.width / 2, this.y, 0, -10));
            bullets.push(new Bullet(this.x + this.width / 2, this.y, -3, -8));
            bullets.push(new Bullet(this.x + this.width / 2, this.y, 3, -8));
        } else {
            // Single shot
            bullets.push(new Bullet(this.x + this.width / 2, this.y, 0, -10));
        }
    }

    render() {
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Shield effect
        if (this.isShielded) {
            stroke(0, 255, 0);
            strokeWeight(3);
            noFill();
            ellipse(0, 0, this.width + 20, this.height + 20);
        }

        // Player ship
        fill(0, 150, 255);
        stroke(255);
        strokeWeight(2);
        
        // Ship body
        triangle(-15, 15, 15, 15, 0, -20);
        
        // Wings
        fill(100, 100, 255);
        triangle(-15, 15, -20, 25, -10, 25);
        triangle(15, 15, 20, 25, 10, 25);
        
        // Engine glow
        if (frameCount % 4 < 2) {
            fill(255, 100, 0, 150);
            noStroke();
            ellipse(-5, 20, 8, 15);
            ellipse(5, 20, 8, 15);
        }

        pop();
    }

    activateTripleShot() {
        this.tripleShot = true;
        this.tripleShotTimer = 600; // 10 seconds at 60fps
    }

    activateSpeedBoost() {
        this.speedBoost = true;
        this.speedBoostTimer = 600; // 10 seconds at 60fps
        this.speed = this.baseSpeed * 1.5;
    }

    activateShield() {
        this.isShielded = true;
        this.shieldTimer = 900; // 15 seconds at 60fps
    }
}

// Enemy class
class Enemy {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.angle = 0;
        this.baseX = x;
        
        // Set properties based on type
        switch (type) {
            case 'basic':
                this.width = 40;
                this.height = 40;
                this.speed = 3;
                this.health = 1;
                this.maxHealth = 1;
                this.color = [0, 255, 0];
                this.points = 10;
                break;
            case 'fast':
                this.width = 35;
                this.height = 35;
                this.speed = 6;
                this.health = 1;
                this.maxHealth = 1;
                this.color = [255, 0, 0];
                this.points = 20;
                break;
            case 'heavy':
                this.width = 60;
                this.height = 60;
                this.speed = 2;
                this.health = 3;
                this.maxHealth = 3;
                this.color = [150, 150, 150];
                this.points = 50;
                break;
        }
    }

    update() {
        this.y += this.speed;
        
        // Fast enemy wobble
        if (this.type === 'fast') {
            this.angle += 0.1;
            this.x = this.baseX + sin(this.angle) * 30;
        }
    }

    takeDamage() {
        this.health--;
        return this.health <= 0;
    }

    render() {
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2);
        
        // Enemy ship
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(255);
        strokeWeight(1);
        
        if (this.type === 'basic') {
            // Basic enemy - simple triangle
            triangle(-15, -15, 15, -15, 0, 20);
        } else if (this.type === 'fast') {
            // Fast enemy - sleek design
            triangle(-10, -20, 10, -20, 0, 15);
            triangle(-15, -10, -5, -20, -5, 10);
            triangle(15, -10, 5, -20, 5, 10);
        } else if (this.type === 'heavy') {
            // Heavy enemy - large rectangular ship
            rect(-25, -25, 50, 50, 5);
            // Armor plating
            fill(100, 100, 100);
            rect(-20, -20, 40, 40, 3);
        }
        
        // Health indicator for heavy enemies
        if (this.type === 'heavy') {
            fill(255, 0, 0);
            noStroke();
            let healthWidth = map(this.health, 0, this.maxHealth, 0, 40);
            rect(-20, -35, healthWidth, 5);
        }
        
        // Damage flash
        if (this.health < this.maxHealth && frameCount % 10 < 5) {
            fill(255, 0, 0, 100);
            noStroke();
            ellipse(0, 0, this.width, this.height);
        }

        pop();
    }
}

// Bullet class
class Bullet {
    constructor(x, y, vx = 0, vy = -10) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.width = 8;
        this.height = 15;
        this.trail = [];
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        
        // Add to trail
        this.trail.push({x: this.x, y: this.y});
        if (this.trail.length > 5) {
            this.trail.shift();
        }
    }

    render() {
        // Bullet trail
        for (let i = 0; i < this.trail.length; i++) {
            let alpha = map(i, 0, this.trail.length - 1, 0, 255);
            fill(255, 255, 0, alpha);
            noStroke();
            ellipse(this.trail[i].x, this.trail[i].y, 3, 3);
        }
        
        // Main bullet
        fill(255, 255, 0);
        stroke(255);
        strokeWeight(1);
        ellipse(this.x, this.y, this.width, this.height);
        
        // Glow effect
        fill(255, 255, 0, 100);
        noStroke();
        ellipse(this.x, this.y, this.width + 4, this.height + 4);
    }

    isOffScreen() {
        return this.y < -this.height || this.y > height + this.height || 
               this.x < -this.width || this.x > width + this.width;
    }
}

// PowerUp class
class PowerUp {
    constructor(x, y, type) {
        this.x = x;
        this.y = y;
        this.type = type;
        this.width = 30;
        this.height = 30;
        this.speed = 2;
        this.angle = 0;
        this.pulsePhase = random(TWO_PI);
        
        // Set properties based on type
        switch (type) {
            case 'tripleShot':
                this.color = [0, 0, 255];
                this.symbol = '⚡';
                break;
            case 'speedBoost':
                this.color = [255, 255, 0];
                this.symbol = '⚡';
                break;
            case 'shield':
                this.color = [0, 255, 0];
                this.symbol = '🛡';
                break;
        }
    }

    update() {
        this.y += this.speed;
        this.angle += 0.05;
        this.pulsePhase += 0.1;
    }

    render() {
        push();
        translate(this.x + this.width / 2, this.y + this.height / 2);
        rotate(this.angle);
        
        // Pulsing glow
        let pulseSize = 1 + sin(this.pulsePhase) * 0.3;
        fill(this.color[0], this.color[1], this.color[2], 100);
        noStroke();
        ellipse(0, 0, this.width * pulseSize * 1.5, this.height * pulseSize * 1.5);
        
        // Main power-up
        fill(this.color[0], this.color[1], this.color[2]);
        stroke(255);
        strokeWeight(2);
        ellipse(0, 0, this.width * pulseSize, this.height * pulseSize);
        
        // Inner symbol
        fill(255);
        noStroke();
        textAlign(CENTER, CENTER);
        textSize(16);
        text(this.symbol, 0, 0);
        
        pop();
    }

    isOffScreen() {
        return this.y > height + this.height;
    }
}

// Particle class
class Particle {
    constructor(x, y, vx, vy, color, life = 60) {
        this.x = x;
        this.y = y;
        this.vx = vx;
        this.vy = vy;
        this.color = color;
        this.life = life;
        this.maxLife = life;
        this.size = random(3, 8);
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx *= 0.98;
        this.vy *= 0.98;
        this.life--;
    }

    render() {
        let alpha = map(this.life, 0, this.maxLife, 0, 255);
        fill(this.color[0], this.color[1], this.color[2], alpha);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }

    isDead() {
        return this.life <= 0;
    }
}

// Star class for background
class Star {
    constructor() {
        this.x = random(width);
        this.y = random(height);
        this.speed = random(1, 4);
        this.size = random(1, 3);
        this.brightness = random(100, 255);
    }

    update() {
        this.y += this.speed;
        if (this.y > height) {
            this.y = 0;
            this.x = random(width);
        }
    }

    render() {
        fill(this.brightness, this.brightness, this.brightness);
        noStroke();
        ellipse(this.x, this.y, this.size, this.size);
    }
}