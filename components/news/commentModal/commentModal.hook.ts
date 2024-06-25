import NewsRepository from '@repositories/news';
import { commentType } from '@utils/interface/news';

import { useCallback, useEffect, useRef, useState } from 'react';

export const useFetchNewsComment = (id: string, comment: commentType | null) => {
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
      const response = await NewsRepository.getNewsComment(id, comment!, page);
      if (response.comments === null || response.comments.length == 0) {
        return false;
      } else {
        setCurComments(response.comments);
        return true;
      }
    } catch (e) {
      console.log(e);
    } finally {
      setIsRequesting(false);
    }
  }

  const getPageBefore = async () => {
    if (curPage.current === 0) return;
    curPage.current -= 10;
    await fetchNewsComment(curPage.current);
  };
  const getPageAfter = async () => {
    curPage.current += 10;
    const response = await fetchNewsComment(curPage.current);
    if (!response) curPage.current -= 10;
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
    page : curPage.current,
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
