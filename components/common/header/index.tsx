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
        <NavigationBox>
          <NavBox
            link={'/news'}
            comment={device === Device.pc ? '뉴스 모아보기' : '뉴스'}
            state={curRoute === 'news'}
          />

          <NavBox
            link={'/keywords'}
            comment={device === Device.pc ? '키워드 모아보기' : '키워드'}
            state={curRoute === 'keywords'}
          />

          <NavBox
            link={'/analyze'}
            comment={device === Device.pc ? '정치 성향 테스트' : '가치관'}
            state={curRoute === 'analyze'}
          />

          <NavBox link={'/about'} comment={'ABOUT'} state={curRoute === 'about'} />
        </NavigationBox>
      </HeaderBody>
    </Wrapper>
  );
}

interface NavBoxProps {
  link: string;
  comment: string;
  state: boolean;
}

function NavBox({ link, comment, state }: NavBoxProps) {
  return (
    <HomeLink href={`${link}`} $state={state}>
      {comment}
    </HomeLink>
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
  font-weight: 500;
  border-bottom: ${({ $state }) => ($state ? '3px solid rgb(114, 190, 218)' : '3px solid white')};
  height: 100%;
  .image-l {
    @media screen and (max-width: 768px) {
      display: none;
    }
  }
  .image-s {
    display: none;
    @media screen and (max-width: 768px) {
      display: flex;
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

const ImageWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  padding: 0;
  margin: 0;
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
