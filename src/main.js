import { Game } from './Game.js';

const game = new Game();
game.render();

let lastTime = performance.now();
const minDT = 0.006;
const maxDT = 0.007;

function gameLoop() {
  const now = performance.now();
  let deltaTime = (now - lastTime) / 1000;
  lastTime = now;

  deltaTime = Math.max(minDT, Math.min(deltaTime, maxDT));

  game.update(deltaTime);

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);