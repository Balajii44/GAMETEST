// Prevent page scrolling with arrow keys
window.addEventListener('keydown', function(e) {
    // Prevent default behavior for arrow keys and space
    if([32, 37, 38, 39, 40].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, { passive: false });

// Prevent touch scrolling
window.addEventListener('touchmove', function(e) {
    e.preventDefault();
}, { passive: false });

// Prevent mouse wheel scrolling
window.addEventListener('wheel', function(e) {
    e.preventDefault();
}, { passive: false });

// Prevent default touch behavior
document.body.addEventListener('touchstart', function(e) {
    e.preventDefault();
}, { passive: false });

// Maze configuration
const mazeConfig = {
    width: 15,
    height: 15,
    cellSize: 30,
    wallColor: '#ff00ff',
    pathColor: '#1a1a1a',
    playerColor: '#00ffff',
    exitColor: '#00ff00'
};

// Simple geometric maze layout
const mazeLayout = [
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,0,1,1,1,1,1,1,1,1,1,1,1,0,1],
    [1,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
    [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1]
];

// Player starting position
let player = {
    x: 1,
    y: 1
};

// Exit position
const exit = {
    x: 13,
    y: 13
}; 