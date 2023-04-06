import styled from 'styled-components';

export default function ExplanationComp({ explain }: { explain: string | undefined }) {
  if (explain === undefined) {
    return <div></div>;
  }
  return (
    <ExplanationWrapper>
      {explain.split('$').map((s, idx) => {
        return <Explanation key={idx}>{s}</Explanation>;
      })}
    </ExplanationWrapper>
  );
}

const ExplanationWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 480px;
  background-color: white;
  padding-top: 30px;
  padding-bottom: 30px;
  padding-left: 20px;
  padding-right: 20px;
  border-radius: 20px;
  box-shadow: 0 0 30px -25px;
`;

const Explanation = styled.p`
  font-family: var(--font-pretendard);
  font-size: 18px;
  color: rgb(90, 90, 90);
  line-height: 1.5;
  text-align: left;
  text-indent: 1em;
`;
