import styled from 'styled-components';

export const StyledSplashVideoText = styled.h2`
  text-align: start;

  &.video-text-kohler {
    font-family: 'Nebulosa Black Display Solid';
    font-size: 42px;
    font-weight: 400;
    color: #ffffff;
    line-height: 60px;
    margin-right: 15px;
  }

  @media screen and (max-width: 1200px) {
    font-size: 35px !important;
  }

  @media screen and (max-width: 1000px) {
    font-size: 1.7rem !important;
  }

  @media screen and (max-width: 844px) {
    font-size: 5vw !important;
    text-align: center;
    margin-right: 0px !important;
    margin-bottom: 30px;
  }

  @media screen and (max-width: 700px) {
    margin-bottom: 15px;
  }
`;
