

// Hexagonal Grid Class using Axial Coordinates (q, r)
export default class HexGrid {
  cells = new Map();
  static directions = [
    { q: 1, r: 0 },   // Right
    { q: 1, r: -1 },  // Up-Right
    { q: 0, r: -1 },  // Up-Left
    { q: -1, r: 0 },  // Left
    { q: -1, r: 1 },  // Down-Left
    { q: 0, r: 1 }    // Down-Right
  ];
  constructor(drawnHexSize = 30, orientation = 'flat') {
    this.hexSize = drawnHexSize; // Size of each hexagon
    this.orientation = orientation; // 'flat' or 'pointy'
  }

  _makePlace(q, r) {
    if (!this.map.has(q, r)) {
      this.map.set(q + '|' + r, new Map());
    }
  }
  getPiece(q, r, name) {
    _makePlace(q, r);
    return this.map(q, r).get(name);
  }

  setPiece(q, r, o) {
    _makePlace(q, r);
    o.q = q; o.r = r;
    map.get(q, r).set(o.name, o);
  }

  getNeighborsInRadius(q, r, radius) {
    const neighbors = [];
    for (let dq = -radius; dq <= radius; dq++) {
      for (let dr = Math.max(-radius, -dq - radius); dr <= Math.min(radius, -dq + radius); dr++) {
        const ds = -dq - dr;
        if (Math.abs(dq) + Math.abs(dr) + Math.abs(ds) <= radius * 2) {
          const nq = q + dq;
          const nr = r + dr;
          // Exclude the center hex when radius > 0
          if (!(dq === 0 && dr === 0)) {
            neighbors.push({ q: nq, r: nr });
          }
        }
      }
    }
    return neighbors;
  }
  getDistance(q1, r1, q2, r2) {
    const dq = q2 - q1;
    const dr = r2 - r1;
    const ds = -dq - dr;

    return (Math.abs(dq) + Math.abs(dr) + Math.abs(ds)) / 2;
  }
  getDirection(q1, r1, q2, r2) {
    const dq = q2 - q1;
    const dr = r2 - r1;
    // Normalize the direction
    const distance = this.getDistance(q1, r1, q2, r2);
    if (distance === 0) {
      return { q: 0, r: 0 };
    }
    // Find the closest direction
    let bestDir = HexGrid.directions[0];
    let minDist = Infinity;
    for (const dir of HexGrid.directions) {
      const testQ = q1 + dir.q;
      const testR = r1 + dir.r;
      const dist = this.getDistance(testQ, testR, q2, r2);
      if (dist < minDist) {
        minDist = dist;
        bestDir = dir;
      }
    }
    return bestDir;
  }
  //For drawing..
  hexToPixel(q, r) {
    let x, y;
    if (this.orientation === 'flat') {
      x = this.hexSize * (3 / 2 * q);
      y = this.hexSize * (Math.sqrt(3) / 2 * q + Math.sqrt(3) * r);
    } else { // pointy
      x = this.hexSize * (Math.sqrt(3) * q + Math.sqrt(3) / 2 * r);
      y = this.hexSize * (3 / 2 * r);
    }
    return { x, y };
  }
  //For getting where the mouse is..
  screenToGrid(screenX, screenY) {
    let q, r;
    if (this.orientation === 'flat') {
      q = (2 / 3 * screenX) / this.hexSize;
      r = (-1 / 3 * screenX + Math.sqrt(3) / 3 * screenY) / this.hexSize;
    } else { // pointy
      q = (Math.sqrt(3) / 3 * screenX - 1 / 3 * screenY) / this.hexSize;
      r = (2 / 3 * screenY) / this.hexSize;
    }

    // Round to nearest hex (axial coordinates)
    return this.roundHex(q, r);
  }
  // Helper method to round fractional hex coordinates to nearest hex
  roundHex(q, r) {
    const s = -q - r;
    let rq = Math.round(q);
    let rr = Math.round(r);
    let rs = Math.round(s);
    const qDiff = Math.abs(rq - q);
    const rDiff = Math.abs(rr - r);
    const sDiff = Math.abs(rs - s);

    if (qDiff > rDiff && qDiff > sDiff) {
      rq = -rr - rs;
    } else if (rDiff > sDiff) {
      rr = -rq - rs;
    }

    return { q: rq, r: rr };
  }
  drawHex(ctx, q, r, centerQ, centerR, canvasWidth, canvasHeight, fillColor = '#ffffff', strokeColor = '#000000', lineWidth = 1) {
    const { x, y } = this.hexToPixel(q, r);
    const { x: centerX, y: centerY } = this.hexToPixel(centerQ, centerR);
    // Calculate offset to center the specified hex on screen
    const offsetX = canvasWidth / 2 - centerX;
    const offsetY = canvasHeight / 2 - centerY;
    const corners = this.getHexCorners(x + offsetX, y + offsetY);
    ctx.beginPath();
    ctx.moveTo(corners[0].x, corners[0].y);
    for (let i = 1; i < corners.length; i++) {
      ctx.lineTo(corners[i].x, corners[i].y);
    }
    ctx.closePath();
    if (fillColor) {
      if (q === centerQ || r == centerR) {
        ctx.fillStyle = '#ffffff', strokeStyle = '#ff0000', lineWidth = 5;
      } else {
        ctx.fillStyle = fillColor; ctx.fill();
      }
      if (strokeColor) {
        ctx.strokeStyle = strokeColor; ctx.lineWidth = lineWidth; ctx.stroke();
      }
    }
  }
  // Draw the entire grid within a given range
  // centerQ, centerR: the hex coordinates that should be centered on screen

  drawGrid(ctx, qMin, qMax, rMin, rMax, centerQ, centerR, canvasWidth, canvasHeight, fillColor = '#ffffff', strokeColor = '#444444', lineWidth) {
    for (let q = qMin; q <= qMax; q++) {
      for (let r = rMin; r <= rMax; r++) {
        this.drawHex(ctx, q, r, centerQ, centerR, canvasWidth, canvasHeight, fillColor, strokeColor, lineWidth);
      }
    }
  }
  //pixels in, pixels out..
  getHexCorners(centerX, centerY) {
    const corners = [];
    const startAngle = this.orientation === 'flat' ? 0 : 30;
    for (let i = 0; i < 6; i++) {
      const angleDeg = 60 * i + startAngle;
      const angleRad = Math.PI / 180 * angleDeg;
      corners.push({
        x: centerX + this.hexSize * Math.cos(angleRad),
        y: centerY + this.hexSize * Math.sin(angleRad)
      });
    }
    return corners;
  }
  drawHexText(ctx, q, r, centerQ, centerR, canvasWidth, canvasHeight, text, color = '#000000', fontSize = 12) {
    const { x, y } = this.hexToPixel(q, r);
    const { x: centerX, y: centerY } = this.hexToPixel(centerQ, centerR);

    // Calculate offset to center the specified hex on screen
    const offsetX = canvasWidth / 2 - centerX;
    const offsetY = canvasHeight / 2 - centerY;

    ctx.fillStyle = color;
    ctx.font = `${fontSize}px Arial`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(text, x + offsetX, y + offsetY);
  }
}

// Export for use in Node.js or browsers
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HexGrid;
}
