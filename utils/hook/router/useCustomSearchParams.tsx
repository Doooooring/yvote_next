import { usePathname, useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';
import { useCallback } from 'react';

export function useCustomSearchParams() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const get = searchParams.get;
  const set = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(key, value);
      router.replace(`${pathname}?${params.toString()}`, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router],
  );
  const remove = useCallback(
    (key: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.delete(key);
      router.replace(`${pathname}?${params.toString()}`, undefined, {
        shallow: true,
        scroll: false,
      });
    },
    [router],
  );

  return {
    get,
    set,
    remove,
  };
}
