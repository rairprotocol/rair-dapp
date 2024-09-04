import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { ICardParagraghWrapperStyled } from '../types/CardParagragh.types';

export const CardParagraghWrapper = styled.div`
  padding: 130px 0 0 0;
  width: 100%;
  white-space: normal;
`;

export const CardParagrashTitle = styled.h2.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<ICardParagraghWrapperStyled>`
  font-family: ${(props) => props.fontFamily && props.fontFamily};
  font-size: 42px;
  text-align: ${(props) => props.fontAlign && props.fontAlign};
  font-weight: ${(props) => props.fontWeight && props.fontWeight};

  @media screen and (max-width: 1100px) {
    font-size: 35px;
  }

  @media screen and (max-width: 670px) {
    font-size: 30px;
  }

  @media screen and (min-width: 2000px) {
    font-size: -webkit-calc(1.8vw + 0.5rem);
  }
`;

export const CardParagraghElement = styled.div`
  text-align: left;
  font-size: 28px;
  margin: 50px 0;
  font-weight: 400;

  width: 100%;

  span {
    font-weight: 700;
  }

  @media screen and (max-width: 1100px) {
    font-size: 20px;
  }

  @media screen and (max-width: 670px) {
    margin: 20px 0;
    line-height: 28px;
    font-size: 18px;
  }

  @media screen and (max-width: 400px) {
    font-size: 16px;
  }

  @media screen and (min-width: 2000px) {
    font-size: -webkit-calc(1vw + 0.5rem);
  }
`;

export const CardParagraghImageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  img {
    width: 34rem;
    heght: auto;
  }

  @media screen and (max-width: 980px) {
    flex-direction: column;
    justify-content: center;

    img {
      width: 28rem;
    }
  }

  @media screen and (max-width: 580px) {
    img {
      width: 20rem;
    }
  }

  @media screen and (max-width: 400px) {
    img {
      // width: 200px;
    }
  }

  @media screen and (min-width: 2000px) {
    img {
      width: -webkit-calc(24vw + 5rem);
      // height: -webkit-calc(16vw + 5rem);
    }
  }
`;

export const CardParagraghTextBlock = styled.div`
  width: 47vw;
  margin-right: 40px;

  @media screen and (max-width: 980px) {
    width: 100%;
    margin-right: 0px;
  }

  @media screen and (min-width: 2000px) {
    width: -webkit-calc(47vw + 12rem);
  }
`;
