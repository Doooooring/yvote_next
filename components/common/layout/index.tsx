import styled from 'styled-components';

import Header from '@components/common/header';

import { ModalProvider } from '@utils/hook/useModal';
import { ToastMessageProvider } from '@utils/hook/useToastMessage';
import { ReactNode } from 'react';
import { GlobalLoadingProvider } from '../../../utils/hook/useGlobalLoading/globalLoadingProvider';
import GlobalErrorBoundary from '../commonErrorBounbdary/globalErrorBoundary';
import LoadingIndicator from './loadingIndicator';
import { QueryProvider } from './queryProvider';
import RouteLoading from './routeLoading';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <QueryProvider>
      <GlobalLoadingProvider>
        <RouteLoading />
        <ToastMessageProvider>
          <ModalProvider>
            <Wrapper>
              <Header />
              <GlobalErrorBoundary>
                <Body>{children}</Body>
              </GlobalErrorBoundary>
            </Wrapper>
            <LoadingIndicator />
          </ModalProvider>
        </ToastMessageProvider>
      </GlobalLoadingProvider>
    </QueryProvider>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100vw;
  height: 100vh;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  background-color: rgb(242, 242, 242);

  flex: 1 0 auto;
`;

interface ForegroundProps {
  state: boolean;
}

const Foreground = styled.div<ForegroundProps>`
  display: ${({ state }) => (state ? 'block' : 'none')};
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
`;
