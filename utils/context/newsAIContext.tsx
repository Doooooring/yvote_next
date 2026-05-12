import { createContext, ReactNode, useCallback, useContext, useState } from 'react';

interface ModalContextInfo {
  newsId: number | null;
  commentTitles: Array<{ commentType: string; title: string }>;
  activeComment: { commentType: string; title: string; body: string } | null;
}

interface NewsAIContextType {
  modalInfo: ModalContextInfo;
  setModalNewsId: (id: number | null) => void;
  setModalCommentTitles: (titles: Array<{ commentType: string; title: string }>) => void;
  setModalActiveComment: (
    comment: { commentType: string; title: string; body: string } | null,
  ) => void;
}

const defaultModalInfo: ModalContextInfo = {
  newsId: null,
  commentTitles: [],
  activeComment: null,
};

const noopSetModalNewsId = () => undefined;
const noopSetModalCommentTitles = () => undefined;
const noopSetModalActiveComment = () => undefined;

const NewsAIContext = createContext<NewsAIContextType>({
  modalInfo: defaultModalInfo,
  setModalNewsId: noopSetModalNewsId,
  setModalCommentTitles: noopSetModalCommentTitles,
  setModalActiveComment: noopSetModalActiveComment,
});

export function NewsAIProvider({ children }: { children: ReactNode }) {
  const [modalInfo, setModalInfo] = useState<ModalContextInfo>(defaultModalInfo);

  const setModalNewsId = useCallback((id: number | null) => {
    if (id === null) {
      setModalInfo(defaultModalInfo);
    } else {
      setModalInfo((prev) => ({ ...prev, newsId: id }));
    }
  }, []);

  const setModalCommentTitles = useCallback(
    (titles: Array<{ commentType: string; title: string }>) => {
      setModalInfo((prev) => ({ ...prev, commentTitles: titles }));
    },
    [],
  );

  const setModalActiveComment = useCallback(
    (comment: { commentType: string; title: string; body: string } | null) => {
      setModalInfo((prev) => ({ ...prev, activeComment: comment }));
    },
    [],
  );

  return (
    <NewsAIContext.Provider
      value={{ modalInfo, setModalNewsId, setModalCommentTitles, setModalActiveComment }}
    >
      {children}
    </NewsAIContext.Provider>
  );
}

export function useNewsAI() {
  return useContext(NewsAIContext);
}
