import {Bullet} from './projectiles/bullet.js';
import {Bomb} from './projectiles/bomb.js';
import {BulletSource} from './const.js';
import {loadedImages} from "./main.js";

export function setupPlayerControls(player, gameObjects) {
  const movement = { up: false, down: false };
  let shootPressed = false;
  let bombPressed = false;

  // Configurable constants
  const PLAYER_SPEED = 1;
  const BULLET_COOLDOWN_MS = 100;
  const BOMB_COOLDOWN_MS = 800;
  const MOVE_DELAY_MS = 25; // Move delay per direction

  let lastBulletTime = 0;
  let lastBombTime = 0;
  let lastMove = { up: 0, down: 0 };

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
        shootPressed = true;
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
        shootPressed = false;
        break;
      case 'Enter':
        bombPressed = false;
        break;
    }
  });

  function updatePlayerControls(playArea) {
    const now = performance.now();
    const bulletImg = loadedImages.bullet;

    // Movement with delay
    if (movement.up && now - lastMove.up >= MOVE_DELAY_MS) {
      player.y -= PLAYER_SPEED;
      lastMove.up = now;
    }
    if (movement.down && now - lastMove.down >= MOVE_DELAY_MS) {
      player.y += PLAYER_SPEED;
      lastMove.down = now;
    }

    // Clamp position
    player.y = Math.max(playArea.y, Math.min(player.y, playArea.y + playArea.height - player.height));

    // Shooting
    if (shootPressed && now - lastBulletTime >= BULLET_COOLDOWN_MS) {
      lastBulletTime = now;
      const bullet = new Bullet(player.x + 22, player.y + 7, bulletImg, player.bulletDamage, BulletSource.PLAYER);
      gameObjects.push(bullet);
    }

    // Bomb
    if (bombPressed && player.bombs > 0 && now - lastBombTime >= BOMB_COOLDOWN_MS) {
      lastBombTime = now;
      player.bombs--;
      const bomb = new Bomb(player.x + 11, player.y - 2, loadedImages.bomb);
      gameObjects.push(bomb);
    }
  }

  return { updatePlayerControls };
}
