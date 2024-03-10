import styled from 'styled-components';
import { LoadingCommonProps } from './loadingCommon.type';

import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

/**
 * 로딩 상태 공통 컴포넌트
 */
export default function LoadingCommon({ comment }: LoadingCommonProps) {
  return (
    <Wrapper>
      <FontAwesomeIcon className="spinner" icon={faSpinner} width={16} />
      <p className="comment">{comment}</p>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;
  background-color: white;

  padding: 1rem 0;

  .spinner {
    animation: spin 2.5s linear infinite;
  }
  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }

  .comment {
    animation: blink 0.75s ease-in-out infinite;

    @keyframes blink {
      0% {
        opacity: 1;
      }
      100% {
        opacity: 0.2;
      }
    }
  }
`;
