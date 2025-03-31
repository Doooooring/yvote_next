import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface PreviewBoxLayoutProps extends HTMLAttributes<HTMLDivElement> {
  headView: ReactNode;
}

export default function PreviewBoxLayout({ headView, ...rest }: PreviewBoxLayoutProps) {
  return (
    <Wrapper {...rest}>
      <BodyWrapper>
        <HeadWrapper>{headView}</HeadWrapper>
      </BodyWrapper>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  width: 100%;
  height: 99%;
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  font: inherit;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: start;
  border-radius: 10px;
  border: 1px solid rgba(200, 200, 200, 0.5);
  box-shadow: 0px 0px 35px -30px;
  text-align: left;
  padding: 7px 10px;
  position: relative;
  @media screen and (max-width: 768px) {
    padding: 2px 5px;
  }

  background-color: ${({ theme }) => theme.colors.gray100};
`;

const BodyWrapper = styled.div`
  display: inline-block;
  width: 100%;
  height: 100%;
  flex: 0 1 auto;
  color: #666;
  text-align: left;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  padding-left: 5px;
`;

const HeadWrapper = styled.div`
  width: 100%;
  -webkit-text-size-adjust: none;
  text-align: left;
  margin: 0;
  padding: 0;
  border: 0;
  font: inherit;
  vertical-align: baseline;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: center;
  gap: 4px;
`;
