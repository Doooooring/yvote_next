import styled from 'styled-components';
import Image from 'next/image';
import Pic01 from '@images/pic01.jpeg';
import Pic02 from '@images/pic02.jpeg';
import Pic03 from '@images/pic03.jpeg';

export function Criteria() {
  return (
    <Wrapper>
      <Header>
        <h2>뉴스 선정 기준</h2>
        <hr />
      </Header>
      <Body>
        <EachOne>
          <Text>
            <h3>1. 법률을 정하는 입법부 소식</h3>
            <p>
              삼권분립 중 입법부의 역할을 수행하는 국회는 우리나라의 법률이 만들어지는 곳입니다.
              법률은 정부 정책의 범위나 법원의 판결에 사용될 수 있는 근거를 결정하기 때문에, 국회는
              우리 삶의 원칙을 만드는 가장 근원적인 기관입니다. 국회에는 총 300명의 국회의원이
              있으며, 4년에 한 번씩 '총선'이라고 불리는 국회의원 선거를 통해 선출됩니다.
            </p>
            <p>
              투표를 위한 최소한의 효율적인 뉴스를 제공하고자 하는 와이보트에서는, 국회에서 한 달에
              수백 개씩 다루어지는 법률안들을 전부 다루지 않습니다. 대신, 국민의 투표로 인해 결과가
              달라졌거나 바꿀 수 있다고 판단되는 법률안에 대한 소식만을 선별하여 전달합니다.
            </p>
          </Text>
          <ImageWrapper>
            <Image src={Pic01} alt="" />
          </ImageWrapper>
        </EachOne>
        <EachOne>
          <ImageWrapper>
            <Image src={Pic02} alt="" />
          </ImageWrapper>
          <Text>
            <h3>2. 정책을 집행하는 행정부 소식</h3>
            <p>
              행정부는 국가의 정책을 실질적으로 집행하는 집단으로, 대통령실부터 동네의 주민센터까지
              모두 행정부에 소속됩니다. 행정부의 업무는 대통령의 지시를 근거로 정해지지만, 모든
              분야에 대통령이 세부적으로 관여하는 것은 불가능합니다. 이러한 세부적인 업무는 장관들을
              필두로 각 부처에서 결정되기도 합니다.
            </p>
            <p>
              와이보트는 행정부의 모든 소식을 전달하지 않습니다. 행정부의 규모는 거대하지만, 국민이
              결정하는 것은 5년에 한 번 뽑는 대통령 뿐이기 때문입니다. 따라서 국정 기조가 드러나는
              대통령 주재 회의, 연설문 또는 외교 일정 등을 중심으로 뉴스를 선별하며, 국정 운영에
              대하여 정당 간의 의견 충돌이 심화될 경우 별도의 소식으로 정리하여 전달합니다.
            </p>
          </Text>
        </EachOne>
        <EachOne>
          <Text>
            <h3>3. 투표로 바꿀 수 없는 사법부</h3>
            <p>
              모든 것을 다수결로 결정하는 단순한 민주주의와 공화국의 가장 큰 차이점은, 사법부의
              존재입니다. 사법부는 국민의 투표로 선출되지 않습니다. 사법부의 역할은, 국회에서 정해진
              법률을 근거로 판결을 내리는 것입니다.
            </p>
            <p>
              사법부의 재판 결과를 알더라도 국민이 투표로 변화를 주도할 수 있는 부분은 없기 때문에,
              와이보트는 사법부에서 뉴스를 선별하지 않습니다. 다만, 사법부의 최상위 기관으로
              여겨지는 헌법재판소에서 입법부나 행정부의 정치적 결정을 평가하는 경우는, 법률이나
              정책에 대한 기존의 결정을 돌아보는 의미에서 뉴스로 선별합니다. 또한 헌법재판소의
              재판관들의 임명 과정에 입법부와 대통령이 개입하기 때문에, 사회/문화 전반에 영향을 주는
              헌법재판소의 결정들을 전달합니다.
            </p>
          </Text>
          <ImageWrapper>
            <Image src={Pic03} alt="" />
          </ImageWrapper>
        </EachOne>
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
    margin: 20px 0 30px 0;
  }
`;

const Body = styled.div`
  display: block;
  padding: 0 40px 20px 40px;
`;

const EachOne = styled.div`
  margin-bottom: 30px;
  display: inline-flex;
`;

const ImageWrapper = styled.div`
  width: 40%;
  margin: 15px 20px;
  img {
    width: 100%;
    height: auto;
  }
`;

const Text = styled.div`
  width: 60%;
  padding: 10px;
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
