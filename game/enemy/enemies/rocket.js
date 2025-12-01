import {Enemy} from '../enemy.js';
import {loadedImages} from '../../main.js';
import {Sprite} from "../../sprite.js";

const SPRITE_WIDTH = 8;

export class Rocket extends Enemy {
  constructor(x, y) {
    super(x, y, new Sprite(loadedImages.rocket, SPRITE_WIDTH));
    this.nextShotInterval = Math.random() * (3000 - 2000) + 2000 - 1500;
  }
}
