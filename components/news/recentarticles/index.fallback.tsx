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
          {new Array(5).fill(null).map((_) => {
            return <Fallback />;
          })}
        </div>
      </div>
      <Backdrop />
    </>
  );
}

const HeadFallback = styled(FallbackBox)`
  min-width: 200px;
  height: 20px;
`;

const Fallback = styled(FallbackBox)`
  width: 90%;
  height: 20px;
  margin-bottom: 10px;
`;