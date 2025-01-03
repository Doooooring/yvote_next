import { Preview } from '@utils/interface/news';
import NewsRepository from '@repositories/news';
import { MutableRefObject, useRef, useState } from 'react';

export const useFetchNewsPreviews = (defaultLimit: number, isAdmin: boolean = false) => {
  let page = useRef(0);
  let prevFilter: MutableRefObject<string | null | undefined> = useRef(null);

  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [isError, setIsError] = useState<boolean>(false);
  const [previews, setPreviews] = useState<Preview[]>([]);

  const fetchPreviews = async (option?: { filter?: string | null; limit?: number }) => {
    let arr: Preview[] = [];
    const { filter = null, limit = defaultLimit } = option ?? {};
    prevFilter.current = filter;
    page.current = 0;

    try {
      setIsRequesting(true);
      const datas: Array<Preview> = isAdmin
        ? await NewsRepository.getPreviewsAdmin(page.current, limit, prevFilter.current ?? '')
        : await NewsRepository.getPreviews(page.current, limit, prevFilter.current);
      if (datas.length === 0) {
        page.current = -1;
        return;
      }

      page.current += limit;
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
      const datas: Array<Preview> = await NewsRepository.getPreviews(
        page.current,
        defaultLimit,
        prevFilter.current,
      );

      if (datas.length === 0) {
        page.current = -1;
        return false;
      }

      page.current += defaultLimit;
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
