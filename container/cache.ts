export class CacheContainer {
  private static instance: CacheContainer;
  private cacheMap: Map<string, any>;
  private constructor() {
    this.cacheMap = new Map<string, any>();
  }

  static getInstance() {
    return this.instance ?? (this.instance = new CacheContainer());
  }

  addMap(key: string, data: any) {
    this.cacheMap.set(key, data);
  }

  getData(key: string) {
    return this.cacheMap.get(key);
  }

  isKey(key: string) {
    return this.cacheMap.has(key);
  }

  keyList() {
    return this.cacheMap.keys();
  }
}
