import { useMemo } from '@node_modules/@types/react';
import { useRouter as useOriginalRouter } from '@node_modules/next/router';
import { getRenderingEnvironment, RenderingEnvironment } from '@utils/tools';

let pageId = 0;

export const useRouter = () => {
  const originalRouter = useOriginalRouter();

  const router = useMemo(() => {
    return new Proxy(originalRouter, {
      get(target, prop, receiver) {
        if (getRenderingEnvironment() === RenderingEnvironment.client) {
          switch (prop) {
            case 'push':
              pageId++;
            case 'back':
              pageId--;
          }
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }, [originalRouter]);

  const getPageId = () => {
    return pageId;
  };

  return { router, getPageId };
};
