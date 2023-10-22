import { useOnScreen } from '@utils/hook/useOnScreen';

import { Preview } from '@utils/interface/news';
import { useEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import PreviewBox from '../previewBox';

interface NewsListProps {
  page: number;
  previews: Preview[];
  curClicked: string | undefined;
  fetchNewsPreviews: () => Promise<void>;
  toggleNewsContentView: (id: string) => void;
}

export default function NewsList({
  page,
  previews,
  curClicked,
  fetchNewsPreviews,
  toggleNewsContentView,
}: NewsListProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const getNewsContent = async () => {
    setIsRequesting(true);
    try {
      await fetchNewsPreviews();
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
          <PreviewBox preview={preview} curClicked={curClicked} click={toggleNewsContentView} />
        </div>
      ))}
      <div className="last-line" ref={elementRef}></div>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 50%);
  grid-column-gap: 0px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  position: relative;
  animation: box-sliding 0.5s linear 1;
  overflow-x: visible;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }

  div.preview-wrapper {
    display: inline-block;
    width: 100%;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }

  div.last-line {
    width: 10px;
    height: 100px;
  }

  @media screen and (max-width: 768px) {
  }
`;
