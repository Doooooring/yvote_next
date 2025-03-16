import menuImage from '@assets/img/menu_icon.svg';
import reloadImage from '@assets/img/reload_icon.svg';
import { KeyTitle } from '@utils/interface/keywords';
import Image from 'next/image';
import { useCallback, useMemo, useRef } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { useDevice } from '../../../utils/hook/useDevice';
import { useScrollInfo } from '../../../utils/hook/useScrollInfo';
import { HeaderHeight } from '../../../utils/layout';
import { CommonIconButton, CommonLayoutBox, CommonTagBox, Row } from '../../common/commonStyles';
import HorizontalScroll from '../../common/horizontalScroll/horizontalScroll';

interface KeywordHeadTabProps {
  keywords: Array<KeyTitle>;
  setKeywords: (keywords: KeyTitle[]) => void;
  openEditKeywordsTopSheet: () => void;
  totalKeywords: Array<KeyTitle>;
  keywordSelected: KeyTitle | null;
  reload: () => void;
  clickKeyword: (keyword: KeyTitle) => Promise<void>;
  style?: CSSProperties;
}

export default function KeywordHeadTab({
  keywords,
  keywordSelected,
  reload,
  clickKeyword,
  openEditKeywordsTopSheet,
  style = {},
}: KeywordHeadTabProps) {
  const { scrollDirection, scrollY } = useScrollInfo();
  const headRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const device = useDevice();

  const stickyTopPosition = useMemo(() => {
    return HeaderHeight(device);
  }, [device]);

  const stickyStyle = useMemo(() => {
    if (!headRef.current) return {};

    return scrollY > headRef.current.offsetTop ? { borderRadius: '0px', width: '100%' } : {};
  }, [device, scrollY]);

  const clickKeywordWithScroll = useCallback(
    async (keyword: KeyTitle) => {
      await clickKeyword(keyword);
      if (headRef.current && window) {
        setTimeout(() => {
          window.scrollTo({ left: 0, top: headRef.current!.offsetTop - 160, behavior: 'smooth' });
        }, 100);
      }
    },
    [clickKeyword],
  );

  return (
    <>
      <Head ref={headRef}></Head>
      <Wrapper ref={bodyRef} style={{ ...style, ...stickyStyle, top: stickyTopPosition }}>
        <ButtonsWrapper>
          <ReloadButton>
            <Image src={reloadImage} alt="reload" width={16} height={16} onClick={reload} />
          </ReloadButton>
          <ReloadButton>
            <Image
              src={menuImage}
              alt="filter-menu"
              width={16}
              height={16}
              onClick={openEditKeywordsTopSheet}
            />
          </ReloadButton>
        </ButtonsWrapper>
        <KeywordWrapper>
          <KeywordScrollWrapper>
            {keywords.map((keyword, idx) => {
              return (
                <Keyword
                  key={keyword.keyword + idx}
                  $clicked={keywordSelected != null && keywordSelected.id === keyword.id}
                  onClick={() => {
                    clickKeywordWithScroll(keyword);
                  }}
                >
                  {keyword.keyword}
                </Keyword>
              );
            })}
          </KeywordScrollWrapper>
        </KeywordWrapper>
      </Wrapper>
    </>
  );
}

const Head = styled.p``;

const Wrapper = styled(CommonLayoutBox)`
  @media screen and (min-width: 1196px) {
    display: none;
  }

  box-sizing: border-box;

  display: flex;
  flex-direction: row;

  width: 70%;
  min-width: 800px;

  position: sticky;
  z-index: 999;
  background-color: white;
  @media screen and (max-width: 768px) {
    width: 98%;
    min-width: 0px;
    overflow: hidden;
  }
  padding: 8px 8px;
  margin-bottom: 10px;
`;

const Layout = styled(Row)`
  width: 100%;
`;

const ButtonsWrapper = styled(Row)`
  height: 32.4px;
  flex: 0 0 auto;
  align-items: center;

  gap: 10px;
  padding-right: 10px;
  border-right: 1px solid #f1f2f5;
`;

const ReloadButton = styled(CommonIconButton)`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
`;

const KeywordWrapper = styled(HorizontalScroll)`
  flex: 0 1 auto;
  width: 100%;
  padding: 0 10px;
`;

const KeywordScrollWrapper = styled(Row)`
  flex: 0 1 auto;
`;

interface KeywordProps {
  $clicked: boolean;
}

const Keyword = styled(CommonTagBox)<KeywordProps>`
  flex: 1 0 auto;

  margin-left: 3px;
  margin-right: 6px;
  color: ${({ $clicked, theme }) => ($clicked ? theme.colors.yvote02 : 'rgb(120, 120, 120)')};
  background-color: ${({ $clicked }) => ($clicked ? 'white !important' : '#f1f2f5')};
  border: 1px solid #f1f2f5;
  border-color: ${({ $clicked, theme }) =>
    $clicked ? theme.colors.yvote01 + ' !important' : '#f1f2f5'};
  border-radius: 20px;
  cursor: pointer;
  transition: background-color 0.2s ease-in-out;

  animation: back-blink 0.4s ease-in-out forwards;
  @keyframes back-blink {
    0% {
      opacity: 0.4;
    }
    100% {
      opacity: 1;
    }
  }

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;
