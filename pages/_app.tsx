import type { AppProps } from 'next/app';

import HeadMeta from '@components/common/HeadMeta';
import Layout from '@components/common/layout';
import ChatAssistant from '@components/common/ChatAssistant';
import { ChatContextProvider, useChatContext } from '@/utils/context/chatContext';
import '@styles/globals.css';
import { ThemeProvider } from 'styled-components';
import { customTheme } from '../public/assets/theme';
import GlobalStyle from '../styles/globalStyle';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

function AppInner({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { activeContent, viewedHistory } = useChatContext();

  const pageContext = useMemo(() => {
    const parts: string[] = [];

    const path = router.pathname;
    if (path === '/') parts.push('홈 페이지.');
    else if (path === '/news') parts.push('/news 페이지. 섹션: 최신 코멘트, 대기중 뉴스, 발행완료 뉴스.');
    else if (path.startsWith('/news/')) parts.push(`뉴스 상세 페이지.`);
    else parts.push(`${path} 페이지.`);

    if (activeContent) {
      parts.push(`현재 보고 있는 내용:\n${activeContent}`);
    }

    if (viewedHistory.length > 0) {
      parts.push(`이전에 본 내용: ${viewedHistory.join(', ')}`);
    }

    return parts.join('\n');
  }, [router.pathname, activeContent, viewedHistory]);

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      <ChatAssistant screenContext={pageContext} />
    </>
  );
}

export default function App(props: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <GlobalStyle />
      <ChatContextProvider>
        <AppInner {...props} />
      </ChatContextProvider>
    </ThemeProvider>
  );
}
