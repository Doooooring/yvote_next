import styled from 'styled-components';

import { Backdrop, FallbackBox } from '@components/common/commonStyles';

export function NewArticlesFallback() {
  return (
    <BodyWrapper className="body-wrapper">
      <div className="grid-wrapper">
        {new Array(5).fill(null).map((_, i) => {
          return <Fallback key={i} />;
        })}
      </div>
      <ArticlesBackdrop />
    </BodyWrapper>
  );
}

const BodyWrapper = styled.div`
  position: relative;
  height: 200px;
  @media screen and (max-width: 768px) {
    height: 150px;
  }
`;

const ArticlesBackdrop = styled(Backdrop)`
  background: linear-gradient(
    90deg,
    ${({ theme }) => theme.colors.yvote02},
    ${({ theme }) => theme.colors.gray100},
    ${({ theme }) => theme.colors.yvote02}
  );
  background-size: 20% auto;
  background-repeat: no-repeat;
  animation-duration: 1s;
`;

const Fallback = styled(FallbackBox)`
  width: 90%;
  height: 30px;
  margin-bottom: 10px;
  @media screen and (max-width: 768px) {
    height: 20px;
  }
`;
