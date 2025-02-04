class CustomCache {
  private static instance: CustomCache;
  private cacheMap: Map<string, any>;
  private constructor() {
    this.cacheMap = new Map<string, any>();
  }

  static getInstance() {
    return this.instance ?? (this.instance = new CustomCache());
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
