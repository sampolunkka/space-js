export const ENEMY_WIDTH = 5;
export const ENEMY_HEIGHT = 5;
export const ENEMY_SPEED = 0.1;

export class Enemy {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = ENEMY_WIDTH;
    this.height = ENEMY_HEIGHT;
    this.speed = ENEMY_SPEED;
    this.health = 1;
  }
  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }
  update() {
    this.x -= this.speed;
  }
  draw(ctx) {
    ctx.fillStyle = '#000';
    ctx.fillRect(Math.floor(this.x), Math.floor(this.y), this.width, this.height);
  }
  isOutOfBounds(bounds) {
    return this.x + this.width < 0;
  }
}
