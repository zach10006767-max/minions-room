// Minions Room Simulator
// A simulation of minions with different jobs walking around a room

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

// Game state
const gameState = {
    minions: [],
    waypoints: [],
    paused: false,
    frameCount: 0,
    lastFpsTime: Date.now(),
    fps: 0
};

// Job types with unique colors and characteristics
const JOBS = [
    { name: 'Engineer', color: '#FF6B35', speed: 1.2, size: 12 },
    { name: 'Scientist', color: '#004E89', speed: 1.0, size: 11 },
    { name: 'Manager', color: '#F77F00', speed: 0.8, size: 13 },
    { name: 'Pilot', color: '#06A77D', speed: 1.5, size: 10 },
    { name: 'Security', color: '#D62828', speed: 1.1, size: 12 },
    { name: 'Doctor', color: '#F4D35E', speed: 0.9, size: 11 },
    { name: 'Chef', color: '#EE964B', speed: 0.7, size: 12 },
    { name: 'Technician', color: '#A23B72', speed: 1.3, size: 10 }
];

class Minion {
    constructor(x, y, jobIndex) {
        this.x = x;
        this.y = y;
        this.vx = 0;
        this.vy = 0;
        this.job = JOBS[jobIndex % JOBS.length];
        this.jobIndex = jobIndex;
        this.radius = this.job.size;
        this.speed = this.job.speed;
        this.waypoints = [];
        this.currentWaypointIndex = 0;
        this.targetWaypoint = null;
        this.wanderAngle = Math.random() * Math.PI * 2;
        this.wanderTimer = 0;
        this.minWanderTime = 30;
        this.maxWanderTime = 100;
        this.nextWanderTime = this.minWanderTime + Math.random() * (this.maxWanderTime - this.minWanderTime);
        this.id = Math.random().toString(36).substr(2, 9);
    }

    setWaypoints(waypoints) {
        this.waypoints = waypoints.slice();
        this.currentWaypointIndex = 0;
        this.targetWaypoint = this.waypoints.length > 0 ? this.waypoints[0] : null;
    }

    update() {
        // Choose behavior: follow waypoints or wander
        if (this.waypoints.length > 0 && this.targetWaypoint) {
            this.followWaypoint();
        } else {
            this.wander();
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Boundary collision
        if (this.x - this.radius < 0) {
            this.x = this.radius;
            this.vx *= -0.5;
        }
        if (this.x + this.radius > canvas.width) {
            this.x = canvas.width - this.radius;
            this.vx *= -0.5;
        }
        if (this.y - this.radius < 0) {
            this.y = this.radius;
            this.vy *= -0.5;
        }
        if (this.y + this.radius > canvas.height) {
            this.y = canvas.height - this.radius;
            this.vy *= -0.5;
        }
    }

    followWaypoint() {
        if (!this.targetWaypoint) return;

        const dx = this.targetWaypoint.x - this.x;
        const dy = this.targetWaypoint.y - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 15) {
            // Reached waypoint, move to next
            this.currentWaypointIndex++;
            if (this.currentWaypointIndex >= this.waypoints.length) {
                this.currentWaypointIndex = 0;
            }
            this.targetWaypoint = this.waypoints[this.currentWaypointIndex];
        } else {
            // Move towards waypoint
            const angle = Math.atan2(dy, dx);
            this.vx = Math.cos(angle) * this.speed;
            this.vy = Math.sin(angle) * this.speed;
        }
    }

    wander() {
        this.wanderTimer++;

        if (this.wanderTimer > this.nextWanderTime) {
            this.wanderAngle += (Math.random() - 0.5) * Math.PI * 0.5;
            this.wanderTimer = 0;
            this.nextWanderTime = this.minWanderTime + Math.random() * (this.maxWanderTime - this.minWanderTime);
        }

        this.vx = Math.cos(this.wanderAngle) * this.speed * 0.5;
        this.vy = Math.sin(this.wanderAngle) * this.speed * 0.5;
    }

    draw() {
        // Draw minion body
        ctx.fillStyle = this.job.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();

        // Draw eyes
        ctx.fillStyle = '#000';
        const eyeRadius = 2;
        const eyeOffset = 4;
        ctx.beginPath();
        ctx.arc(this.x - eyeOffset, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(this.x + eyeOffset, this.y - 2, eyeRadius, 0, Math.PI * 2);
        ctx.fill();

        // Draw mouth
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(this.x, this.y + 2, 3, 0, Math.PI);
        ctx.stroke();

        // Draw job label
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 8px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.job.name.substr(0, 3), this.x, this.y + this.radius + 10);
    }

    distanceTo(other) {
        const dx = other.x - this.x;
        const dy = other.y - this.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    separateFrom(others) {
        const separationRadius = this.radius * 3;
        const separationForce = 0.3;

        for (let other of others) {
            if (other === this) continue;
            const distance = this.distanceTo(other);
            if (distance < separationRadius && distance > 0) {
                const angle = Math.atan2(other.y - this.y, other.x - this.x);
                this.vx -= Math.cos(angle) * separationForce;
                this.vy -= Math.sin(angle) * separationForce;
            }
        }
    }
}

// Event listeners
canvas.addEventListener('click', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    gameState.waypoints.push({ x, y });
    updateAllMinionWaypoints();
});

canvas.addEventListener('dblclick', (e) => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    // Check if clicked on a minion
    for (let i = gameState.minions.length - 1; i >= 0; i--) {
        const minion = gameState.minions[i];
        if (minion.distanceTo({ x, y }) < minion.radius * 2) {
            gameState.minions.splice(i, 1);
            break;
        }
    }
});

// Helper functions
function addMinion() {
    if (gameState.minions.length >= 20) {
        alert('Maximum 20 minions! Double-click a minion to remove it.');
        return;
    }
    const jobIndex = gameState.minions.length % JOBS.length;
    const minion = new Minion(
        Math.random() * (canvas.width - 100) + 50,
        Math.random() * (canvas.height - 100) + 50,
        jobIndex
    );
    minion.setWaypoints(gameState.waypoints);
    gameState.minions.push(minion);
}

function clearWaypoints() {
    gameState.waypoints = [];
    gameState.minions.forEach(minion => {
        minion.setWaypoints([]);
    });
}

function resetRoom() {
    gameState.minions = [];
    gameState.waypoints = [];
}

function updateAllMinionWaypoints() {
    gameState.minions.forEach(minion => {
        minion.setWaypoints(gameState.waypoints);
    });
}

function togglePause() {
    gameState.paused = !gameState.paused;
}

// Update UI
function updateUI() {
    document.getElementById('minionCount').textContent = gameState.minions.length;
    document.getElementById('waypointCount').textContent = gameState.waypoints.length;
    document.getElementById('fps').textContent = gameState.fps;

    // Update minion details list
    const detailsDiv = document.getElementById('minionDetails');
    detailsDiv.innerHTML = gameState.minions.map(m => 
        `<div class="minion-entry">🍌 ${m.job.name} (#${m.id.substr(0, 4)}) - Position: (${Math.round(m.x)}, ${Math.round(m.y)})</div>`
    ).join('');
}

// Game loop
function gameLoop() {
    // Update
    if (!gameState.paused) {
        gameState.minions.forEach(minion => {
            minion.update();
            minion.separateFrom(gameState.minions);
        });
    }

    // Draw
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw waypoints
    gameState.waypoints.forEach((waypoint, index) => {
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(waypoint.x, waypoint.y, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#FFA500';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Draw waypoint number
        ctx.fillStyle = '#000';
        ctx.font = 'bold 10px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(index + 1, waypoint.x, waypoint.y);
    });

    // Draw waypoint path
    if (gameState.waypoints.length > 1) {
        ctx.strokeStyle = 'rgba(255, 165, 0, 0.3)';
        ctx.lineWidth = 2;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(gameState.waypoints[0].x, gameState.waypoints[0].y);
        for (let i = 1; i < gameState.waypoints.length; i++) {
            ctx.lineTo(gameState.waypoints[i].x, gameState.waypoints[i].y);
        }
        ctx.stroke();
        ctx.setLineDash([]);
    }

    // Draw minions
    gameState.minions.forEach(minion => minion.draw());

    // Update FPS
    gameState.frameCount++;
    const now = Date.now();
    if (now - gameState.lastFpsTime >= 1000) {
        gameState.fps = gameState.frameCount;
        gameState.frameCount = 0;
        gameState.lastFpsTime = now;
    }

    updateUI();
    requestAnimationFrame(gameLoop);
}

// Start simulation with initial minions
for (let i = 0; i < 3; i++) {
    addMinion();
}

gameLoop();
