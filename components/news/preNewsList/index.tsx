import PreviewBox from '@components/news/previewBox';
import usePreNewsList from '@utils/hook/news/usePreNewsList';
import styled from 'styled-components';

export function PreNewsList() {
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


const Wrapper = styled.div``;
