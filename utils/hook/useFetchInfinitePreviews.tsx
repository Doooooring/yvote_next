import NewsRepository from '@repositories/news';
import { Preview } from '@utils/interface/news';
import { fetchImg } from '@utils/tools/async';
import { MutableRefObject, useRef, useState } from 'react';

export const useFetchNewsPreviews = (defaultLimit: number, isAdmin: boolean = false) => {
  let page = useRef(0);
  let limit = useRef(defaultLimit);
  let prevFilter: MutableRefObject<string | null | undefined> = useRef(null);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const fetchPreviews = async (option?: { filter?: string | null; limit?: number }) => {
    let arr: Preview[] = [];
    const { filter = null, limit: l = defaultLimit } = option ?? {};

    prevFilter.current = filter;
    page.current = 0;
    limit.current = l;

    try {
      setIsRequesting(true);
      const datas: Array<Preview> = isAdmin
        ? await NewsRepository.getPreviewsAdmin(
            page.current,
            limit.current,
            prevFilter.current ?? '',
          )
        : await NewsRepository.getPreviews(page.current, limit.current, prevFilter.current);
      if (datas.length === 0) {
        page.current = -1;
        return;
      }

      const promises = await Promise.all(
        datas.map(async (data) => {
          const response = await fetchImg(data.newsImage as string);
          data.newsImage = response;
        }),
      );

      page.current += limit.current;
      setPreviews([...arr, ...datas]);
    } catch (e) {
      setIsError(true);
    } finally {
      setIsRequesting(false);
    }
  };

  const fetchNextPreviews = async () => {
    let arr = previews;
    if (page.current === -1) return false;
    try {
      setIsRequesting(true);
      const datas: Array<Preview> = isAdmin
        ? await NewsRepository.getPreviewsAdmin(page.current, limit.current, prevFilter.current)
        : await NewsRepository.getPreviews(page.current, limit.current, prevFilter.current);

      if (datas.length === 0) {
        page.current = -1;
        return false;
      }

      const promises = await Promise.all(
        datas.map(async (data) => {
          const response = await fetchImg(data.newsImage as string);
          data.newsImage = response;
        }),
      );

      page.current += limit.current;
      setPreviews([...arr, ...datas]);
      return true;
    } catch (e) {
      setIsError(true);
      return false;
    } finally {
      setIsRequesting(false);
    }
  };

  return {
    page: page.current,
    isRequesting,
    isError,
    previews,
    fetchPreviews,
    fetchNextPreviews,
  };
};
