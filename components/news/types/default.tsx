import NewsContent from '@components/news/newsContents';
import { NewsInView } from '@utils/interface/news';
import styled from 'styled-components';

export type NewsTypeLayoutProps = {
  news: NewsInView;
};

export default function DefaultNewsLayout({ news }: NewsTypeLayoutProps) {
  return (
    <Wrapper>
      <div className="main-contents">
        <div className="main-contents-body">
          <div className="news-contents-wrapper">
            <NewsContent newsContent={news} voteHistory={null} />
          </div>
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  font-family: Helvetica, sans-serif;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .main-contents {
    width: 50%;
    min-width: 600px;
    @media screen and (max-width: 768px) {
      width: 98%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      font-size: 13px;
    }
  }
`;
