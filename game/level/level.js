export class Level {
  /**
   * @param {Object[]} spawnQueue - Array of object spawn configs: {enemyType, x, y, tick}
   * @param {Object} colorPalette - Level color palette
   * @param {HTMLImageElement} [backgroundSprite] - (Optional) Background image
   */
  constructor({ spawnQueue, colorPalette, backgroundSprite = null }) {
    this.spawnQueue = spawnQueue; // [{type, x, y, tick}]
    this.colorPalette = colorPalette;
    this.backgroundSprite = backgroundSprite;
  }

  /**
   * Returns the next object config to spawn if its tick has come, else null.
   * @param {number} currentTick
   * @returns {Object|null} Enemy config to spawn or null
   */
  getSpawn(currentTick) {
    if (
      this.spawnQueue.length > 0 &&
      this.spawnQueue[0].tick <= currentTick
    ) {
      return this.spawnQueue.shift();
    }
    return null;
  }
}
