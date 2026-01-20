import HexGrid from './hexgrid.js';

const grid = new HexGrid(20, 'flat'); // 30px hexes, flat orientation
const neighbors = grid.getNeighborsInRadius(0, 0, 2);
const distance = grid.getDistance(0, 0, 3, 2);
const direction = grid.getDirection(0, 0, 3, 2);
const hex = grid.screenToGrid(150, 200);
document.getElementById('canvas');
const ctx = canvas.getContext('2d');
document.addEventListener('DOMContentLoaded', function () {
  grid.drawGrid(ctx, 0, 10, 0, 10, 5, 5, canvas.width, canvas.height,'#112255', '#557700' , 2);
  console.log (grid.hexToPixel (0,0));
    console.log (grid.hexToPixel (10,0));
    console.log (grid.hexToPixel (10,10));
    console.log (grid.hexToPixel (0,10));
  canvas.addEventListener ('mouseup',(e)=>{
    let coord = grid.screenToGrid (e.clientX, e.clientY);
    console.log (coord);
    let coords2 = grid.hexToPixel(coord.q, coord.r);
    console.log (coords2);    
  });
});
