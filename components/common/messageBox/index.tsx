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
  padding: 0.5rem 2rem;
  min-width: 200px;
  max-width: 90%;

  position: relative;
  z-index: 1;
`;

const PositiveWrapper = styled(Wrapper)`
  color: ${({ theme }) => RGBA(theme.colors.yvote02, 1)};
  border-color: ${({ theme }) => RGBA(theme.colors.yvote02, 1)};
  background-color: white;
  p {
    font-weight: 500;
    font-size: 16px;
  }
`;

const NegativeWrapper = styled(Wrapper)``;
