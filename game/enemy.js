import {GameObject} from './gameobject.js';
import {Bullet} from './bullet.js';
import {isPlayer, isPlayerBullet} from "./utils.js";
import {BulletSource, GameObjectType, PaletteIndex} from "./const.js";
import {Sprite} from "./sprite.js";
import {loadedImages} from "./main.js";

const SPRITE_WIDTH = 9;

export class Enemy extends GameObject {
  constructor(x, y, enemyImg, paletteIndex = PaletteIndex.LIGHT) {
    super(x, y, new Sprite(enemyImg, SPRITE_WIDTH));
    this.speed = 0.1;
    this.health = 1;
    this.scoreValue = 100;
    this.lastShotTime = performance.now();
    this.nextShotInterval = Math.random() * (3000 - 2000) + 2000 - 1500;
    this.type = GameObjectType.ENEMY;
  }

  update(playArea, gameObjects) {
    const bulletImg = loadedImages.bullet;
    this.x -= this.speed;
    this.y = Math.max(playArea.y, Math.min(this.y, playArea.y + playArea.height - this.height));

    // Fire bullet
    const now = performance.now();
    if (now - this.lastShotTime >= this.nextShotInterval) {
      gameObjects.push(
        new Bullet(this.x - 2, this.y + this.height / 2, bulletImg, 1, BulletSource.ENEMY)
      );
      this.lastShotTime = now;
      this.nextShotInterval = Math.random() * (3000 - 2000) + 2000;
    }
  }

  draw(ctx) {
    if (this.sprite && this.sprite.image.complete) {
      console.log('Drawing enemy at', this.x, this.y);
      this.sprite.draw(ctx, Math.floor(this.x), Math.floor(this.y), 0, 0, 2);
    } else {
      ctx.fillStyle = '#000';
      ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
    }
  }

  collideWith(other) {
    if (isPlayerBullet(other)) {
      this.health -= other.damage;
    } else if (isPlayer(other)) {
      this.health -= 1;
    }

    if (this.health <= 0) {
      this.destroyed = true;
    }
  }
}
