export class Level {
  /**
   * @param {Object[]} spawnStack - Array of object spawn configs: {enemyType, x, y, time}
   * @param {Object} colorPalette - Level color palette
   * @param {HTMLImageElement} [backgroundSprite] - (Optional) Background image
   */
  constructor({ spawnQueue, colorPalette, backgroundSprite = null }) {
    this.spawnQueue = spawnQueue; // [{type, x, y, time}]
    this.colorPalette = colorPalette;
    this.backgroundSprite = backgroundSprite;
  }

  /**
   * Returns the next object config to spawn if its time has come, else null.
   * @param {number} currentTime
   * @returns {Object|null} Enemy config to spawn or null
   */
  getSpawn(currentTime) {
    if (
      this.spawnQueue.length > 0 &&
      this.spawnQueue[0].time <= currentTime
    ) {
      return this.spawnQueue.shift();
    }
    return null;
  }
}
