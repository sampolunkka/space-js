export class Sprite {
  /**
   * @param {HTMLImageElement} image - The sprite sheet image.
   * @param {number} frameWidth - Width of a single frame.
   * @param {number} scale - Scale factor (default 2).
   * @param {number} fps - Animation frames per second (default 12).
   */
  constructor(image, frameWidth, scale = 2, fps = 4) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = image.height;
    this.frameCount = Math.floor(image.width / frameWidth);
    this.scale = scale;

    // Animation state
    this.fps = fps;
  }

  getFrameIndex() {
    const t = performance.now() * 0.001;
    const fps = this.fps ?? 12;
    return Math.floor(t * fps) % this.frameCount;
  }

  draw(ctx, x, y) {
    if (!this.image.complete) return;
    const sx = this.getFrameIndex() * this.frameWidth;
    ctx.drawImage(
      this.image,
      sx, 0, this.frameWidth, this.frameHeight,
      x, y, this.frameWidth * this.scale, this.frameHeight * this.scale
    );
  }

  getWidth() {
    return this.frameWidth * this.scale;
  }

  getHeight() {
    return this.frameHeight * this.scale;
  }
}
