import { createContext, useCallback, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  activeContent: string | null;
  viewedHistory: string[];
  setActiveContent: (content: string | null) => void;
  addToHistory: (summary: string) => void;
}

const ChatContext = createContext<ChatContextType>({
  activeContent: null,
  viewedHistory: [],
  setActiveContent: () => {},
  addToHistory: () => {},
});

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [activeContent, setActiveContentRaw] = useState<string | null>(null);
  const [viewedHistory, setViewedHistory] = useState<string[]>([]);

  const addToHistory = useCallback((summary: string) => {
    setViewedHistory(prev => {
      if (prev.includes(summary)) return prev;
      return [...prev.slice(-9), summary];
    });
  }, []);

  const setActiveContent = useCallback((content: string | null) => {
    setActiveContentRaw(prev => {
      if (prev && !content) {
        const firstLine = prev.split('\n')[0].slice(0, 80);
        addToHistory(firstLine);
      }
      return content;
    });
  }, [addToHistory]);

  return (
    <ChatContext.Provider value={{ activeContent, viewedHistory, setActiveContent, addToHistory }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
