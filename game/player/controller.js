import {Bullet} from '../projectile/projectiles/bullet.js';
import {Bomb} from '../projectile/projectiles/bomb.js';
import {ProjectileSource, SCALE_DEFAULT, TICK_STEP} from '../const.js';
import {loadedImages} from "../main.js";

export function setupPlayerControls(player, gameObjects) {
  const movement = {up: false, down: false};
  let bombPressed = false;

  // Configurable constants
  const BULLET_COOLDOWN_MS = 110;
  const BOMB_COOLDOWN_MS = 800;

  // Convert cooldowns to ticks
  const BULLET_COOLDOWN_TICKS = Math.ceil(BULLET_COOLDOWN_MS / TICK_STEP);
  const BOMB_COOLDOWN_TICKS = Math.ceil(BOMB_COOLDOWN_MS / TICK_STEP);

  let lastBulletTick = -Infinity;
  let lastBombTick = -Infinity;

  // Track if space is held to prevent auto-fire
  let spaceHeld = false;

  window.addEventListener('keydown', e => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        movement.up = true;
        break;
      case 'ArrowDown':
      case 's':
        movement.down = true;
        break;
      case ' ':
        if (!spaceHeld) {
          spaceHeld = true;
        }
        break;
      case 'Enter':
        bombPressed = true;
        break;
    }
  });

  window.addEventListener('keyup', e => {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        movement.up = false;
        break;
      case 'ArrowDown':
      case 's':
        movement.down = false;
        break;
      case ' ':
        spaceHeld = false;
        break;
      case 'Enter':
        bombPressed = false;
        break;
    }
  });

  function updatePlayerControls(playArea, tick) {
    // Move every tick if key is held
    if (movement.up) {
      player.y -= player.speed;
    }
    if (movement.down) {
      player.y += player.speed;
    }

    // Clamp position
    player.y = Math.max(playArea.y, Math.min(player.y, playArea.y + playArea.height - player.height));

    // Bullet: only fire on keydown, not while held
    if (spaceHeld && tick - lastBulletTick >= BULLET_COOLDOWN_TICKS) {
      lastBulletTick = tick;

      const bulletX = player.x + 11 * SCALE_DEFAULT;
      const bulletY = player.y + player.sprite.getMiddleY() - SCALE_DEFAULT/2;
      const bulletImg = loadedImages.bullet;

      const bullet = new Bullet(bulletX, bulletY, bulletImg, player.bulletDamage, ProjectileSource.PLAYER);
      gameObjects.push(bullet);

      // Prevent further shots until key is released
      spaceHeld = false;
    }

    // Bomb
    if (bombPressed && player.bombs > 0 && tick - lastBombTick >= BOMB_COOLDOWN_TICKS) {
      lastBombTick = tick;
      player.bombs--;
      const bomb = new Bomb(player.x + 11, player.y - 2, loadedImages.bomb);
      gameObjects.push(bomb);
    }
  }

  return {updatePlayerControls};
}
