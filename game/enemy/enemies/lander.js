import {Enemy} from "../enemy.js";
import {Sprite} from "../../sprite.js";
import {loadedImages} from "../../main.js";

const SPRITE_WIDTH = 6;

export class Lander extends Enemy {
  constructor(x, y) {
    super(x, y, new Sprite(loadedImages.lander, SPRITE_WIDTH));
    this.startY = y;
    this.amplitude = 15;
    this.frequency = 0.05;
    this.phase = 0;
  }

  move(playArea) {
    // Sine wave movement
    this.x -= this.speed;
    this.y = this.startY + this.amplitude * Math.sin(this.frequency * this.x + this.phase);
  }

  shoot(gameObjects) {
    super.shoot(gameObjects);
  }
}
