import { faInstagram } from '@fortawesome/free-brands-svg-icons';
import {
  faBolt,
  faCalendar,
  faCameraRetro,
  faCog,
  faDesktop,
  faEnvelope,
  faWater,
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Image from 'next/image';
import styled from 'styled-components';

import EderPage from '@images/eder.jpg';
import KeywordPage from '@images/keyword.png';
import NewsPage from '@images/news.png';

import Pic01 from '@images/pic01.jpg';

export default function Home() {
  return (
    <Wrapper className="is-preload">
      <section id="header">
        <div className="container">
          <div className="inner">
            <h1>뉴스의 새로운 기준, 와이보트</h1>
            <p>
              와이보트는 뉴스를 선별하는 새로운 기준과 전달 방식의 변화를 통해
              <br />
              현대인들의 뉴스 중독 및 기피로 인한 정치 참여 불균형을 해결하여
              <br />
              민주정치의 안정성을 목표로 하는 미래지향적 뉴스레터 서비스입니다.
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
              <div>
                <h3>1. 뉴스 최소화</h3>
                <p>
                  과거와 달리 뉴스는 구하기 어려운 정보가 아니라 따라가기 어려운 정보가 되어가고
                  있습니다. 하지만 우리가 정치와 경제에 대한 모든 뉴스를 읽어야 한다면, 일상 속의
                  즐거움을 추구할 시간이 현저히 줄어들 것입니다. 이에 와이보트는 필요한 뉴스가
                  아니라면 전달하지 않는 ‘뉴스 최소화’ 원칙을 고수합니다.
                </p>
                <h3>2. 정론직필</h3>
                <p>
                  최근 많은 뉴스 매체들이 생겨나면서 객관적이고 이론적인 원리에 기반하지 않은,
                  주관적인 견해가 담긴 뉴스를 전달하는 경우가 많습니다. 하지만 이렇게 견해를 담은
                  뉴스들은 독자의 감정적 피로를 유발합니다. 이에 와이보트는, 언제나 이론과 원칙에
                  근거한 ‘정론직필’의 원칙을 고수합니다.
                </p>
                <h3>3. 관점의 다양성</h3>
                <p>
                  매체가 한정되어 있던 과거에는 매체의 중립성이 아주 중요한 가치였습니다. 하지만
                  다양한 의견이 공존하고 전달될 수 있는 현대에는, 중립성이란 관점을 전달하지
                  않는다는 제약일 뿐입니다. 와이보트는, 뉴스에 대한 분석과 함께 개인의 관점과 성향에
                  따라 달라질 수 있는 의견의 차이를 제공합니다.
                </p>
              </div>
            </div>
            <div className="col-6 col-12-medium imp-medium">
              <span className="image fit">
                <Image src={Pic01} alt="" style={{ height: 'auto' }} />
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
              <p>정치 참여에 필요한 최소한의 유의미한 뉴스를 가장 편안한 형식으로 만나보세요.</p>
              <ul className="actions special">
                <li>
                  <a href="#" className="button">
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
              <p>뉴스에 자주 등장하지만 평소에 어려웠던 용어들을 이해하고 뉴스를 정복하세요.</p>
              <ul className="actions special">
                <li>
                  <a href="#" className="button">
                    키워드 모아보기
                  </a>
                </li>
              </ul>
            </div>
            <div className="col-4 col-12-medium">
              <span className="image fit">
                <Image
                  src={EderPage}
                  alt=""
                  style={{
                    height: 'auto',
                  }}
                />
              </span>
              <h3>정치성향 테스트</h3>
              <p>
                자신도 모르는 정치성향을 확인해보세요.
                <br />.
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
                  더 많은 정보를 원하시나요?
                  <br />
                </h2>
              </header>
              <p>
                더 상세한 정보들과 다양한 분석이 담긴
                <br />
                Y보트의 프리미엄 뉴스레터를 구독하세요
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
                      <FontAwesomeIcon icon={faWater} className="icon1" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style2 major fa-bolt">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faBolt} className="icon2" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style3 major fa-camera-retro">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faCameraRetro} className="icon3" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style4 major fa-cog">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faCog} className="icon4" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style5 major fa-desktop">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faDesktop} className="icon5" />
                    </FaWrapper>
                  </span>
                </li>
                <li>
                  <span className="icon solid style6 major fa-calendar">
                    <FaWrapper>
                      <FontAwesomeIcon icon={faCalendar} className="icon6" />
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
              <h3>뉴스의 반복성</h3>
              <p>
                Eder's 109th-minute goal was brilliantly taken. He had impressed since replacing
                Renato Sanches in the second half but had few options when he received the ball out
                on the left, closely marked by Laurent Koscielny. Eder marauded infield and then,
                from 25 yards, cracked a powerful, accurate shot to Hugo Lloris' right. It was a
                bolt from the blue, and one that deserved to win any final.
              </p>
              <p>
                Back when everything seemed rosy and optimistic, the French had started at a
                ferocious tempo. A swarm of moths had curiously descended upon the stadium prior to
                the game, and the hosts set about Portugal in similar fashion. France came close to
                an early goal when Antoine Griezmann's looped header from a fine Dimitri Payet pass
                was denied by an acrobatic, arching tip-over from Rui Patricio.
              </p>
              <p>
                The Payet challenge on Ronaldo that ultimately ended his final within 25 minutes
                encapsulated the zeal with which France set about their task. Yet the pace of their
                pressing dropped after Ronaldo's departure: two Moussa Sissoko shots were the sum
                total of their attacking endeavours for the rest of the half. Portugal, however, saw
                things through until half-time in relative comfort.
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
