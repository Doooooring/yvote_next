import { CacheContainer } from '@container/cache';
import NewsRepository from '@repositories/news';
import { Preview } from '@utils/interface/news';
import { fetchImg } from '@utils/tools/async';
import { MutableRefObject, useCallback, useRef, useState } from 'react';

export const useFetchNewsPreviews = (defaultLimit: number, isAdmin: boolean = false) => {
  let page = useRef(0);
  let limit = useRef(defaultLimit);
  let prevFilter: MutableRefObject<string | null | undefined> = useRef(null);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const fetchPreviews = useCallback(
    async (
      prevPreviews: Preview[],
      option: { page: number; limit: number; filter: string; isAdmin: boolean },
    ) => {
      const { page: fetchPage, limit: fetchLimit, filter = '', isAdmin = false } = option;
      try {
        setIsRequesting(true);

        const datas: Array<Preview> = isAdmin
          ? await NewsRepository.getPreviewsAdmin(fetchPage, fetchLimit, filter)
          : await NewsRepository.getPreviews(fetchPage, fetchLimit, filter);

        if (datas.length === 0) {
          page.current = -1;
          return false;
        }

        setIsFetchingImages(true);

        const cacheContainer = CacheContainer.getInstance();

        await Promise.all(
          datas.map(async (data) => {
            const newsImageId = `news-${data.id}-image`;

            try {
              if (cacheContainer.isKey(newsImageId)) {
                data.newsImage = cacheContainer.getData(newsImageId);
              } else {
                const response = await fetchImg(data.newsImage as string);
                cacheContainer.addMap(newsImageId, response);
                data.newsImage = response;
              }
            } catch (e) {
              data.newsImage = '';
            }
          }),
        );
        page.current += limit.current;
        setPreviews([...prevPreviews, ...datas]);
        return true;
      } catch (e) {
        setIsError(true);
        return false;
      } finally {
        setIsRequesting(false);
        setIsFetchingImages(false);
      }
    },
    [setIsRequesting, setIsFetchingImages, setPreviews],
  );

  const fetchInitialPreviews = async (option?: { filter?: string | null; limit?: number }) => {
    let arr: Preview[] = [];
    const { filter = null, limit: l = defaultLimit } = option ?? {};

    prevFilter.current = filter;
    page.current = 0;
    limit.current = l;

    return await fetchPreviews(arr, {
      page: page.current,
      limit: limit.current,
      filter: prevFilter.current ?? '',
      isAdmin,
    });
  };

  const fetchNextPreviews = async () => {
    let arr = previews;
    if (page.current === -1) return false;

    return await fetchPreviews(arr, {
      page: page.current,
      limit: limit.current,
      filter: prevFilter.current ?? '',
      isAdmin,
    });
  };

  return {
    page: page.current,
    isRequesting,
    isFetchingImages,
    isError,
    previews,
    fetchPreviews: fetchInitialPreviews,
    fetchNextPreviews,
  };
};
