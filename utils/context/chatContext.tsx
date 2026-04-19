import { createContext, useCallback, useContext, useRef, useState, ReactNode } from 'react';

interface ChatContextType {
  activeContent: string | null;
  setActiveContent: (content: string | null) => void;
  consumePendingActions: () => string[];
}

const ChatContext = createContext<ChatContextType>({
  activeContent: null,
  setActiveContent: () => {},
  consumePendingActions: () => [],
});

export function ChatContextProvider({ children }: { children: ReactNode }) {
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const pendingActions = useRef<string[]>([]);
  const lastContent = useRef<string | null>(null);

  const setActiveContentWrapped = useCallback((content: string | null) => {
    setActiveContent(content);
    if (content && content !== lastContent.current) {
      pendingActions.current.push(content);
      lastContent.current = content;
      console.log('[ChatContext] action queued:', content.slice(0, 80));
    }
  }, []);

  const consumePendingActions = useCallback(() => {
    const actions = [...pendingActions.current];
    pendingActions.current = [];
    return actions;
  }, []);

  return (
    <ChatContext.Provider value={{ activeContent, setActiveContent: setActiveContentWrapped, consumePendingActions }}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  return useContext(ChatContext);
}
