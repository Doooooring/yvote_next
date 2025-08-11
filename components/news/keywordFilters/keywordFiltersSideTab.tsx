import menuImage from '@assets/img/menu_icon.svg';
import reloadImage from '@assets/img/reload_icon.svg';
import { KeyTitle } from '@utils/interface/keywords';
import Image from 'next/image';
import styled from 'styled-components';
import { CommonIconButton, CommonLayoutBox, CommonTagBox, Row } from '../../common/commonStyles';

export function KeywordFiltersSideTab({
  keywords,
  keywordSelected,
  reload,
  clickKeyword,
  openEditKeywordsTopSheet,
}: {
  keywords: Array<KeyTitle>;
  openEditKeywordsTopSheet: () => void;
  keywordSelected: KeyTitle | null;
  reload: () => void;
  clickKeyword: (keyword: KeyTitle) => Promise<void>;
}) {
  return (
    <TagWrapper>
      <KeywordsWrapper>
        <Row
          style={{
            gap: '10px',
          }}
        >
          <KeywordTitle>키워드로 골라보기</KeywordTitle>
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
        </Row>
        <KeywordContents>
          {keywords.map((keyword) => {
            return (
              <Keyword
                key={keyword.keyword}
                $clicked={keywordSelected != null && keywordSelected.id === keyword.id}
                onClick={() => {
                  clickKeyword(keyword);
                }}
              >
                {keyword.keyword}
              </Keyword>
            );
          })}
        </KeywordContents>
      </KeywordsWrapper>
    </TagWrapper>
  );
}

const ReloadButton = styled(CommonIconButton)`
  flex: 0 0 auto;
  width: 24px;
  height: 24px;
`;

const TagWrapper = styled.div`
  flex: 1 0 auto;

  width: 300px;
  padding-left: 10px;

  position: relative;

  @media screen and (max-width: 1196px) {
    display: none;
  }
`;

const KeywordsWrapper = styled(CommonLayoutBox)`
  padding: 1rem;
  position: sticky;
  top: 100px;
`;

const KeywordTitle = styled.div`
  color: ${({ theme }) => theme.colors.gray800};
  font-weight: 700;
  font-size: 1.1rem;
  text-align: left;
`;

const KeywordContents = styled.div`
  padding-top: 10px;
  text-align: left;
`;

interface KeywordProps {
  $clicked: boolean;
}

const Keyword = styled(CommonTagBox)<KeywordProps>`
  margin-left: 3px;
  margin-right: 6px;
  margin-bottom: 6px;
  color: ${({ $clicked, theme }) => ($clicked ? theme.colors.yvote05 : 'rgb(120, 120, 120)')};
  background-color: ${({ $clicked }) => ($clicked ? 'white !important' : '#f1f2f5')};
  border-color: ${({ $clicked, theme }) =>
    $clicked ? theme.colors.yvote03 + ' !important' : '#f1f2f5'};
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
