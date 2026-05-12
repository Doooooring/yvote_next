import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

import { newsRepository } from '@repositories/news';
import { Comment, commentType } from '@utils/interface/news';
import { throttle } from '@utils/tools/lodash';

const PAGE_SIZE = 20;

export const useFetchNewsComment = (id: number, comment: commentType | null) => {
  const curPage = useRef(0);
  const [curComments, setCurComments] = useState<Array<Comment>>([]);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);

  async function fetchNewsComment(offset: number): Promise<Comment[] | null> {
    try {
      setIsRequesting(true);
      const response = await newsRepository.getNewsComment(id, comment!, offset, PAGE_SIZE + 1);
      if (!response || response.length == 0) {
        return null;
      } else {
        const hasNextPage = response.length > PAGE_SIZE;
        const pageComments = hasNextPage ? response.slice(0, PAGE_SIZE) : response;
        setCurComments(pageComments);
        setHasMore(hasNextPage);
        return pageComments;
      }
    } catch (e) {
      console.log(e);
      return null;
    } finally {
      setIsRequesting(false);
    }
  }

  const getPageBefore = async (): Promise<Comment[] | null> => {
    if (curPage.current === 0) return null;
    curPage.current -= PAGE_SIZE;
    return await fetchNewsComment(curPage.current);
  };
  const getPageAfter = async (): Promise<Comment[] | null> => {
    const response = await fetchNewsComment(curPage.current + PAGE_SIZE);
    if (response) {
      curPage.current += PAGE_SIZE;
      return response;
    }
    setHasMore(false);
    return null;
  };

  useEffect(() => {
    if (comment === null) {
      setCurComments([]);
      return;
    }
    curPage.current = 0;
    setHasMore(false);
    fetchNewsComment(0);
  }, [comment]);

  return {
    page: curPage.current,
    curComments,
    isRequesting,
    hasMore,
    getPageBefore,
    getPageAfter,
  };
};

export const useListScrollheight = (ref?: RefObject<HTMLDivElement>) => {
  let target = useRef<HTMLDivElement>(null);
  if (ref) target = ref;
  const [scrollHeight, setScrollHeight] = useState<number>(0);

  const saveScrollHeight = useCallback(() => {
    if (!target.current) return;
    setScrollHeight(target.current.scrollTop);
  }, [setScrollHeight]);

  const moveToScrollHeight = useCallback(
    (height: number) => {
      if (!target.current) return;
      target.current.scrollTo({ top: height, left: 0 });
    },
    [target],
  );

  const reloadScrollHeight = useCallback(() => {
    moveToScrollHeight(scrollHeight);
  }, [scrollHeight, moveToScrollHeight]);

  return {
    target,
    saveScrollHeight,
    moveToScrollHeight,
    reloadScrollHeight,
  };
};

export const useScrollInfo = (ref?: RefObject<HTMLDivElement>) => {
  let target = useRef<HTMLDivElement>(null);
  if (ref) target = ref;

  const [scrollHeight, setScrollHeight] = useState<number>(0);
  const [maxScrollHeight, setMaxScrollHeight] = useState<number>(0);

  useEffect(() => {
    const scrollContainer = target.current;
    if (!scrollContainer) return;

    const observer = new MutationObserver((mutations) => {
      setScrollHeight(scrollContainer.scrollTop);
      setMaxScrollHeight(scrollContainer.scrollHeight - scrollContainer.clientHeight);
    });

    observer.observe(scrollContainer, {
      childList: true,
      subtree: true,
    });

    setMaxScrollHeight(scrollContainer.scrollHeight - scrollContainer.clientHeight);

    const handleScroll = throttle((e: Event) => {
      const { scrollTop } = scrollContainer;
      setScrollHeight(scrollTop);
    }, 50);

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      observer.disconnect();
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [target.current, setScrollHeight]);

  return {
    target,
    scrollHeight,
    maxScrollHeight,
  };
};
