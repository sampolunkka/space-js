export const BULLET_WIDTH = 2;
export const BULLET_HEIGHT = 1;
export const BULLET_SPEED = 0.14;

export const BulletSource = Object.freeze({
  PLAYER: 'player',
  ENEMY: 'enemy'
});

export class Bullet {
  constructor(x, y, damage = 1, source = BulletSource.PLAYER, speed = BULLET_SPEED) {
    this.x = x;
    this.y = y;
    this.damage = damage;
    this.source = source;
    this.speed = source === BulletSource.PLAYER ? speed : -speed;
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: BULLET_WIDTH,
      height: BULLET_HEIGHT
    }
  }

  update() {
    this.x += this.speed;
  }

  draw(ctx) {
    ctx.fillStyle = '#000'; // white bullet
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), BULLET_WIDTH, BULLET_HEIGHT);
  }

  isOutOfBounds(bounds) {
    return this.x > bounds.x + bounds.width ||
      this.y < bounds.y ||
      this.y > bounds.y + bounds.height
  }
}
