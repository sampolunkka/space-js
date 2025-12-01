import {GameObject} from '../game-object.js';
import {Bullet} from '../projectile/projectiles/bullet.js';
import {isPlayer, isPlayerBullet} from "../utils.js";
import {BulletSource, GameObjectType} from "../const.js";
import {loadedImages} from "../main.js";

export class Enemy extends GameObject {
  /**
   *
   * @param {number} x - X coordinate of the enemy
   * @param {number} y - Y coordinate of the enemy
   * @param {object} sprite - Sprite of the enemy
   */
  constructor(x, y, sprite) {
    super(x, y, sprite);
    this.speed = 0.2;
    this.health = 1;
    this.scoreValue = 100;
    this.lastShotTime = performance.now();
    this.nextShotInterval = Math.random() * (3000 - 2000) + 2000 - 1500;
    this.type = GameObjectType.ENEMY;
  }

  move(playArea) {
    this.x -= this.speed;
    this.y = Math.max(playArea.y, Math.min(this.y, playArea.y + playArea.height - this.height));
  }
  shoot(gameObjects) {
    // Fire bullet
    const now = performance.now();
    if (now - this.lastShotTime >= this.nextShotInterval) {
      gameObjects.push(
        new Bullet(this.x - 2, this.y + this.height / 2, loadedImages.bullet, 1, BulletSource.ENEMY, 0.5)
      );
      this.lastShotTime = now;
      this.nextShotInterval = Math.random() * (3000 - 2000) + 2000;
    }
  }

  update(playArea, gameObjects) {
    this.move(playArea);
    this.shoot(gameObjects);
  }

  isOutOfBounds(bounds) {
    // Enemies go out of bounds on the left side only
    return this.x + this.width < bounds.x;
  }

  collideWith(other) {
    if (isPlayerBullet(other)) {
      this.health -= other.damage;
    } else if (isPlayer(other)) {
      this.health -= 1;
    }

    if (this.health <= 0) {
      this.destroyed = true;
    }
  }
}
