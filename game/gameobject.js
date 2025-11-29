import {PaletteIndex} from "./const.js";

export class GameObject {
  constructor(x, y, sprite, paletteIndex = PaletteIndex.LIGHT) {
    this.x = x;
    this.y = y;
    this.width = sprite.getWidth();
    this.height = sprite.getHeight();
    this.damage = 0;
    this.type = 'GENERIC';
    this.destroyed = false;
    this.sprite = sprite;
    this.paletteIndex = paletteIndex;
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
    // Default: do nothing
  }

  draw(ctx) {
    // Default: do nothing
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
