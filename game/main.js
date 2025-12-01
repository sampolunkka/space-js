import {Player} from './player/player.js';
import {isColliding, isEnemy} from './utils.js';
import {setupPlayerControls} from './player/controller.js';
import {drawHUD, HUD_HEIGHT} from "./hud.js";
import {INTERNAL_WIDTH, INTERNAL_HEIGHT, PATH_ASSETS, SCREEN_DARK, SCREEN_LIGHT, ColorPalette} from "./const.js";
import {AssetLoader} from "./asset-loader.js";
import {firstLevel} from './level/levels.js';
import {createEnemy} from "./enemy/enemy-factory.js";

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
  rocket: PATH_ASSETS + 'rocket.png'
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
    animate();
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

function spawnGameObject() {
  const currentTime = performance.now() - levelStartTime;
  const spawnConfig = currentLevel.getSpawn(currentTime);
  if (spawnConfig) {
    console.log('Spawning:', spawnConfig);
    let enemy = createEnemy(spawnConfig.type, spawnConfig.x, spawnConfig.y);
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

function drawPausedOverlay(ctx) {
  ctx.save();
  // Draw the pause overlay image centered
  const img = loadedImages.pauseOverlay;
  if (img && img.complete) {
    const x = 0;
    const y = 0;

    // Fill with tint color
    ctx.fillStyle = colorPalette.foreground; // Example: impact green
    ctx.fillRect(x, y, INTERNAL_WIDTH, INTERNAL_WIDTH);

    ctx.globalCompositeOperation = "destination-in";
    ctx.drawImage(img, x, y, INTERNAL_WIDTH, INTERNAL_HEIGHT);

    // Restore composite operation
    ctx.globalCompositeOperation = "source-over";
  }
  ctx.restore();
}

function animate() {
  if (!paused) {
    drawScene();

    const now = performance.now();
    spawnGameObject();
  } else {
    // Draw the current game state (objects and HUD) without updating
    backgroundLayerCanvasCtx.fillStyle = colorPalette.background;
    backgroundLayerCanvasCtx.fillRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);

    gameLayerCanvasCtx.clearRect(0, 0, INTERNAL_WIDTH, INTERNAL_HEIGHT);
    gameLayerCanvasCtx.imageSmoothingEnabled = false;

    // Draw all game objects in their current positions
    drawGameObjects(gameLayerCanvasCtx, gameObjects);

    // Draw HUD
    drawHUD(gameLayerCanvasCtx, player, score);

    // Tint layers if needed
    tintLayer(gameLayerCanvasCtx, colorPalette.foreground);

    // Overlay "Paused"
    drawPausedOverlay(gameLayerCanvasCtx);
  }

  requestAnimationFrame(animate);
}
