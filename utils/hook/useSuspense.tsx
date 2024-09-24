import { useCallback, useEffect, useState } from 'react';

export enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}
class PromiseCache {
  private static cacheMap = new Map<string, any>();

  constructor() {}

  static addMap(key: string, data: any) {
    this.cacheMap.set(key, data);
  }

  static getData(key: string) {
    return this.cacheMap.get(key);
  }

  static isKey(key: string) {
    return this.cacheMap.has(key);
  }

  static keyList() {
    return this.cacheMap.keys();
  }
}

export const useSuspense = <t extends {}>(key: string, fetch: () => Promise<t>) => {
  const read = () => {
    PromiseCache.keyList();
    const data = PromiseCache.getData(key) as { status: Status; data: Promise<t> | t };
    switch (data.status) {
      case Status.success:
        return data.data as t;
      default:
        throw data.data as Promise<t>;
    }
  };

  if (!PromiseCache.isKey(key)) {
    const promise = fetch();
    promise.then(
      (resolve) => {
        PromiseCache.addMap(key, { status: Status.success, data: resolve });
      },
      (err) => {
        PromiseCache.addMap(key, { status: Status.error, data: err });
      },
    );
    PromiseCache.addMap(key, { status: Status.pending, data: promise });
  }

  return read;
};
