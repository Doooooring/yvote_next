import styled from 'styled-components';
import { LoadingCommonProps } from './loadingCommon.type';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { useTypeEffect } from '@utils/hook/useTypeEffect';

/**
 * 로딩 상태 공통 컴포넌트
 */
export default function LoadingCommon({
  comment,
  isRow = true,
  fontSize = '1rem',
  fontColor = 'white',
  iconSize = 16,
}: LoadingCommonProps) {
  const { curText } = useTypeEffect({
    text: comment,
    duration: 100,
    isInfinite: true,
    period: 1000,
  });

  return (
    <Wrapper $isRow={isRow} fontSize={fontSize} fontColor={fontColor}>
      <FontAwesomeIcon className="spinner" icon={faSpinner as IconProp} width={iconSize} />
      <p className="comment">{curText}</p>
    </Wrapper>
  );
}

interface WrapperProps {
  $isRow: boolean;
  fontSize: string;
  fontColor: string;
}

const Wrapper = styled.div<WrapperProps>`
  display: flex;
  flex-direction: ${({ $isRow }) => ($isRow ? 'row' : 'column')};
  justify-content: center;
  align-items: center;
  gap: 20px;
  width: 100%;
  height: 100%;
  font-size: ${({ fontSize }) => fontSize};
  line-height: 1;
  font-weight: 500;
  padding: 1rem 0;
  color: ${({ fontColor }) => fontColor};

  p {
    min-width: ${({ fontSize }) => fontSize};
    min-height: ${({ fontSize }) => fontSize};
  }

  animation: blink 0.75s ease-in-out infinite;

  @keyframes blink {
    0% {
      opacity: 1;
    }
    100% {
      opacity: 0.5;
    }
  }

  .spinner {
    animation: spin 2.5s linear infinite;

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }
  }
`;
