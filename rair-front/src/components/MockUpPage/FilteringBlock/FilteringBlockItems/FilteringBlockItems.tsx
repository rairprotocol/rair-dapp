import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { ArrowDown, ArrowUp, FilterIconNew, SimpleFilterArrow } from './incons';

import {
  TFiltersTitleIconStyled,
  TModalContentPictureStyled,
  TSelectFiltersItemStyled,
  TSelectFiltersPopUpStyled,
  TSelectSortItemStyled,
  TSelectSortPopUpStyled,
  TSortArrowUpIconStyled,
  TStyledShevronIconStyled
} from '../filteringBlock.types';

export const SelectFiltersItem = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSelectFiltersItemStyled>`
  background-color: ${(props) =>
    props.primaryColor === '#dedede'
      ? 'var(--rhyno-40)'
      : `color-mix(in srgb, ${props.primaryColor}, #888888)`};
  color: ${(props) =>
    props.filterPopUp ? '#fff' : `var(--${props.textColor})`};
  border: solid 1px
    ${(props) =>
      props.secondaryColor === '#dedede'
        ? 'var(--rhyno-40)'
        : `color-mix(in srgb, ${props.secondaryColor}, #888888)`};

  &.disabled {
    color: grey;
  }
`;

export const FiltersTitleIcon = styled.i.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFiltersTitleIconStyled>`
  color: ${(props) => (props.filterPopUp ? '#fff' : '#E882D5')};
`;

export const SelectFiltersPopUp = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSelectFiltersPopUpStyled>`
  background-color: 
    ${(props) =>
      props.primaryColor === '#dedede' ? 'var(--rhyno)' : props.primaryColor}
  );
  z-index: 100;
`;

export const SelectSortItem = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSelectSortItemStyled>`
  background-color: ${({ isDarkMode, primaryColor }) =>
    !isDarkMode
      ? 'var(--rhyno-40)'
      : `color-mix(in srgb, ${primaryColor}, #888888)`};
  color: ${(props) => props.textColor};
  border: solid 1px
    ${(props) =>
      props.secondaryColor === '#dedede'
        ? 'var(--rhyno-40)'
        : `color-mix(in srgb, ${props.secondaryColor}, #888888)`};
`;

export const SortArrowUpIcon = styled.i.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  color: ${(props) => (props.sortItem === 'up' ? '#E882D5' : '#A7A6A6')};
`;

export const SortArrowDownIcon = styled.i.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  color: ${(props) => (props.sortItem === 'down' ? '#E882D5' : '#A7A6A6')};
`;

export const SelectSortPopUp = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSelectSortPopUpStyled>`
  background-color: ${({ isDarkMode, primaryColor }) =>
    isDarkMode
      ? `color-mix(in srgb, ${primaryColor}, #2d2d2d)` : 'var(--rhyno)'};
  color: ${({ textColor }) => textColor};
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    background-color: ${({ primaryColor, isDarkMode }) =>
      !isDarkMode
        ? 'var(--rhyno)'
        : `color-mix(in srgb, ${primaryColor}, #2d2d2d)`};
    position: absolute;
    transform: rotate(45deg);
    bottom: 63px;
    right: 20px;
    z-index: 29;
  }
`;

export const ModalContentPicture = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TModalContentPictureStyled>`
  background-image: url(${(props) => props.picture || props.defaultImg});
  background-color: var(--${(props) => props.primaryColor}-transparent);
`;

export const StyledFilterIcon = styled(FilterIconNew).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TFiltersTitleIconStyled>`
  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : props.filterPopUp
          ? '#fff'
          : `${
              props.customSecondaryButtonColor === '#1486c5'
                ? '#E882D5'
                : props.customSecondaryButtonColor
            }`};
  }
  margin-right: 8px;
`;

export const StyledArrowUpIcon = styled(ArrowUp).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : props.sortItem === 'up'
          ? `${
              props.customSecondaryButtonColor === '#1486c5'
                ? '#E882D5'
                : props.customSecondaryButtonColor
            }`
          : '#A7A6A6'};
  }
`;
export const StyledArrowDownIcon = styled(ArrowDown).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : props.sortItem === 'down' &&
          `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#E882D5'
              : props.customSecondaryButtonColor
          }`};
  }
`;

export const StyledShevronIcon = styled(SimpleFilterArrow).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TStyledShevronIconStyled>`
  transform: ${(props) => (props.rotate ? 'rotate(-180deg)' : '')};

  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#E882D5'
              : props.customSecondaryButtonColor
          }`};
  }
`;

export const StyledPopupArrowUpIcon = styled(ArrowUp).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#E882D5'
              : props.customSecondaryButtonColor
          }`};
  }
`;
export const StyledPopupArrowDownIcon = styled(ArrowDown).withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TSortArrowUpIconStyled>`
  path {
    stroke: ${(props) =>
      import.meta.env.VITE_TESTNET === 'true'
        ? `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#F95631'
              : props.customSecondaryButtonColor
          }`
        : `${
            props.customSecondaryButtonColor === '#1486c5'
              ? '#E882D5'
              : props.customSecondaryButtonColor
          }`};
  }
`;
