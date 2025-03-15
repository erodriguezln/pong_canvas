export function createBox(ctx, x, y, width, height) {
  ctx.fillStyle = 'white';
  ctx.fillRect(x, y, width, height);
}

export function dottedLine(ctx, x, y) {
  ctx.beginPath();
  ctx.setLineDash([10, 10]);
  ctx.moveTo(x, 4);
  ctx.lineTo(x, y);
  ctx.strokeStyle = 'grey';
  ctx.lineWidth = 4;
  ctx.stroke();
}

export function drawScore(ctx, x, y, score) {
  ctx.font = '50px Arial';
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(score.toString(), x, y);
}

export function drawText(ctx, x, y, text, size = '50') {
  ctx.font = `${size}px Arial`;
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.fillText(text.toString(), x, y);
}

export function createCircle(ctx, x, y, radius) {
  // Align to pixel boundaries for crisp rendering
  const alignedX = Math.round(x) + 0.5;
  const alignedY = Math.round(y) + 0.5;

  ctx.beginPath();
  ctx.arc(alignedX, alignedY, radius, 0, Math.PI * 2, false);
  ctx.fillStyle = 'white';
  ctx.fill();
  ctx.closePath();
}

export function debugLine(ctx, x, y, dx, dy) {
  ctx.beginPath();
  ctx.setLineDash([15, 15]);
  ctx.moveTo(x, y);
  ctx.lineTo(dx, dy);
  ctx.strokeStyle = 'orange';
  ctx.lineWidth = 2;
  ctx.stroke();
}