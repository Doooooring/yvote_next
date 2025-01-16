import styled from 'styled-components';

import Header from '@components/common/header';

import { ToastMessageProvider } from '@utils/hook/useToastMessage';
import { ReactNode } from 'react';
import { useRouteState } from './layout.tool';
import LoadingIndicator from './loadingIndicator';
import CommonErrorBoundary from '../commonErrorBounbdary/iindex';
import { Column } from '../commonStyles';

const Layout = ({ children }: { children: ReactNode }) => {
  const routeState = useRouteState();

  return (
    <ToastMessageProvider>
      <Wrapper>
        <Header />
        <CommonErrorBoundary>
          <Body>{children}</Body>
          <LoadingIndicator state={routeState} />
        </CommonErrorBoundary>
      </Wrapper>
    </ToastMessageProvider>
  );
};

export default Layout;

const Wrapper = styled(Column)`
  width: 100vw;
  height: 100vh;
`;

const Body = styled.div`
  width: 100%;
  height: 100%;

  padding-bottom: 50px;

  background-color: rgb(242, 242, 242);
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
