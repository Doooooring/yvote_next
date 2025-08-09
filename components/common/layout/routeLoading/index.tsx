import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useGlobalLoading } from '../../../../utils/hook/useGlobalLoading/useGlobalLoading';

export default function RouteLoading() {
  const router = useRouter();
  const { setIsLoading } = useGlobalLoading();

  const setRouteStart = useCallback(() => {
    setIsLoading(true);
  }, [setIsLoading]);

  const setRouteEnd = useCallback(() => {
    setIsLoading(false);
  }, [setIsLoading]);

  useEffect(() => {
    router.events.on('routeChangeStart', setRouteStart);
    router.events.on('routeChangeComplete', setRouteEnd);
    router.events.on('routeChangeError', setRouteEnd);

    return () => {
      router.events.off('routeChangeStart', setRouteStart);
      router.events.off('routeChangeComplete', setRouteEnd);
      router.events.off('routeChangeError', setRouteEnd);
    };
  }, []);

  return <></>;
}
