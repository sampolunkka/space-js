import {Player} from './player/player.js';
import {isColliding, isEnemy} from './utils.js';
import {setupPlayerControls} from './player/controller.js';
import {drawHUD, HUD_HEIGHT} from "./hud.js";
import {INTERNAL_WIDTH, INTERNAL_HEIGHT, PATH_ASSETS, SCREEN_DARK, SCREEN_LIGHT, TICK_RATE, TICK_STEP, ColorPalette} from "./const.js";
import {AssetLoader} from "./asset-loader.js";
import {firstLevel} from './level/levels.js';
import {createEnemy} from "./enemy/enemy-factory.js";
let last = performance.now();
let accumulator = 0;
let tick = 0;

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
  bomb: PATH_ASSETS + 'bomb.png',
  pauseOverlay: PATH_ASSETS + 'pause-overlay.png',
  rocket: PATH_ASSETS + 'rocket.png',
  jelly: PATH_ASSETS + 'jelly.png',
  lander: PATH_ASSETS + 'lander.png',
};

const assetLoader = new AssetLoader(ASSETS);
export let loadedImages = {};

let player, score, gameObjects, controller;
let colorPalette = ColorPalette.DARK;
let paused = true;
let currentLevel = null;
let levelStartTime = 0;
let gameStarted = false;

function initGame() {
  gameObjects = [];
  player = new Player(1, 48, loadedImages.player);
  gameObjects.push(player);
  score = 0;
  controller = setupPlayerControls(player, gameObjects);
}

function startLevel() {
  currentLevel = firstLevel;
  levelStartTime = performance.now();
  colorPalette = currentLevel.colorPalette;
}

function startGame() {
  resizeCanvas();
  assetLoader.loadAll().then(images => {
    loadedImages = images;
    initGame();
    requestAnimationFrame(gameLoop);
  });
}

window.addEventListener('resize', resizeCanvas);
window.addEventListener('DOMContentLoaded', startGame);
window.addEventListener('keydown', (e) => {
  if (e.code === 'Escape') {
    paused = !paused;
    if (!gameStarted) {
      gameStarted = true;
      paused = false;
      startLevel();
    }
  }
});

function resetGame() {
  initGame();
}

function spawnGameObject(currentTick) {
  const spawnConfig = currentLevel.getSpawn(currentTick);
  if (spawnConfig) {
    let enemy = createEnemy(spawnConfig.enemyType, spawnConfig.x, spawnConfig.y);
    gameObjects.push(enemy);
  }
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

  //TODO: When game objects collide, no bullet damage is transferred to enemy. This is likely due to changing
  //constructors of game objects, bullets, enemies, etc. Need to investigate and fix.

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
    if (obj.destroyed) {
      if (isEnemy(obj)) {
        score += obj.scoreValue;
      }
      return false
    }
    if (obj.isOutOfBounds && obj.isOutOfBounds(playArea)) return false;
    return true;
  });
}

function drawGameObjects(ctx, gameObjects, tick, alpha) {
  for (const obj of gameObjects) {
    if (obj.draw) obj.draw(ctx, tick, alpha);
  }
}

function drawScene(alpha) {
  backgroundLayerCanvasCtx.fillStyle = colorPalette.background;
  backgroundLayerCanvasCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

  gameLayerCanvasCtx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
  gameLayerCanvasCtx.imageSmoothingEnabled = false;

  drawGameObjects(gameLayerCanvasCtx, gameObjects, tick, alpha);
  drawHUD(gameLayerCanvasCtx, player, score);
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

function drawPausedOverlay(ctx) {
  backgroundLayerCanvasCtx.fillStyle = colorPalette.background;
  backgroundLayerCanvasCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
  ctx.imageSmoothingEnabled = false;
  ctx.save();
  const img = loadedImages.pauseOverlay;
  if (img && img.complete) {
    const x = 0;
    const y = 0;
    ctx.fillStyle = colorPalette.foreground;
    ctx.fillRect(x, y, INTERNAL_WIDTH, INTERNAL_WIDTH);
    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(img, x, y, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.restore();
}

// Main game loop with fixed tickrate
function gameLoop(now) {
  if (paused) {
    drawPausedOverlay(gameLayerCanvasCtx);
    requestAnimationFrame(gameLoop);
    return;
  }

  let delta = now - last;
  last = now;
  accumulator += delta;

  while (accumulator >= TICK_STEP) {
    if (controller && controller.updatePlayerControls) {
      controller.updatePlayerControls(playArea, tick);
    }
    updateGameObjects(gameObjects, playArea);
    collideGameObjects(gameObjects);
    const cleanedObjects = cleanupGameObjects(gameObjects, playArea);
    gameObjects.length = 0;
    gameObjects.push(...cleanedObjects);

    spawnGameObject(tick);

    tick++;
    accumulator -= TICK_STEP;
  }

  const alpha = accumulator / TICK_STEP;

  drawScene(alpha);
  requestAnimationFrame(gameLoop);
}
