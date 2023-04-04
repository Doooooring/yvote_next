import { useMemo } from "react";
import styled from "styled-components";

import Image from "next/image";

import icoChosun from "@assets/img/ico_chosun.png";
import icoDonga from "@assets/img/ico_donga.png";
import icoHankyoreh from "@assets/img/ico_hankyoreh.png";
import icoHankyung from "@assets/img/ico_hankyung.png";
import icoJoongang from "@assets/img/ico_joongang.png";
import icoMk from "@assets/img/ico_mk.png";
import { News } from "@utils/interface/news";

interface JournalsProps {
  journals: News["journals"];
}

export default function Journals({ journals }: JournalsProps) {
  const pressImage = useMemo(
    () => ({
      조선: icoChosun,
      중앙: icoJoongang,
      동아: icoDonga,
      한겨레: icoHankyoreh,
      한경: icoHankyung,
      매경: icoMk,
    }),
    []
  );
  return (
    <Wrapper>
      <Head>사설 및 칼럼</Head>
      {journals.map((journal) => {
        return (
          <JournalLink
            key={journal.press}
            href={`${journal.link}`}
            target="_blank"
          >
            <Journal>
              <Image src={pressImage[journal.press]} alt="hmm" />
              <JournalName>{journal.title}</JournalName>
            </Journal>
          </JournalLink>
        );
      })}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  border: 0;
  border-radius: 10px;
  background-color: rgb(246, 246, 246);
  margin-top: 3%;
  margin-bottom: 20px;
  text-align: left;
  padding: 20px;
  padding-bottom: 30px;
  overflow: scroll;
`;
const Head = styled.h2`
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 20px;
`;

const JournalLink = styled.a`
  text-decoration: none;
  color: black;
`;

const Journal = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
  text-decoration: none;

  & > img {
    display: inline-block;
    color: white;
    height: 30px;
    text-decoration: none;
    margin-right: 15px;
    text-align: center;
    border-radius: 5px;
    font-weight: 600;
  }
`;

const JournalName = styled.p`
  color: black;
  font-size: 14px;
  font-weight: 600;
`;
