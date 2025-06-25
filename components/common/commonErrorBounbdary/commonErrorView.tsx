import logoImage from '@images/logo_image.png';

import styled from 'styled-components';
import { Column } from '../commonStyles';
import Image from 'next/image';
import { ReactNode } from 'react';

export function CommonErrorView({ children }: { children: ReactNode }) {
  return (
    <Wrapper>
      <Image className="pear" src={logoImage} alt="logo" width="150" height="150" />
      {children}
    </Wrapper>
  );
}

const Wrapper = styled(Column)`
  width: 100%;
  height: 100%;

  justify-content: center;
  align-items: center;

  background-color: white;

  .pear {
    animation: rotate-fade-out 6s ease-in-out infinite;
  }

  @keyframes rotate-fade-out {
    0% {
      opacity: 1;
      transform: rotateY(0deg);
    }

    100% {
      opacity: 0;
      transform: rotateY(1080deg);
    }
  }
`;

export const ErrorHead = styled.p`
  color: ${({ theme }) => theme.colors.text};
  font-size: ${({ theme }) => theme.fontSizes.large};
  font-weight: 500;
  margin-bottom: 12px;
`;

export const ErrorComment = styled.p`
  color: ${({ theme }) => theme.colors.gray600};
  font-size: ${({ theme }) => theme.fontSizes.medium};
  font-weight: 500;
  margin-bottom: 4px;
`;
