import {Level} from './level.js';
import {ColorPalette, INTERNAL_WIDTH} from "../const.js";
import {EnemyType} from "../enemy/enemy-type.js";

const firstLevelEnemies = [
  { type: EnemyType.ROCKET, x: INTERNAL_WIDTH, y: 60, time: 1000 },
  { type: EnemyType.ROCKET, x: INTERNAL_WIDTH, y: 80, time: 2000 },
  { type: EnemyType.ROCKET, x: INTERNAL_WIDTH, y: 20, time: 3000 },
  { type: EnemyType.ROCKET, x: INTERNAL_WIDTH, y: 15, time: 4000 },
  { type: EnemyType.ROCKET, x: INTERNAL_WIDTH, y: 40, time: 5000 }
];


export const firstLevel = new Level({
  spawnQueue: firstLevelEnemies,
  colorPalette: ColorPalette.DARK,
});
