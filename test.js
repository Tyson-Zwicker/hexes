import HexGrid from './hexgrid.js';

const grid = new HexGrid(30, 'flat'); // 30px hexes, flat orientation
const neighbors = grid.getNeighborsInRadius(0, 0, 2);
const distance = grid.getDistance(0, 0, 3, 2);
const direction = grid.getDirection(0, 0, 3, 2);
const hex = grid.screenToGrid(150, 200);
document.getElementById('canvas');
const ctx = canvas.getContext('2d');
document.addEventListener('DOMContentLoaded', function () {
  grid.drawGrid(ctx, 0, 30, 0, 30, 15, 15, canvas.width, canvas.height,'#112255', '#557700' , 2);
});
