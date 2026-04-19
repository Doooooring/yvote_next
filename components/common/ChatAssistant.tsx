import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { useChatContext } from '@/utils/context/chatContext';

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
      return <Link key={i} href={href} style={{ color: 'inherit', textDecoration: 'underline' }}>{match[1]}</Link>;
    }
    return <span key={i}>{part}</span>;
  });
}

export default function ChatAssistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string; model?: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiModel, setAiModel] = useState<'gpt' | 'grok' | 'claude'>('gpt');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const fabRef = useRef<HTMLButtonElement>(null);
  const { consumePendingActions } = useChatContext();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    const mql = window.matchMedia('(min-width: 1200px)');
    if (open && mql.matches) {
      document.body.classList.add('chat-open');
    } else {
      document.body.classList.remove('chat-open');
    }
    const onChange = () => {
      if (open && mql.matches) document.body.classList.add('chat-open');
      else document.body.classList.remove('chat-open');
    };
    mql.addEventListener('change', onChange);
    return () => {
      mql.removeEventListener('change', onChange);
      document.body.classList.remove('chat-open');
    };
  }, [open]);

  const handleSend = useCallback(async () => {
    const q = input.trim();
    if (!q || loading) return;
    setMessages((prev) => [...prev, { role: 'user', text: q }]);
    setInput('');
    setLoading(true);
    try {
      const actions = consumePendingActions();
      const lastAction = actions.length > 0 ? actions[actions.length - 1] : null;
      const userText = lastAction
        ? `[현재 보고 있는 항목: ${lastAction}]\n${q}`
        : q;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [...messages.filter(m => m.role !== 'ai' || messages.indexOf(m) > 0).map(m => ({
            role: m.role === 'ai' ? 'assistant' : 'user',
            text: m.text,
          })), { role: 'user', text: userText }],
          model: aiModel,
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
      setMessages((prev) => [...prev, { role: 'ai', text: '서버에 연결할 수 없습니다.', model: aiModel }]);
    } finally {
      setLoading(false);
    }
  }, [input, loading, messages, aiModel, consumePendingActions]);

  return (
    <>
      <ChatFab ref={fabRef} onClick={() => setOpen(!open)} $open={open}>
        {open ? <ChatIcon viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" fill="currentColor"/></ChatIcon> : <ChatIcon viewBox="0 0 24 24"><path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm0 14H5.2L4 17.2V4h16v12z" fill="currentColor"/></ChatIcon>}
      </ChatFab>
      {open && (
        <ChatPanel ref={panelRef}>
          <ChatHeader>
            <ChatHeaderLeft>
              <ChatHeaderTitle>yVote AI</ChatHeaderTitle>
              <ClearBtn onClick={() => { setMessages([]); setInput(''); }} disabled={loading} title="Clear chat">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor"><path d="M19.36 2.72l1.42 1.42-5.72 5.71c1.07 1.54 1.22 3.26.32 4.46L9.06 8c1.2-.9 2.93-.75 4.46.32l5.84-5.6zM5.93 17.57c-2.01-2.01-3.24-4.41-3.58-6.65l4.88-2.09 7.44 7.44-2.09 4.88c-2.24-.34-4.64-1.57-6.65-3.58z"/></svg>
              </ClearBtn>
            </ChatHeaderLeft>
            <ChatHeaderRight>
              <ModelSelect>
                <ModelBtn $active={aiModel === 'gpt'} onClick={() => setAiModel('gpt')} title="GPT">
                  <ModelIcon src="/icons/openai.svg" alt="GPT" width={14} height={14} />
                </ModelBtn>
                <ModelBtn $active={aiModel === 'grok'} onClick={() => setAiModel('grok')} title="Grok">
                  <ModelIcon src="/icons/grok.svg" alt="Grok" width={14} height={14} />
                </ModelBtn>
                <ModelBtn $active={aiModel === 'claude'} onClick={() => setAiModel('claude')} title="Claude">
                  <ModelIcon src="/icons/anthropic.svg" alt="Claude" width={14} height={14} />
                </ModelBtn>
              </ModelSelect>
              <ChatCloseBtn onClick={() => setOpen(false)}>{'\u2715'}</ChatCloseBtn>
            </ChatHeaderRight>
          </ChatHeader>
          <ChatMessages>
            {messages.map((m, i) => (
              <BubbleRow key={i} $role={m.role}>
                {m.role === 'ai' && m.model && (
                  <BubbleModelIcon src={`/icons/${m.model === 'gpt' ? 'openai' : m.model === 'claude' ? 'anthropic' : 'grok'}.svg`} alt={m.model} width={12} height={12} />
                )}
                <ChatBubble
                  $role={m.role}
                  onContextMenu={m.role === 'user' ? (e) => {
                    e.preventDefault();
                    setInput(m.text);
                    setMessages((prev) => prev.slice(0, i));
                  } : undefined}
                >
                  {renderMessageText(m.text)}
                </ChatBubble>
              </BubbleRow>
            ))}
            {loading && <BubbleRow $role="ai"><ChatBubble $role="ai"><TypingDots><span /><span /><span /></TypingDots></ChatBubble></BubbleRow>}
            <div ref={messagesEndRef} />
          </ChatMessages>
          <ChatInputRow>
            <ChatInput
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.nativeEvent.isComposing && handleSend()}
              placeholder="질문을 입력하세요"
            />
            <ChatSendBtn onClick={handleSend} disabled={loading || !input.trim()}>{'\u2192'}</ChatSendBtn>
          </ChatInputRow>
        </ChatPanel>
      )}
    </>
  );
}

const ChatIcon = styled.svg`
  width: 20px;
  height: 20px;
`;

const ChatFab = styled.button<{ $open: boolean }>`
  position: fixed;
  bottom: 24px;
  right: 24px;
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.yvote12};
  color: ${({ theme }) => theme.colors.yvote01};
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2);
  z-index: 10000;
  transition: transform 0.2s;
  font-size: ${({ $open }) => $open ? '18px' : '14px'};
  font-weight: 700;
  letter-spacing: 0;

  &:hover {
    transform: scale(1.08);
  }
`;

const ChatPanel = styled.div`
  position: fixed;
  bottom: 84px;
  right: 8px;
  width: calc(23vw - 8px);
  min-width: 268px;
  max-height: 85vh;
  background: ${({ theme }) => theme.colors.yvote01};
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 14px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.15);
  z-index: 10000;
  overflow: hidden;

  @media (max-width: 480px) {
    width: calc(100vw - 16px);
    right: 8px;
    bottom: 80px;
    max-height: 65vh;
  }
`;

const ChatHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 10px 14px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatHeaderTitle = styled.span`
  font-size: 13px;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.yvote12};
`;

const ChatHeaderLeft = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ClearBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${({ theme }) => theme.colors.yvote07};
  padding: 2px;
  display: flex;
  align-items: center;

  &:hover { opacity: 0.7; }
  &:disabled { opacity: 0.2; cursor: default; }
`;

const ChatHeaderRight = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
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
  width: 24px;
  height: 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  background: ${({ $active, theme }) => $active ? theme.colors.yvote01 : 'transparent'};
  opacity: ${({ $active }) => $active ? 1 : 0.35};
  transition: all 0.15s;
`;

const ModelIcon = styled.img`
  width: 14px;
  height: 14px;
`;

const ChatCloseBtn = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.yvote07};
  padding: 0;
`;

const ChatMessages = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-height: 200px;
`;

const BubbleRow = styled.div<{ $role: 'user' | 'ai' }>`
  display: flex;
  align-items: flex-start;
  gap: 4px;
  align-self: ${({ $role }) => $role === 'user' ? 'flex-end' : 'flex-start'};
  max-width: 85%;
`;

const BubbleModelIcon = styled.img`
  width: 12px;
  height: 12px;
  margin-top: 6px;
  opacity: 0.5;
  flex-shrink: 0;
`;

const ChatBubble = styled.div<{ $role: 'user' | 'ai' }>`
  background: ${({ $role, theme }) => $role === 'user' ? theme.colors.yvote12 : theme.colors.yvote03};
  color: ${({ $role, theme }) => $role === 'user' ? theme.colors.yvote01 : theme.colors.yvote12};
  padding: 8px 12px;
  border-radius: 10px;
  font-size: 13px;
  line-height: 1.45;
  white-space: pre-wrap;
`;

const ChatInputRow = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 10px;
  border-top: 1px solid ${({ theme }) => theme.colors.yvote04};
`;

const ChatInput = styled.input`
  flex: 1;
  border: 1px solid ${({ theme }) => theme.colors.yvote04};
  border-radius: 8px;
  padding: 7px 10px;
  font-size: 13px;
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
  padding: 7px 12px;
  font-size: 14px;
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
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: ${({ theme }) => theme.colors.yvote08};
    animation: ${typingBounce} 1.2s infinite ease-in-out;

    &:nth-child(2) { animation-delay: 0.15s; }
    &:nth-child(3) { animation-delay: 0.3s; }
  }
`;
