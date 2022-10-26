import styled from 'styled-components';

import { TStyledSplashCardButton } from '../../splashConfig.types';

export const StyledSplashCardButton = styled.button<TStyledSplashCardButton>`
  max-width: 100%;
  border-radius: 16px;
  height: 64px;
  color: #ffffff;
  border: none;

  &.need-help-kohler {
    background: var(--stimorol);
    font-family: 'Plus Jakarta Sans';
    font-size: 28px;
    font-weight: 700;
    line-height: 28px;
    width: 303px !important;
  }

  &.card-button-mark-kohler {
    background: #000000;
    font-family: 'Plus Jakarta Sans';
    font-weight: 700;
    font-size: 22px;
  }

  @media screen and (max-width: 539px) {
    &.need-help-kohler {
      width: 100% !important;
      font-size: 22px;
    }
  }
`;
