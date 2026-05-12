import styled from 'styled-components';

export const ScrollWrapper = styled.div`
  height: 100%;
  margin-right: -1.25rem;
  padding-left: 0.25rem;
  padding-right: 1.25rem;
  overflow-y: auto;

  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-track {
    background: transparent;
  }
  &::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.yvote04};
    border-radius: 0;
  }
  &::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.yvote05};
  }
  scrollbar-width: thin;

  @media screen and (max-width: 768px) {
    margin-right: 0;
    padding-right: 0.25rem;
    scrollbar-width: none;
    &::-webkit-scrollbar {
      display: none;
    }
  }
`;

export const ModalBodyWrapper = styled.div`
  width: 50%;
  min-width: 560px;
  max-width: 640px;
  margin-left: auto;
  margin-right: auto;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);

  @media screen and (max-width: 768px) {
    width: 95%;
    min-width: 0px;
  }
`;
