import { Backdrop, FallbackBox } from '@components/common/commonStyles';
import styled from 'styled-components';

export function NewArticlesFallback() {
  return (
    <>
      <div className="header-wrapper">
        <div className="category-head">
          <HeadFallback />
        </div>
      </div>
      <div className="body-wrapper">
        <div className="grid-wrapper">
          {new Array(5).fill(null).map((_, i) => {
            return <Fallback key={i} />;
          })}
        </div>
      </div>
      <Backdrop />
    </>
  );
}

const HeadFallback = styled(FallbackBox)`
  min-width: 200px;
  height: 30px;
  margin-bottom: 10px;
`;

const Fallback = styled(FallbackBox)`
  width: 90%;
  height: 25px;
  margin-bottom: 14px;
`;
