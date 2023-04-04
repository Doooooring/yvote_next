import styled from "styled-components";

import { BrickBar } from "@components/common/figure";
import { News } from "@utils/interface/news";

interface NewsHistoryProps {
  news: News["news"];
}

export default function NewsHistory({ news }: NewsHistoryProps) {
  return (
    <Wrapper>
      <HistoryHead>관련 뉴스 기사</HistoryHead>
      <HistoryExplanation>
        <HistoryDate>
          {news.map((comp) => {
            console.log(comp);
            const dateToList = comp.date.split(".");
            const year = dateToList[0];
            const month = dateToList[1];
            return (
              <li
                key={`${comp.date}`}
                style={{ textAlign: "left" }}
              >{`${year}.${month}`}</li>
            );
          })}
        </HistoryDate>
        <BrickBar num={news.length} />
        <HistorySentences>
          {news.map((comp) => {
            return (
              <SentenceWrapper key={comp.title}>
                <NewsLink href={`${comp.link}`} target="_blank">
                  {comp.title}
                </NewsLink>
              </SentenceWrapper>
            );
          })}
        </HistorySentences>
      </HistoryExplanation>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 0;
  padding: 20px;
  margin-top: 10px;
  background-color: rgb(246, 246, 246);
  border-radius: 10px;
`;

const HistoryHead = styled.span`
  font-size: 17px;
  font-weight: 800;
`;

const HistoryExplanation = styled.p`
  display: flex;
  justify-content: row;
  flex-direction: row;
  margin-top: 12px;
`;

const NewsGrid = styled.div`
  display: grid;
  align-items: center;
`;

const HistoryDate = styled(NewsGrid)`
  text-align: right;
  margin-right: 20px;
`;
const HistorySentences = styled(NewsGrid)``;

const SentenceWrapper = styled.div``;

const NewsLink = styled.a`
  text-decoration: none;
  color: black;
`;
