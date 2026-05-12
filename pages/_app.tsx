import { useEffect } from 'react';
import type { AppProps } from 'next/app';
import { useRouter } from 'next/router';
import { ThemeProvider } from 'styled-components';

import { ChatContextProvider, useChatContext } from '@/utils/context/chatContext';
import ChatAssistant from '@components/common/ChatAssistant';
import HeadMeta from '@components/common/HeadMeta';
import Layout from '@components/common/layout';

import { customTheme } from '../public/assets/theme';
import GlobalStyle from '../styles/globalStyle';

import '@styles/globals.css';

function AppInner({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const { setActiveContent } = useChatContext();

  useEffect(() => {
    const path = router.asPath.split('?')[0];
    if (path.startsWith('/news/')) return;
    if (path === '/') setActiveContent('/ (홈 페이지) 이동');
    else if (path === '/news') setActiveContent('/news (뉴스 목록 페이지) 이동');
    else setActiveContent(`${path} 이동`);
  }, [router.asPath]);

  return (
    <>
      <Layout>
        <Component {...pageProps} />
      </Layout>
      {router.pathname !== '/chatbot' && <ChatAssistant />}
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
