import React, { useState } from 'react';
import styled from 'styled-components';
import { PieChart } from 'react-minimal-pie-chart';

export type ResultAnswers = number[];

const Result = ({ answers }: { answers: ResultAnswers }) => {
  const colors = ['#4CAF50', '#FFC107', '#2196F3', '#143225'];
  const titles = ['정부의존성', '이념성', '보수성', '정부불신'];
  const [detailsVisible, setDetailsVisible] = useState(false);

  const calculateScores = () => {
    let scores = [];
    for (let i = 0; i < answers.length; i += 6) {
      const group = answers.slice(i, i + 6);
      const totalScore = group.reduce((acc, current) => acc + current, 0);
      const detailScore1 = group.slice(0, 3).reduce((acc, current) => acc + current, 0);
      const detailScore2 = group.slice(3, 6).reduce((acc, current) => acc + current, 0);
      scores.push({
        totalScore,
        detailScore1,
        detailScore2,
        color: colors[(i / 6) % colors.length],
      });
    }
    return scores;
  };

  const toggleAllDetails = () => {
    setDetailsVisible(!detailsVisible);
  };

  const scores = calculateScores();

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
                  value: score.totalScore,
                  color: colors[index % colors.length],
                },
                { title: 'Remainder', value: 100 - score.totalScore, color: 'lightgrey' },
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
      {detailsVisible && (
        <DetailsContainer>
          {scores.map((score, index) => (
            <Detail key={index}>
              <DetailTitle>{titles[index]} Analysis:</DetailTitle>
              <BarLabel>
                <ScoreLabel>Detail 1</ScoreLabel>
                <Bar color={score.color} width={score.detailScore1} max={15} />
              </BarLabel>
              <BarLabel>
                <ScoreLabel>Detail 2</ScoreLabel>
                <Bar color={score.color} width={score.detailScore2} max={15} />
              </BarLabel>
            </Detail>
          ))}
        </DetailsContainer>
      )}
      <ToggleButton onClick={toggleAllDetails}>
        {detailsVisible ? '숨기기' : '자세히 보기'}
      </ToggleButton>
    </Wrapper>
  );
};

export default Result;

const Wrapper = styled.div`
  width: 100%;
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
  margin-top: 20px;
  padding: 20px 40px 20px 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
`;

interface BarProps {
  color: string;
  width: number;
  max: number;
}

const BarLabel = styled.div`
  display: flex;
  justify-content: flex-start;
  width: 100%;
  align-items: center;
`;

const Bar = styled.div<BarProps>`
  background-color: ${({ color }) => color};
  width: ${({ width, max }) => `${(width / max) * 100}%`};
  height: 20px;
  border-radius: 2px;
  transition: width 0.3s ease;
`;

const ScoreLabel = styled.div`
  width: 60px;
  margin-right: 10px;
  font-size: 0.9rem;
  color: #666;
  flex-shrink: 0;
  white-space: nowrap;
`;

const Detail = styled.div`
  margin-bottom: 15px;
`;

const DetailTitle = styled.h3`
  color: #333;
  font-size: 1.2rem;
  margin-bottom: 5px;
`;

const ToggleButton = styled.button`
  padding: 5px 10px;
  margin: 20px 0;
  background-color: white;
  color: #747272;
  border: none;
  border-radius: 5px;
  cursor: pointer;
`;
