import {isEnemy, isEnemyBullet, isPlayer, isPlayerBullet} from "../utils.js";
import {BulletSource, GameObjectType} from "../const.js";
import {Sprite} from "../sprite.js";
import {Projectile} from "../projectile.js";

const SPRITE_WIDTH = 2;

export class Bullet extends Projectile {
  constructor(x, y, bulletImg, damage = 1, source = BulletSource.PLAYER, speed = 0.33) {
    super(x, y, new Sprite(bulletImg, SPRITE_WIDTH));
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.type = GameObjectType.BULLET;
  }

  update() {
    this.x += this.speed;
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }

  collideWith(other) {
    if (this.source === BulletSource.PLAYER) {
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
