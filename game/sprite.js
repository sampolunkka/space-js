export class Sprite {
  /**
   * @param {HTMLImageElement} image - The sprite sheet image.
   * @param {number} frameWidth - Width of a single frame.
   * @param {number} scaleX - Scale factor for x(default 2).
   * @param {number} scaleY - Scale factor for y (default 2).
   * @param {number} fps - Animation frames per second (default 12).
   */
  constructor(image, frameWidth, scaleX = 2, scaleY = 2, fps = 8) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = image.height;
    this.frameCount = Math.floor(image.width / frameWidth);
    this.scaleX = scaleX;
    this.scaleY = scaleY;

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
      x, y, this.getWidth(), this.getHeight()
    );
  }

  getWidth() {
    return this.frameWidth * this.scaleX;
  }

  getHeight() {
    return this.frameHeight * this.scaleY;
  }
}
