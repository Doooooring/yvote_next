import styled from "styled-components";

import Image from "next/image";

import icoClose from "@assets/img/ico_close.png";
import Journals from "@components/news/newsContents/journals";
import NewsHistory from "@components/news/newsContents/newsHistory";
import VoteBox from "@components/news/newsContents/voteBox";
import { News } from "@utils/interface/news";

type newsContent = undefined | News;
type curClicked = undefined | News["order"];
type setCurClicked = (curClicked: curClicked) => void;

interface NewsContentProps {
  curClicked: curClicked;
  setCurClicked: setCurClicked;
  newsContent: newsContent;
  voteHistory: "left" | "right" | "none" | null;
}

export default function NewsContent({
  curClicked,
  setCurClicked,
  newsContent,
  voteHistory,
}: NewsContentProps) {
  if (curClicked === undefined || newsContent === undefined) {
    return <div></div>;
  } else {
    return (
      <Wrapper>
        <NewsBoxClose>
          <input
            type="button"
            style={{ display: "none" }}
            id="close-button"
            onClick={() => {
              setCurClicked(undefined);
            }}
          ></input>
          <CloseButton htmlFor="close-button">
            <Image src={icoClose} alt="hmm" />
          </CloseButton>
        </NewsBoxClose>
        <Body>
          <ContentHead>{newsContent.title}</ContentHead>
          <ContentBody>
            <Summary>{newsContent.summary}</Summary>
            <NewsHistory news={newsContent.news} />
            <Journals journals={newsContent.journals} />
            <VoteBox
              id={newsContent._id}
              state={newsContent.state}
              opinions={newsContent.opinions}
              votes={newsContent.votes}
              voteHistory={voteHistory}
            />
          </ContentBody>
        </Body>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  width: 500px;
  background-color: white;
  border-width: 0px;
  border-color: #000000;
  border-radius: 10px;
  border-style: solid;
  padding-top: 20px;
  padding-bottom: 20px;
  text-align: left;
  position: absolute;
  overflow: scroll;
`;
const NewsBoxClose = styled.div`
  padding-top: 10px;
  padding-right: 20px;
  text-align: right;
`;
const CloseButton = styled.label`
  padding-top: 10px;

  text-align: right;
  &:hover {
    cursor: pointer;
  }
`;
const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  line-height: 150%;
  text-align: left;
  position: relative;
  background-color: white;
`;
const ContentHead = styled.h1`
  padding-left: 20px;
  margin-bottom: 20px;
  font-size: 22px;
  font-weight: 600;
`;
const ContentBody = styled.div`
  padding-left: 20px;
  padding-right: 20px;
`;
const Summary = styled.div`
  display: inline-block;
  font-size: 17px;
  line-height: 1.5;
  color: rgb(130, 130, 130);
  font-weight: 450;
  margin-bottom: 5%;
  font-family: "summary-font";
  word-break: break-all;
`;
