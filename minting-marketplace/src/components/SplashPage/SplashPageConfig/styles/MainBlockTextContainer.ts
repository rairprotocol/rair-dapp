import styled from 'styled-components';
import { TMainBlockTitle } from '../splashConfig.types';

export const MainBlockTextContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-right: 48px;
`;

export const MainBlockTitle = styled.div<TMainBlockTitle>`
  color: ${({ color }) => color};
  font-size: ${({ fontSize }) => fontSize}; ;
`;
