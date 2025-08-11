import { Suspense, useCallback } from 'react';
import styled from 'styled-components';

import { CommonLayoutBox } from '@/components/common/commonStyles';
import LoadingCommon from '@/components/common/loading';
import NewsListSection from '@/components/news/newsListSection';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useMount } from '@utils/hook/useMount';
import { Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';

type curPreviewsList = Preview[];

interface pageProps {
  data: Array<Preview>;
}

export default function NewsPage(props: pageProps) {
  const router = useRouter();
  const { page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews } =
    useFetchNewsPreviews(16, true);

  useMount(() => {
    fetchPreviews({ limit: 16 });
  });

  const showNewsContent = useCallback(async (id: number) => {
    router.push(`/adminjae/${id}`);
  }, []);

  return (
    <Wrapper>
      <div className="main-contents">
        <div className="main-contents-body">
          <Suspense
            fallback={
              <LoadingWrapper>
                <LoadingCommon comment={'새소식을 받아오고 있어요!'} fontColor="black" />
              </LoadingWrapper>
            }
          >
            <NewsListSection keywordFilter="" clickPreviews={showNewsContent} isAdmin={true} />
          </Suspense>
          {/* <SuspensePreNewsList /> */}
          {/* <NewsList
            page={page}
            previews={previews}
            isRequesting={isRequesting}
            fetchPreviews={fetchNextPreviews}
            showNewsContent={showNewsContent}
          /> */}
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  padding: 0;
  border: 0;
  font-family: Helvetica, sans-serif;
  box-sizing: inherit;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 10px;
  padding-bottom: 50px;
  background-color: rgb(242, 242, 242);
  ::-webkit-scrollbar {
    display: none;
  }
  -ms-overflow-style: none;
  scrollbar-width: none;
  .search-wrapper {
    width: 70%;
    min-width: 800px;
    height: 50px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 30px -20px;
    margin-bottom: 40px;
    position: relative;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
      margin-bottom: 20px;
    }
  }

  .main-header-wrapper {
    height: 30px;
    .main-header {
      width: 70%;
      min-width: 800px;
      text-align: left;
      padding-left: 10px;
      .category-name {
        display: inline;
        width: 70%;
        margin-left: 10px;
        font-weight: 700;
        font-size: 18px;
        @media screen and (max-width: 768px) {
          width: 90%;
          min-width: 0px;
        }
      }
    }
  }

  .main-contents {
    width: 70%;
    min-width: 800px;
    @media screen and (max-width: 768px) {
      width: 90%;
      min-width: 0px;
    }
  }

  .main-contents-body {
    position: relative;
    .news-contents-wrapper {
      width: 100%;
      height: 800px;
      font-size: 13px;
    }
  }
`;
const LoadingWrapper = styled(CommonLayoutBox)`
  background-color: white;
`;
