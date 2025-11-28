export const BulletSource = Object.freeze({
  PLAYER: 'player',
  ENEMY: 'enemy'
});

export class Bullet {
  constructor(x, y, damage = 1, source = BulletSource.PLAYER, speed = 0.14, width = 2, height = 1) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
    this.width = width;
    this.height = height;
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    }
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width || this.x < bounds.x;
  }

  collideWithBullet(other) {
    // Bombs are not destroyed by bullet collision
    if (this.isBomb() || (typeof other.isBomb === 'function' && other.isBomb())) {
      return { destroyThis: false, destroyOther: false };
    }
    // Only regular bullets from different sources destroy each other
    if (other instanceof Bullet && this.source !== other.source) {
      return { destroyThis: true, destroyOther: true };
    }
    return { destroyThis: false, destroyOther: false };
  }

  isBomb() {
    return false;
  }
}
