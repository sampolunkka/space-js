import {Level} from './level.js';
import {ColorPalette, INTERNAL_WIDTH} from "../const.js";
import {EnemyType} from "../enemy/enemy-type.js";
import {TICK_STEP} from "../const.js";

// Tickrate constants (should match main.js)
const msToTick = ms => Math.floor(ms / TICK_STEP);

const RIGHT_SPAWN_X = INTERNAL_WIDTH + 10;
const TOP_SPAWN_Y = 14;
const TOP_QUARTER_SPAWN_Y = 24;
const MIDDLE_SPAWN_Y = 48;
const BOTTOM_QUARTER_SPAWN_Y = 72;
const BOTTOM_SPAWN_Y = 96;

const firstLevelEnemies = [
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 10, tick: msToTick(200)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 12, tick: msToTick(2200)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 14, tick: msToTick(4200)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: MIDDLE_SPAWN_Y + 10, tick: msToTick(4500)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: MIDDLE_SPAWN_Y + 10, tick: msToTick(5500)},

  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, tick: msToTick(10500)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, tick: msToTick(11500)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 10, tick: msToTick(12500)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 12, tick: msToTick(14000)},

  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, tick: msToTick(17000)},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y + 4, tick: msToTick(18000)},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, tick: msToTick(19000)},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, tick: msToTick(20000)},
  {enemyType: EnemyType.LANDER, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y - 6, tick: msToTick(20700)},

  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: BOTTOM_QUARTER_SPAWN_Y, tick: msToTick(24000)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y, tick: msToTick(25000)},
  {enemyType: EnemyType.JELLY, x: RIGHT_SPAWN_X, y: TOP_QUARTER_SPAWN_Y+2, tick: msToTick(26000)},
];

export const firstLevel = new Level({
  spawnQueue: firstLevelEnemies,
  colorPalette: ColorPalette.DARK,
});
