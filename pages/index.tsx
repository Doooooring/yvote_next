import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import styled from 'styled-components';

import Test from '@images/eder.png';
import KeywordPage from '@images/keyword.png';
import NewsPage from '@images/news.png';

import Pic01 from '@images/pic01.jpeg';
import Pic02 from '@images/pic02.jpeg';
import Pic03 from '@images/pic03.jpeg';

export default function Home() {
  return (
    <Wrapper className="is-preload">
      <section id="two" className="main style2 special">
        <div className="container">
          <header className="major">
            <h2>뉴스의 새로운 기준, 와이보트</h2>
          </header>
          <div className="row gtr-150">
            <div className="col-4 col-12-medium column-center">
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
                가장 효율적인 형식으로 만나보세요
              </p>
              <ul className="actions special">
                <li>
                  <a href="news" className="button">
                    뉴스 모아보기
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-4 col-12-medium column-center">
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
                뉴스 이해에 도움이 되는
                <br />
                주요 용어들을 정복하세요
              </p>
              <ul className="actions special">
                <li>
                  <a href="keywords" className="button">
                    키워드 모아보기
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-4 col-12-medium column-center">
              <span className="image fit">
                <Image
                  src={Test}
                  alt=""
                  style={{
                    height: 'auto',
                  }}
                />
              </span>
              <h3>가치관 테스트</h3>
              <p>
                나의 정치적 가치관을 파악하고
                <br />
                타인의 관점까지 이해해보세요
              </p>
              <ul className="actions special">
                <li>
                  <a href="analyze" className="button">
                    테스트 하러 가기
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* <section id="one" className="main style1">
        <div className="container">
          <header className="major">
            <h2>
              와이보트의 뉴스 선정 기준
              <br />
            </h2>
          </header>
          <div className="row gtr-150">
            <div className="col-6 col-12-medium">
              <h3>1. 법률을 정하는 입법부 소식</h3>
              <p>
                삼권분립 중 입법부의 역할을 수행하는 국회는 우리나라의 법률이 만들어지는 곳입니다.
                법률은 정부 정책의 범위나 법원의 판결에 사용될 수 있는 근거를 결정하기 때문에,
                국회는 우리 삶의 원칙을 만드는 가장 근원적인 기관입니다. 국회에는 총 300명의
                국회의원이 있으며, 4년에 한 번씩 '총선'이라고 불리는 국회의원 선거를 통해
                선출됩니다.
                <br />
                <br />
                투표를 위한 최소한의 효율적인 뉴스를 제공하고자 하는 와이보트에서는, 국회에서 한
                달에 수백 개씩 다루어지는 법률안들을 전부 다루지 않습니다. 대신, 국민의 투표로 인해
                결과가 달라졌거나 바꿀 수 있다고 판단되는 법률안에 대한 소식만을 선별하여
                전달합니다.
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
              <h3>2. 정책을 집행하는 행정부 소식</h3>
              <p>
                행정부는 국가의 정책을 실질적으로 집행하는 집단으로, 대통령실부터 동네의
                주민센터까지 모두 행정부에 소속됩니다. 행정부의 업무는 대통령의 지시를 근거로
                정해지지만, 모든 분야에 대통령이 세부적으로 관여하는 것은 불가능합니다. 이러한
                세부적인 업무는 장관들을 필두로 각 부처에서 결정되기도 합니다.
                <br />
                <br />
                와이보트는 행정부의 모든 소식을 전달하지 않습니다. 행정부의 규모는 거대하지만,
                국민이 결정하는 것은 5년에 한 번 뽑는 대통령 뿐이기 때문입니다. 따라서 국정 기조가
                드러나는 대통령 주재 회의, 연설문 또는 외교 일정 등을 중심으로 뉴스를 선별하며, 국정
                운영에 대하여 정당 간의 의견 충돌이 심화될 경우 별도의 소식으로 정리하여 전달합니다.
              </p>
            </div>
            <div className="col-6 col-12-medium notimp-medium">
              <h3>3. 투표로 바꿀 수 없는 사법부</h3>
              <p>
                모든 것을 다수결로 결정하는 단순한 민주주의와 공화국의 가장 큰 차이점은, 사법부의
                존재입니다. 사법부는 국민의 투표로 선출되지 않습니다. 사법부의 역할은, 국회에서
                정해진 법률을 근거로 판결을 내리는 것입니다.
                <br />
                <br />
                사법부의 재판 결과를 알더라도 국민이 투표로 변화를 주도할 수 있는 부분은 없기
                때문에, 와이보트는 사법부에서 뉴스를 선별하지 않습니다. 다만, 사법부의 최상위
                기관으로 여겨지는 헌법재판소에서 입법부나 행정부의 정치적 결정을 평가하는 경우는,
                법률이나 정책에 대한 기존의 결정을 돌아보는 의미에서 뉴스로 선별합니다. 또한
                헌법재판소의 재판관들의 임명 과정에 입법부와 대통령이 개입하기 때문에, 사회/문화
                전반에 영향을 주는 헌법재판소의 결정들을 전달합니다.
              </p>
            </div>
            <div className="col-6 col-12-medium">
              <span className="image fit">
                <Image src={Pic03} alt="" style={{ height: 'auto' }} />
              </span>
            </div>
          </div>
        </div>
      </section> */}

      {/* <section id="four" className="main style2">
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
    </section> */}

      {/* <section id="five" className="main style2">
        <div className="container">
          <header>
            <h2>Contact</h2>
          </header>
          <section>
            <p>함께 새로운 언론을 만들어나갈 팀원을 모집합니다</p>
            <p>
              <FontAwesomeIcon icon={faEnvelope} />
              <span className="icon solid alt fa-envelope label"></span> 8gundogan@yonsei.ac.kr{' '}
              <br />
            </p>
          </section>
        </div>
      </section> */}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  height: 100vh;
  overflow: scroll;

  .column-center {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  #two {
    padding: 30px 0 50px 0;
  }
  #two p {
    margin-bottom: 20px;
  }
  #two h3 {
    margin-bottom: 15px;
  }
  #two ul {
    padding-bottom: 50px;
  }
`;
