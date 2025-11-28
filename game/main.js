// JavaScript

import { Player } from './player.js';
import { Bullet, BULLET_WIDTH, BULLET_HEIGHT } from './bullet.js';
import { Enemy, ENEMY_WIDTH, ENEMY_HEIGHT } from './enemy.js';
import { isColliding } from './collision.js';

// 1. Constants
const NOKIA_GREEN = '#6aa84f';
const INTERNAL_WIDTH = 84;
const INTERNAL_HEIGHT = 48;
const BULLET_COOLDOWN_MS = 140;
const ENEMY_SPAWN_INTERVAL_MS = 2000;

// 2. Canvas and context setup
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

// 3. Game object instantiations
const playerImg = new Image();
const player = new Player(4, 1);

// 4. Canvas size
canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;

// 5. State variables
let lastEnemySpawnTime = 0;
let lastBulletTime = 0;

// 6. Arrays
const bullets = [];
const enemies = [];

// 7. Event listeners
window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', resizeCanvas);
window.addEventListener('keydown', e => {
  const bullet = player.handleKeyDown(e);
  if (bullet) {
    bullets.push(bullet);
  }
});
window.addEventListener('keyup', e => player.handleKeyUp(e));
window.addEventListener('keyup', e => player.handleKeyUp(e));

// 8. Resource loading
playerImg.src = 'img/player.png';

function spawnEnemy() {
  const y = Math.floor(Math.random() * (INTERNAL_HEIGHT - ENEMY_HEIGHT));
  enemies.push(new Enemy(INTERNAL_WIDTH - ENEMY_WIDTH, y));
  console.log('Enemy spawned at', INTERNAL_WIDTH - ENEMY_WIDTH, y);
}

function drawScene() {
  ctx.fillStyle = NOKIA_GREEN;
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  ctx.imageSmoothingEnabled = false;

  player.tick({ width: INTERNAL_WIDTH, height: INTERNAL_HEIGHT });
  if (playerImg.complete) {
    ctx.drawImage(playerImg, Math.floor(player.x), Math.floor(player.y));
  }

  // --- Collision detection: bullets vs enemies ---
  for (let b = bullets.length - 1; b >= 0; b--) {
    const bulletBox = bullets[b].getCollisionBox();
    for (let e = enemies.length - 1; e >= 0; e--) {
      const enemyBox = enemies[e].getCollisionBox();
      if (isColliding(bulletBox, enemyBox)) {
        bullets.splice(b, 1);
        enemies.splice(e, 1);
        break; // Bullet is gone, skip further enemy checks
      }
    }
  }

  // Update and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].draw(ctx);
    if (bullets[i].isOutOfBounds({ width: INTERNAL_WIDTH, height: INTERNAL_HEIGHT })) {
      bullets.splice(i, 1);
    }
  }

  // Update and draw enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update();
    enemies[i].draw(ctx);
    if (enemies[i].isOutOfBounds({ width: INTERNAL_WIDTH, height: INTERNAL_HEIGHT })) {
      enemies.splice(i, 1);
    }
  }
}

function getControlsHeight() {
  const controls = document.getElementById('controls-bottom');
  return controls ? controls.offsetHeight : 0;
}

function getMaxScale() {
  const controlsHeight = getControlsHeight();
  // Subtract controls' height from available window height
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = (window.innerHeight - controlsHeight) * 0.8;
  const scaleByWidth = Math.floor(maxWidth / INTERNAL_WIDTH);
  const scaleByHeight = Math.floor(maxHeight / INTERNAL_HEIGHT);
  // Use the minimum scale to ensure no overlap
  return Math.max(2, Math.min(scaleByWidth, scaleByHeight));
}

function resizeCanvas() {
  const scale = getMaxScale();
  canvas.style.width = `${INTERNAL_WIDTH * scale}px`;
  canvas.style.height = `${INTERNAL_HEIGHT * scale}px`;
}
function animate() {
  drawScene();

  const now = performance.now();
  if (now - lastEnemySpawnTime >= ENEMY_SPAWN_INTERVAL_MS) {
    spawnEnemy();
    lastEnemySpawnTime = now;
  }

  requestAnimationFrame(animate);
}

animate();
