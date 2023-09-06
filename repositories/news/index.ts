import axios from 'axios';

import { HOST_URL } from '@url';
import { News, Preview, commentType } from '@utils/interface/news';

type AnswerState = 'left' | 'right' | 'none';

interface Response<T> {
  data: {
    success: boolean;
    result: T;
  };
}

export interface NewsDetail
  extends Pick<
    News,
    | '_id'
    | 'title'
    | 'order'
    | 'title'
    | 'summary'
    | 'keywords'
    | 'state'
    | 'timeline'
    | 'opinions'
    | 'votes'
  > {
  comments: Array<commentType>;
}

interface getNewsContentResponse {
  response: AnswerState;
  news: NewsDetail;
}

interface NewsCommentResponse {
  comments: Array<{
    title: string;
    comment: string;
  }>;
}

interface VoteResponse {
  token: string;
  state: boolean;
}

class NewsRepository {
  async getPreviews(curNum: number, keyword: string | null = null) {
    // return [
    //   {
    //     _id: '1',
    //     order: 1,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    //   {
    //     _id: '2',
    //     order: 2,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    //   {
    //     _id: '2',
    //     order: 3,
    //     title: '더미데이터 제목입니다.',
    //     summary:
    //       '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //   },
    // ];
    try {
      const response: Response<{ news: Array<Preview> }> = await axios.get(
        `${HOST_URL}/news/preview?page=${curNum}&keyword=${keyword}`,
      );
      const data = response.data;
      return data.result.news;
    } catch (e) {
      // console.log(e);
      // return [];
      return [
        {
          _id: '1',
          order: 1,
          title: '더미데이터 제목입니다.',
          summary:
            '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
          keywords: ['키워드1', '키워드2', '키워드3'],
          state: true,
        },
        {
          _id: '2',
          order: 2,
          title: '더미데이터 제목입니다.',
          summary:
            '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
          keywords: ['키워드1', '키워드2', '키워드3'],
          state: true,
        },
        {
          _id: '2',
          order: 3,
          title: '더미데이터 제목입니다.',
          summary:
            '더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다. 더미데이터 뉴스 요약입니다.',
          keywords: ['키워드1', '키워드2', '키워드3'],
          state: true,
        },
      ];
    }
  }

  async getNewsContent(id: Preview['_id']) {
    // return {
    //   response: null,
    //   news: {
    //     _id: '1',
    //     order: 1,
    //     title: '더미데이터 제목입니다',
    //     summary:
    //       '더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.$ 더미데이터 내용입니다. 더미데이터 내용입니다. 더미데이터 내용입니다.',
    //     keywords: ['키워드1', '키워드2', '키워드3'],
    //     state: true,
    //     timeline: [
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //       {
    //         date: '2017.08.12',
    //         title: '더미데이터 입니다.',
    //       },
    //     ],
    //     opinions: {
    //       left: '왼쪽 의견 입니다.',
    //       right: '오른쪽 의견입니다.',
    //     },
    //     comments: [commentType.감시자, commentType.개혁가, commentType.관찰자, commentType.민주당],
    //     votes: {
    //       left: 1,
    //       right: 1,
    //       none: 1,
    //     },
    //   },
    // };
    try {
      const token = localStorage.getItem('yVote');
      const response: Response<getNewsContentResponse> = await axios.get(
        `${HOST_URL}/news/detail?id=${id}`,
        {
          headers: {
            authorization: token,
          },
        },
      );
      const data = response.data;
      if (!data.success) Error('api error');

      return data.result;
    } catch (e) {
      return {
        response: null,
        news: {
          _id: '1',
          order: 1,
          title: '더미데이터 제목입니다',
          summary:
            '더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.더미데이터 내용입니다.$ 더미데이터 내용입니다. 더미데이터 내용입니다. 더미데이터 내용입니다.',
          keywords: ['키워드1', '키워드2', '키워드3'],
          state: true,
          timeline: [
            {
              date: '2017.08.12',
              title: '더미데이터 입니다.',
            },
            {
              date: '2017.08.12',
              title: '더미데이터 입니다.',
            },
            {
              date: '2017.08.12',
              title: '더미데이터 입니다.',
            },
          ],
          opinions: {
            left: '왼쪽 의견 입니다.',
            right: '오른쪽 의견입니다.',
          },
          comments: [
            commentType.감시자,
            commentType.개혁가,
            commentType.관찰자,
            commentType.민주당,
          ],
          votes: {
            left: 1,
            right: 1,
            none: 1,
          },
        },
      };
    }
  }

  async getNewsComment(
    id: News['_id'],
    type: commentType,
    page: number,
  ): Promise<NewsCommentResponse> {
    try {
      const response: Response<NewsCommentResponse> = await axios.get(
        `${HOST_URL}/news/comment?id=${id}&type=${type}&page=${page}`,
      );
      if (response.data.success) {
        return response.data.result;
      } else {
        Error('not success');
        return {
          comments: [
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
            {
              title: '2023.07.04 수석대변인 논평',
              comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
            },
          ],
        };
      }
    } catch (e) {
      console.log(e);
      return {
        comments: [
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
          {
            title: '2023.07.04 수석대변인 논평',
            comment: `오늘 국제원자력기구 IAEA가 일본 후쿠시마 오염수에 대한 최종 검증결과를 전달하고 발표했다.$11개 국가의 원자력 분야 최고 전문가로 구성된 IAEA TF가 거의 2년 동안 작업한 결과인 만큼, 우리 역시 국제사회의 중추국가로서 결과를 겸허히 받아들여야 한다.$아울러 냉철한 분석을 바탕으로 추후 있을 일본의 오염수 방류에 차분하게 대응해야 할 것이다.$이제 일본 후쿠시마 오염수 문제는 새로운 국면을 맞이했다고 해도 과언이 아니다.$국내의 여러 전문가뿐 아니라 국제사회가 철저한 검증을 통해 인정한 사안을,$아무런 과학적 근거도 없이 정쟁을 위해 선전선동한다 한들 귀 기울일 이는 없을뿐더러, 오히려 국제적 망신만 초래할 뿐이다.$민주당은 그동안 내내 거짓선동을 일삼다 종국에 이르러서는 IAEA의 검증조차 못 믿겠다며 UN으로 달려가겠다는 황당한 발상도 내놓았다.$UN산하 독립기구를 못믿겠으니 UN총회에 회부하겠다는 가당치도 않은 어불성설이 어디 있나.$게다가 민주당은 과거 신고리 원전 5,6호기 건설 때나 월성 원전 1호기 폐쇄 촉구 당시, 입버릇처럼 IAEA의 기준을 들먹였다.$문재인 정부 시절 정의용 전 외교부장관은 “일본이 IAEA 기준에 따른다면 굳이 반대하지 않는다”고 대정부 질문에서 당당히 말했다.$그런데도 이제와 선동을 위해 국제기구마저 '돌팔이' 취급을 하니, 대체 어느 나라 정당인지 묻지 않을 수 없다.$국제기구의 검증결과가 나온 만큼, 민주당은 이제 괴담정치를 중단하고 오직 국민안전을 위한 후속 대책에 머리를 맞대야 한다.$어제 국민의힘은 당정협의회에서 국민 불안을 줄이기 위한 대책을 논의하고 실천에 옮기기로 했다.$국민의힘은 윤석열 정부와 함께 국민불안을 종식시키고, 철저한 안전성이 확보되도록 후속조치에 만전을 기할 것이다.`,
          },
        ],
      };
    }
  }

  async vote(id: News['_id'], answer: AnswerState, token: string | null): Promise<VoteResponse> {
    const response = await axios.post(
      `${HOST_URL}/vote`,
      {
        news: id,
        response: answer,
      },
      {
        headers: {
          Authorization: `${token}`,
        },
      },
    );
    const data: {
      token: string;
      state: boolean;
    } = response.data;
    return data;
  }
}

export default new NewsRepository();
