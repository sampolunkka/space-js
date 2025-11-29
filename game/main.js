import {Player} from './player.js';
import {Enemy} from './enemy.js';
import {isColliding} from './utils.js';
import {setupPlayerControls} from './controller.js';
import {drawHUD, HUD_HEIGHT} from "./hud.js";
import {NOKIA_GREEN, INTERNAL_WIDTH, INTERNAL_HEIGHT} from "./const.js";
import {AssetLoader} from "./assetloader.js";

const ENEMY_SPAWN_INTERVAL_MS = 2000;

const PLAY_AREA_X = 0;
const PLAY_AREA_Y = HUD_HEIGHT;
const PLAY_AREA_WIDTH = INTERNAL_WIDTH;
const PLAY_AREA_HEIGHT = INTERNAL_HEIGHT - HUD_HEIGHT;

const playArea = {
  x: PLAY_AREA_X,
  y: PLAY_AREA_Y,
  width: PLAY_AREA_WIDTH,
  height: PLAY_AREA_HEIGHT
};

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

canvas.width = INTERNAL_WIDTH;
canvas.height = INTERNAL_HEIGHT;

const ASSETS = {
  player: './img/player.png',
  enemy: './img/enemy-rocket.png',
  bullet: './img/bullet.png'
};

const assetLoader = new AssetLoader(ASSETS);
export let loadedImages = {};

let player, score, lastEnemySpawnTime, gameObjects, controller;

function initGame() {
  gameObjects = [];
  player = new Player(1, 1, loadedImages.player);
  gameObjects.push(player);
  score = 0;
  lastEnemySpawnTime = performance.now();
  controller = setupPlayerControls(player, gameObjects);
}

function startGame() {
  resizeCanvas();
  assetLoader.loadAll().then(images => {
    loadedImages = images;
    initGame();
    animate();
  });
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', startGame);

function resetGame() {
  initGame();
}

function spawnEnemy() {
  const y = Math.floor(Math.random() * (PLAY_AREA_HEIGHT - playArea.y)) + playArea.y;
  const x = playArea.x + playArea.width - 7;
  console.log(`Spawning enemy at (${x}, ${y})`);
  gameObjects.push(new Enemy(x, y, loadedImages.enemy));
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
  drawHUD(ctx, player, score);
  if (player.hp <= 0) {
    resetGame();
  }
}

function getMaxScale() {
  const maxWidth = window.innerWidth * 0.8;
  const maxHeight = window.innerHeight * 0.8;
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
