import styled from 'styled-components';

import Header from '@components/common/header';

import { ToastMessageProvider } from '@utils/hook/useToastMessage';
import { ReactNode } from 'react';
import CommonErrorBoundary from '../commonErrorBounbdary/iindex';
import { Column } from '../commonStyles';
import { useRouteState } from './layout.tool';
import LoadingIndicator from './loadingIndicator';

const Layout = ({ children }: { children: ReactNode }) => {
  const routeState = useRouteState();

  return (
    <ToastMessageProvider>
      <Wrapper>
        <Header />
        <CommonErrorBoundary>
          <Body>{children}</Body>
        </CommonErrorBoundary>
      </Wrapper>
      <LoadingIndicator state={routeState} />
    </ToastMessageProvider>
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
