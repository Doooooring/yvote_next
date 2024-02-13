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
            정기회의 회기는 100일을, 임시회의 회기는 30일을 초과할 수 없다. 중앙선거관리위원회는
            법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며,
            법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다. 의무교육은
            무상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게
            부담시킬 수 없다.
          </p>
        </EachValue>
        <VerticalLine />
        <EachValue>
          <h3>2. 중립성/신뢰도 회복</h3>
          <ImageWrapper>
            <Image src={Pic02} alt="" />
          </ImageWrapper>
          <p>
            정기회의 회기는 100일을, 임시회의 회기는 30일을 초과할 수 없다. 중앙선거관리위원회는
            법령의 범위안에서 선거관리·국민투표관리 또는 정당사무에 관한 규칙을 제정할 수 있으며,
            법률에 저촉되지 아니하는 범위안에서 내부규율에 관한 규칙을 제정할 수 있다. 의무교육은
            무상으로 한다. 선거에 관한 경비는 법률이 정하는 경우를 제외하고는 정당 또는 후보자에게
            부담시킬 수 없다.
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
