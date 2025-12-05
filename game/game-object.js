import {USE_INTERPOLATION} from "./const.js";
import {speedUnitsToPixelsPerTick} from "./utils.js";

export class GameObject {


  constructor(x, y, sprite, speed, type) {
    this.x = x;
    this.y = y;
    this.prevX = x;
    this.prevY = y;
    this.width = sprite.getWidth();
    this.height = sprite.getHeight();
    this.damage = 0;
    this.type = type;
    this.destroyed = false;
    this.sprite = sprite;
    this.speed = speedUnitsToPixelsPerTick(speed);
  }

  savePreviousState() {
    this.prevX = this.x;
    this.prevY = this.y;
  }

  getCollisionBox() {
    return {
      x: this.x,
      y: this.y,
      width: this.width,
      height: this.height
    };
  }

  update(playArea, gameObjects) {
    this.savePreviousState();
    this.onUpdate(playArea, gameObjects);
  }

  onUpdate(playArea, gameObjects) {
    // Default: do nothing
  }

  draw(ctx, tick, alpha = 1) {
    let drawX, drawY;
    if (USE_INTERPOLATION) {
      drawX = this.prevX + (this.x - this.prevX) * alpha;
      drawY = this.prevY + (this.y - this.prevY) * alpha;
    } else {
      drawX = this.x;
      drawY = this.y;
    }
    if (this.sprite && this.sprite.image && this.sprite.image.complete) {
      this.sprite.draw(ctx, tick, Math.floor(drawX), Math.floor(drawY));
    } else {
      ctx.fillStyle = '#ff0000';
      ctx.fillRect(Math.floor(drawX), Math.floor(drawY), this.width, this.height);
    }
  }

  isOutOfBounds(bounds) {
    return (
      this.x < bounds.x ||
      this.x > bounds.x + bounds.width ||
      this.y < bounds.y ||
      this.y > bounds.y + bounds.height
    );
  }

  /**
   * Handle collision with another object.
   *
   * Each object's collideWith should only modify its own internal state
   * (e.g., mark itself for removal, update health, etc.), and must not
   * directly modify the state of the other object.
   *
   * The main loop should call both objA.collideWith(objB) and objB.collideWith(objA)
   * for each collision, so both objects can react independently.
   *
   * @param {GameObject} other - The other object involved in the collision.
   * @returns {Object} Optional data about the collision.
   */
  collideWith(other) {
    // Default: do nothing
    return {};
  }
}
