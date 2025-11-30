import {BulletSource, GameObjectType} from "./const.js";

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
  return isBullet(bullet) && bullet.source === BulletSource.PLAYER;
}

export function isEnemyBullet(bullet) {
  return isBullet(bullet) && bullet.source === BulletSource.ENEMY;
}

export function isColliding(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
