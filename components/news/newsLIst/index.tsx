import LoadingCommon from '@components/common/loading';
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
  showNewsContent: (id: string) => void;
}

export default function NewsList({
  page,
  previews,
  curClicked,
  fetchNewsPreviews,
  showNewsContent,
}: NewsListProps) {
  const elementRef = useRef<HTMLDivElement>(null);
  const isOnScreen = useOnScreen(elementRef);
  const [isRequesting, setIsRequesting] = useState<boolean>(false);

  const getNewsContent = async () => {
    setIsRequesting(true);
    try {
      await fetchNewsPreviews();
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
    <>
      <Wrapper>
        {previews.map((preview, idx) => (
          <div className="preview-wrapper" key={preview._id}>
            <PreviewBox preview={preview} curClicked={curClicked} click={showNewsContent} />
          </div>
        ))}
      </Wrapper>
      {isRequesting ? <LoadingCommon comment={'새소식을 받아오고 있어요!'} /> : <></>}
      <LastLine ref={elementRef}></LastLine>
    </>
  );
}

const Wrapper = styled.div`
  -webkit-text-size-adjust: none;
  color: #666;
  text-align: center;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  box-sizing: inherit;
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, 50%);
  column-gap: 0px;
  justify-items: center;
  border-style: solid;
  border-radius: 10px;
  border-width: 0px;
  opacity: 1;
  position: relative;
  animation: 0.5s linear 0s 1 normal none running box-sliding;
  overflow-x: visible;
  @media screen and (max-width: 768px) {
    grid-template-columns: repeat(auto-fill, 100%);
  }

  div.preview-wrapper {
    -webkit-text-size-adjust: none;
    color: #666;
    text-align: center;
    margin: 0;
    padding: 0;
    border: 0;
    font: inherit;
    box-sizing: inherit;
    display: inline-block;
    padding-right: 0.25rem;
    padding-left: 0.25rem;
  }
`;

const LastLine = styled.div`
  width: 10px;
  height: 120px;
`;
