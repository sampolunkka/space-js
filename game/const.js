export const BulletSource = Object.freeze({
  PLAYER: 'player',
  ENEMY: 'enemy'
});

export const GameObjectType = Object.freeze({
  GENERIC: 'generic',
  PLAYER: 'player',
  ENEMY: 'enemy',
  BULLET: 'bullet',
  BOMB: 'bomb'
});

export const SCREEN_LIGHT = '#c4eeb2';
export const SCREEN_DARK = '#43523d';
export const ColorPalette = Object.freeze({
  LIGHT: {background: SCREEN_LIGHT, foreground: SCREEN_DARK},
  DARK: {background: SCREEN_DARK, foreground: SCREEN_LIGHT}
});
export const PATH_ASSETS = './game/assets/';
export const INTERNAL_WIDTH = 168;
export const INTERNAL_HEIGHT = 96;
