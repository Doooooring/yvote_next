import HeadMeta from '@components/common/HeadMeta';
import HomeModal from '@components/home/homemodal';
import valuesImage from '@images/eder.png';
import keywordImage from '@images/keyword.png';
import logoImage from '@images/logo_image.png';
import newsImage from '@images/news.png';
import backgroundImage from '@images/voting.png';
import { StaticImageData } from 'next/image';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

interface Item {
  name: string;
  title: string;
  description: string;
  imageUrl: StaticImageData;
  linkUrl: string;
  linkText: string;
}

export default function Home() {
  const [loaded, setLoaded] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalContent, setModalContent] = useState<Item | null>(null);

  const items: Item[] = [
    {
      name: '뉴스',
      title: '뉴스 모아보기',
      description:
        '와이보트는 정치 참여, 즉 투표에 고려될 가치가 있다고 판단되는 뉴스만을 선정하여 주제별로 제공합니다. 다시 말해, 국민이 선출한 피선거권자들이 세상을 바꾸는 방향에 관련된 뉴스를 제공합니다.\n국회의원들의 의견이 불일치하는 법률안, 대통령이 직접 추진하는 행정부의 기조, 입법부와 행정부의 결과가 간접적으로 반영되는 헌법재판소의 결정들이 이에 해당합니다. 정치인들의 사생활이나 비리, 말실수 등에 관한 뉴스가 제공되지 않는 것은 이러한 기준의 장점이자 단점입니다.\n정치 참여에 필요한 최소한의 뉴스를 만나보세요.',
      imageUrl: newsImage,
      linkUrl: '/news',
      linkText: '뉴스 모아보기 >',
    },
    {
      name: '키워드',
      title: '키워드 모아보기',
      description:
        "정치와 경제에 대한 이해를 보편적으로 배우지 않은 결과, 우리는 뉴스를 이해하는데에 필요한 배경 지식이 결여되어 있습니다. 하지만 뉴스를 읽을 때마다 단편적인 개념들을 공부하며 읽는 것은 너무나도 소모적입니다.\n와이보트는 뉴스를 이해하기 위해 필요한 개념들을 4가지 항목으로 나누어 제공합니다. 분류 기준에는 뉴스에 자주 등장하는 '단체', 정치 이념과 우리나라의 정치 제도에 관한 '정치', 경제학의 기초적인 내용을 소개한 '경제', 가치관의 차이로 인해 끊임없이 주제가 되는 '사회'가 있습니다.\n뉴스의 이해를 돕는 주요 용어들을 정복하세요.",
      imageUrl: keywordImage,
      linkUrl: '/keywords',
      linkText: '키워드 모아보기 >',
    },
    {
      name: '가치관',
      title: '가치관 테스트',
      description:
        '우리는 중립적인 뉴스에 대해 환상을 갖지만, 완벽한 중립이라는 것은 존재하지 않습니다. 정보의 가공만으로도 특정 집단에게 유리하게 글을 서술하는 것은 충분히 가능하며, 이 때문에 단순히 정보를 제공하거나 제공하지 않는 것만으로도 편향성 논란이 제기되기도 합니다.\n와이보트는 편향성에 의한 불신을 최대한 해결하기 위해 뉴스 가공을 최소화합니다. 하지만 뉴스에 대한 불신을 해소하기 위해서는 독자의 노력도 필요합니다. 정치적 대화에 대한 막연한 두려움은 자신의 관점이나 의견이 확실하지 않아, 언제든 휘둘릴 수 있다고 느끼기 때문입니다.\n나의 가치관을 파악하고 타인의 관점까지 이해해보세요.',
      imageUrl: valuesImage,
      linkUrl: '/analyze',
      linkText: '가치관 알아보기 >',
    },
    {
      name: 'Contact',
      title: 'Contact',
      description: '',
      imageUrl: valuesImage,
      linkUrl: '',
      linkText: '',
    },
  ];

  const handleItemClick = (item: Item) => {
    setModalContent(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Wrapper>
      <HeadMeta />
      <Content show={showModal}>
        <Rectangle loaded={loaded}>
          <FlexContainer>
            <Image className="pear" loaded={loaded} src={logoImage.src} alt="logo" />
            <TextBox loaded={loaded}>
              <TextHeading>Why Vote?</TextHeading>
              <TextParagraph>실용적인 뉴스 서비스를 지향합니다</TextParagraph>
            </TextBox>
          </FlexContainer>
          <MobileTextParagraph loaded={loaded}>
            실용적인 뉴스 서비스를 지향합니다
          </MobileTextParagraph>
        </Rectangle>
        <MidlineWrapper>
          <Midline />
        </MidlineWrapper>
        <ListContainer>
          <List>
            {items.map((item) => (
              <ListItem onClick={() => handleItemClick(item)}>
                <p>{item.name}</p>
              </ListItem>
            ))}
          </List>
        </ListContainer>
      </Content>
      <HomeModal show={showModal} onClose={closeModal} content={modalContent} />
      <BackgroundImage loaded={loaded} src={backgroundImage.src} />
    </Wrapper>
  );
}

const Wrapper = styled.div`
  box-sizing: border-box;
  font-family: 'Source Sans Pro', sans-serif;
  position: relative;
  height: calc(100vh - 65px);
  background-color: black; /* Set initial background color to black */
  padding: 3rem 2rem;
  overflow: hidden;
  &::-webkit-scrollbar {
    display: none;
  }
  scrollbar-width: none;
  @media (max-height: 480px) {
    overflow-y: auto;
    height: calc(100vh - 50px);
  }
`;

const Content = styled.div<{ show: boolean }>`
  position: relative;
  width: 417px;
  height: 254px;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 1; /* Ensure the content is above the background image */
  transition: opacity 0.5s; // Transition opacity over 0.5 seconds
  @media (max-width: 480px) {
    width: 280px;
    height: auto;
  }
`;

const Rectangle = styled.div<{ loaded: boolean }>`
  display: inline-flex; /* Adjust display property */
  align-items: center; /* Center content vertically */
  background-color: transparent;
  border-top: 1.5px solid white;
  border-bottom: 1.5px solid white;
  position: relative;
  @media (max-width: 480px) {
    flex-direction: column;
    align-items: flex-start;
  }
`;

const FlexContainer = styled.div`
  display: flex;
  align-items: center;
`;

const Image = styled.img<{ loaded: boolean }>`
  width: 4.5rem;
  height: auto;
  max-height: 40rem;
  margin-left: 16px;
  margin-right: 16px;
  opacity: ${({ loaded }) => (loaded ? '1' : '0')};
  transition: height 1s ease, opacity 1s ease;
  @media (max-width: 480px) {
    opacity: ${({ loaded }) => (loaded ? '1' : '0')};
    transition: opacity 1.5s ease;
  }
`;

const TextBox = styled.div<{ loaded: boolean }>`
  flex-grow: 1;
  height: auto;
  max-height: 40rem;
  padding: ${({ loaded }) => (loaded ? '40px 16px' : '5px 0 0 0')};
  opacity: ${({ loaded }) => (loaded ? '1' : '0')};
  transition: padding 1s ease, opacity 1s ease;
  @media (max-width: 480px) {
    padding: ${({ loaded }) => (loaded ? '15px 0 0 0' : '0 0 0 0')};
    opacity: ${({ loaded }) => (loaded ? '1' : '0')};
  }
`;

const TextHeading = styled.h1`
  color: #ffffff;
  font-weight: 600;
  margin: 0 0 1rem 0;
  text-transform: uppercase;
  font-size: 2rem;
  line-height: 1.3;
  letter-spacing: 0.5rem;
  @media (max-width: 480px) {
    margin: 0 0 0.5rem 0;
  }
`;

const TextParagraph = styled.p`
  color: white;
  margin: 0;
  text-transform: uppercase;
  letter-spacing: 0.15rem;
  font-size: 0.9rem;
  line-height: 2;

  @media (max-width: 480px) {
    display: none;
  }
`;

const MobileTextParagraph = styled.p<{ loaded: boolean }>`
  display: none;

  @media (max-width: 480px) {
    display: block;
    width: 100%;
    font: inherit;
    color: white;
    letter-spacing: 0.15rem;
    font-size: 0.8rem;
    padding: ${({ loaded }) => (loaded ? '0 0 10px 0' : '0 0 0 0')};
    opacity: ${({ loaded }) => (loaded ? '1' : '0')};
    transition: padding 1s ease, opacity 1s ease;
  }
`;

const MidlineWrapper = styled.div`
  height: 30px;
  background-color: transparent;
  display: flex;
  justify-content: center;
`;

const Midline = styled.div`
  height: 30px;
  width: 1px;
  background-color: white;
`;

const ListContainer = styled.div`
  border: 1px solid white;
  border-radius: 4px; /* Rounded border */
  overflow: hidden; /* Ensure the border radius is applied properly */
`;

const List = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;

  @media (max-width: 480px) {
    flex-direction: column;
    align-items: center;
  }
`;

const ListItem = styled.li`
  flex: 1;
  text-align: center;
  position: relative;
  color: white;
  display: flex;
  justify-content: center;
  cursor: pointer;

  transition: background-color 0.3s ease;
  &:hover {
    background-color: #c1c1c1;
  }

  &:not(:last-child)::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 0.7px;
    height: 100%;
    background-color: white;
  }

  > p {
    display: block;
    line-height: 2.5rem;
    text-transform: uppercase;
    letter-spacing: 0.15rem;
    font-size: 0.8rem;
    border-bottom: 0;
  }

  &:last-child > a {
    font-size: 0.7rem;
  }

  @media (max-width: 480px) {
    width: 100%;
    text-align: center;
    border-bottom: 1px solid white;
    border-left: none;

    &:not(:last-child)::after {
      display: none;
    }
    > p {
      width: 80%;
      margin: auto;
      font-size: 0.8rem;
    }
    &:last-child {
      border-bottom: none;
      > p {
        font-size: 0.7rem;
      }
    }
  }
`;

const BackgroundImage = styled.div<{ loaded: boolean; src: string }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: calc(100% + 6rem);
  background-image: ${({ src }) => `url('${src}')`};
  background-size: cover;
  background-position: center;
  opacity: ${({ loaded }) => (loaded ? '0.7' : '0')}; /* Initially transparent, then fades in */
  transition: opacity 1s ease-in-out; /* Slow transition duration */
  z-index: 0; /* Ensure the background image is below the content */
`;
