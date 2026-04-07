import NewsContent from '@components/news/newsContents';
import { NewsInView } from '@utils/interface/news';
import styled from 'styled-components';

export type NewsTypeLayoutProps = {
  news: NewsInView;
};

export default function DefaultNewsLayout({ news }: NewsTypeLayoutProps) {
  return (
    <Wrapper>
      <Content>
        <NewsContent newsContent={news} voteHistory={null} />
      </Content>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 24px 0 60px;
  background-color: ${({ theme }) => theme.colors.yvote02};

  @media screen and (max-width: 768px) {
    padding: 12px 0 40px;
  }
`;

const Content = styled.div`
  width: 92%;
  max-width: 1200px;
  padding: 0 6px;

  @media screen and (max-width: 768px) {
    width: 96%;
    padding: 0 10px;
  }
`;
