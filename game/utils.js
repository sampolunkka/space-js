import {TICK_STEP, INTERNAL_HEIGHT, ProjectileSource, GameObjectType} from "./const.js";

export function isPlayer(obj) {
  return obj && obj.type === GameObjectType.PLAYER;
}

export function isEnemy(obj) {
  return obj && obj.type === GameObjectType.ENEMY;
}

export function isBullet(obj) {
  return obj && obj.type === GameObjectType.BULLET;
}

export function isBomb(obj) {
  return obj && obj.type === GameObjectType.BOMB;
}

export function isPlayerBullet(bullet) {
  return isBullet(bullet) && bullet.source === ProjectileSource.PLAYER;
}

export function isEnemyBullet(bullet) {
  return isBullet(bullet) && bullet.source === ProjectileSource.ENEMY;
}

export function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

/**
 * Converts speed in "units per second" (100 = full vertical screen/sec)
 * to pixels per tick, accounting for internal resolution.
 * @param {number} unitsPerSecond - Speed in units per second.
 * @param {number} screenHeight - Internal screen height in pixels.
 * @returns {number} Pixels to move per tick.
 */
export function speedUnitsToPixelsPerTick(unitsPerSecond, screenHeight = INTERNAL_HEIGHT) {
  return (unitsPerSecond / 100) * screenHeight * TICK_STEP / 1000;
}
