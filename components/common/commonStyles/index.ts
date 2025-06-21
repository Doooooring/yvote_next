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

export const CommonModalBackground = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.2);
  overflow: hidden;
  z-index: 9999;
  overscroll-behavior: none;
  overscroll-behavior: contain;
`;

export const CommonTagBox = styled.div`
  box-sizing: border-box;
  display: inline-block;
  text-decoration: none;
  font-size: 14px;
  font-weight: 500;
  color: 'rgb(120, 120, 120)';
  margin: 0;
  padding: 2px 8px;
  background-color: #f1f2f5;
  border: 1px solid #f1f2f5;
  border-color: '#f1f2f5';
  border-radius: 20px;
`;

export const CommonIconButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;

  padding: 4px;

  border: 1px solid ${({ theme }) => theme.colors.gray300};
  border-radius: 50%;
  background: white;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.gray400};
  }
`;

export const TextButton = styled(CommonLayoutBox)`
  padding: 0.4rem 1.2rem;
  font-weight: 400;
  cursor: pointer;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: #f0f0f0;
  }
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
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.5), white, rgba(255, 255, 255, 0.5));
  background-size: 20% auto;
  background-repeat: no-repeat;
  animation: ${backgroundSlide} 2s ease-in-out infinite;
`;

export const FallbackBox = styled.div`
  background-color: ${({ theme }) => theme.colors.fallback};

  border-radius: 4px;
`;
