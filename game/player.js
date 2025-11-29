import {Bullet} from './bullet.js';
import {Bomb} from './bomb.js';
import {isEnemy, isEnemyBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType} from "./enum.js";

export class Player extends GameObject {
  PLAYER_SPEED = 1;

  constructor(x, y, width, height, sprite) {
    super(x, y, width, height);
    this.speed = this.PLAYER_SPEED;
    this.bulletDamage = 1;
    this.hp = 3;
    this.bombs = 99;
    this.type = GameObjectType.PLAYER;
    this.sprite = sprite;
  }

  update(playArea, gameObjects) {
    this.y = Math.max(playArea.y, Math.min(this.y, playArea.y + playArea.height - this.height));
  }

  draw(ctx) {
    // Draw player image if loaded, else fallback to rectangle
    if (this.sprite && this.sprite.complete) {
      ctx.drawImage(this.sprite, Math.floor(this.x), Math.floor(this.y));
    } else {
      ctx.fillStyle = '#0f0';
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
