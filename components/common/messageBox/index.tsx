import { RGB, RGBA } from '@utils/tools';
import { CSSProperties, PropsWithChildren } from 'react';
import styled from 'styled-components';
import { CommonLayoutBox } from '../commonStyles';

interface MessageBoxProps extends PropsWithChildren {
  style?: CSSProperties;
}

export function CommonMessageBox({ children, style = {} }: MessageBoxProps) {
  return (
    <CommonWrapper
      style={{
        ...style,
      }}
    >
      <p>{children}</p>
    </CommonWrapper>
  );
}

export function DefaultMessageBox({ children, style = {} }: MessageBoxProps) {
  return (
    <DefaultWrapper
      style={{
        ...style,
      }}
    >
      {children}
    </DefaultWrapper>
  );
}

export function PositiveMessageBox({ children, style }: MessageBoxProps) {
  return <PositiveWrapper style={{ ...style }}>{children}</PositiveWrapper>;
}

export function NegativeMessageBox({ children, style }: MessageBoxProps) {
  return <Wrapper style={{ ...style }}>{children}</Wrapper>;
}

const Wrapper = styled(CommonLayoutBox)`
  box-sizing: content-box;
  padding: 0.5rem 1.5rem;
  min-width: 200px;
  text-align: center;
  white-space: nowrap;
  overflow: hidden;
  p {
    font-weight: 500;

    font-size: 16px;
  }

  @media screen and (max-width: 550px) {
    padding: 0.4rem 1.2rem;
    p {
      font-weight: 500;

      font-size: 13px;
    }
  }

  position: relative;
  z-index: 1;
`;

const CommonWrapper = styled(Wrapper)`
  background-color: white;
  color: ${({ theme }) => theme.colors.yvote07};
  border: 0;
  box-shadow: 0px 0px 10px -5px ${({ theme }) => RGB(theme.colors.gray700)};
`;

const DefaultWrapper = styled(Wrapper)`
  background-color: ${({ theme }) => RGBA(theme.colors.gray700, 1)};
  border: none;
  color: white;
`;

const PositiveWrapper = styled(Wrapper)`
  background-color: ${({ theme }) => theme.colors.yvote03};
  border: none;
  color: white;
  font-weight: 500;
`;

const NegativeWrapper = styled(Wrapper)``;
