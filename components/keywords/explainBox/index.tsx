import defaultImg from '@images/img_thumb@2x.png';
import { HOST_URL } from '@public/assets/url';
import { category } from '@utils/interface/keywords';

import Image from 'next/image';
import { useState } from 'react';
import styled from 'styled-components';

export default function ExplanationComp({
  explain,
  keyword,
}: {
  category: category;
  explain: string | undefined;
  keyword: string;
}) {
  const [keywordTagLoadError, setKeywordTagLoadError] = useState<boolean>(false);
  const [keywordImgLoadError, setKeywordImgLoadError] = useState<boolean>(false);
  if (explain === undefined) {
    return <div></div>;
  }
  return (
    <ExplanationWrapper>
      <ExplanationHeader>
        <p>{keyword}</p>
        <Image
          src={keywordTagLoadError ? defaultImg : `${HOST_URL}/images/keyword/${keyword}.png`}
          alt="hmm"
          width="20"
          height="20"
          onError={() => {
            setKeywordTagLoadError(true);
          }}
        />
      </ExplanationHeader>
      <ExplanationBody>
        <ExplanationList>
          {explain.split('$').map((s, idx) => {
            return <Explanation key={idx}>{s}</Explanation>;
          })}
        </ExplanationList>
        <KeywordImg>
          <Image
            src={keywordImgLoadError ? defaultImg : `${HOST_URL}/images/keyword/${keyword}.png`}
            alt="hmm"
            width="170"
            height="170"
            onError={() => {
              setKeywordImgLoadError(true);
            }}
          />
        </KeywordImg>
      </ExplanationBody>
    </ExplanationWrapper>
  );
}

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 1000px;
  background-color: white;
  padding: 2rem 3rem;
  box-shadow: 0 8px 35px -25px;
  p {
    margin: 0;
    padding: 0;
  }
`;

const ExplanationHeader = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 8px;
  font-size: 18px;
  font-weight: 600;
  & {
    img {
      flex: 0 0 auto;
      object-fit: contain;
    }
  }
`;

const ExplanationBody = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const ExplanationList = styled.div`
  display: flex;
  flex-direction: column;
  padding-left: 0.25rem;
  width: 700px;
  gap: 10px;
`;

const KeywordImg = styled.div``;

const Explanation = styled.p`
  font-family: var(--font-pretendard);
  font-size: 16px;
  font-weight: 600;
  color: #a1a1a1;
  line-height: 1.5;
  text-align: left;
`;
