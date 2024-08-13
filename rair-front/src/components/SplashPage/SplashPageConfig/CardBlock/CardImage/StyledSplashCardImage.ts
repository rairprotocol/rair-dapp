import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { TStyledSplashCardImage } from '../../splashConfig.types';

export const StyledSplashCardImage = styled.img.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TStyledSplashCardImage>`
  width: 100%;
  height: auto;
  min-width: 400px;
  margin: ${({ imageMargin }) => imageMargin};

  @media (max-width: 930px) {
    margin: 0px;
    padding: 15px;
    border-radius: 0px;
    min-width: 100%;
  }
`;
