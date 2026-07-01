# 🍌 Minions Room Simulator 🍌

A fun and interactive browser-based simulator where colorful minions with different job titles walk around a room, interact with each other, and follow waypoints you set.

## Features

✨ **8 Different Jobs with Unique Characteristics:**
- **Engineer** - Fast (🔴 Red)
- **Scientist** - Steady (🔵 Blue)
- **Manager** - Slow leader (🟠 Orange)
- **Pilot** - Very Fast (🟢 Green)
- **Security** - Alert (🔴 Dark Red)
- **Doctor** - Careful (🟡 Yellow)
- **Chef** - Relaxed (🟠 Brown)
- **Technician** - Quick (🟣 Purple)

🎮 **Interactive Controls:**
- **Click** on the canvas to place waypoints (minions will follow them)
- **Double-click** a minion to remove it
- **Add Minion** button to spawn new workers
- **Clear Waypoints** to let minions wander freely
- **Pause/Resume** simulation
- **Reset Room** to start over

🤖 **Smart AI Behavior:**
- Autonomous wandering when no waypoints are set
- Smooth waypoint following
- Collision avoidance between minions
- Boundary collision handling
- Real-time FPS counter

📊 **Live Statistics:**
- Active minion count
- Waypoint tracker
- Individual minion details (job, position)
- Performance monitoring

## How to Play

1. **Open** `index.html` in a web browser
2. **Click** on the canvas to create a path of waypoints (numbered)
3. **Watch** as minions navigate to each waypoint in order
4. **Add more minions** using the button - each gets a unique job
5. **Double-click** minions to remove them
6. **Clear waypoints** to let them wander around randomly

## Game Mechanics

- **Waypoint System**: Minions follow waypoints in order, then loop back to the start
- **Wandering**: Without waypoints, minions move randomly and change direction occasionally
- **Separation**: Minions avoid each other to prevent overlap
- **Job Speeds**: Each job has different movement speeds (Pilots are fastest, Chefs are slowest)
- **Visual Identity**: Each minion shows their job title and has a unique color

## Files

- `index.html` - Main interface and canvas
- `minions.js` - Game logic, minion AI, and simulation engine
- `README.md` - This file

## Browser Compatibility

Works on all modern browsers (Chrome, Firefox, Safari, Edge) that support HTML5 Canvas.

## Future Enhancements

- Save/load configurations
- Sound effects
- More job types
- Collision physics
- Task delegation between minions
- Custom minion naming
- Difficulty levels

---

**Made with ❤️ for minion lovers everywhere! 🍌**
