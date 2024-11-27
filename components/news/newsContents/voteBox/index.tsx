import { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';

import NewsRepository from '@repositories/news';
import { News } from '@utils/interface/news';
import { CommonLayoutBox } from '@components/common/commonStyles';

type AnswerState = 'left' | 'right' | 'none';
type SubmitState = 'resolve' | 'pending' | 'error';

interface VoteBoxProps extends Pick<News, 'id' | 'state' | 'votes'> {
  voteHistory: 'left' | 'right' | 'none' | null;
  opinions: {
    left: string;
    right: string;
  };
}

export default function VoteBox({ id, state, opinions, votes, voteHistory }: VoteBoxProps) {
  const [haveThinked, setHaveThinked] = useState<boolean | null>(false);
  const [checkLeftRight, setCheckLeftRight] = useState<'left' | 'right' | 'none' | null>(null);
  const [submitState, setSubmitState] = useState<SubmitState>('pending');

  // const voteTotal = useMemo(() => {
  //   const { left, right, none } = votes ?? { left: 1, right: 1, none: 1 };
  //   return left + right + none;
  // }, [votes]);

  const submitButtonText = useMemo(() => {
    return {
      resolve: '생각이 바뀌었습니다',
      pending: '✔ 참여하기',
      error: '! 생각을 하고 왔습니다.',
    };
  }, []);

  const vote = async (voteAnswer: AnswerState) => {
    const token = localStorage.getItem('yVote');
    const response = await NewsRepository.vote(id, voteAnswer, token);
    localStorage.setItem('yVote', response.token);
    return;
  };

  const handlePendingState = async () => {
    if (haveThinked) {
      const voteAnswer: AnswerState = checkLeftRight ?? 'none';
      const response = await vote(voteAnswer);
      if (checkLeftRight == null) {
        setCheckLeftRight('none');
      }
      setSubmitState('resolve');
    } else {
      setSubmitState('error');
    }
  };

  const clickSubmitButton = async () => {
    try {
      switch (submitState) {
        case 'resolve':
          setSubmitState('pending');
          break;
        case 'pending':
          handlePendingState();
          break;
        case 'error':
          setSubmitState('pending');
          break;
      }
    } catch (e) {
      alert('다시 시도해 주세요.');
    }
  };

  useEffect(() => {
    if (voteHistory !== null) {
      setHaveThinked(true);
      setCheckLeftRight(voteHistory);
      setSubmitState('resolve');
    } else {
      setHaveThinked(false);
      setCheckLeftRight(null);
      setSubmitState('pending');
    }
  }, [id]);

  return (
    <Wrapper>
      <HaveThinked>
        <VotingSentence>투표하기 전에 생각했나요?</VotingSentence>
        <VotingBlocks>
          <VotingBlock>
            <ThinkBox
              type="radio"
              name="think"
              id="yes"
              checked={state === true && haveThinked === true}
              onClick={() => {
                setHaveThinked(true);
              }}
              disabled={submitState !== 'pending'}
            />
            예
          </VotingBlock>
          <VotingBlock>
            <ThinkBox
              type="radio"
              name="think"
              id="no"
              checked={state === true && haveThinked === false}
              onClick={() => {
                setHaveThinked(false);
                setCheckLeftRight(null);
              }}
              disabled={submitState !== 'pending'}
            />
            아니오
          </VotingBlock>
        </VotingBlocks>
      </HaveThinked>
      <LeftRightBox>
        <LeftRightHead>여러분의 생각에 투표하세요.</LeftRightHead>
        <CheckBoxWrapper>
          <CheckBox
            type="radio"
            name="checkbox"
            id="left"
            checked={checkLeftRight === 'left'}
            onClick={() => {
              setCheckLeftRight('left');
            }}
            disabled={haveThinked === false || submitState === 'resolve'}
          />
          <LRComment>{opinions.left}</LRComment>
        </CheckBoxWrapper>
        {/* <VoteGraph
          vote={votes.left}
          totalVote={voteTotal}
          backgroundColor={'#e17070'}
          submitState={submitState}
        /> */}
        <CheckBoxWrapper>
          <CheckBox
            type="radio"
            name="checkbox"
            id="right"
            checked={checkLeftRight === 'right'}
            onClick={() => {
              setCheckLeftRight('right');
            }}
            disabled={haveThinked === false || submitState === 'resolve'}
          />
          <LRComment>{opinions.right}</LRComment>
        </CheckBoxWrapper>
        {/* <VoteGraph
          vote={votes.right}
          totalVote={voteTotal}
          backgroundColor={'#6872c9'}
          submitState={submitState}
        /> */}
        <CheckBoxWrapper>
          <CheckBox
            type="radio"
            name="checkbox"
            id="none"
            checked={checkLeftRight === 'none'}
            onClick={() => {
              setCheckLeftRight('none');
            }}
            disabled={haveThinked === false || submitState === 'resolve'}
          />
          <LRComment>{'잘 모르겠다'}</LRComment>
        </CheckBoxWrapper>
        {/* <VoteGraph
          vote={votes.none}
          totalVote={voteTotal}
          backgroundColor={'grey'}
          submitState={submitState}
        /> */}
      </LeftRightBox>
      <SubmitBlock>
        <SubmitButton
          type="submit"
          onClick={(e) => {
            e.preventDefault();
            clickSubmitButton();
          }}
        >
          {submitButtonText[submitState]}
        </SubmitButton>
      </SubmitBlock>
      <BackDrop state={state}></BackDrop>
    </Wrapper>
  );
}

const Wrapper = styled(CommonLayoutBox)`
  padding: 20px;
  margin-bottom: 20px;
  // border-radius: 15px;
  // background-color: rgba(121, 192, 215, 0.2);
  position: relative;
  & {
    input[type='radio'] {
      border: 1px solid black;
      -webkit-text-size-adjust: none;
      appearance: auto;
      width: 0.8rem;
      height: 0.8rem;
      border-radius: 100%;
      margin: 0;
      margin-right: 10px;
      background-color: white;
    }
    input[type='radio']:checked {
      accent-color: rgb(43, 159, 194);
    }
  }
`;

const HaveThinked = styled.div`
  font-size: 20px;
  font-weight: 800;
  margin-bottom: 20px;
  text-align: center;
  color: black;
`;

const VotingSentence = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 10px;
  color: black;
`;

const VotingBlocks = styled.div`
  width: 70%;
  display: grid;
  grid-template-columns: repeat(2, 50%);
`;

const VotingBlock = styled.div`
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #2b2c2d;
  display: flex;
  align-items: center;
`;

const ThinkBox = styled.input`
  margin-right: 10px;
`;

const LeftRightBox = styled.div`
  width: 100%;
`;

const LeftRightHead = styled.div`
  font-size: 16px;
  font-weight: 600;
  text-align: left;
  margin-bottom: 10px;
  color: black;
`;

const CheckBoxWrapper = styled.div`
  margin-bottom: 10px;
  display: flex;
  align-items: center;
`;

const CheckBox = styled.input`
  margin-right: 10px;
`;

const LRComment = styled.span`
  text-align: left;
  font-size: 14px;
  font-weight: 600;
  color: #2b2c2d;
`;

const SubmitBlock = styled.div`
  text-align: center;
  margin-top: 30px;
  border: 0;
`;

const SubmitButton = styled.button`
  width: 200px;
  height: 50px;
  border: 0;
  border-radius: 10px;
  background-color: #79c0d7;
  color: white;
  font-size: 13px;
  font-weight: 600;
  &:hover {
    cursor: pointer;
  }
  &:active {
    box-shadow: 0px 0px 35px -5px rgb(57, 150, 248);
  }
`;

interface BackDropProps {
  state: boolean;
}

const BackDrop = styled.div<BackDropProps>`
  display: ${({ state }) => (state ? 'none' : 'block')};
  width: 100%;
  height: 100%;
  position: absolute;
  left: 0;
  top: 0;
  z-index: 99;
  backdrop-filter: grayscale(90%);
`;
