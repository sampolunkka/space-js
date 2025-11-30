export class AssetLoader {
  constructor(assetMap) {
    this.assetMap = assetMap;
    this.images = {};
  }

  loadAll() {
    const keys = Object.keys(this.assetMap);
    const promises = keys.map(key => {
      return new Promise((resolve, reject) => {
        const img = new window.Image();
        console.log(`[AssetLoader] Loading asset: ${key} from ${this.assetMap[key]}`);
        img.src = this.assetMap[key];
        img.onload = () => {
          console.log(`[AssetLoader] Loaded asset: ${key} (${img.width}x${img.height})`);
          this.images[key] = img;
          resolve();
        };
        img.onerror = (err) => {
          console.error(`[AssetLoader] Failed to load asset: ${key} from ${img.src}`, err);
          reject(err);
        };
      });
    });
    return Promise.all(promises).then(() => {
      console.log('[AssetLoader] All assets loaded:', Object.keys(this.images));
      return this.images;
    });
  }
}
