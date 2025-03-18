import NewsRepository from '@repositories/news';
import { Comment, commentType } from '@utils/interface/news';
import { throttle } from '@utils/tools/lodash';

import { RefObject, useCallback, useEffect, useRef, useState } from 'react';

export const useFetchNewsComment = (id: number, comment: commentType | null) => {
  const curPage = useRef(0);
  const [curComments, setCurComments] = useState<Array<Comment>>([]);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  async function fetchNewsComment(page: number) {
    try {
      setIsRequesting(true);
      const response = await NewsRepository.getNewsComment(id, comment!, page);
      if (!response || response.length == 0) {
        return false;
      } else {
        setCurComments(response);
        return true;
      }
    } catch (e) {
      console.log(e);
      return false;
    } finally {
      setIsRequesting(false);
    }
  }

  const getPageBefore = async () => {
    if (curPage.current === 0) return false;
    curPage.current -= 10;
    const response = await fetchNewsComment(curPage.current);
    return response;
  };
  const getPageAfter = async () => {
    const response = await fetchNewsComment(curPage.current + 10);
    if (response) curPage.current += 10;
    return response;
  };

  useEffect(() => {
    if (comment === null) {
      setCurComments([]);
      return;
    }
    curPage.current = 0;
    fetchNewsComment(0);
  }, [comment]);

  return {
    page: curPage.current,
    curComments,
    isRequesting,
    getPageBefore,
    getPageAfter,
  };
};

export const useCurComment = () => {
  const [curComment, setCurComment] = useState<Comment | null>(null);

  const showCurComment = useCallback(
    (comment: Comment) => {
      setCurComment(comment);
    },
    [setCurComment],
  );

  const closeCurComment = useCallback(() => {
    setCurComment(null);
  }, [setCurComment]);

  return {
    curComment,
    showCurComment,
    closeCurComment,
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
