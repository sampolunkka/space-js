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
    this.frameIndex = 0;
    this.fps = fps;
    this.frameDuration = 1000 / this.fps;
    this.lastFrameTime = performance.now();
  }

  draw(ctx, x, y) {
    if (!this.image.complete) return;

    // Update animation frame
    this.update();

    const sx = this.frameIndex * this.frameWidth;
    ctx.drawImage(
      this.image,
      sx, 0, this.frameWidth, this.frameHeight,
      x, y, this.frameWidth * this.scale, this.frameHeight * this.scale
    );
  }

  update() {
    const now = performance.now();
    if (now - this.lastFrameTime >= this.frameDuration) {
      this.lastFrameTime = now;
      this.frameIndex = (this.frameIndex + 1) % this.frameCount;
    }
  }

  getWidth() {
    return this.frameWidth * this.scale;
  }

  getHeight() {
    return this.frameHeight * this.scale;
  }
}
