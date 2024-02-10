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
            삼권분립 중 입법부의 역할을 수행하는 국회는 우리나라의 법률이 만들어지는 곳입니다.
            법률은 정부 정책의 범위나 법원의 판결에 사용될 수 있는 근거를 결정하기 때문에, 국회는
            우리 삶의 원칙을 만드는 가장 근원적인 기관입니다. 국회에는 총 300명의 국회의원이 있으며,
            4년에 한 번씩 '총선'이라고 불리는 국회의원 선거를 통해 선출됩니다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3>2. 중립성/신뢰도 회복</h3>
          <ImageWrapper>
            <Image src={Pic02} alt="" />
          </ImageWrapper>
          <p>
            삼권분립 중 입법부의 역할을 수행하는 국회는 우리나라의 법률이 만들어지는 곳입니다.
            법률은 정부 정책의 범위나 법원의 판결에 사용될 수 있는 근거를 결정하기 때문에, 국회는
            우리 삶의 원칙을 만드는 가장 근원적인 기관입니다. 국회에는 총 300명의 국회의원이 있으며,
            4년에 한 번씩 '총선'이라고 불리는 국회의원 선거를 통해 선출됩니다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3>3. 능동적 뉴스 소비</h3>
          <ImageWrapper>
            <Image src={Pic03} alt="" />
          </ImageWrapper>
          <p>
            삼권분립 중 입법부의 역할을 수행하는 국회는 우리나라의 법률이 만들어지는 곳입니다.
            법률은 정부 정책의 범위나 법원의 판결에 사용될 수 있는 근거를 결정하기 때문에, 국회는
            우리 삶의 원칙을 만드는 가장 근원적인 기관입니다. 국회에는 총 300명의 국회의원이 있으며,
            4년에 한 번씩 '총선'이라고 불리는 국회의원 선거를 통해 선출됩니다.
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
