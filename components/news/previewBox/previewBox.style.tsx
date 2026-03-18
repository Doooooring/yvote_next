import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface PreviewBoxLayout_PublishedProps extends HTMLAttributes<HTMLDivElement> {
  headView: ReactNode;
  contentView: ReactNode;
  expanded?: boolean;
}

export function PreviewBoxLayout_Published({
  headView,
  contentView,
  expanded,
  ...rest
}: PreviewBoxLayout_PublishedProps) {
  return (
    <Wrapper $expanded={expanded} {...rest}>
      <BodyWrapper>
        <HeadWrapper>{headView}</HeadWrapper>
        <ContentWrapper>{contentView}</ContentWrapper>
      </BodyWrapper>
    </Wrapper>
  );
}

interface PreviewBoxLayout_PendingProps extends HTMLAttributes<HTMLDivElement> {
  bodyView: ReactNode;
  expanded?: boolean;
}

export function PreviewBoxLayout_Pending({ bodyView, expanded, ...rest }: PreviewBoxLayout_PendingProps) {
  return (
    <CompactWrapper $expanded={expanded} {...rest}>
      <HeadWrapper>{bodyView}</HeadWrapper>
    </CompactWrapper>
  );
}

const Wrapper = styled.div<{ $expanded?: boolean }>`
  width: 100%;
  height: auto;
  min-height: auto;
  box-sizing: border-box;
  -webkit-text-size-adjust: none;
  color: #666;
  margin: 0;
  font: inherit;
  display: flex;
  flex-direction: row;
  -webkit-box-align: center;
  align-items: start;
  border-radius: 0;
  border: none;
  border-bottom: 0.5px solid #e5e0d8;
  box-shadow: none;
  text-align: left;
  padding: 10px 4px;
  position: relative;
  @media screen and (max-width: 768px) {
    padding: 8px 2px;
  }

  background-color: transparent;
  &:hover {
    cursor: pointer;
  }
`;

const CompactWrapper = styled(Wrapper)`
  padding: 5px 4px;
  min-height: 0;
  font-size: 13px;

  @media screen and (max-width: 768px) {
    padding: 4px 2px;
  }
`;

const ImgWrapper = styled.div`
  display: inline-block;
  border-radius: 10px;
  width: 100px;
  height: 100px;
  overflow: hidden;
  position: relative;
  color: #666;
  margin: 0;
  padding: 0;
  flex-shrink: 0;
  align-self: center;
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
  padding-left: 15px;
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
  > Img {
    padding-right: 8px;
  }
`;

const ContentWrapper = styled.div`
  align-self: center;
`;
