import { KeywordToView } from '@utils/interface/keywords';
import { useCallback, useMemo, useState } from 'react';
import styled, { CSSProperties } from 'styled-components';
import { useDevice } from '../../../utils/hook/useDevice';
import { HeaderHeight } from '../../../utils/layout';
import { CommonTagBox } from '../../common/commonStyles';

interface KeywordHeadTabProps {
  keywords: Array<KeywordToView>;
  reload: () => void;
  fetchNewsPreviews: (filter: string | null) => void;
  style?: CSSProperties;
}

export default function KeywordHeadTab({
  keywords,
  reload,
  fetchNewsPreviews,
  style = {},
}: KeywordHeadTabProps) {
  const [keywordClicked, setKeywordClicked] = useState<KeywordToView | null>(null);
  const device = useDevice();

  const stickyTopPosition = useMemo(() => {
    return HeaderHeight(device);
  }, [device]);

  const clickKeyword = useCallback(
    (keyword: KeywordToView) => {
      if (keywordClicked?.id == keyword.id) {
        setKeywordClicked(null);
        fetchNewsPreviews(null);
      } else {
        setKeywordClicked(keyword);
        fetchNewsPreviews(keyword.keyword);
      }
    },
    [setKeywordClicked, fetchNewsPreviews],
  );

  return (
    <Wrapper style={style}>
      <div></div>
      <div>
        {keywords.map((keyword) => {
          return (
            <Keyword
              key={keyword.keyword}
              $clicked={keywordClicked != null && keywordClicked.id === keyword.id}
            />
          );
        })}
      </div>
    </Wrapper>
  );
}

const Wrapper = styled.div``;
const ReloadWrapper = styled.div``;

interface KeywordProps {
  $clicked: boolean;
}

const Keyword = styled(CommonTagBox)<KeywordProps>`
  flex: 0 1 auto;

  margin-left: 3px;
  margin-right: 6px;
  margin-bottom: 6px;
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
