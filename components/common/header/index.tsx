import Image from 'next/image';
import ImageFallback from '../imageFallback';
import Link from 'next/link';
import { useCurRoute } from './header.tool';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Device, useDevice } from '@utils/hook/useDevice';

export default function Header() {
  const curRoute = useCurRoute();
  const device = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Ensures the menu closes when navigating
  };

  return (
    <Wrapper>
      <HeaderBody>
        <LogoImgBox>
          <HomeLink href="/" $state={curRoute === 'home'}>
            <ImageWrapper className="image-l">
              <ImageFallback src="/assets/img/김민재 로고.png" width="120" height="27" alt="logo" />
            </ImageWrapper>
            <ImageWrapper className="image-s">
              <ImageFallback src="/assets/img/logo_image.png" width="50" height="50" alt="logo" />
            </ImageWrapper>
          </HomeLink>
        </LogoImgBox>

        {/* Hamburger Button */}
        <Hamburger onClick={toggleMenu}>
          <span />
          <span />
          <span />
        </Hamburger>

        {/* Navigation Menu */}
        <NavigationBox isMenuOpen={isMenuOpen}>
          <NavBox
            link={'/news'}
            comment={device === Device.pc ? '뉴스 모아보기' : '뉴스'}
            state={curRoute === 'news'}
            onNavigate={closeMenu} // Close menu on click
          />

          <NavBox
            link={'/keywords'}
            comment={device === Device.pc ? '키워드 모아보기' : '키워드'}
            state={curRoute === 'keywords'}
            onNavigate={closeMenu} // Close menu on click
          />

          <NavBox
            link={'/analyze'}
            comment={device === Device.pc ? '정치 성향 테스트' : '가치관'}
            state={curRoute === 'analyze'}
            onNavigate={closeMenu} // Close menu on click
          />

          <NavBox
            link={'/about'}
            comment={'ABOUT'}
            state={curRoute === 'about'}
            onNavigate={closeMenu} // Close menu on click
          />
        </NavigationBox>
      </HeaderBody>
    </Wrapper>
  );
}

interface NavBoxProps {
  link: string;
  comment: string;
  state: boolean;
  onNavigate: () => void;
}

function NavBox({ link, comment, state, onNavigate }: NavBoxProps) {
  return (
    <HomeLink href={`${link}`} $state={state} onClick={onNavigate}>
      {comment}
    </HomeLink>
  );
}

const Hamburger = styled.div`
  display: none;
  flex-direction: column;
  justify-content: space-between;
  height: 20px;
  cursor: pointer;

  span {
    width: 25px;
    height: 3px;
    background-color: black;
    border-radius: 2px;
  }

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

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
  $state: boolean;
}

const HomeLink = styled(Link)<homeLinkProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0 10px;
  white-space: nowrap;
  color: ${({ $state }) => ($state ? 'rgb(114, 190, 218)' : '#747272')};
  text-decoration: none;
  font: inherit;
  font-size: 1rem;
  font-weight: 400;
  border-bottom: ${({ $state }) => ($state ? '3px solid rgb(114, 190, 218)' : '3px solid white')};
  height: 100%;
  // .image-l {
  //   @media screen and (max-width: 768px) {
  //   }
  // }
  .image-s {
    display: none;
  }
  @media screen and (max-width: 768px) {
    padding: 0 5px;
    font-size: 13px;
    border-bottom: none;
  }
`;

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
`;

const NavigationBox = styled.div<{ isMenuOpen: boolean }>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3%;
  flex: 4;
  margin: 0 10%;
  height: 100%;
  border: 0;
  @media screen and (max-width: 768px) {
    flex-direction: column;
    position: absolute;
    top: 80px; // Match header height
    right: 0;
    width: 30%;
    background-color: white;
    padding: 1rem;
    margin: 0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;
    height: auto;
    transform: ${({ isMenuOpen }) => (isMenuOpen ? 'translateY(0)' : 'translateY(-200%)')};
    transition: transform 0.3s ease-in-out;
  }
`;
