import { RGBA } from '@utils/tools';
import { CSSProperties, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { CommonLayoutBox } from '../commonStyles';

interface MessageBoxProps extends PropsWithChildren {
  style?: CSSProperties;
}

export function PositiveMessageBox({ children, style = {} }: MessageBoxProps) {
  return (
    <PositiveWrapper
      style={{
        ...style,
      }}
    >
      {children}
    </PositiveWrapper>
  );
}

export function NegativeMessageBox({ children, style }: MessageBoxProps) {
  return <Wrapper style={{ ...style }}>{children}</Wrapper>;
}

const Wrapper = styled(CommonLayoutBox)`
  box-sizing: content-box;
  padding: 0.5rem 1rem;
  min-width: 300px;

  p {
    white-space: nowrap;
    font-weight: 500;

    font-size: 16px;
  }

  @media screen and (max-width: 550px) {
    min-width: 200px;
    padding: 0.4rem 0.75rem;
    p {
      font-weight: 500;

      font-size: 13px;
    }
  }

  position: relative;
  z-index: 1;
`;

const PositiveWrapper = styled(Wrapper)`
  color: ${({ theme }) => RGBA(theme.colors.yvote02, 1)};
  border-color: ${({ theme }) => RGBA(theme.colors.yvote02, 1)};
  background-color: white;
`;

const NegativeWrapper = styled(Wrapper)``;
