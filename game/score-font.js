import {PATH_ASSETS} from "./const.js";

const DIGIT_WIDTH = 3;
const DIGIT_HEIGHT = 5;
const DIGIT_COUNT = 10;

export const scoreFontImage = new window.Image();
scoreFontImage.src = PATH_ASSETS + 'score-font.png';

/**
 * Draw a single digit using the sprite sheet.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number|string} digit - 0-9
 * @param {number} x
 * @param {number} y
 * @param {number} scale - Optional scale factor (default 1)
 */
export function drawDigit(ctx, digit, x, y, scale = 1) {
  const d = Number(digit);
  if (isNaN(d) || d < 0 || d >= DIGIT_COUNT) return;
  if (!scoreFontImage.complete) return; // Image not loaded yet

  ctx.drawImage(
    scoreFontImage,
    d * DIGIT_WIDTH, 0, DIGIT_WIDTH, DIGIT_HEIGHT, // source
    x, y, DIGIT_WIDTH * scale, DIGIT_HEIGHT * scale // destination
  );
}

/**
 * Draw a number using the sprite sheet.
 * @param {CanvasRenderingContext2D} ctx
 * @param {number|string} number
 * @param {number} x
 * @param {number} y
 * @param {number} scale - Optional scale factor (default 1)
 * @param {number} gap - Optional gap between digits (default 1)
 */
export function drawNumber(ctx, number, x, y, scale = 1, gap = 2) {
  const str = String(number);
  for (let i = 0; i < str.length; i++) {
    drawDigit(
      ctx,
      str[i],
      x + i * (DIGIT_WIDTH * scale + gap),
      y,
      scale
    );
  }
}
