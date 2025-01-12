import styled, { keyframes } from 'styled-components';

export const Row = styled.div`
  display: flex;
  flex-direction: row;
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`;

export const Center = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const Expand = styled.div`
  width: 100%;
  height: 100%;
`;

export const CommonLayoutBox = styled.div`
  background-color: white;
  border: 1px solid rgba(200, 200, 200, 0.5);
  border-radius: 10px;
  box-shadow: 0 0 35px -30px;
`;

export const backgroundSlide = keyframes`
  0% {
    background-position : -10% 0%;
  }
  100% {
    background-position : 110% 0%;
  }
`;
export const Backdrop = styled.div`
  width: 100%;
  height: 100%;
  box-sizing: content-box;
  position: absolute;
  left: 0;
  top: 0;
  background: linear-gradient(90deg, rgba(255, 255, 255, 0), white, rgba(255, 255, 255, 0));
  background-size: 20% auto;
  background-repeat: no-repeat;
  animation: ${backgroundSlide} 1s ease-in-out infinite;
`;

export const FallbackBox = styled.div`
  background-color: ${({ theme }) => theme.colors.fallback};

  border-radius: 4px;
`;
