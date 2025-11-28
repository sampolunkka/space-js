// game/font3x5.js

export const FONT_3x5 = {
  '0': [
    [1,1,1],
    [1,0,1],
    [1,0,1],
    [1,0,1],
    [1,1,1]
  ],
  '1': [
    [0,1,0],
    [1,1,0],
    [0,1,0],
    [0,1,0],
    [1,1,1]
  ],
  '2': [
    [1,1,1],
    [0,0,1],
    [1,1,1],
    [1,0,0],
    [1,1,1]
  ],
  '3': [
    [1,1,1],
    [0,0,1],
    [0,1,1],
    [0,0,1],
    [1,1,1]
  ],
  '4': [
    [1,0,1],
    [1,0,1],
    [1,1,1],
    [0,0,1],
    [0,0,1]
  ],
  '5': [
    [1,1,1],
    [1,0,0],
    [1,1,1],
    [0,0,1],
    [1,1,1]
  ],
  '6': [
    [1,1,1],
    [1,0,0],
    [1,1,1],
    [1,0,1],
    [1,1,1]
  ],
  '7': [
    [1,1,1],
    [0,0,1],
    [0,1,0],
    [1,0,0],
    [1,0,0]
  ],
  '8': [
    [1,1,1],
    [1,0,1],
    [1,1,1],
    [1,0,1],
    [1,1,1]
  ],
  '9': [
    [1,1,1],
    [1,0,1],
    [1,1,1],
    [0,0,1],
    [1,1,1]
  ]
};

export function drawDigit(ctx, digit, x, y, pixelSize = 1, color = '#000') {
  const pixels = FONT_3x5[digit];
  if (!pixels) return;
  ctx.fillStyle = color;
  for (let row = 0; row < 5; row++) {
    for (let col = 0; col < 3; col++) {
      if (pixels[row][col]) {
        ctx.fillRect(
          x + col * pixelSize,
          y + row * pixelSize,
          pixelSize,
          pixelSize
        );
      }
    }
  }
}

export function drawNumber(ctx, number, x, y, pixelSize = 1, gap = 1, color = '#000') {
  const str = String(number);
  for (let i = 0; i < str.length; i++) {
    drawDigit(
      ctx,
      str[i],
      x + i * (3 * pixelSize + gap),
      y,
      pixelSize,
      color
    );
  }
}
