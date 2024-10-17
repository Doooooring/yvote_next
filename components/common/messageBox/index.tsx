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
  padding: 0.75rem 1.25rem;
  min-width: 200px;
  max-width: 70%;

  position: relative;
  z-index: 1;
`;

const PositiveWrapper = styled(Wrapper)`
  background-color: ${({ theme }) => RGBA(theme.colors.yvote01, 1)};
  border-color: white;
  p {
    color: white;
    font-weight: bold;
    font-size: 16px;
  }
`;

const NegativeWrapper = styled(Wrapper)``;
