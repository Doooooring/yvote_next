export enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}
class PromiseCache {
  private static instance: PromiseCache;
  private cacheMap: Map<string, any>;
  private constructor() {
    this.cacheMap = new Map<string, any>();
  }

  static getInstance() {
    return this.instance ?? (this.instance = new PromiseCache());
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

export const useSuspense = <t extends {}>(key: string, fetch: () => Promise<t>) => {
  const promiseCache = PromiseCache.getInstance();

  const read = () => {
    promiseCache.keyList();
    const data = promiseCache.getData(key) as { status: Status; data: Promise<t> | t };
    switch (data.status) {
      case Status.success:
        return data.data as t;
      default:
        throw data.data as Promise<t>;
    }
  };

  if (!promiseCache.isKey(key)) {
    const promise = fetch();
    promise.then(
      (resolve) => {
        promiseCache.addMap(key, { status: Status.success, data: resolve });
      },
      (err) => {
        promiseCache.addMap(key, { status: Status.error, data: err });
      },
    );
    promiseCache.addMap(key, { status: Status.pending, data: promise });
  }

  return read;
};
