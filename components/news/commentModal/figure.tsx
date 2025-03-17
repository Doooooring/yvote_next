import { CommonLayoutBox } from '@components/common/commonStyles';
import styled from 'styled-components';

export const ScrollWrapper = styled.div`
  width: 100%;
  height: 100%;
  padding-left: 0.5rem;
  padding-right: 0.5rem;
  overflow-y: scroll;
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
