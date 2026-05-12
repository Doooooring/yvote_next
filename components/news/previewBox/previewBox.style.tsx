import { HTMLAttributes, ReactNode } from 'react';
import styled from 'styled-components';

interface PreviewBoxLayout_PublishedProps extends HTMLAttributes<HTMLDivElement> {
  headView: ReactNode;
  contentView: ReactNode;
  sideView?: ReactNode;
  expanded?: boolean;
}

export function PreviewBoxLayout_Published({
  headView,
  contentView,
  sideView,
  expanded,
  ...rest
}: PreviewBoxLayout_PublishedProps) {
  return (
    <Wrapper $expanded={expanded} {...rest}>
      <InnerRow>
        <BodyWrapper>
          <HeadWrapper>{headView}</HeadWrapper>
          <ContentWrapper>{contentView}</ContentWrapper>
        </BodyWrapper>
        {sideView && <SideWrapper>{sideView}</SideWrapper>}
      </InnerRow>
    </Wrapper>
  );
}

interface PreviewBoxLayout_PendingProps extends HTMLAttributes<HTMLDivElement> {
  bodyView: ReactNode;
  sideView?: ReactNode;
  expanded?: boolean;
}

export function PreviewBoxLayout_Pending({
  bodyView,
  sideView,
  expanded,
  ...rest
}: PreviewBoxLayout_PendingProps) {
  return (
    <CompactWrapper $expanded={expanded} {...rest}>
      <InnerRow>
        <HeadWrapper style={{ flex: 1, minWidth: 0 }}>{bodyView}</HeadWrapper>
        {sideView && <SideWrapper>{sideView}</SideWrapper>}
      </InnerRow>
    </CompactWrapper>
  );
}

const Wrapper = styled.div<{ $expanded?: boolean }>`
  width: 100%;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  border-bottom: 0.5px solid ${({ theme }) => theme.colors.yvote06};
  border-image: linear-gradient(
      90deg,
      transparent,
      ${({ theme }) => theme.colors.yvote06} 15%,
      ${({ theme }) => theme.colors.yvote06} 85%,
      transparent
    )
    1;
  padding: 10px 4px;
  background-color: transparent;
  cursor: pointer;

  @media screen and (max-width: 768px) {
    padding: 8px 2px 8px 6px;
  }
`;

const CompactWrapper = styled(Wrapper)`
  padding: 0;
  margin: 0;
  line-height: 1;
  min-height: 38px;
  display: flex;
  justify-content: center;

  && .title {
    font-weight: 400;
    font-size: 13px;
    line-height: 38px;
    -webkit-line-clamp: 1;
    padding: 0;
    margin: 0;
  }

  @media screen and (max-width: 768px) {
    padding: 6px 0 6px 6px;
    min-height: unset;

    && .title {
      font-size: 14px;
      line-height: 1.3;
      -webkit-line-clamp: 2;
    }
  }
`;

const InnerRow = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  gap: 8px;
`;

const SideWrapper = styled.div`
  display: flex;
  align-items: stretch;
  flex-shrink: 0;
`;

const BodyWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 4px;

  @media screen and (max-width: 768px) {
    gap: 2px;
  }
`;

const HeadWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 4px;
  overflow: hidden;
`;

const ContentWrapper = styled.div``;
