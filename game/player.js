import {Bullet} from './bullet.js';
import {Bomb} from './bomb.js';
import {isEnemy, isEnemyBullet} from "./utils.js";
import {GameObject} from "./gameobject.js";
import {BulletSource, GameObjectType} from "./enum.js";

export class Player extends GameObject {
  BULLET_COOLDOWN_MS = 300;
  BOMB_COOLDOWN_MS = 800;

  constructor(x, y, width, height, speed = 1) {
    super(x, y, width, height);
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.moving = {up: false, down: false};
    this.lastMove = {up: 0, down: 0};
    this.moveDelay = 50;
    this.lastBulletTime = 0;
    this.lastBombTime = 0;
    this.bulletCooldownMs = this.BULLET_COOLDOWN_MS;
    this.bombCooldownMs = this.BOMB_COOLDOWN_MS;
    this.bulletDamage = 1;
    this.hp = 3;
    this.bombs = 99;
    this.type = GameObjectType.PLAYER;
  }

  handleKeyDown(e) {
    const now = performance.now();
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        if (!this.moving.up) {
          this.y -= this.speed;
          this.lastMove.up = now;
        }
        this.moving.up = true;
        break;
      case 'ArrowDown':
      case 's':
        if (!this.moving.down) {
          this.y += this.speed;
          this.lastMove.down = now;
        }
        this.moving.down = true;
        break;
      case ' ':
        return this.shoot(now);
    }
    return null;
  }

  handleKeyUp(e) {
    switch (e.key) {
      case 'ArrowUp':
      case 'w':
        this.moving.up = false;
        break;
      case 'ArrowDown':
      case 's':
        this.moving.down = false;
        break;
    }
  }

  shoot(now) {
    if (now - this.lastBulletTime >= this.bulletCooldownMs) {
      this.lastBulletTime = now;
      return new Bullet(this.x + 11, this.y + 3, this.bulletDamage, BulletSource.PLAYER);
    }
    return null;
  }

  useBomb(now) {
    if (this.bombs > 0 && now - this.lastBombTime >= this.bombCooldownMs) {
      this.bombs--;
      this.lastBombTime = now;
      return new Bomb(this.x + 11, this.y - 2);
    }
    return null;
  }

  tick(bounds) {
    const now = performance.now();
    if (this.moving.up && now - this.lastMove.up >= this.moveDelay) {
      this.y -= this.speed;
      this.lastMove.up = now;
    }
    if (this.moving.down && now - this.lastMove.down >= this.moveDelay) {
      this.y += this.speed;
      this.lastMove.down = now;
    }
    this.y = Math.max(bounds.y, Math.min(bounds.y + bounds.height - 7, this.y));
  }

  collideWith(other) {
    if (isEnemyBullet(other)) {
      this.health -= other.damage;
    } else if (isEnemy(other)) {
      this.health -= 1;
    }
    if (this.health <= 0) {
      this.destroyed = true;
    }
  }
}
