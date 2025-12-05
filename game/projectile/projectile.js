import {GameObject} from "../game-object.js";
import {ProjectileSource, GameObjectType} from "../const.js";

const PROJECTILE_TYPE = GameObjectType.PROJECTILE;

export class Projectile extends GameObject {
  constructor(x, y, sprite, damage, source, speed, type = PROJECTILE_TYPE) {
    super(x, y, sprite, speed, type);
    this.damage = damage;
    this.source = source;
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }
}
