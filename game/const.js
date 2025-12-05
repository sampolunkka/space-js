export const ProjectileSource = Object.freeze({
  PLAYER: 'player',
  ENEMY: 'enemy'
});

export const GameObjectType = Object.freeze({
  GENERIC: 'generic',
  PLAYER: 'player',
  ENEMY: 'enemy',
  PROJECTILE: 'projectile',
  BOMB: 'bomb'
});

export const TICK_RATE = 60;
export const TICK_STEP = 1000 / TICK_RATE;
export const SCALE_DEFAULT = 3;

export const USE_INTERPOLATION = true;

export const SCREEN_LIGHT = '#c4eeb2';
export const SCREEN_DARK = '#43523d';
export const ColorPalette = Object.freeze({
  LIGHT: {background: SCREEN_LIGHT, foreground: SCREEN_DARK},
  DARK: {background: SCREEN_DARK, foreground: SCREEN_LIGHT}
});
export const PATH_ASSETS = './game/assets/';
export const INTERNAL_WIDTH = 252;
export const INTERNAL_HEIGHT = 144;
