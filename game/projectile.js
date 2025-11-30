import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType} from "./const.js";

export class Projectile extends GameObject {
  constructor(x, y, sprite, damage = 1, source = BulletSource.PLAYER, speed = 0.33) {
    super(x, y, sprite);
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.type = GameObjectType.BULLET;
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }
}
