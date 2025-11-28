// JavaScript

import { Player } from './player.js';
import { Enemy, ENEMY_WIDTH, ENEMY_HEIGHT } from './enemy.js';
import { isColliding } from './collision.js';
import { drawNumber } from './font5x5.js';

const NOKIA_GREEN = '#6aa84f';
const INTERNAL_WIDTH = 84;
const INTERNAL_HEIGHT = 48;
const ENEMY_SPAWN_INTERVAL_MS = 2000;

const UI_HEIGHT = 7;
const PLAY_AREA_X = 0;
const PLAY_AREA_Y = UI_HEIGHT;
const PLAY_AREA_WIDTH = INTERNAL_WIDTH;
const PLAY_AREA_HEIGHT = INTERNAL_HEIGHT - UI_HEIGHT;

const playArea = {
  x: PLAY_AREA_X,
  y: PLAY_AREA_Y,
  width: PLAY_AREA_WIDTH,
  height: PLAY_AREA_HEIGHT
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const playerImg = new Image();
const player = new Player(1, 1);
const heartImg = new Image();

canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;

let score = 0;
let lastEnemySpawnTime = 0;

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
heartImg.src = 'img/heart.png';

function drawPlayerHP(ctx, hp) {
  const HEART_SIZE = 5;
  const MARGIN_LEFT = 1;
  const MARGIN_TOP = 1;
  const GAP = 1;
  for (let i = 0; i < hp; i++) {
    ctx.drawImage(
      heartImg,
      MARGIN_LEFT + i * (HEART_SIZE + GAP),
      MARGIN_TOP,
      HEART_SIZE,
      HEART_SIZE
    );
  }
}

function spawnEnemy() {
  const y = Math.floor(Math.random() * (playArea.height - ENEMY_HEIGHT)) + playArea.y;
  enemies.push(new Enemy(playArea.x + playArea.width - ENEMY_WIDTH, y));
}

function drawScene() {
  ctx.fillStyle = NOKIA_GREEN;
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  ctx.imageSmoothingEnabled = false;

  // Draw HP hearts
  drawPlayerHP(ctx, player.hp);

  // Draw score
  const scoreStr = String(score).padStart(5, '0');
  drawNumber(
    ctx,
    scoreStr,
    56,
    1,
    1,
    1,
    '#000'
  );
  player.tick(playArea);

  if (playerImg.complete) {
    ctx.drawImage(playerImg, Math.floor(player.x), Math.floor(player.y));
  }

  // --- Collision detection: bullets vs enemies ---
  for (let b = bullets.length - 1; b >= 0; b--) {
    const bulletBox = bullets[b].getCollisionBox();
    for (let e = enemies.length - 1; e >= 0; e--) {
      const enemyBox = enemies[e].getCollisionBox();
      if (isColliding(bulletBox, enemyBox)) {
        score += enemies[e].scoreValue; // Add to score
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
    // Restrict bullets to play area
    if (bullets[i].isOutOfBounds(playArea)) {
      bullets.splice(i, 1);
    }
  }

  // Update and draw enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update(playArea);
    enemies[i].draw(ctx);
    // Restrict enemies to play area
    if (enemies[i].isOutOfBounds(playArea)) {
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
