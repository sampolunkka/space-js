import {isEnemy, isEnemyBullet} from "../utils.js";
import {GameObject} from "../game-object.js";
import {GameObjectType} from "../const.js";
import {Sprite} from '../sprite.js';
import {speedUnitsToPixelsPerTick} from "../utils.js";

const PLAYER_SPEED = 40;
const PLAYER_SPRITE_WIDTH = 10;
const PLAYER_TYPE = GameObjectType.PLAYER;

export class Player extends GameObject {
  constructor(x, y, playerImg, speed = PLAYER_SPEED, type = GameObjectType.PLAYER) {
    super(x, y, new Sprite(playerImg, PLAYER_SPRITE_WIDTH), speed);
    this.bulletDamage = 1;
    this.hp = 3;
    this.bombs = 2;
  }

  onUpdate(playArea, gameObjects) {
    this.y = Math.max(playArea.y, Math.min(this.y, playArea.y + playArea.height - this.height));
  }

  collideWith(other) {
    if (isEnemyBullet(other)) {
      this.hp -= other.damage;
    } else if (isEnemy(other)) {
      this.hp -= 1;
    }
    if (this.hp <= 0) {
      this.destroyed = true;
    }
  }
}
