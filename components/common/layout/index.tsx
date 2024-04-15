import styled from 'styled-components';

import Header from '@components/common/header';
import { ReactNode, useState } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  return (
    <Wrapper>
      <Header />
      <Body>{children}</Body>
      <Foreground state={isLoading}></Foreground>
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div``;

const Body = styled.div`
  width: 100vw;
  height: 100vh;
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
