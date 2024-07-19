import { Column, Row } from '@components/common/commonStyles';
import { Timeline } from '@utils/interface/news';
import styled from 'styled-components';

interface TimelineProps {
  timelines: Array<Timeline>;
}

const getTableData = (timelines : Array<Timeline>) => {
    const tables = timelines.map((d, i) => {
        
    })


}

export default function TimelineBox({ timelines }: TimelineProps) {
  return (
    <Wrapper>
      {timelines.map((timeline) => {
        return (
          <DataWrapper>
            <DateWrapper>
                <div className="year">{getYear(timeline.date)}</div>
                <div className="month_date">{`${getMonth()}.${}`}</div>
            </DateWrapper>
            <ContentWrapper></ContentWrapper>
          </DataWrapper>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled(Column)``;

const DataWrapper = styled(Row)``;

const DateWrapper = styled.div``;

const ContentWrapper = styled.div``;
