import { useCallback, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import styled, { keyframes } from 'styled-components';

function renderMessageText(text: string | any) {
  if (typeof text !== 'string') text = String(text || '');
  const parts = text.split(/(\[[^\]]+\]\([^)]+\))/g);
  return parts.map((part: string, i: number) => {
    const match = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (match) {
      let href = match[2];
      const cm = href.match(/^\/news\/c\/(\d+)\/([^/]+)\/(\d+)$/);
      if (cm) {
        href = `/news?newsId=${cm[1]}&commentType=${encodeURIComponent(cm[2])}&commentId=${cm[3]}`;
      }
      return (
        <Link key={i} href={href} style={{ color: 'inherit', textDecoration: 'underline' }}>
          {match[1]}
        </Link>
      );
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatbotPage() {
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; model?: string }[]>(
    [],
  );
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiModel, setAiModel] = useState<'gpt' | 'grok' | 'claude'>('gpt');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            ...messages
              .filter((m) => m.role !== 'ai' || messages.indexOf(m) > 0)
              .map((m) => ({
                role: m.role === 'ai' ? 'assistant' : 'user',
                text: m.text,
              })),
            { role: 'user', text: q },
          ],
          model: aiModel,
          context: '현재 위치: /chatbot (전용 채팅 페이지)',
        }),
      });
      const data = await res.json();
      const result = data?.result;
      const extractText = (r: any): string => {
        if (typeof r === 'string') return r;
        if (r == null) return '응답을 받지 못했습니다.';
        if (typeof r === 'object') {
          if (typeof r.error === 'string') return r.error;
          if (typeof r.error?.message === 'string') return r.error.message;
          if (typeof r.message === 'string') return r.message;
          return JSON.stringify(r);
        }
        return String(r);
      };
      const text = extractText(result);
      setMessages((prev) => [...prev, { role: 'ai', text, model: aiModel }]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'ai', text: '서버에 연결할 수 없습니다.', model: aiModel },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, aiModel]);

  return (
    <PageWrapper>
      <ChatContainer>
        <ChatHeader>
          <ChatHeaderLeft>
            <ChatHeaderTitle>yVote AI</ChatHeaderTitle>
            <ClearBtn
              onClick={() => {
                setMessages([]);
                setInput('');
              }}
              disabled={loading}
              title="Clear chat"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19.36 2.72l1.42 1.42-5.72 5.71c1.07 1.54 1.22 3.26.32 4.46L9.06 8c1.2-.9 2.93-.75 4.46.32l5.84-5.6zM5.93 17.57c-2.01-2.01-3.24-4.41-3.58-6.65l4.88-2.09 7.44 7.44-2.09 4.88c-2.24-.34-4.64-1.57-6.65-3.58z" />
              </svg>
            </ClearBtn>
          </ChatHeaderLeft>
          <ModelSelect>
            <ModelBtn $active={aiModel === 'gpt'} onClick={() => setAiModel('gpt')} title="GPT">
              <ModelIcon src="/icons/openai.svg" alt="GPT" width={14} height={14} />
            </ModelBtn>
            <ModelBtn $active={aiModel === 'grok'} onClick={() => setAiModel('grok')} title="Grok">
              <ModelIcon src="/icons/grok.svg" alt="Grok" width={14} height={14} />
            </ModelBtn>
            <ModelBtn
              $active={aiModel === 'claude'}
              onClick={() => setAiModel('claude')}
              title="Claude"
            >
              <ModelIcon src="/icons/anthropic.svg" alt="Claude" width={14} height={14} />
            </ModelBtn>
          </ModelSelect>
        </ChatHeader>
        <ChatMessages>
          {messages.length === 0 && <EmptyState>yVote AI에게 질문하세요</EmptyState>}
          {messages.map((m, i) => (
            <BubbleRow key={i} $role={m.role}>
              {m.role === 'ai' && m.model && (
                <BubbleModelIcon
                  src={`/icons/${
                    m.model === 'gpt' ? 'openai' : m.model === 'claude' ? 'anthropic' : 'grok'
                  }.svg`}
                  alt={m.model}
                  width={14}
                  height={14}
                />
              )}
              <ChatBubble
                $role={m.role}
                onContextMenu={
                  m.role === 'user'
                    ? (e) => {
                        e.preventDefault();
                        setInput(m.text);
                        setMessages((prev) => prev.slice(0, i));
                      }
                    : undefined
                }
              >
                {renderMessageText(m.text)}
              </ChatBubble>
            </BubbleRow>
          ))}
          {loading && (
            <BubbleRow $role="ai">
              <ChatBubble $role="ai">
                <TypingDots>
                  <span />
                  <span />
                  <span />
                </TypingDots>
              </ChatBubble>
            </BubbleRow>
          )}
          <div ref={messagesEndRef} />
        </ChatMessages>
        <ChatInputRow>
          <ChatInput
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
            placeholder="질문을 입력하세요"
          />
          <ChatSendBtn onClick={handleSend} disabled={loading || !input.trim()}>
            {'\u2192'}
          </ChatSendBtn>
        </ChatInputRow>
      </ChatContainer>
    </PageWrapper>
  );
}

const PageWrapper = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ theme }) => theme.colors.yvote02};
  padding: 24px;

  @media (max-width: 480px) {
    padding: 0;
    align-items: stretch;
    height: 100vh;
    min-height: unset;
    overflow: hidden;
  }
`;

const ChatContainer = styled.div`
  width: 600px;
  height: 80vh;
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 480px) {
    width: 100%;
    height: 100vh;
    border-radius: 0;
    border: none;
    box-shadow: none;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ChatHeaderTitle = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.yvote07};
  padding: 2px;
  display: flex;
  align-items: center;

  &:hover {
    opacity: 0.7;
  }
  &:disabled {
    opacity: 0.2;
    cursor: default;
  }
`;

const ModelSelect = styled.div`
  display: flex;
  gap: 2px;
  background: ${({ theme }) => theme.colors.yvote03};
  border-radius: 6px;
  padding: 2px;
`;

const ModelBtn = styled.button<{ $active: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active, theme }) => ($active ? theme.colors.yvote01 : 'transparent')};
  opacity: ${({ $active }) => ($active ? 1 : 0.35)};
  transition: all 0.15s;
`;

const ModelIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const EmptyState = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${({ theme }) => theme.colors.yvote06};
  font-size: 14px;
`;

const BubbleRow = styled.div<{ $role: 'user' | 'ai' }>`
  display: flex;
  align-items: flex-start;
  gap: 6px;
  align-self: ${({ $role }) => ($role === 'user' ? 'flex-end' : 'flex-start')};
  max-width: 80%;
`;

const BubbleModelIcon = styled.img`
  width: 14px;
  height: 14px;
  margin-top: 8px;
  opacity: 0.5;
  flex-shrink: 0;
`;

const ChatBubble = styled.div<{ $role: 'user' | 'ai' }>`
  background: ${({ $role, theme }) =>
    $role === 'user' ? theme.colors.yvote12 : theme.colors.yvote03};
  color: ${({ $role, theme }) => ($role === 'user' ? theme.colors.yvote01 : theme.colors.yvote12)};
  padding: 10px 14px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.5;
  white-space: pre-wrap;
`;

const ChatInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 8px;
  padding: 10px 12px;
  font-size: 14px;
  background: ${({ theme }) => theme.colors.yvote02};
  color: ${({ theme }) => theme.colors.yvote12};
  outline: none;

  &::placeholder {
    color: ${({ theme }) => theme.colors.yvote06};
  }
`;

const ChatSendBtn = styled.button`
  background: ${({ theme }) => theme.colors.yvote12};
  color: ${({ theme }) => theme.colors.yvote01};
  border: none;
  border-radius: 8px;
  padding: 10px 14px;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600;

  &:disabled {
    opacity: 0.3;
    cursor: default;
  }
`;

const typingBounce = keyframes`
  0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
  40% { transform: translateY(-4px); opacity: 1; }
`;

const TypingDots = styled.div`
  display: flex;
  gap: 4px;
  padding: 2px 0;

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.yvote08};
    animation: ${typingBounce} 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.15s;
    }
    &:nth-child(3) {
      animation-delay: 0.3s;
    }
  }
`;
