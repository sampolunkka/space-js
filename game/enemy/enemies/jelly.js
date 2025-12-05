import {Enemy} from "../enemy.js";
import {Sprite} from "../../sprite.js";
import {loadedImages} from "../../main.js";

const SPRITE_WIDTH = 9;
const JELLY_FRAME_SEGMENTS = [
  {start: 0, width: 2, scaleX: 3, scaleY: 3},
  {start: 2, width: 7, scaleX: 2, scaleY: 3}
];

export class Jelly extends Enemy {
  constructor(x, y) {
    super(x, y, new Sprite(
      loadedImages.jelly,
      SPRITE_WIDTH,
      2, // default scaleX (unused for segments)
      2, // default scaleY
      8, // fps
      JELLY_FRAME_SEGMENTS
    ));
  }

  shoot(gameObjects) {
    // Jelly does not shoot
  }
}
