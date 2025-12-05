import {SCALE_DEFAULT, TICK_RATE} from "./const.js";

export class Sprite {
  /**
   * @param {HTMLImageElement} image - The sprite sheet image.
   * @param {number} frameWidth - Width of a single frame.
   * @param {number} scaleX - Default scale factor for x.
   * @param {number} scaleY - Default scale factor for y.
   * @param {number} fps - Animation frames per second.
   * @param {Array} frameSegments - Optional array of {start, width, scaleX, scaleY} for segmented scaling.
   */
  constructor(image, frameWidth, scaleX = SCALE_DEFAULT, scaleY = SCALE_DEFAULT, fps = 8, frameSegments = null) {
    this.image = image;
    this.frameWidth = frameWidth;
    this.frameHeight = image.height;
    this.frameCount = Math.floor(image.width / frameWidth);
    this.scaleX = scaleX;
    this.scaleY = scaleY;
    this.fps = fps;
    this.frameSegments = frameSegments; // Array of {start, width, scaleX, scaleY}
  }

  getFrameIndex(tick) {
    const fps = this.fps ?? 12;
    return Math.floor(tick * fps / TICK_RATE) % this.frameCount;
  }

  draw(ctx, tick, x, y) {
    if (!this.image.complete) return;
    const frameIdx = this.getFrameIndex(tick);
    const frameStart = frameIdx * this.frameWidth;

    if (this.frameSegments && Array.isArray(this.frameSegments)) {
      let drawX = x;
      for (const seg of this.frameSegments) {
        ctx.drawImage(
          this.image,
          frameStart + seg.start, 0, seg.width, this.frameHeight, // source
          drawX, y, seg.width * seg.scaleX, this.frameHeight * seg.scaleY // dest
        );
        drawX += seg.width * seg.scaleX;
      }
    } else {
      // Default: draw whole frame with uniform scale
      ctx.drawImage(
        this.image,
        frameStart, 0, this.frameWidth, this.frameHeight,
        x, y, this.getWidth(), this.getHeight()
      );
    }
  }

  getWidth() {
    if (this.frameSegments && Array.isArray(this.frameSegments)) {
      return this.frameSegments.reduce((sum, seg) => sum + seg.width * seg.scaleX, 0);
    }
    return this.frameWidth * this.scaleX;
  }

  getHeight() {
    if (this.frameSegments && Array.isArray(this.frameSegments)) {
      // Assume all segments have same scaleY
      return this.frameHeight * (this.frameSegments[0]?.scaleY ?? this.scaleY);
    }
    return this.frameHeight * this.scaleY;
  }

  getMiddleY() {
    return (this.getHeight()) / 2;
  }
}
