import type { AppProps } from 'next/app';

import Layout from '@components/common/layout';
import indexStore from '@store/indexStore';
import '@styles/globals.css';
import { Provider } from 'mobx-react';
import { ThemeProvider } from 'styled-components';
import { customTheme } from '../public/assets/theme';

export default function App({ Component, pageProps }: AppProps) {
  const store = indexStore();
  return (
    <ThemeProvider theme={customTheme}>
      <Layout>
        <Provider store={store}>
          <Component {...pageProps} />;
        </Provider>
      </Layout>
    </ThemeProvider>
  );
}
