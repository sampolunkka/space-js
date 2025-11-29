import {isEnemy, isEnemyBullet, isPlayer, isPlayerBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType, PaletteIndex} from "./const.js";
import {Sprite} from "./sprite.js";

const SPRITE_WIDTH = 2;

export class Bullet extends GameObject {
  constructor(x, y, bulletImg, damage = 1, source = BulletSource.PLAYER, speed = 0.33, paletteIndex = PaletteIndex.LIGHT) {
    super(x, y, new Sprite(bulletImg, SPRITE_WIDTH), paletteIndex);
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.type = GameObjectType.BULLET;
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    if (this.sprite && this.sprite.image.complete) {
      this.sprite.draw(ctx, Math.floor(this.x), Math.floor(this.y), 0, this.paletteIndex, 2);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
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
