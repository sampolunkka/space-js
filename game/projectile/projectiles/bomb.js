import {isEnemy, speedUnitsToPixelsPerTick} from "../../utils.js";
import {ProjectileSource, GameObjectType} from "../../const.js";
import {Projectile} from "../projectile.js";
import {Sprite} from "../../sprite.js";

const BOMB_SPEED_UNITS = 25;
const BOMB_SPEED = speedUnitsToPixelsPerTick(BOMB_SPEED_UNITS);
const BOMB_FREQUENCY = 0.1;
const BOMB_DAMAGE = 2;
const BOMB_SOURCE = ProjectileSource.PLAYER;

export class Bomb extends Projectile {
  static DEFAULT_AMPLITUDE = 12;
  static DEFAULT_PHASE = 0;
  static SPRITE_WIDTH = 5;

  constructor(x, y, bombImg, damage = BOMB_DAMAGE, speed = BOMB_SPEED, frequency = BOMB_FREQUENCY, source = BOMB_SOURCE) {
    super(
      x,
      y,
      new Sprite(bombImg, Bomb.SPRITE_WIDTH),
      damage,
      speed,
      source
    );

    this.amplitude = Bomb.DEFAULT_AMPLITUDE;
    this.frequency = frequency;
    this.phase = Bomb.DEFAULT_PHASE;
  }

  onUpdate() {
    this.x += this.speed;
    this.y = this.startY + this.amplitude * Math.sin(this.frequency * this.x + this.phase);
  }

  collideWith(other) {
    if (isEnemy(other)) {
      this.destroyed = true;
    }
  }
}
