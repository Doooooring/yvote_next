import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import logo_s from '@images/logo_image.png';
import logo from '@images/김민재 로고.png';

interface NavBoxProps {
  link: string;
  comment: string;
  state: boolean;
  responsiveComment: string;
}

function NavBox({ link, comment, responsiveComment, state }: NavBoxProps) {
  const [displayComment, setDisplayComment] = useState(comment);

  useEffect(() => {
    const updateCommentBasedOnWidth = () => {
      const screenWidth = window.innerWidth;
      if (screenWidth < 480) {
        setDisplayComment(responsiveComment);
      } else {
        setDisplayComment(comment);
      }
    };

    // Update comment on mount and when resizing the window
    updateCommentBasedOnWidth();
    window.addEventListener('resize', updateCommentBasedOnWidth);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener('resize', updateCommentBasedOnWidth);
  }, [comment, responsiveComment]);

  return (
    <HomeLink href={`${link}`} state={state}>
      {displayComment}
    </HomeLink>
  );
}

export default function Header() {
  const navigation = useRouter();
  const [curTab, setCurTab] = useState<string>('home');

  useEffect(() => {
    if (navigation.pathname === '/error') {
      console.log("it's error");
      return;
    }
    if (navigation.pathname.includes('news')) {
      setCurTab('news');
    } else if (navigation.pathname.includes('keywords')) {
      setCurTab('keywords');
    } else if (navigation.pathname.includes('analyze')) {
      setCurTab('analyze');
    } else if (navigation.pathname.includes('about')) {
      setCurTab('about');
    } else {
      setCurTab('home');
    }
  }, [navigation]);

  return (
    <Wrapper>
      <HeaderBody>
        <LogoImgBox>
          <HomeLink href="/" state={curTab === 'home'}>
            <Image src={logo} alt="hmm" height="27" className="image-l" />
            <Image src={logo_s} alt="hmm" height="50" className="image-s" />
          </HomeLink>
        </LogoImgBox>
        <NavigationBox>
          <NavBox
            link={'/news'}
            comment="뉴스 모아보기"
            state={curTab === 'news'}
            responsiveComment="뉴스"
          />

          <NavBox
            link={'/keywords'}
            comment="키워드 모아보기"
            state={curTab === 'keywords'}
            responsiveComment="키워드"
          />

          <NavBox
            link={'/analyze'}
            comment="정치 성향 테스트"
            state={curTab === 'analyze'}
            responsiveComment="가치관"
          />

          <NavBox
            link={'/about'}
            comment="ABOUT"
            state={curTab === 'about'}
            responsiveComment="ABOUT"
          />
        </NavigationBox>
      </HeaderBody>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 80px;
  box-shadow: 0px 0px 30px -25px;
  position: sticky;
  top: 0;
  z-index: 9999;
  background-color: white;
  border-bottom: 2px solid white;
  @media screen and (max-width: 300px) {
    justify-content: center;
  }
`;

const HeaderBody = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  min-width: 800px;
  height: 100%;
  border: 0;
  @media screen and (max-width: 768px) {
    width: 90%;
    min-width: 0px;
  }
  @media screen and (max-width: 300px) {
    justify-content: center;
    width: 100%;
  }
`;

const LogoImgBox = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  margin-left: 2%;
  height: 100%;
  border: 0;
  @media screen and (max-width: 768px) {
    margin: 0;
    justify-content: center;
  }
  @media screen and (max-width: 300px) {
    display: none;
    flex: 0;
  }
`;

interface homeLinkProps {
  state: boolean;
}

const HomeLink = styled(Link)<homeLinkProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  white-space: nowrap;
  color: ${({ state }) => (state ? 'rgb(61, 152, 247)' : 'grey')};
  text-decoration: none;
  font: inherit;
  font-size: 1rem;
  border-bottom: ${({ state }) => (state ? '3px solid rgb(61, 152, 247)' : '3px solid white')};
  height: 100%;
  .image-l {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .image-s {
    display: none;
    @media screen and (max-width: 768px) {
      display: block;
    }
  }
  @media screen and (max-width: 768px) {
    padding: 0 5px;
    font-size: 13px;
  }
  @media screen and (max-width: 300px) {
    justify-content: center;
  }
`;

const NavigationBox = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3%;
  flex: 4; // Make the navigation box also flexible
  margin: 0 10%;
  height: 100%;
  border: 0;
  @media screen and (max-width: 768px) {
    margin-left: 5%;
    margin-right: 5%;
    gap: 0;
    justify-content: space-between;
  }
  @media screen and (max-width: 480px) {
    margin-left: 10%;
    margin-right: 10%;
  }
  @media screen and (max-width: 300px) {
    justify-content: space-between;
    margin: 0;
    max-width: 80%;
  }
`;
