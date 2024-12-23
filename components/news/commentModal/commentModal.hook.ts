import NewsRepository from '@repositories/news';
import { commentType } from '@utils/interface/news';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useFetchNewsComment = (id: number, comment: commentType | null) => {
  const curPage = useRef(0);
  const [curComments, setCurComments] = useState<
    Array<{
      title: string;
      comment: string;
    }>
  >([]);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  async function fetchNewsComment(page: number) {
    try {
      setIsRequesting(true);
      console.log('is start comment');
      const response = await NewsRepository.getNewsComment(id, comment!, page);
      console.log(response);
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
  const [curComment, setCurComment] = useState<{ title: string; comment: string } | null>(null);

  const showCurComment = useCallback(
    (comment: { title: string; comment: string }) => {
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
