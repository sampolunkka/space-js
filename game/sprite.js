import {PaletteIndex} from "./const.js";

export class Sprite {
  /**
   * @param {HTMLImageElement} image - The sprite sheet image.
   * @param {number} frameWidth - Width of a single frame.
   * @param {number} scale - Scale factor (default 2).
   * @param {number} paletteCount - Number of palette rows (default 2).
   */
  constructor(image, frameWidth, scale = 2, paletteCount = 2) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.paletteCount = paletteCount;
    this.frameHeight = image.height / paletteCount;
    this.frameCount = Math.floor(image.width / frameWidth);
    this.scale = scale;
  }

  /**
   * Draw a frame from the sprite sheet.
   * @param {CanvasRenderingContext2D} ctx
   * @param {number} x
   * @param {number} y
   * @param {number} frameIndex
   * @param {number} paletteIndex
   * @param {number} scale
   */
  draw(ctx, x, y, frameIndex = 0, paletteIndex = PaletteIndex.LIGHT, scale = 1) {
    if (!this.image.complete) return;
    const sx = frameIndex * this.frameWidth;
    const sy = paletteIndex * this.frameHeight;
    ctx.drawImage(
      this.image,
      sx, sy, this.frameWidth, this.frameHeight,
      x, y, this.frameWidth * scale, this.frameHeight * scale
    );
  }

  getWidth() {
    return this.frameWidth * this.scale;
  }

  getHeight() {
    return this.frameHeight * this.scale;
  }
}
