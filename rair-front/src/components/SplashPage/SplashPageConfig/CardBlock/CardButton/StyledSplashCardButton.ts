import styled from 'styled-components';

import { TStyledSplashCardButton } from '../../splashConfig.types';

export const StyledSplashCardButton = styled.button<TStyledSplashCardButton>`
  border-radius: 16px;
  height: 64px;
  color: #ffffff;
  border: none;
  outline: none;

  &.need-help-kohler {
    background: var(--stimorol);
    font-family: 'Plus Jakarta Sans';
    font-size: 28px;
    font-weight: 700;
    width: 303px !important;
  }

  &.enter-summit-kohler {
    background: var(--stimorol);
    font-family: 'Plus Jakarta Sans';
    font-size: 28px;
    font-weight: 700;
    width: 735px;
  }

  &.card-button-mark-kohler {
    background: #000000;
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 22px;
  }

  @media screen and (max-width: 1032px) {
    &.enter-summit-kohler {
      width: 535px !important;
      height: 48px;
      font-size: 20px;
    }
  }

  @media screen and (max-width: 844px) {
    &.need-help-kohler {
      width: 535px !important;
      height: 48px;
      font-size: 20px;
    }
  }

  @media screen and (max-width: 670px) {
    &.need-help-kohler,
    &.enter-summit-kohler {
      width: 80vw !important;
      font-size: 16px !important;
      height: 48px;
    }
  }
`;
