import PreviewBox from '@components/news/previewBox';
import usePreNewsList from '@utils/hook/news/usePreNewsList';
import { Suspense } from 'react';
import styled from 'styled-components';

function PreNewsList() {
  const read = usePreNewsList();
  const preNewsList = read();

  return (
    <Wrapper>
      {preNewsList.map((item) => {
        return <PreviewBox key={item.id} preview={item} img={item.newsImage} click={() => {}} />;
      })}
    </Wrapper>
  );
}

export default function SuspensePreNewsList() {
  return (
    <Suspense fallback={<></>}>
      <PreNewsList />
    </Suspense>
  );
}

const Wrapper = styled.div``;
