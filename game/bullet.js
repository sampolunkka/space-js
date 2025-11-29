import {isEnemy, isEnemyBullet, isPlayer, isPlayerBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType} from "./enum.js";

export class Bullet extends GameObject {
  constructor(x, y, damage = 1, source = BulletSource.PLAYER, speed = 0.14, width = 2, height = 1) {
    super(x, y, width, height);
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.width = width;
    this.height = height;
    this.type = GameObjectType.BULLET;
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
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
