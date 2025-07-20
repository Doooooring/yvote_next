import { Backdrop, FallbackBox } from '@components/common/commonStyles';
import styled from 'styled-components';

export function NewArticlesFallback() {
  return (
    <BodyWrapper className="body-wrapper">
      <div className="grid-wrapper">
        {new Array(5).fill(null).map((_, i) => {
          return <Fallback key={i} />;
        })}
      </div>
      <Backdrop />
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

const Fallback = styled(FallbackBox)`
  width: 90%;
  height: 30px;
  margin-bottom: 10px;

  @media screen and (max-width: 768px) {
    height: 20px;
  }
`;
