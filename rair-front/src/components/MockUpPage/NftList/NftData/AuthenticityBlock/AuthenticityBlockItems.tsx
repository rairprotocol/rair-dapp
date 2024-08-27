import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { TAuthenticityStyled } from '../../nftList.types';

export const TableAuthenticity = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TAuthenticityStyled>`
  background: ${({ isDarkMode, primaryColor }) =>
    !isDarkMode
      ? 'rgb(189, 189, 189)'
      : `color-mix(in srgb, ${primaryColor}, #888888)`};
  border-radius: 16px;
  padding-top: 10px;
  margin-top: 24px;

  font-size: 20px;
  font-weight: 700;

  .authenticity-box:nth-child(2):hover {
    background: ${({ isDarkMode, primaryColor }) =>
      !isDarkMode
        ? '#b1b1b1'
        : `color-mix(in srgb, ${primaryColor} 20%, #888888)`};
    cursor: pointer;
  }

  .authenticity-box:nth-child(3):hover {
    background: ${({ isDarkMode, primaryColor }) =>
      !isDarkMode
        ? '#b1b1b1'
        : `color-mix(in srgb, ${primaryColor} 30%, #888888)`};
    border-end-end-radius: 16px;
    border-end-start-radius: 16px;
    cursor: pointer;
  }

  .authenticity-box .link-block span {
    color: white;
    width: 48px;
    height: 48px;

    background: ${(props) =>
      props.primaryColor === '#dedede'
        ? '#939393'
        : 'linear-gradient(0deg, #4E4D4D, #4E4D4D)'};
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 16px;
  }

  .authenticity-box .block-arrow {
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '#dedede' : '#E882D5'};

    width: 48px;
    height: 48px;
    background: ${(props) =>
      props.primaryColor === '#dedede'
        ? '#939393'
        : 'linear-gradient(0deg, #4E4D4D, #4E4D4D)'};
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nftDataPageTest-a-hover:hover {
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '' : 'var(--bubblegum)'};
  }
`;
