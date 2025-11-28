import {Player} from './player.js';
import {Enemy, ENEMY_WIDTH, ENEMY_HEIGHT} from './enemy.js';
import {isColliding} from './collision.js';
import {drawNumber} from './font5x5.js';
import { Bullet, BulletSource } from './bullet.js';

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
const heartImg = new Image();
const bombImg = new Image();

canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;

let player;
let score;
let lastEnemySpawnTime;
const bullets = [];
const enemies = [];

function initGame() {
  player = new Player(1, 1);
  score = 0;
  lastEnemySpawnTime = performance.now();
  bullets.length = 0;
  enemies.length = 0;
}

function startGame() {
  resizeCanvas();
  initGame();
  animate();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', startGame);

window.addEventListener('keydown', e => {
  const now = performance.now();
  if (e.key === 'Enter') {
    const bomb = player.useBomb(now);
    if (bomb) {
      bullets.push(bomb);
    }
    return;
  }
  const bullet = player.handleKeyDown(e);
  if (bullet) {
    bullets.push(bullet);
  }
});
window.addEventListener('keyup', e => player.handleKeyUp(e));

playerImg.src = 'img/player.png';
heartImg.src = 'img/heart.png';
bombImg.src = 'img/bomb.png';

function resetGame() {
  initGame();
}

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

function drawPlayerBombs(ctx, bombs) {
  const BOMB_SIZE = 5;
  const MARGIN_LEFT = 34;
  const MARGIN_TOP = 1; // Draw below hearts, adjust as needed
  const GAP = 3;
  ctx.drawImage(
    bombImg,
    MARGIN_LEFT,
    MARGIN_TOP,
    BOMB_SIZE,
    BOMB_SIZE);

  const bombsStr = String(bombs).padStart(2, '0');

  drawNumber(
    ctx,
    bombsStr,
    MARGIN_LEFT + (BOMB_SIZE + GAP),
    1,
    1,
    1,
    '#000'
  );
}

function spawnEnemy() {
  const y = Math.floor(Math.random() * (playArea.height - ENEMY_HEIGHT)) + playArea.y;
  enemies.push(new Enemy(playArea.x + playArea.width - ENEMY_WIDTH, y));
}

function drawGUI() {
  // Draw rectangle under UI (below UI bar)
  ctx.fillStyle = NOKIA_GREEN; // Slightly lighter green for contrast
  ctx.fillRect(0, 0, INTERNAL_WIDTH, 7);

  // Draw HP hearts
  drawPlayerHP(ctx, player.hp);

  // Draw bombs
  drawPlayerBombs(ctx, player.bombs);

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
}

function drawScene() {
  ctx.fillStyle = NOKIA_GREEN;
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  ctx.imageSmoothingEnabled = false;

  player.tick(playArea);

  if (playerImg.complete) {
    ctx.drawImage(playerImg, Math.floor(player.x), Math.floor(player.y));
  }

  // Update and draw bullets
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].update();
    bullets[i].draw(ctx);
    if (bullets[i].isOutOfBounds(playArea)) {
      bullets.splice(i, 1);
    }
  }

  // Update and draw enemies
  for (let i = enemies.length - 1; i >= 0; i--) {
    enemies[i].update(playArea, bullets);
    enemies[i].draw(ctx);
    if (enemies[i].isOutOfBounds(playArea)) {
      enemies.splice(i, 1);
    }
  }

  // --- Collision detection: bullets vs enemies ---
  for (let b = bullets.length - 1; b >= 0; b--) {
    const bulletBox = bullets[b].getCollisionBox();
    for (let e = enemies.length - 1; e >= 0; e--) {
      const enemyBox = enemies[e].getCollisionBox();
      if (isColliding(bulletBox, enemyBox)) {
        score += enemies[e].scoreValue;
        bullets.splice(b, 1);
        enemies.splice(e, 1);
        break;
      }
    }
  }

  // --- Player vs Enemy collision detection ---
  const playerBox = {
    x: player.x,
    y: player.y,
    width: playerImg.width || 7,
    height: playerImg.height || 7
  };
  for (let i = enemies.length - 1; i >= 0; i--) {
    const enemyBox = enemies[i].getCollisionBox();
    if (isColliding(playerBox, enemyBox)) {
      player.hp = Math.max(0, player.hp - 1);
      enemies.splice(i, 1);
      if (player.hp === 0) {
        resetGame();
        return; // Stop further drawing this frame
      }
    }
  }

  // --- Player vs Enemy Bullets collision detection ---
  for (let b = bullets.length - 1; b >= 0; b--) {
    if (bullets[b].source === BulletSource.ENEMY) {
      const bulletBox = bullets[b].getCollisionBox();
      if (isColliding(playerBox, bulletBox)) {
        player.hp = Math.max(0, player.hp - bullets[b].damage);
        bullets.splice(b, 1);
        if (player.hp === 0) {
          resetGame();
          return;
        }
      }
    }
  }

  // --- Bullet vs Bullet collision detection ---
  for (let i = bullets.length - 1; i >= 0; i--) {
    const bulletA = bullets[i];
    if (!bulletA) continue; // Defensive check
    for (let j = bullets.length - 1; j >= 0; j--) {
      if (i === j) continue;
      const bulletB = bullets[j];
      if (!bulletB) continue; // Defensive check
      if (isColliding(bulletA.getCollisionBox(), bulletB.getCollisionBox())) {
        const result = bulletA.collideWithBullet(bulletB);
        if (result.destroyThis) bullets.splice(i, 1);
        if (result.destroyOther) bullets.splice(j > i ? j - 1 : j, 1);
        break; // Exit inner loop after removal
      }
    }
  }

  drawGUI();
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
