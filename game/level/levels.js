import {Level} from './level.js';
import {ColorPalette, INTERNAL_WIDTH} from "../const.js";
import {EnemyType} from "../enemy/enemy-type.js";

// * Guides for spawn location:
// Y =  0   -> Top of the play area
// Y = 14   -> HUD line
// Y = 24   -> Upper quarter of the play area
// Y = 48   -> Middle of the play area
// Y = 72   -> Lower quarter of the play area
// Y = 96   -> Bottom of the play area
const RIGHT_SPAWN_X = INTERNAL_WIDTH + 10;

const TOP_SPAWN_Y = 14;
const TOP_QUARTER_SPAWN_Y = 24;
const MIDDLE_SPAWN_Y = 48;
const BOTTOM_QUARTER_SPAWN_Y = 72;
const BOTTOM_SPAWN_Y = 96;

const firstLevelEnemies = [
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 10, time: 200},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 12, time: 1200},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 14, time: 2200},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: MIDDLE_SPAWN_Y + 10, time: 4500},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: MIDDLE_SPAWN_Y + 10, time: 5500},

  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, time: 10500},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, time: 11500},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 10, time: 12500},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 12, time: 14000},

  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, time: 17000},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 4, time: 18000},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, time: 19000},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, time: 20000},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y - 6, time: 20700},

  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, time: 24000},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, time: 25000},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y+2, time: 26000},
];


export const firstLevel = new Level({
  spawnQueue: firstLevelEnemies,
  colorPalette: ColorPalette.DARK,
});
