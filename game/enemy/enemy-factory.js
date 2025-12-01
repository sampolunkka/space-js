import {Rocket} from "./enemies/rocket.js";
import {Jelly} from "./enemies/jelly.js";
import {Lander} from "./enemies/lander.js";

export function createEnemy(enemyType, x, y) {
  switch (enemyType) {
    case 'rocket': return new Rocket(x, y);
    case 'jelly': return new Jelly(x, y);
    case 'lander': return new Lander(x, y);
    default: throw new Error(`Unknown enemy type: ${enemyType}`);
  }
}
