import styled from 'styled-components';

import Header from '@components/common/header';
import { ReactNode } from 'react';

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <Wrapper>
      <Header />
      <Body>{children}</Body>
    </Wrapper>
  );
};

export default Layout;

const Wrapper = styled.div``;

const Body = styled.div`
  width: 100vw;
  height: 100vh;
  padding-bottom: 50px;
  overflow: scroll;
  background-color: rgb(242, 242, 242);
`;
