import styled from 'styled-components';

import Header from '@components/common/header';

import { RouterProvider } from '@utils/hook/useRouter/routerProvider';
import { ToastMessageProvider } from '@utils/hook/useToastMessage';
import { ReactNode } from 'react';
import { GlobalLoadingProvider } from '../../../utils/hook/useGlobalLoading/globalLoadingProvider';
import CommonErrorBoundary from '../commonErrorBounbdary/index';
import LoadingIndicator from './loadingIndicator';
import RouteLoading from './routeLoading';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <RouterProvider>
      <GlobalLoadingProvider>
        <RouteLoading />
        <ToastMessageProvider>
          <Wrapper>
            <Header />
            <CommonErrorBoundary>
              <Body>{children}</Body>
            </CommonErrorBoundary>
          </Wrapper>
          <LoadingIndicator />
        </ToastMessageProvider>
      </GlobalLoadingProvider>
    </RouterProvider>
  );
};

export default Layout;

const Wrapper = styled.div`
  width: 100vw;
`;

const Body = styled.div`
  width: 100%;

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
