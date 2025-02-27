import { KeyTitle, KeywordToView } from '@utils/interface/keywords';
import { use, useCallback, useMemo, useRef, useState } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { useDevice } from '../../../utils/hook/useDevice';
import { HeaderHeight } from '../../../utils/layout';
import { CommonIconButton, CommonLayoutBox, CommonTagBox, Row } from '../../common/commonStyles';
import { useScrollInfo } from '../../../utils/hook/useScrollInfo';
import HorizontalScroll from '../../common/horizontalScroll/horizontalScroll';
import Image from 'next/image';
import reloadImage from '@assets/img/reload_icon.svg';
import menuImage from '@assets/img/menu_icon.svg';
import Modal from '../../common/modal';

interface KeywordHeadTabProps {
  keywords: Array<KeyTitle>;
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
  totalKeywords,
  style = {},
}: KeywordHeadTabProps) {
  const [isOpenTopSheet, setIsOpenTopSheet] = useState(false);
  const [isTopSheetDown, setIsTopSheetDown] = useState(false);

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
        console.log('==========');
        console.log(headRef.current.offsetTop);
        setTimeout(() => {
          window.scrollTo({ left: 0, top: headRef.current!.offsetTop - 160, behavior: 'smooth' });
        }, 100);
      }
    },
    [clickKeyword],
  );

  const openTopSheet = useCallback(() => {
    setIsOpenTopSheet(true);
    setTimeout(() => {
      setIsTopSheetDown(true);
    }, 0);
  }, []);

  const closeTopSheet = useCallback(() => {
    setIsTopSheetDown(false);
    setTimeout(() => {
      setIsOpenTopSheet(false);
    }, 100);
  }, []);

  return (
    <>
      <Head ref={headRef}>와이보트 아티클</Head>
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
              onClick={openTopSheet}
            />
          </ReloadButton>
        </ButtonsWrapper>
        <KeywordWrapper>
          <KeywordScrollWrapper>
            {keywords.map((keyword) => {
              return (
                <Keyword
                  key={keyword.keyword}
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
  box-sizing: border-box;

  display: flex;
  flex-direction: row;

  width: 70%;
  max-width: 1000px;
  min-width: 800px;
  position: sticky;
  z-index: 9999;
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
  flex: 1 0 auto;
  align-items: center;
  gap: 10px;
  padding-right: 10px;
  border-right: 1px solid #f1f2f5;
`;

const ReloadButton = styled(CommonIconButton)`
  flex: 1 0 auto;
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

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

interface TopSheetProps {
  isOpen: boolean;
}

const TopSheet = styled(CommonLayoutBox)<TopSheetProps>`
  @media screen and (max-width: 768px) {
    position: absolute;
    top: ${({ isOpen }) => (isOpen ? '0px' : '-500px')};
    left: 0;
    width: 100%;
    height: 500px;
    background-color: white;

    transition: top 0.2s ease-in-out;
  }
`;

const TopSheetHead = styled(Row)`
  padding: 6px;
`;

const SearchWrapper = styled.div``;

const TopSheetHeadKeywords = styled.div``;

const TopSheetBody = styled.div``;

const TopSheetKeywordWrapper = styled.div``;
