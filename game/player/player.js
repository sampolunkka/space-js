import {isEnemy, isEnemyBullet} from "../utils.js";
import {GameObject} from "../game-object.js";
import {GameObjectType} from "../const.js";
import {Sprite} from '../sprite.js';

const PLAYER_SPEED = 1;
const PLAYER_SPRITE_WIDTH = 10;

export class Player extends GameObject {
  constructor(x, y, playerImg) {
    super(x, y, new Sprite(playerImg, PLAYER_SPRITE_WIDTH));
    this.speed = PLAYER_SPEED;
    this.bulletDamage = 1;
    this.hp = 3;
    this.bombs = 2;
    this.type = GameObjectType.PLAYER;
  }

  update(playArea, gameObjects) {
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
