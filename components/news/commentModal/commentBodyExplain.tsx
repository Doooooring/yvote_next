import styled from 'styled-components';

interface CommentBodyExplainProps {
  title: string;
  explain: string;
}

export default function CommentBodyExplain({ title, explain }: CommentBodyExplainProps) {
  return (
    <Wrapper>
      <ContentTitle>{title}</ContentTitle>
      <ContentBody>
        {explain.split('$').map((li, idx) => {
          return (
            <p key={idx} className="content_line">
              {li}
            </p>
          );
        })}
      </ContentBody>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  padding: 1rem 0;
  color: black;
`;

const ContentTitle = styled.p`
  color: black;
  font-size: 16px;
  font-weight: 600;
  padding-bottom: 1.5rem;
  @media screen and (max-width: 768px) {
    font-weight: 600;
  }
`;

const ContentBody = styled.div`
  font-weight: 400;
  font-size: 15px;
`;

const ContentLine = styled.div`
  color: black;
  margin-bottom: 0.5rem;
  min-height: 10px;
`;
