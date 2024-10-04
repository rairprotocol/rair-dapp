import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import {
  TModalContentCloseBtnStyled,
  TShowMoreContainer,
  TShowMoreItem,
  TShowMoreText
} from '../../NftList/nftList.types';

export const ShowMoreContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TShowMoreContainer>`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  margin: ${(props) => props.margin};
  background: ${(props) => props.background};
  pointer-events: ${(props) => (props.loading === 'true' ? 'none' : 'auto')};
  @media screen and (max-width: 659px) and (min-width: 410px) {
    margin: 0.5rem;
  }
  // @media screen and (max-width: 409px) and (min-width: 250px) {
  //   width: -webkit-fill-available;
  // }
`;

export const ShowMoreItem = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TShowMoreItem>`
  width: ${(props) => props.width};
  min-height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  border: ${(props) => props.border};
  background: ${(props) =>
    props.background
      ? 'none'
      : props.primaryColor === 'rhyno'
        ? '#F2F2F2'
        : '#434343'};
  padding: ${(props) => props.padding};
  transition-duration: 0.5s;
  &:hover {
    transition-duration: 0.5s;
    background: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? 'var(--hot-drops-click)'
        : props.hoverBackground};
  }
  // @media screen and (max-width: 409px) and (min-width: 250px) {
  //   width: -webkit-fill-available;
  // }
  @media screen and (max-width: 659px) and (min-width: 410px) {
    width: -webkit-fill-available;
  }
  @media screen and (max-width: 849px) and (min-width: 660px) {
    width: -webkit-fill-available;
  }
  @media screen and (max-width: 1260px) and (min-width: 850px) {
    width: -webkit-fill-available;
  }
`;

export const ModalContentCloseBtn = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TModalContentCloseBtnStyled>`
  width: 32px;
  height: 32px;
  border-radius: 11.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${({ isDarkMode }) => (isDarkMode ? '#FFFFFF' : '#4E4D4D')};
  &:hover {
    background: ${({ isDarkMode }) => (isDarkMode ? '#4E4D4D' : '#FFFFFF')};
  }
  i {
    color: #e882d5;
    transform: scale(1.6);
    font-weight: 100;
    line-height: normal;
  }
`;

export const ShowMoreText = styled.span.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TShowMoreText>`
  font-family: ${(props) => props.font};
  color: ${(props) => props.fontColor};
  font-size: ${(props) => props.fontSize};
`;
