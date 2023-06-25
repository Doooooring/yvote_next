import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import logo from '@images/ico_logo.png';

interface NavBoxProps {
  link: string;
  comment: string;
  state: boolean;
}

function NavBox({ link, comment, state }: NavBoxProps) {
  return (
    <HomeLink href={`${link}`} state={state}>
      {comment}
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
    } else if (navigation.pathname.includes('contatct')) {
      setCurTab('contact');
    } else {
      setCurTab('home');
    }
  }, [navigation]);

  return (
    <Wrapper>
      <HeaderBody>
        <LogoImgBox>
          <HomeLink href="/" state={curTab === 'home'}>
            <Image src={logo} alt="hmm" height="40" />
          </HomeLink>
        </LogoImgBox>
        <NavigationBox>
          <NavBox link={'/news'} comment="뉴스 모아보기" state={curTab === 'news'} />
          <Blank />
          <NavBox link={'/keywords'} comment="키워드 모아보기" state={curTab === 'keywords'} />
          <Blank />
          <NavBox link={'/analyze'} comment="정치 성향 테스트" state={curTab === 'analyze'} />
          <Blank />
          <NavBox link={'/contact'} comment="CONTACT" state={curTab === 'contact'} />
        </NavigationBox>
      </HeaderBody>
    </Wrapper>
  );
}

const Wrapper = styled.header`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  min-width: 800px;
  height: 80px;
  font-size: 15px;
  text-align: left;
  color: black;
  box-shadow: 0px 0px 30px -25px;
  position: sticky;
  top: 0;
  z-index: 9999;
  border-width: 0px;
  border-bottom-width: 4px;
`;

const HeaderBody = styled.div`
  width: 1000px;
  height: 100%;
  position: relative;
  margin-right: auto;
  margin-left: auto;
`;

const LogoImgBox = styled.div`
  position: absolute;
  left: 0;
  width: 30%;
  height: 100%;
`;

interface homeLinkProps {
  state: boolean;
}

const HomeLink = styled(Link)<homeLinkProps>`
  border-bottom: none;
  color: ${({ state }) => (state ? 'rgb(61, 152, 247)' : 'grey')};
  border-bottom: ${({ state }) => (state ? '3px solid rgb(61, 152, 247)' : 'none')};
  display: inline-flex;
  flex-direction: column;
  justify-content: center;
  height: 100%;
  text-decoration: none;
`;
const Logo = styled.img``;
const NavigationBox = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

const Blank = styled.div`
  width: 30px;
`;
