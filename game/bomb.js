import {Bullet} from './bullet.js';
import {isEnemy} from "./utils.js";
import {BulletSource, GameObjectType} from "./enum.js";

export class Bomb extends Bullet {
  static DEFAULT_AMPLITUDE = 6;
  static DEFAULT_PHASE = 0;

  constructor(x, y, damage = 2, source = BulletSource.PLAYER, speed = 0.07, frequency = 0.2) {
    super(x, y, damage, source, speed, 5, 5); // Unique bomb size
    this.startY = y;
    this.amplitude = Bomb.DEFAULT_AMPLITUDE;
    this.frequency = frequency;
    this.phase = Bomb.DEFAULT_PHASE;
    this.sprite = new Image();
    this.sprite.src = 'img/bomb.png';
    this._age = 0;
    this.damage = damage;
    this.type = GameObjectType.BULLET;
  }

  update() {
    this.x += this.speed;
    this._age += this.speed;
    this.y = this.startY + this.amplitude * Math.sin(this.frequency * this.x + this.phase);
  }

  draw(ctx) {
    if (this.sprite.complete) {
      ctx.drawImage(this.sprite, Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
  }

  collideWith(other) {
    if (isEnemy(other)) {
      this.destroyed = true;
    }
  }
}
