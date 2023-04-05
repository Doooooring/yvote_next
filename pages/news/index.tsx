import { useCallback, useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { GetServerSideProps } from "next";

import { SpeechBubble } from "@components/common/figure";
import NewsContents from "@components/news/newsContents";
import PreviewBox from "@components/news/previewBox";
import SearchBox from "@components/news/searchBox";
import icoNews from "@images/ico_news.png";
import NewsRepository from "@repositories/news";
import { useOnScreen } from "@utils/hook/useOnScreen";
import { News, Preview } from "@utils/interface/news";
import Image from "next/image";

type curPreviewsList = Preview[];
type newsContent = undefined | News;
type curClicked = undefined | News["order"];
type setCurClicked = (curClicked: curClicked) => void;

interface NewsProps {
  data: Array<Preview>;
}

export const getServerSideProps: GetServerSideProps<NewsProps> = async () => {
  const data: Array<Preview> = await NewsRepository.getPreviews(0, "");
  console.log(data);
  return {
    props: { data },
  };
};

// export async function getServerSideProps(): Promise<{ props: NewsProps }> {
//   const data: Array<Preview> = await NewsRepository.getPreviews(0, "");
//   return {
//     props: { data },
//   };
// }

export default function NewsPage(props: NewsProps) {
  const [curClicked, setCurClicked] = useState<curClicked>(undefined);
  const [submitWord, setSubmitWord] = useState<string>("");
  const [newsContent, setNewsContent] = useState<newsContent>(undefined);
  const [curPreviews, setCurPreviews] = useState<curPreviewsList>(props.data);
  const [voteHistory, setVoteHistory] = useState<
    "left" | "right" | "none" | null
  >(null);

  //무한 스크롤에 필요한 훅들
  const curPage = useRef<number>(10);
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  //뷰에 들어옴이 감지될 때 요청 보내기
  const getNewsContent = useCallback(async () => {
    setIsRequesting(true);
    try {
      const Previews: Array<Preview> = await NewsRepository.getPreviews(
        curPage.current,
        submitWord
      );
      if (Previews.length === 0) {
        curPage.current = -1;
        return;
      }
      curPage.current += 10;
      const newPreviews = curPreviews.concat(Previews);
      setCurPreviews(newPreviews);
      return;
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  }, [curPreviews]);

  useEffect(() => {
    getNewsContent();
  }, []);

  useEffect(() => {
    //요청 중이라면 보내지 않기
    if (isOnScreen === true && isRequesting === false) {
      getNewsContent();
    } else {
      return;
    }
  }, [isOnScreen]);

  return (
    <Wrapper>
      <SearchWrapper>
        <SearchBox
          curPage={curPage}
          setSubmitWord={setSubmitWord}
          setCurPreviews={setCurPreviews}
        />
        <SpeechBubble width={200} height={30} />
      </SearchWrapper>
      <MainContents>
        <MainHeaderWrapper>
          <MainHeader>
            <Image src={icoNews} alt="hmm" height="18" />
            <CategoryName>{"최신 뉴스"}</CategoryName>
          </MainHeader>
        </MainHeaderWrapper>
        <MainContentsBody>
          <NewsList curClicked={curClicked}>
            {curPreviews.map((preview) => (
              <PreviewBoxWrapper key={preview.order}>
                <PreviewBox
                  Preview={preview}
                  curClicked={curClicked}
                  setCurClicked={setCurClicked}
                  setNewsContent={setNewsContent}
                  setVoteHistory={setVoteHistory}
                />
              </PreviewBoxWrapper>
            ))}
            <LastLine
              ref={curPage.current === -1 ? null : elementRef}
            ></LastLine>
          </NewsList>
          <NewsContentsWrapper curClicked={curClicked}>
            <NewsContents
              curClicked={curClicked}
              setCurClicked={setCurClicked}
              newsContent={newsContent}
              voteHistory={voteHistory}
            />
          </NewsContentsWrapper>
        </MainContentsBody>
      </MainContents>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  height: 1500px;
  margin-top: 100px;
`;

const SearchWrapper = styled.div`
  width: 1000px;
  height: 50px;
  background-color: white;
  border-radius: 10px;
  box-shadow: 0px 0px 30px -20px;
  margin-bottom: 40px;
`;

const MainContents = styled.div``;

const MainHeaderWrapper = styled.div`
  height: 30px;
`;

const MainHeader = styled.div`
  width: 1000px;
  text-align: left;
  padding-left: 10px;
`;

const CategoryName = styled.p`
  display: inline;
  width: 1000px;
  margin-left: 10px;
  font-weight: 700;
  font-size: 18px;
`;

const MainContentsBody = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 495px);
  grid-column-gap: 10px;
  position: relative;
`;

interface NewsListProps {
  curClicked: curClicked;
}

const NewsList = styled.div<NewsListProps>`
  width: ${({ curClicked }) => {
    return curClicked ? "500px" : "1000px";
  }};
  display: grid;
  grid-template-columns: repeat(auto-fill, 490px);
  grid-template-rows: repeat(auto-fill, 130px);
  grid-column-gap: 0px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  height: 1300px;
  position: relative;
  overflow: scroll;
  animation: box-sliding 0.5s linear 1;
`;

const PreviewBoxWrapper = styled.div`
  display: inline-block;
  width: 470px;
`;

interface NewsContentsWrapperProps {
  curClicked: curClicked;
}

const LastLine = styled.div`
  width: 10px;
  height: 10px;
`;

const NewsContentsWrapper = styled.div<NewsContentsWrapperProps>`
  width: 500px;
  height: 800px;
  opacity: ${(curClicked) => (curClicked ? 1 : 0)};
  pointer-events: ${(curClicked) => (curClicked ? "auto" : "none")};
`;
