import {Rocket} from "./enemies/rocket.js";

export function createEnemy(enemyType, x, y) {
  switch (enemyType) {
    case 'rocket': return new Rocket(x, y);
    default: throw new Error(`Unknown enemy type: ${enemyType}`);
  }
}
