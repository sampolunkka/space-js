import {Enemy} from "../enemy.js";
import {Sprite} from "../../sprite.js";
import {loadedImages} from "../../main.js";

const SPRITE_WIDTH = 10;

export class Jelly extends Enemy {
  constructor(x, y) {
    super(x, y, new Sprite(loadedImages.jelly, SPRITE_WIDTH));
  }

  shoot(gameObjects) {
    // Jelly does not shoot
  }
}
