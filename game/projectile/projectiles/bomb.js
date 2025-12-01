import {isEnemy} from "../../utils.js";
import {BulletSource, GameObjectType} from "../../const.js";
import {Projectile} from "../projectile.js";
import {Sprite} from "../../sprite.js";

export class Bomb extends Projectile {
  static DEFAULT_AMPLITUDE = 12;
  static DEFAULT_PHASE = 0;
  static SPRITE_WIDTH = 5;

  constructor(x, y, bombImg, damage = 2, source = BulletSource.PLAYER, speed = 0.14, frequency = 0.1) {
    super(x, y, new Sprite(bombImg, Bomb.SPRITE_WIDTH), damage, source, speed);
    this.startY = y;
    this.amplitude = Bomb.DEFAULT_AMPLITUDE;
    this.frequency = frequency;
    this.phase = Bomb.DEFAULT_PHASE;
    this._age = 0;
    this.damage = damage;
    this.type = GameObjectType.BULLET;
  }

  update() {
    this.x += this.speed;
    this._age += this.speed;
    this.y = this.startY + this.amplitude * Math.sin(this.frequency * this.x + this.phase);
  }

  collideWith(other) {
    if (isEnemy(other)) {
      this.destroyed = true;
    }
  }
}
