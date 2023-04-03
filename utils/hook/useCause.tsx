import { useMemo } from "react";

import avoidArgumentsImg from "@images/avoid_arguments.png";
import covidImg from "@images/covid.png";
import excessiveNewsImg from "@images/excessive_news.png";
import negativeMoodImg from "@images/negative_mood.png";
import unessentialImg from "@images/unessential.png";
import untrustworthyImg from "@images/untrustworthy.png";
import { StaticImageData } from "next/image";

const imgMap = {
  covid: covidImg,
  avoid_arguments: avoidArgumentsImg,
  excessive_news: excessiveNewsImg,
  negative_mood: negativeMoodImg,
  unessential: unessentialImg,
  untrustworthy: untrustworthyImg,
};

const percentMap = {
  covid: 43,
  avoid_arguments: 17,
  excessive_news: 29,
  negative_mood: 36,
  unessential: 16,
  untrustworthy: 29,
};

const colorMap = {
  covid: "rgb(102, 166, 174)",
  avoid_arguments: "rgb(160, 181, 128)",
  excessive_news: "rgb(168, 161, 121)",
  negative_mood: "rgb(194, 119, 73)",
  unessential: "rgb(151, 69, 53)",
  untrustworthy: "rgb(100, 47, 76)",
};

const titleMap = {
  covid: `"정치 뉴스가 너무 많아요"`,
  avoid_arguments: `"싸움에 휘말리는 느낌이 싫어요"`,
  excessive_news: `"그냥 너무 많아요.. 어디서 부터 읽어야 할지 모르겠어요"`,
  negative_mood: `"매번 부정적 기사 뿐이라 괜히 기분 안좋아"`,
  unessential: `"알면 뭐가 달라지나요? 그냥 모르고 사는게 편해요."`,
  untrustworthy: `"사람마다 말이 다 달라서... 어느 쪽 말이 맞는지 모르겠어요"`,
};

export function useCause(
  cause:
    | "covid"
    | "avoid_arguments"
    | "excessive_news"
    | "negative_mood"
    | "unessential"
    | "untrustworthy"
): [number, StaticImageData, string, string] {
  const percent = useMemo(() => percentMap[cause], []);
  const curImage = useMemo(() => imgMap[cause], []);
  const curTitle = useMemo(() => titleMap[cause], []);
  const curColor = useMemo(() => colorMap[cause], []);

  return [percent, curImage, curTitle, curColor];
}
