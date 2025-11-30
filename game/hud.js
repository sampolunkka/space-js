import {drawNumber} from './scorefont.js';
import {PATH_ASSETS} from './const.js';
export const HUD_HEIGHT = 14;

const MARGIN_TOP = 1;

const heartImg = new window.Image();
heartImg.src =  PATH_ASSETS + 'heart.png';

const bombImg = new window.Image();
bombImg.src =  PATH_ASSETS + 'bomb.png';

export function drawPlayerHP(ctx, hp, heartImg) {
  const HEART_SIZE = 10;
  const MARGIN_LEFT = 1;
  const GAP = 1;
  for (let i = 0; i < hp; i++) {
    ctx.drawImage(
      heartImg,
      MARGIN_LEFT + i * (HEART_SIZE + GAP),
      MARGIN_TOP,
    );
  }
}

export function drawPlayerBombs(ctx, bombs, bombImg) {
  const BOMB_SIZE = 10;
  const BOMBS_X = 72;

  const GAP = 4;
  ctx.drawImage(
    bombImg,
    BOMBS_X,
    MARGIN_TOP,
    BOMB_SIZE,
    BOMB_SIZE
  );

  const bombsStr = String(bombs).padStart(2, '0');
  drawNumber(
    ctx,
    bombsStr,
    BOMBS_X + (BOMB_SIZE + GAP),
    MARGIN_TOP
  );
}

function drawScore(ctx, score) {
  const SCORE_X = 114;
  const scoreStr = String(score).padStart(5, '0');
  drawNumber(
    ctx,
    scoreStr,
    SCORE_X,
    MARGIN_TOP
  );
}

export function drawHUD(ctx, player, score) {
  ctx.clearRect(0, 0, ctx.canvas.width, HUD_HEIGHT);

  drawPlayerHP(ctx, player.hp, heartImg);
  drawPlayerBombs(ctx, player.bombs, bombImg);
  drawScore(ctx, score);
}
