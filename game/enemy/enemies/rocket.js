import {Enemy} from '../enemy.js';
import {loadedImages} from '../../main.js';
import {Sprite} from "../../sprite.js";

const SPRITE_WIDTH = 8;

export class Rocket extends Enemy {
  constructor(x, y) {
    super(x, y, new Sprite(loadedImages.rocket, SPRITE_WIDTH));
  }
}
