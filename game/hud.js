import {drawNumber} from './score-font.js';
import {PATH_ASSETS, SCALE_DEFAULT} from './const.js';
export const HUD_HEIGHT = 7 * SCALE_DEFAULT;

const MARGIN_TOP = 1;

const heartImg = new window.Image();
heartImg.src =  PATH_ASSETS + 'heart.png';

const bombImg = new window.Image();
bombImg.src =  PATH_ASSETS + 'bomb.png';

export function drawPlayerHP(ctx, hp, heartImg) {
  const MARGIN_LEFT = 1;
  const GAP = 1;
  for (let i = 0; i < hp; i++) {
    ctx.drawImage(
      heartImg,
      MARGIN_LEFT + i * (heartImg.width + GAP) * SCALE_DEFAULT,
      MARGIN_TOP,
      heartImg.width * SCALE_DEFAULT,
      heartImg.height * SCALE_DEFAULT
    );
  }
}

export function drawPlayerBombs(ctx, bombs, bombImg) {
  const BOMBS_X = 36 * SCALE_DEFAULT;

  const GAP = 2;
  ctx.drawImage(
    bombImg,
    BOMBS_X,
    MARGIN_TOP,
    bombImg.width * SCALE_DEFAULT,
    bombImg.height * SCALE_DEFAULT
  );

  const bombsStr = String(bombs).padStart(2, '0');
  drawNumber(
    ctx,
    bombsStr,
    BOMBS_X + (bombImg.width + GAP) * SCALE_DEFAULT,
    MARGIN_TOP,
    SCALE_DEFAULT
  );
}

function drawScore(ctx, score) {
  const SCORE_X = 57 * SCALE_DEFAULT
  const scoreStr = String(score).padStart(5, '0');
  drawNumber(
    ctx,
    scoreStr,
    SCORE_X,
    MARGIN_TOP,
    SCALE_DEFAULT
  );
}

export function drawHUD(ctx, player, score) {
  ctx.clearRect(0, 0, ctx.canvas.width, HUD_HEIGHT);

  drawPlayerHP(ctx, player.hp, heartImg);
  drawPlayerBombs(ctx, player.bombs, bombImg);
  drawScore(ctx, score);
}
