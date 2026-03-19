import { ErrorComment } from '@components/common/commonErrorBounbdary/commonErrorView';
import IsShow from '@components/common/isShow';
import { Comment, commentType } from '@utils/interface/news';
import { commentTypeColor } from '@utils/interface/news/comment';
import { getDateHidingCurrentYear } from '@utils/tools/date';
import styled from 'styled-components';

interface CommentBodyListProps {
  commentType: commentType;
  comments: Comment[];
  clickComment: (comment: Comment) => void;
}

export default function CommentBodyList({
  commentType,
  comments,
  clickComment,
}: CommentBodyListProps) {
  return comments.length > 0 ? (
    <ModalList>
      {comments.map((comment, idx) => {
        return (
          <BodyBlock
            key={comment.comment + idx}
            onClick={() => {
              clickComment(comment);
            }}
          >
            <span>{comment.title}</span>
            <IsShow state={comment.date != null}>
              <span className="date">{getDateHidingCurrentYear(comment.date)}</span>
            </IsShow>
          </BodyBlock>
        );
      })}{' '}
    </ModalList>
  ) : (
    <VacantWrapper>
      <ErrorComment>
        <span
          style={{
            color: commentTypeColor(commentType),
          }}
        >
          {commentType}
        </span>{' '}
        관련 최신 자료가 존재하지 않습니다.
      </ErrorComment>
    </VacantWrapper>
  );
}

const ModalList = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyBlock = styled.div`
  height: auto;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  border-bottom: 1px solid ${({ theme }) => theme.colors.yvote03};
  justify-content: space-between;
  transition: background-color 0.15s ease;

  &:hover {
    background-color: ${({ theme }) => theme.colors.yvote02};
  }

  span:first-child {
    flex: 1;
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 13.5px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.text};
    line-height: 1.4;
    margin-right: 8px;
  }

  .date {
    flex: 0 0 auto;
    font-size: 11px;
    font-weight: 400;
    color: ${({ theme }) => theme.colors.yvote06};
  }
`;

const VacantWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;
