import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  faCheckToSlot,
  faComments,
  faEnvelope,
  faEquals,
  faFaceFrownOpen,
  faInfinity,
  faScroll,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import styled from 'styled-components';

import KeywordPage from '@images/keyword.png';
import NewsPage from '@images/news.png';

import ImageFallback from '@components/common/imageFallback';
import Pic01 from '@images/pic01.jpeg';
import Pic02 from '@images/pic02.jpeg';
import Pic03 from '@images/pic03.jpeg';

export default function Home() {
  return (
    <Wrapper className="is-preload">
      <section id="header">
        <div className="container">
          <div className="inner">
            <h1>뉴스의 새로운 기준, 와이보트</h1>
            <p>
              와이보트는 효율성과 실용성을 추구하는 현대인들을 위해
              <br />
              최소한의 뉴스를 최대한 깔끔하게 제공하는 서비스입니다.
            </p>
            <ul className="actions special">
              <li>
                <a href="#one" className="button scrolly">
                  더 알아보기
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section id="one" className="main style1">
        <div className="container">
          <header className="major">
            <h2>
              와이보트의 핵심 가치
              <br />
            </h2>
          </header>
          <div className="row gtr-150">
            <div className="col-6 col-12-medium">
              <h3>1. 뉴스의 최소화</h3>
              <p>
                최소한의 뉴스만을 선별하는 것은 와이보트의 가장 기본적인 원칙입니다. 정치 분야의
                뉴스는 개인의 즐거움을 위해서 보는 소비의 대상이 아니라, 민주 시민으로서 최소한의
                역할을 다하기 위해 요구되는 의무에 가깝습니다. 따라서 와이보트는 개인의 정치적 의사
                결정 과정에 유의미한 영향을 주는지에 따라, 최소한의 뉴스만을 선별하고 제공합니다.
                <br />
                <br />
                와이보트는 최소한의 필요한 뉴스를 전달하고 있다는 부분에 대한 독자의 신뢰를 소중하게
                생각합니다. 뉴스 소재가 없다고 해서 억지로 만들어내기보다는, 뉴스를 전달하지 않는
                것을 선택합니다. 모두에게 일상을 방해받지 않고 뉴스를 따라갈 수 있는 최선의 방법을
                위해 끊임 없이 고민하고 노력하겠습니다.
              </p>
            </div>
            <div className="col-6 col-12-medium imp-medium">
              <span className="image fit">
                <Image src={Pic01} alt="" style={{ height: 'auto' }} />
              </span>
            </div>
            <div className="col-6 col-12-medium">
              <span className="image fit">
                <Image src={Pic02} alt="" style={{ height: 'auto' }} />
              </span>
            </div>
            <div className="col-6 col-12-medium">
              <h3>2. 기준의 객관화</h3>
              <p>
                와이보트는 반드시 중립을 지킬 것이라고는 약속하지 않습니다. 사안에 따라, 객관적인
                기준에 따라 뉴스를 선정하고 서술하는 것이 특정 진영에게 유리한 경우가 있기
                때문입니다. 중립성보다는 객관성을 더 중요시하는 와이보트는 이에 대한 비판을
                감수합니다.
                <br />
                <br />
                그동안 독자들이 읽고 화제가 될 뉴스를 고르는 것은 언론의 역할이자 권한이었습니다.
                하지만 그 기준에는 언론사의 주관적인 성향이나 독자들의 관심을 끌 수 있는 자극성이
                포함되어 있었습니다. 이와 달리 와이보트는, 객관적인 기준으로 선별한 중요하고도
                실용적인 뉴스만을 전달합니다.
              </p>
            </div>
            <div className="col-6 col-12-medium">
              <h3>3. 정보와 의견의 구분</h3>
              <p>
                와이보트는 논리적이고 객관적인 이성의 영역과, 가치관의 영역을 구분하여 전달니다.
                논리와 분석은 원인과 결과에 대한 가장 정확한 예측을 의미합니다. 그리고 원인과 결과의
                조합 중, 개인이 어느 것을 선호하는지는 순수하게 개인의 취향과 가치관의 영역입니다.
                <br />
                <br />
                최근 개인 미디어와 대안 언론이 떠오르면서, 전달자나 다른 사람들의 의견이 뉴스에서
                차지하는 비중이 높아지고 있습니다. 이러한 방식에는 뉴스가 쉽고 재밌어진다는 긍정적인
                효과도 있지만, 사안에 대한 독자의 판단에 영향을 준다는 단점도 있습니다. 와이보트는
                자신의 생각을 차분히 정리하고 싶은 독자들을 위해, 자체적인 의견 뿐만 아니라 다른
                사람들의 의견까지 체계적으로 정리하여 전달합니다.
              </p>
            </div>
            <div className="col-6 col-12-medium">
              <span className="image fit">
                <Image src={Pic03} alt="" style={{ height: 'auto' }} />
              </span>
            </div>
          </div>
        </div>
      </section>
      <section id="two" className="main style2 special">
        <div className="container">
          <header className="major">
            <h2>와이보트의 기능을 만나보세요</h2>
          </header>
          <p>새로운 뉴스 구독 방식을 지금 바로 확인하세요</p>
          <div className="row gtr-150">
            <div className="col-4 col-12-medium">
              <span className="image fit">
                <Image
                  src={NewsPage}
                  alt=""
                  style={{
                    height: 'auto',
                  }}
                />
              </span>
              <h3>뉴스 모아보기</h3>
              <p>
                정치 참여에 필요한 최소한의 뉴스를
                <br />
                가장 정돈된 형식으로 만나보세요.
              </p>
              <ul className="actions special">
                <li>
                  <a href="news" className="button">
                    뉴스 모아보기
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-4 col-12-medium">
              <span className="image fit">
                <Image
                  src={KeywordPage}
                  alt=""
                  style={{
                    height: 'auto',
                  }}
                />
              </span>
              <h3>키워드 모아보기</h3>
              <p>
                자주 쓰이는 용어들을 이해하고
                <br />
                손쉽게 뉴스를 정복하세요.
              </p>
              <ul className="actions special">
                <li>
                  <a href="keywords" className="button">
                    키워드 모아보기
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-4 col-12-medium">
              <span className="image fit">
                <ImageFallback src={'/assets/img/eder.jpg'} width={307} height={216} />
              </span>
              <h3>정치성향 테스트</h3>
              <p>
                자신의 정치성향을 확인하고
                <br />
                타인의 관점을 이해해보세요.
              </p>
              <ul className="actions special">
                <li>
                  <a href="#" className="button">
                    내 정치성향 알아보기
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="three" className="main style1">
        <div className="container">
          <div className="row gtr-150">
            <div className="col-6 col-12-medium">
              <header className="major">
                <h2>
                  더 많은 뉴스를 원하신다면?
                  <br />
                </h2>
              </header>
              <p>
                더 상세한 정보와 다양한 분석이 담긴
                <br />
                와이보트의 뉴스레터를 구독하세요
              </p>
            </div>
            <div className="col-6 col-12-medium imp-medium">
              <h4>무료 뉴스레터 신청하기</h4>
              <form method="post" action="#">
                <div className="row gtr-uniform gtr-50">
                  <div className="col-6 col-12-xsmall">
                    <input
                      type="text"
                      name="demo-name"
                      id="demo-name"
                      value=""
                      placeholder="이름"
                    />
                  </div>
                  <div className="col-6 col-12-xsmall">
                    <input
                      type="email"
                      name="demo-email"
                      id="demo-email"
                      value=""
                      placeholder="이메일"
                    />
                  </div>
                  <div className="col-12 w-100 age-select-wrapper">
                    <select name="demo-category" id="demo-category">
                      <option value="">- 연령 -</option>
                      <option value="1">청소년</option>
                      <option value="1">대학생</option>
                      <option value="1">20대</option>
                      <option value="1">30대</option>
                      <option value="1">40대</option>
                      <option value="1">그 이상</option>
                    </select>
                  </div>
                </div>
              </form>
              <ul className="actions special apply-button-wrapper">
                <li>
                  <a href="#" className="button wide primary">
                    신청하기
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section id="four" className="main style2">
        <div className="container">
          <div className="row gtr-150">
            <div className="col-6 col-12-medium">
              <ul className="major-icons">
                <li>
                  <span className="icon solid style1 major fa-water">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faScroll} className="icon1" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style2 major fa-bolt">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faEquals} className="icon2" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style3 major fa-camera-retro">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faFaceFrownOpen} className="icon3" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style4 major fa-cog">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faInfinity} className="icon4" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style5 major fa-desktop">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faComments} className="icon5" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style6 major fa-calendar">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faCheckToSlot} className="icon6" />
                    </FaWrapper>
                  </span>
                </li>
                <p>
                  <br />- 출처 : 2022 로이터 뉴스 리포트 -
                </p>
              </ul>
            </div>
            <div className="col-6 col-12-medium">
              <header className="major">
                <h2>뉴스 기피 현상이 발생하는 이유</h2>
              </header>
              <h3>뉴스의 중복성</h3>
              <p>
                뉴스의 양이 많더라도 모두 제각기 중요하고 다른 내용이라면 어쩔 수 없겠지만, 실상을
                들여다보면 정치 뉴스는 서로 중복되는 경우가 허다합니다. 어떤 사안에 대한 진전이
                조금이라도 생기면 아예 새로운 뉴스 기사가 생성되며, 심지어는 아무런 변화가 발생하지
                않더라도 특정 정치인의 발언만으로도 뉴스가 생산되기도 합니다. 이는 독자가 특정
                주제에 반복적으로 노출되어 질리게 만드는 대표적인 원인입니다.
              </p>
              <p>
                뉴스의 중복성과 양을 줄이기 위한 가장 기본적인 방법으로, 와이보트는 기사가 아닌
                사안별로 뉴스를 정리합니다. 이는 동일한 주제에 대한 사소한 업데이트를 새로운 기사가
                아닌, 기존 뉴스의 수정을 통해 전달할 수 있도록 함으로써 기존에 비해 효율적이고
                편안한 뉴스 구독 경험을 제공한다는 장점이 있습니다. 또한 뉴스의 진행 상황을
                일목요연하게 파악할 수 있다는 점에서도 가치가 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="five" className="main style1">
        <div className="container">
          <header>
            <h2>Contact</h2>
          </header>
          <section>
            <h4>모집</h4>
            <p>우리가 구하는 사람들의 종류들을 여기다가 쓰면 좋을까</p>
            {/* <h4>연락처</h4> */}
            <p>
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="icon solid alt fa-envelope label"></span> 8gundogan@yonsei.ac.kr{' '}
              <br />
              <FontAwesomeIcon icon={faInstagram} />
              <span className="icon brands alt fa-instagram label"></span> @liberalminds_kr
              <br />
            </p>
          </section>
        </div>
      </section>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  overflow: scroll;
  padding-bottom: 100px;

  .age-select-wrapper {
    padding-right: 2.75em;
  }

  .apply-button-wrapper {
  }

  #demo-category {
    width: 100%;
  }
`;

const FaWrapper = styled.div`
  transform: rotate(-45deg);
  font-size: 4em;
  @media screen and (max-width: 736px) {
    font-size: 42px;
  }
  & > svg {
    display: inline-block;
    line-height: inherit;
  }

  & {
    svg.icon1 {
      color: #75d6e4;
    }
    svg.icon2 {
      color: #6acaed;
    }
    svg.icon3 {
      color: #4883ec;
    }
    svg.icon4 {
      color: #7078e3;
    }
    svg.icon5 {
      color: #9971e2;
    }
    svg.icon6 {
      color: #b76ff7;
    }
  }
`;
