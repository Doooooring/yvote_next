import styled from 'styled-components';
import Image from 'next/image';
import Pic01 from '@images/pic01_1.jpeg';
import Pic02 from '@images/pic02_2.jpeg';
import Pic03 from '@images/pic03_3.jpeg';

export function Values() {
  return (
    <Wrapper>
      <Header>
        <h2>제공 가치와 목표</h2>
        <hr />
      </Header>
      <Body>
        <EachValue>
          <h3 className="bullet-point">뉴스 최소화</h3>
          <ImageWrapper>
            <Image
              src={Pic01}
              alt=""
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
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
          <h3 className="bullet-point">중립성/신뢰도 회복</h3>
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
            기준부터 작성까지, 사람의 개입을 최소화하고 '정보 전달'이라는 뉴스의 본질을 지키기 위해
            노력합니다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3 className="bullet-point">능동적 뉴스 소비</h3>
          <ImageWrapper>
            <Image src={Pic03} alt="" />
          </ImageWrapper>
          <p>
            같은 정보와 사건도 바라보는 사람에 따라 해석이 달라질 수 있습니다. 이를 남에게 맡기는
            것은 한 사람으로서 투표할 이유를 잃어버리는 것일 뿐만 아니라, 해석을 대신 해주는 그
            사람에게 나의 투표권을 넘기는 것과 같습니다.
          </p>
          <p>
            와이보트는 각자의 의견 형성될 시공간적 여유를 보장하기 위해, 뉴스의 이해를 돕는 서사와
            설명을 최소화합니다. 이는 뉴스 소비의 난이도를 높이기도 하지만, 한편으로는 다른 사람이
            대신 해석해주는 뉴스에 의존하지 않고 싶은 이들을 위한 필수불가결 대가입니다. 나아가
            앞으로는 타 서비스나 인공지능 기술을 활용하여, 원문 자료에 기반한 능동적 뉴스 소비를
            실현할 방법을 고민하고 있습니다.
          </p>
        </EachValue>
      </Body>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  background-color: white;
  margin-bottom: 60px;
  border: 0;
  border-radius: 10px;
  @media (max-width: 1080px) {
    margin-bottom: 30px;
  }
`;

const Header = styled.div`
  display: block;
  align-items: center;
  font-size: 0.8em;
  padding: 40px 40px 0 40px;
  h2 {
    font: inherit;
    font-size: 1.6rem;
    font-weight: 550;
    border-bottom: 2px solid rgb(64, 64, 64);
    padding-bottom: 5px;
    display: inline-block;
  }
  hr {
    margin: 20px 0 0 0;
  }
`;

const Body = styled.div`
  display: flex;
  flex-direction: row;
  padding: 0 20px 3rem;
  justify-content: center;
  @media (max-width: 1080px) {
    display: block;
    padding: 0 40px 1rem;
  }
`;

const EachValue = styled.div`
  width: calc(100% / 3);
  padding: 0 20px;
  h3 {
    font: inherit;
    font-size: 1.3rem;
    line-height: 1.5em;
    margin: 0.5rem 0 0 0;
    font-weight: 400;
    @media (max-width: 480px) {
      font-size: 1.1rem;
    }
  }
  p {
    margin: 1rem 0 0 0;
    font-family: summary-font;
    font-size: 0.9rem;
    line-height: 1.8em;
  }
  @media (max-width: 1080px) {
    width: 100%;
    padding: 10px 0;
    margin-bottom: 30px;
    h3.bullet-point::before {
      content: '• ';
      font-size: 1.3rem;
    }
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
`;
