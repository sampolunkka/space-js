import {isEnemy, isEnemyBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {GameObjectType, PaletteIndex} from "./const.js";
import {Sprite} from './sprite.js';

const PLAYER_SPEED = 1;
const PLAYER_SPRITE_WIDTH = 10;

export class Player extends GameObject {
  constructor(x, y, playerImg, paletteIndex = PaletteIndex.LIGHT) {
    super(x, y, new Sprite(playerImg, PLAYER_SPRITE_WIDTH));
    this.speed = PLAYER_SPEED;
    this.bulletDamage = 1;
    this.hp = 3;
    this.bombs = 99;
    this.type = GameObjectType.PLAYER;
    this.paletteIndex = paletteIndex;
  }

  update(playArea, gameObjects) {
    this.y = Math.max(playArea.y, Math.min(this.y, playArea.y + playArea.height - this.height));
  }

  draw(ctx) {
    if (this.sprite && this.sprite.image.complete) {
      this.sprite.draw(ctx, Math.floor(this.x), Math.floor(this.y), 0, this.paletteIndex, 2);
    } else {
      ctx.fillStyle = '#ed1';
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
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
