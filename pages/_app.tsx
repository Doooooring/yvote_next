import type { AppProps } from 'next/app';

import HeadMeta from '@components/common/HeadMeta';
import Layout from '@components/common/layout';
import '@styles/globals.css';
import { ThemeProvider } from 'styled-components';
import { customTheme } from '../public/assets/theme';
import GlobalStyle from '../styles/globalStyle';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={customTheme}>
      <GlobalStyle />
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ThemeProvider>
  );
}
