import NewsRepository from '@repositories/news';
import { Comment, commentType } from '@utils/interface/news';

import { RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';

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

  const maxScrollHeight = useMemo(() => {
    if (!target.current) return 0;
    const { scrollHeight, clientHeight, scrollTop } = target.current;
    console.log('<<<<<<<<<<<');
    console.log(scrollHeight - clientHeight);
    return scrollHeight - clientHeight;
  }, [target.current]);

  useEffect(() => {
    const scrollContainer = target.current;
    if (!scrollContainer) return;
    console.log('is re useEffect?');
    const handleScroll = () => {
      console.log('is called');
      const { scrollHeight } = scrollContainer;
      setScrollHeight(scrollHeight);
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => {
      scrollContainer.removeEventListener('scroll', handleScroll);
    };
  }, [target.current, setScrollHeight]);

  return {
    target,
    scrollHeight,
    maxScrollHeight,
  };
};
