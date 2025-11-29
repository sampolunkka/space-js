import {isEnemy, isEnemyBullet, isPlayer, isPlayerBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType} from "./const.js";

export class Bullet extends GameObject {
  constructor(x, y, damage = 1, source = BulletSource.PLAYER, speed = 0.14, width = 2, height = 1) {
    super(x, y, 4, 2);
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.type = GameObjectType.BULLET;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }

  collideWith(other) {
    console.debug('Bullet collideWith', other);
    // Self is Player bullet
    if (this.source === BulletSource.PLAYER) {
      if (isEnemyBullet(other)) {
        this.destroyed = true
      } else if (isEnemy(other)) {
        this.destroyed = true
      }
    }

    // Self is Enemy bullet
    else {
      if (isPlayerBullet(other)) {
        this.destroyed = true
      } else if (isPlayer(other)) {
        this.destroyed = true
      }
    }
  }
}
