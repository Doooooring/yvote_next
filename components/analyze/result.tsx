import React, { useState } from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';
import typedquestions from './questions.json';
import Types from './types.tsx';

export type ResultAnswers = number[];

interface BarProps {
  color: string;
  width: number;
  max: number;
}

const Result = ({ answers }: { answers: ResultAnswers }) => {
  const colors = ['#4CAF50', '#FFC107', '#2196F3', '#666666'];
  const titles = ['정부의존성', '이념성', '보수성', '정부불신'];
  const [detailsVisible, setDetailsVisible] = useState(false);
  const fetchDetailId = (scoreIndex: number, detailIndex: number) => {
    const adjustedIndex = scoreIndex * 30 + detailIndex * 3;
    const id = typedquestions[adjustedIndex]?.detail;
    return id ? id : '??';
  };

  const calculateScores = () => {
    let scores = [];
    const detailScoreCount = 10;
    const answersPerDetailScore = 3;

    for (let i = 0; i < answers.length; i += 30) {
      const group = answers.slice(i, i + 30);
      const totalScore = group.reduce((acc, current) => acc + current, 0);

      let detailScores = [];
      for (let j = 0; j < detailScoreCount; j++) {
        const detailStart = j * answersPerDetailScore;
        const detailScore = group
          .slice(detailStart, detailStart + answersPerDetailScore)
          .reduce((acc, current) => acc + current, 0);
        detailScores.push(detailScore);
      }

      scores.push({
        totalScore,
        detailScores,
        color: colors[(i / 30) % colors.length],
      });
    }
    return scores;
  };

  const toggleAllDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const scores = calculateScores();

  const key = scores.map((score) => (score.totalScore > 75 ? 'G' : 'L')).join('');

  let resultid;
  switch (key) {
    case 'LLLL':
      resultid = 0;
      break;
    case 'LLLG':
      resultid = 10;
      break;
    case 'LLGL':
      resultid = 8;
      break;
    case 'LLGG':
      resultid = 7;
      break;
    case 'LGLL':
      resultid = 3;
      break;
    case 'LGLG':
      resultid = 9;
      break;
    case 'LGGL':
      resultid = 6;
      break;
    case 'LGGG':
      resultid = 6;
      break;
    case 'GLLL':
      resultid = 11;
      break;
    case 'GLLG':
      resultid = 12;
      break;
    case 'GLGL':
      resultid = 5;
      break;
    case 'GLGG':
      resultid = 4;
      break;
    case 'GGLL':
      resultid = 1;
      break;
    case 'GGLG':
      resultid = 1;
      break;
    case 'GGGL':
      resultid = 2;
      break;
    case 'GGGG':
      resultid = 2;
      break;
    default:
      resultid = -1; // Default case if none match
      break;
  }

  return (
    <Wrapper>
      <ChartContainer>
        {scores.map((score, index) => (
          <ChartWrapper key={index}>
            <ChartTitle>{titles[index % titles.length]}</ChartTitle>
            <PieChart
              data={[
                {
                  title: `Score ${index + 1}`,
                  value: (score.totalScore * 100) / 150,
                  color: colors[index % colors.length],
                },
                {
                  title: 'Remainder',
                  value: ((150 - score.totalScore) * 100) / 150,
                  color: 'lightgrey',
                },
              ]}
              lineWidth={40}
              startAngle={270}
              lengthAngle={-360}
              animate
              label={({ dataEntry }) =>
                dataEntry.title === `Score ${index + 1}` ? `${dataEntry.value}` : ''
              }
              labelStyle={{
                fontSize: '1.5rem',
                fontFamily: 'Helvetica',
                fill: '#666',
              }}
              labelPosition={0}
            />
          </ChartWrapper>
        ))}
      </ChartContainer>
      <ToggleButton onClick={toggleAllDetails}>
        {detailsVisible ? '숨기기' : '자세히 보기'}
      </ToggleButton>
      {detailsVisible && (
        <DetailsContainer>
          {scores.map((score, index) => (
            <Detail key={index}>
              <DetailTitle>{titles[index]}</DetailTitle>
              {score.detailScores.map((detailScore, detailIndex) => (
                <BarLabel key={detailIndex}>
                  <ScoreLabel>{fetchDetailId(index, detailIndex)}</ScoreLabel>
                  <Barbox>
                    <Bar color={score.color} width={detailScore} max={15} />
                  </Barbox>
                </BarLabel>
              ))}
            </Detail>
          ))}
        </DetailsContainer>
      )}
      <Types id={12}></Types>
    </Wrapper>
  );
};

export default Result;

const Wrapper = styled.div`
  width: 100%;
  padding: 0 0 150px 0;
`;

const ChartContainer = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  align-items: center;
`;

const ChartWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin: 50px 0;
  width: 15%;
  height: 15%;
`;

const ChartTitle = styled.h2`
  margin: 10px 0;
  font-size: 1.2rem;
  color: #333;
`;

const DetailsContainer = styled.div`
  margin: 20px 0 0 0;
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  justify-content: space-around;
  border-radius: 8px;
`;

const Detail = styled.div`
  display: flex;
  padding: 15px 20px;
  flex-direction: column;
  align-items: center;
  width: 18%;
  border-radius: 10px;
  background-color: #f9f9f9;
`;

const DetailTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 10px;
`;

const BarLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const Barbox = styled.div`
  display: flex;
  background-color: transparent;
  align-items: center;
  height: 20px;
  width: 100%;
  transition: width 0.3s ease;
`;

const Bar = styled.div<BarProps>`
  background-color: ${({ color }) => color};
  width: ${({ width, max }) => `${(width / max) * 100}%`};
  height: 60%;
  border-radius: 3px;
  transition: width 0.3s ease;
`;

const ScoreLabel = styled.div`
  display: flex;
  align-items: center;
  width: 60px;
  font-size: 0.8rem;
  color: #666;
  flex-shrink: 0;
  white-space: nowrap;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  background-color: white;
  color: #747272;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
