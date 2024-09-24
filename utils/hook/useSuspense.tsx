import { useCallback, useEffect, useState } from 'react';

export enum Status {
  pending = 'pending',
  success = 'success',
  error = 'error',
}

export const useSuspense = <t extends {}>(key: string, fetch: () => Promise<t>) => {
  const [status, setStatus] = useState<Status>(Status.pending);
  const [result, setResult] = useState<t | null>(null);
  const [promise, setPromise] = useState<Promise<t> | null>(null);

  useEffect(() => {
    const promise = fetch();
    promise.then(
      (resolve) => {
        setStatus(Status.success);
        setResult(resolve);
      },
      (err) => {
        setStatus(Status.error);
      },
    );

    setPromise(promise);
  }, []);

  const read = () => {
    if (!promise) return '';
    switch (status) {
      case Status.success:
        return result;
      case Status.pending:
      case Status.error:
        throw promise;
    }
  };
  return read;
};
