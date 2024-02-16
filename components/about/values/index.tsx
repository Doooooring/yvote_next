import styled from 'styled-components';
import Image from 'next/image';
import Pic01 from '@images/pic01_1.jpeg';
import Pic02 from '@images/pic02_2.jpeg';
import Pic03 from '@images/pic03_3.jpeg';

export function Values() {
  return (
    <Wrapper>
      <Header>
        <h2>제공 가치</h2>
        <hr />
      </Header>
      <Body>
        <EachValue>
          <h3>1. 뉴스 최소화</h3>
          <ImageWrapper>
            <Image src={Pic01} alt="" />
          </ImageWrapper>
          <p>
            '정치 참여에 필요한 최소한의 뉴스'를 목표로 두는 와이보트는, 여러분의 인생에서 정치
            뉴스를 읽는데에 필요한 노력을 최소화하고자 합니다.
          </p>
          <p>
            이를 위해 첫 번째, '최소한의 정치 뉴스'를 결정하는 독자적인 기준을 마련하고 뉴스를
            선정합니다. 모든 기준은 '국민의 투표를 통해 바꿀 수 있는 내용인가'를 대원칙으로 삼고
            있습니다.
          </p>
          <p>
            두 번째, 사용자들이 같은 양의 정보 읽는 시간을 최소화하기 위해 기사라는 형식을 버리고
            새로운 전달 방식을 활용합니다. 와이보트의 뉴스 전달 방식은 기사에 비해 신속성이
            떨어지지만, 결국 뉴스를 이해하는 데에 드는 노력을 획기적으로 최소화합니다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3>2. 중립성/신뢰도 회복</h3>
          <ImageWrapper>
            <Image src={Pic02} alt="" />
          </ImageWrapper>
          <p>
            정치권과 언론에 대한 신뢰도의 감소 추세는 민주사회의 존립을 해치는 치명적인 요소입니다.
            와이보트는 언론의 중립성을 회복하고 정치권과 정치 뉴스에 대한 신뢰도를 회복시키고자
            합니다.
          </p>
          <p>
            이를 위한 와이보트의 결론은, 뉴스 가공 과정에서 사람의 개입을 최소화하는 것입니다.
            인터넷이 널리 보급되어 사용되기 이전까지, 사람이 직접 주요 뉴스를 선정하고 가공하는 것이
            당연했습니다. 하지만 인터넷으로 디지털 정보가 유통되고 인공지능 기술이 발전된 지금,
            뉴스의 생산 과정에 사람의 개입을 줄이는 것이 가능해졌습니다. 와이보트는 뉴스 선정
            기준부터 작성까지, 사람의 개입을 최소화하고 '정보 전달'이라는 뉴스의 본질에 가까워지도록
            하겠습니다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3>3. 능동적 뉴스 소비</h3>
          <ImageWrapper>
            <Image src={Pic03} alt="" />
          </ImageWrapper>
          <p>
            정기회의 회기는 100일을, 임시회의 회기는 30일을 초과할 수 없다. 중앙선거관리위원회는
            법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며,
            법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다. 의무교육은
            무상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게
            부담시킬 수 없다.
          </p>
        </EachValue>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-bottom: 60px;
`;

const Header = styled.div`
  display: block;
  align-items: center;
  font-size: 0.8em;
  padding: 30px 40px 0 40px;
  h2 {
    margin: 0 0 0 0;
  }
  hr {
    margin: 20px 0 0 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  padding: 40px 30px;
  justify-content: center;
`;

const EachValue = styled.div`
  width: calc(100% / 3);
  padding: 0 20px;
  h3 {
    font-size: 1.3em;
    line-height: 1.5em;
    margin: 0;
  }
  p {
    margin: 1em 0 0 0;
    font-family: summary-font;
    font-size: 15px;
    line-height: 1.8em;
  }
`;

const ImageWrapper = styled.div`
  img {
    margin: 10px 0;
    display: block;
    width: 100%;
    height: auto;
  }
`;

const VerticalLine = styled.div`
  border-right: solid 1px rgba(144, 144, 144, 0.5);
  margin: 90px 0;
`;
