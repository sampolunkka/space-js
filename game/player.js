// game/player.js
import {Bullet, BulletSource} from './bullet.js';

export class Player {
  constructor(x, y, speed = 1, bulletCooldownMs = 140) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.moving = { up: false, down: false };
    this.lastMove = { up: 0, down: 0 };
    this.moveDelay = 50;
    this.lastBulletTime = 0;
    this.bulletCooldownMs = bulletCooldownMs;
    this.bulletDamage = 1;
    this.hp = 3;
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
    this.y = Math.max(0, Math.min(bounds.height - 7, this.y));
  }
}
