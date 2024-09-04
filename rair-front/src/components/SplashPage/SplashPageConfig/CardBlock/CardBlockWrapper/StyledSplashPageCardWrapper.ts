import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { TStyledSplashPageCardWrapper } from '../../splashConfig.types';

export const StyledSplashPageCardWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TStyledSplashPageCardWrapper>`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-radius: 20px;
  background-color: ${({ bgColor }) => bgColor || '#FFFFFF'};
  width: 100%;
  height: ${({ height }) => height || 'auto'};
  @media (max-width: 930px) {
    flex-direction: column-reverse;
    border-radius: 16px;
  }
`;
