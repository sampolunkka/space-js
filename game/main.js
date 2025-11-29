import {Player} from './player.js';
import {Enemy} from './enemy.js';
import {isColliding} from './utils.js';
import {drawNumber} from './font5x5.js';
import {setupPlayerControls} from './controller.js';

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
const gameObjects = [];
let controller;

function initGame() {
  gameObjects.length = 0;
  player = new Player(1, 1, 11, 7, playerImg); // Pass playerImg
  gameObjects.push(player);
  score = 0;
  lastEnemySpawnTime = performance.now();
  controller = setupPlayerControls(player, gameObjects);
}

function startGame() {
  resizeCanvas();
  initGame();
  animate();
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', startGame);

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
  const y = Math.floor(Math.random() * (playArea.height - 7)) + playArea.y;
  gameObjects.push(new Enemy(playArea.x + playArea.width - 7, y));
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

function updateGameObjects(gameObjects, playArea) {
  for (const obj of gameObjects) {
    if (obj.update) {
      obj.update(playArea, gameObjects);
    }
  }
}

function collideGameObjects(gameObjects) {
  const len = gameObjects.length;

  for (let i = 0; i < len; i++) {
    const objA = gameObjects[i];

    for (let j = i + 1; j < len; j++) {
      const objB = gameObjects[j];

      if (
        objA.getCollisionBox &&
        objB.getCollisionBox &&
        isColliding(objA.getCollisionBox(), objB.getCollisionBox())
      ) {
        objA.collideWith(objB);
        objB.collideWith(objA);
      }
    }
  }
}

function cleanupGameObjects(gameObjects, playArea) {
  return gameObjects.filter(obj => {
    // Remove if explicitly destroyed or out of bounds
    if (obj.destroyed) return false;
    if (obj.isOutOfBounds && obj.isOutOfBounds(playArea)) return false;
    return true;
  });
}

function drawGameObjects(ctx, gameObjects) {
  for (const obj of gameObjects) {
    if (obj.draw) {
      obj.draw(ctx);
    }
  }
}

function drawScene() {
  ctx.fillStyle = NOKIA_GREEN;
  ctx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  ctx.imageSmoothingEnabled = false;

  if (controller && controller.updatePlayerControls) {
    controller.updatePlayerControls(playArea); // <-- Call controls per frame
  }

  // 1. Update all game objects
  updateGameObjects(gameObjects, playArea);

  // 2. Handle collisions
  collideGameObjects(gameObjects);

  // 3. Cleanup destroyed or out-of-bounds objects
  const cleanedObjects = cleanupGameObjects(gameObjects, playArea);
  gameObjects.length = 0;
  gameObjects.push(...cleanedObjects);

  // 4. Draw all game objects
  drawGameObjects(ctx, gameObjects);

  // 5. Draw GUI
  drawGUI();
  if (player.hp <= 0) {
    resetGame();
  }
}

function getControlsHeight() {
  const controls = document.getElementById('controls-bottom');
  return controls ? controls.offsetHeight : 0;
}

function getMaxScale() {
  const controlsHeight = getControlsHeight();
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = (window.innerHeight - controlsHeight) * 0.8;
  const scaleByWidth = Math.floor(maxWidth / INTERNAL_WIDTH);
  const scaleByHeight = Math.floor(maxHeight / INTERNAL_HEIGHT);
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
