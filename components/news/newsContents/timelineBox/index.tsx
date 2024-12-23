// import { Column, CommonLayoutBox, Row } from '@components/common/commonStyles';
// import { Timeline } from '@utils/interface/news';
// import styled from 'styled-components';

// interface TimelineProps {
//   timelines: Array<Timeline>;
// }

// type TimelineTable = {
//   [year: number]: {
//     [month: number]: {
//       [day: number]: string;
//     };
//   };
// };

// const addDfs = (target: any, k: string, v: any) => {
//   if (typeof v == 'string') {
//     target[k] = v;
//   } else {
//     if (!(k in target)) target[k] = {};
//     const neTarget = target[k];
//     const keys = Object.keys(v);
//     for (let nk of keys) {
//       addDfs(neTarget, nk, v[nk]);
//     }
//   }
// };

// const getTableData = (timelines: Array<{ title: string; date: string }>) => {
//   const tables = {};
//   timelines.forEach((d, i) => {
//     const [year, month, date] = d.date.split('.');
//     const dt: any = {};
//     dt[date] = d.title;
//     const ddt: any = {};
//     ddt[month] = dt;

//     addDfs(tables, year, ddt);
//   });

//   return tables;
// };

// const monthEng: { [key: string]: string } = {
//   '01': 'Jan',
//   '02': 'Feb',
//   '03': 'Mar',
//   '04': 'Apr',
//   '05': 'May',
//   '06': 'Jun',
//   '07': 'Jul',
//   '08': 'Aug',
//   '09': 'Sep',
//   '10': 'Oct',
//   '11': 'Nov',
//   '12': 'Dec',
// };

// interface ITimelineTable {
//   [key: string]: ITimelineTable | string;
// }

// export default function TimelineBox({ timelines }: TimelineProps) {
//   const timelineTable = getTableData(timelines) as ITimelineTable;

//   return (
//     <Wrapper>
//       <ContentWrapper>
//         <CommonHeadLine>타임라인 살펴보기</CommonHeadLine>

//         {Object.keys(timelineTable).map((year: string) => {
//           const monthTable = timelineTable[year] as ITimelineTable;
//           return (
//             <YearWrapper>
//               <LineWrapper>
//                 <Line />
//               </LineWrapper>
//               <YearData>
//                 <YearTitle>
//                   <p className="timeline_data">{year}</p>
//                 </YearTitle>
//                 {Object.keys(monthTable).map((month: string) => {
//                   const dateTable = monthTable[month] as { [key: string]: string };
//                   return (
//                     <>
//                       {Object.keys(dateTable).map((date: string) => {
//                         const data = dateTable[date] as string;
//                         return (
//                           <MonthWrapper>
//                             <DateWrapper>
//                               <div className="circle_outer">
//                                 <div className="circle_inner">
//                                   <p>
//                                     {month}.{date}
//                                   </p>
//                                 </div>
//                               </div>
//                             </DateWrapper>
//                             <DataWrapper>
//                               <p className="timeline_data">{data}</p>
//                             </DataWrapper>
//                           </MonthWrapper>
//                         );
//                       })}
//                     </>
//                   );
//                 })}
//               </YearData>
//             </YearWrapper>
//           );
//         })}
//       </ContentWrapper>
//     </Wrapper>
//   );
// }

// const CommonHeadLine = styled.h4`
//   font-size: 14px;
//   font-weight: 600;
//   color: black;
// `;

// const Wrapper = styled(CommonLayoutBox)`
//   box-sizing: border-box;

//   width: 100%;

//   padding: 0.5rem 1rem;
// `;

// const ContentWrapper = styled(Column)`
//   width: 100%;

//   position: relative;

//   .timeline_data {
//     font-weight: 600;
//     font-size: 12px;
//     color: #a1a1a1;
//   }
// `;

// const YearWrapper = styled.div``;

// const LineWrapper = styled.div`
//   position: absolute;

//   width: 60px;
//   height: 100%;

//   display: flex;
//   flex-direction: column;
//   align-items: center;
// `;

// const Line = styled.div`
//   width: 2px;
//   height: 100%;
//   background-color: #bde8eb;
//   z-index: 0;
// `;

// const YearTitle = styled.div`
//   width: 60px;

//   background-color: white;

//   padding: 0.5rem 0rem;

//   .timeline_data {
//     text-align: center;
//     font-size: 12px;
//     font-weight: 400;
//   }
// `;

// const YearData = styled(Column)`
//   padding-top: 10px;

//   gap: 10px;
//   z-index: 1;
// `;
// const MonthWrapper = styled(Row)`
//   align-items: center;
//   gap: 20px;
// `;

// const DateWrapper = styled.div`
//   align-items: center;

//   flex: 1 0 auto;

//   .circle_outer {
//     background-color: #bde8eb;

//     padding: 0.25rem;

//     border-radius: 4px;

//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//   }

//   .circle_inner {
//     background-color: #88cadf;

//     padding: 0.25rem 0.5rem;

//     border-radius: 4px;

//     display: flex;
//     flex-direction: column;
//     justify-content: center;
//     align-items: center;
//   }

//   p {
//     line-height: 1.1;
//     font-size: 12px;
//     color: #fffdfd;
//   }
// `;

// const DataWrapper = styled.div`
//   width: 100%;
// `;
