import { Device, useDevice } from '@utils/hook/useDevice';
import Link from 'next/link';
import { MouseEventHandler, useCallback, useState } from 'react';
import styled from 'styled-components';
import ImageFallback from '../imageFallback';
import { useCurRoute } from './header.tool';
import { useRouter } from '@utils/hook/useRouter/useRouter';

export default function Header() {
  const curRoute = useCurRoute();
  const device = useDevice();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <Wrapper style={{ height: device === Device.pc ? '65px' : '50px' }}>
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
        <Hamburger onClick={toggleMenu} $state={isMenuOpen}>
          <div className="line1" />
          <div className="line2" />
          <div className="line3" />
        </Hamburger>

        {/* router Menu */}
        <NavAnimation isMenuOpen={isMenuOpen}>
          <NavigationBox>
            <NavBox
              link={'/news'}
              comment={'뉴스 모아보기'}
              state={curRoute === 'news'}
              onNavigate={closeMenu}
            />

            <NavBox
              link={'/keywords'}
              comment={'키워드 모아보기'}
              state={curRoute === 'keywords'}
              onNavigate={closeMenu}
            />

            <NavBox
              link={'/analyze'}
              comment={'정치 성향 테스트'}
              state={curRoute === 'analyze'}
              onNavigate={closeMenu}
            />

            <NavBox
              link={'/about'}
              comment={'ABOUT'}
              state={curRoute === 'about'}
              onNavigate={closeMenu}
            />
          </NavigationBox>
        </NavAnimation>
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

interface HamburgerProps {
  $state: boolean;
}

const Hamburger = styled.div<HamburgerProps>`
  display: none;
  flex-direction: column;
  gap: 5px;
  justify-content: space-between;
  width: 20px;
  cursor: pointer;

  @media screen and (max-width: 300px) {
    margin: 0.5rem 0;
  }

  div {
    width: 1px;
    height: 2px;
    position: relative;
    transition: all 0.3s ease;
  }

  div::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0.5px;
    width: 20px;
    height: 1.5px;
    background: black;
  }

  div.line1 {
    transform: ${({ $state }) => ($state ? 'rotate(45deg)' : 'rotate(0)')};
  }

  div.line2 {
    opacity: ${({ $state }) => ($state ? '0' : '1')};
  }

  div.line3 {
    transform: ${({ $state }) => ($state ? 'rotate(-45deg)' : 'rotate(0)')};
  }

  @media screen and (max-width: 768px) {
    display: flex;
  }
`;

const Wrapper = styled.nav`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  box-shadow: 0px 0px 30px -25px;
  position: sticky;
  top: 0;
  z-index: 9999;
  background-color: white;
  border-bottom: 2px solid white;

  @media screen and (max-width: 768px) {
    display: flex;
  }

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
  padding: 1.25rem 0;

  @media screen and (max-width: 768px) {
    margin: 0;
    justify-content: center;
    padding: 0.75rem 0;
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
  color: ${({ $state }) => ($state ? 'rgb(114, 190, 218) !important' : '#747272')};
  text-decoration: none;
  font: inherit;
  font-size: 1rem;
  font-weight: 400;

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
    transition: color 0.3s ease;

    &:hover {
      color: ${({ theme }) => theme.colors.gray400};
    }
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

const NavAnimation = styled.div<{ isMenuOpen: boolean }>`
  flex: 1 1 auto;

  @media screen and (max-width: 768px) {
    width: 100%;
    max-height: ${({ isMenuOpen }) => (isMenuOpen ? '300px' : '0')};
    transition: max-height 0.75s ease;
    overflow: hidden;
    position: absolute;
    top: 100%;
    left: 0;
  }
`;

const NavigationBox = styled.div`
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 3%;
  height: 100%;
  border: 0;

  @media screen and (max-width: 768px) {
    flex-direction: column;

    width: 100%;
    background-color: white;
    padding: 1rem;
    margin: 0;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    gap: 1rem;
    // height: auto;
  }
`;
