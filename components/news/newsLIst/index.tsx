import { useOnScreen } from '@utils/hook/useOnScreen';

import { Preview } from '@utils/interface/news';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PreviewBox from '../previewBox';

interface NewsListProps {
  page: number;
  previews: Preview[];
  curClicked: string | undefined;
  fetchNewsContent: () => Promise<void>;
  toggleNewsContentView: (id: string) => void;
}

export default function NewsList({
  page,
  previews,
  curClicked,
  fetchNewsContent,
  toggleNewsContentView,
}: NewsListProps) {
  //무한 스크롤에 필요한 훅들
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const getNewsContent = async () => {
    setIsRequesting(true);
    try {
      await fetchNewsContent();
      return;
    } catch (e) {
      console.error(e);
    } finally {
      setIsRequesting(false);
    }
  };

  //뷰에 들어옴이 감지될 때 요청 보내기
  useEffect(() => {
    //요청 중이라면 보내지 않기
    if (page != -1 && isOnScreen === true && isRequesting === false) {
      getNewsContent();
    } else {
      return;
    }
  }, [isOnScreen]);

  return (
    <Wrapper>
      {previews.map((preview, idx) => (
        <div className="preview-wrapper" key={idx}>
          <PreviewBox Preview={preview} curClicked={curClicked} click={toggleNewsContentView} />
        </div>
      ))}
      <div className="last-line" ref={elementRef}></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 1000px;
  display: grid;
  grid-template-columns: repeat(auto-fill, 500px);
  grid-template-rows: repeat(auto-fill, 140px);
  grid-column-gap: 0px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  height: 1300px;
  position: relative;
  animation: box-sliding 0.5s linear 1;
  overflow-x: visible;

  div.preview-wrapper {
    display: inline-block;
    width: 490px;
  }

  div.last-line {
    width: 10px;
    height: 100px;
  }
`;