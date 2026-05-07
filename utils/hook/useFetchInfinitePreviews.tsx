import { MutableRefObject, useCallback, useRef, useState } from 'react';

import { newsRepository } from '@repositories/news';
import { NewsState, Preview } from '@utils/interface/news';

export const useFetchNewsPreviews = (defaultLimit: number, isAdmin = false) => {
  const page = useRef(0);
  const limit = useRef(defaultLimit);
  const prevFilter: MutableRefObject<string | null | undefined> = useRef(null);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isFetchingImages, setIsFetchingImages] = useState<boolean>(false);

  const [isError, setIsError] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const fetchPreviews = useCallback(
    async (
      isNew: boolean,
      option: { page: number; limit: number; filter: string; isAdmin: boolean },
    ) => {
      const { page: fetchPage, limit: fetchLimit, filter = '', isAdmin = false } = option;
      try {
        setIsRequesting(true);

        const datas: Array<Preview> = isAdmin
          ? await newsRepository.getPreviewsAdmin(fetchPage, fetchLimit, filter)
          : await newsRepository.getPreviews(fetchPage, fetchLimit, filter, NewsState.Published);

        if (datas.length === 0) {
          page.current = -1;
          return false;
        }

        page.current += limit.current;
        isNew ? setPreviews(datas) : setPreviews((state) => [...state, ...datas]);

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

  const fetchInitialPreviews = useCallback(
    async (option?: { filter?: string | null; limit?: number }) => {
      const { filter = null, limit: l = defaultLimit } = option ?? {};

      prevFilter.current = filter;
      page.current = 0;
      limit.current = l;

      return await fetchPreviews(true, {
        page: page.current,
        limit: limit.current,
        filter: prevFilter.current ?? '',
        isAdmin,
      });
    },
    [fetchPreviews],
  );

  const fetchNextPreviews = useCallback(
    async (nextLimit?: number) => {
      const arr = previews;
      if (page.current === -1) return false;
      if (nextLimit) limit.current = nextLimit;

      return await fetchPreviews(false, {
        page: page.current,
        limit: limit.current,
        filter: prevFilter.current ?? '',
        isAdmin,
      });
    },
    [fetchPreviews],
  );

  const getCurrentMetadata = useCallback(() => {
    return {
      page: page.current,
      limit: limit.current,
      filter: prevFilter.current,
      isAdmin,
    };
  }, []);

  return {
    page: page.current,
    isRequesting,
    isFetchingImages,
    isError,
    previews,
    fetchPreviews: fetchInitialPreviews,
    fetchNextPreviews,
    getCurrentMetadata,
  };
};
