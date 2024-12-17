import { useCallback, useEffect, useRef, useState } from 'react';
import styled from 'styled-components';

import { SpeechBubble } from '@components/common/figure';
import NewsList from '@components/news/newsLIst';
import SearchBox from '@components/news/searchBox';
import NewsRepository from '@repositories/news';
import { Preview } from '@utils/interface/news';
import { useRouter } from 'next/router';
import { useFetchNewsPreviews } from '@utils/hook/useFetchInfinitePreviews';
import { useMount } from '@utils/hook/useMount';
import { useNewsNavigate } from '@utils/hook/useNewsNavigate';

type curPreviewsList = Preview[];

interface pageProps {
  data: Array<Preview>;
}

export default function NewsPage(props: pageProps) {
  const navigate = useRouter();
  const { page, isRequesting, isError, previews, fetchPreviews, fetchNextPreviews } =
    useFetchNewsPreviews(16, true);

  useMount(() => {
    fetchPreviews({ limit: 16 });
  });

  const showNewsContent = useCallback(async (id: number) => {
    navigate.push(`/adminjae/${id}`);
  }, []);

  return (
    <Wrapper>
      <div className="search-wrapper">
        <SearchBox page={page} fetchPreviews={fetchPreviews} />
        {/* <SpeechBubble /> */}
      </div>
      <div className="main-contents">
        <div className="main-header-wrapper"></div>
        <div className="main-contents-body">
          <NewsList
            page={page}
            previews={previews}
            isRequesting={isRequesting}
            fetchPreviews={fetchNextPreviews}
            showNewsContent={showNewsContent}
          />
        </div>
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100%;
  overflow-y: scroll;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding-top: 20px;
  background-color: rgb(242, 242, 242);
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
