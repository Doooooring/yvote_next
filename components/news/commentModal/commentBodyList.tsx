import IsShow from '@components/common/isShow';
import { Comment } from '@utils/interface/news';
import { getDateHidingCurrentYear } from '@utils/tools/date';
import styled from 'styled-components';

interface CommentBodyListProps {
  comments: Comment[];
  clickComment: (comment: Comment) => void;
}

export default function CommentBodyList({ comments, clickComment }: CommentBodyListProps) {
  return (
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
      })}
    </ModalList>
  );
}

const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  overflow-y: scroll;
`;

const ModalList = styled.div`
  display: flex;
  flex-direction: column;
`;

const BodyBlock = styled.div`
  height: 60px;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  box-sizing: border-box;
  border-bottom: 1.5px solid #ddd;
  span {
    display: -webkit-box;
    -webkit-line-clamp: 1;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    font-size: 15px;
    font-weight: 500;
    color: rgb(50, 50, 50);
  }
  .date {
    flex: 0 0 auto;
    margin-left: 8px;
    font-size: 13px;
    color: rgb(120, 120, 120);
  }
`;
