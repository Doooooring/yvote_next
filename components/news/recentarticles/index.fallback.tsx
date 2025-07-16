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
`;

const Fallback = styled(FallbackBox)`
  width: 90%;
  height: 25px;
  margin-bottom: 14px;
`;
