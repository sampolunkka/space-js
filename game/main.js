import {Player} from './player.js';
import {Enemy} from './enemy.js';
import {isColliding, isEnemy} from './utils.js';
import {setupPlayerControls} from './controller.js';
import {drawHUD, HUD_HEIGHT} from "./hud.js";
import {INTERNAL_WIDTH, INTERNAL_HEIGHT, PATH_ASSETS, SCREEN_DARK, SCREEN_LIGHT, ColorPalette} from "./const.js";
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

const container = document.getElementById("game-container");

const backgroundLayerCanvas = document.getElementById('bg-layer');
const backgroundLayerCanvasCtx = backgroundLayerCanvas.getContext('2d');

const gameLayerCanvas = document.getElementById('game-layer');
const gameLayerCanvasCtx = gameLayerCanvas.getContext('2d');

gameLayerCanvas.width = INTERNAL_WIDTH;
gameLayerCanvas.height = INTERNAL_HEIGHT;

backgroundLayerCanvas.width = INTERNAL_WIDTH;
backgroundLayerCanvas.height = INTERNAL_HEIGHT;

const ASSETS = {
  player: PATH_ASSETS + 'player.png',
  enemy: PATH_ASSETS + 'rocket.png',
  bullet: PATH_ASSETS + 'bullet.png',
  bomb: PATH_ASSETS + 'bomb.png'
};

const assetLoader = new AssetLoader(ASSETS);
export let loadedImages = {};

let player, score, lastEnemySpawnTime, gameObjects, controller;
let colorPalette = ColorPalette.DARK;

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
  gameObjects.push(new Enemy(x, y, loadedImages.enemy));
}

function tintLayer(ctx, color) {
  ctx.globalCompositeOperation = "source-in";
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.globalCompositeOperation = "source-over";
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

    // On destroy
    if (obj.destroyed) {
      if (isEnemy(obj)) {
        score += obj.scoreValue;
      }
      return false
    }

    // On out of bounds
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
  backgroundLayerCanvasCtx.fillStyle = colorPalette.background;
  backgroundLayerCanvasCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  gameLayerCanvasCtx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
  gameLayerCanvasCtx.imageSmoothingEnabled = false;

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
  drawGameObjects(gameLayerCanvasCtx, gameObjects);

  // 5. Draw GUI
  drawHUD(gameLayerCanvasCtx, player, score);

  // 6. Tint layers if needed
  tintLayer(gameLayerCanvasCtx, colorPalette.foreground);
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
  container.style.width = `${INTERNAL_WIDTH * scale}px`;
  container.style.height = `${INTERNAL_HEIGHT * scale}px`;
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
