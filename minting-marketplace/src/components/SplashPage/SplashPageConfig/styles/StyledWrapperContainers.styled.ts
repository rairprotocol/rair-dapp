import styled from 'styled-components';
import { TStyledHigherWrapperSplashPage } from '../splashConfig.types';

export const StyledHigherWrapperSplashPage = styled.div<TStyledHigherWrapperSplashPage>`
  display: flex;
  justify-content: center;
  font-family: ${({ fontFamily }) => fontFamily};
`;

export const StyledSplashPageWrapperContainer = styled.div`
  width: 85vw;
`;
