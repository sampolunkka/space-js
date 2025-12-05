import {isEnemy, isEnemyBullet, isPlayer, isPlayerBullet, speedUnitsToPixelsPerTick} from "../../utils.js";
import {ProjectileSource, GameObjectType} from "../../const.js";
import {Sprite} from "../../sprite.js";
import {Projectile} from "../projectile.js";

const SPRITE_WIDTH = 2;

const BULLET_SPEED = 50;
const BULLET_SPEED_ENEMY_MULTIPLIER = 3;

export class Bullet extends Projectile {
  constructor(x, y, bulletImg, damage, source, speed = BULLET_SPEED) {
    const finalSpeed = source === ProjectileSource.PLAYER ? speed : -speed * BULLET_SPEED_ENEMY_MULTIPLIER;
    super(
      x,
      y,
      new Sprite(bulletImg, SPRITE_WIDTH),
      damage,
      source,
      finalSpeed
    );
    console.log(`bullet damage: ${this.damage}, speed: ${this.speed}`);
  }

  onUpdate() {
    this.x += this.speed;
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }

  collideWith(other) {
    if (this.source === ProjectileSource.PLAYER) {
      if (isEnemyBullet(other) || isEnemy(other)) {
        this.destroyed = true;
      }
    } else {
      if (isPlayerBullet(other) || isPlayer(other)) {
        this.destroyed = true;
      }
    }
  }
}
