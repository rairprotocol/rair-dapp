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

export const SelectFiltersItem = styled.div`
  background-color: ${(props: TSelectFiltersItemStyled) =>
    props.primaryColor === '#dedede'
      ? 'var(--rhyno-40)'
      : `color-mix(in srgb, ${props.primaryColor}, #888888)`};
  color: ${(props: TSelectFiltersItemStyled) =>
    props.filterPopUp ? '#fff' : `var(--${props.textColor})`};
  border: solid 1px
    ${(props: TSelectFiltersItemStyled) =>
      props.secondaryColor === '#dedede'
        ? 'var(--rhyno-40)'
        : `color-mix(in srgb, ${props.secondaryColor}, #888888)`};

  &.disabled {
    color: grey;
  }
`;

export const FiltersTitleIcon = styled.i`
  color: ${(props: TFiltersTitleIconStyled) =>
    props.filterPopUp ? '#fff' : '#E882D5'};
`;

export const SelectFiltersPopUp = styled.div`
  background-color: 
    ${(props: TSelectFiltersPopUpStyled) =>
      props.primaryColor === '#dedede' ? 'var(--rhyno)' : props.primaryColor}
  );
  z-index: 100;
`;

export const SelectSortItem = styled.div`
  background-color: ${(props: TSelectSortItemStyled) =>
    props.primaryColor === '#dedede'
      ? 'var(--rhyno-40)'
      : `color-mix(in srgb, ${props.primaryColor}, #888888)`};
  color: ${(props: TSelectSortItemStyled) => props.textColor};
  border: solid 1px
    ${(props: TSelectSortItemStyled) =>
      props.secondaryColor === '#dedede'
        ? 'var(--rhyno-40)'
        : `color-mix(in srgb, ${props.secondaryColor}, #888888)`};
`;

export const SortArrowUpIcon = styled.i`
  color: ${(props: TSortArrowUpIconStyled) =>
    props.sortItem === 'up' ? '#E882D5' : '#A7A6A6'};
`;

export const SortArrowDownIcon = styled.i`
  color: ${(props: TSortArrowUpIconStyled) =>
    props.sortItem === 'down' ? '#E882D5' : '#A7A6A6'};
`;

export const SelectSortPopUp = styled.div`
  background-color: ${(props: TSelectSortPopUpStyled) =>
    props.primaryColor === '#dedede'
      ? 'var(--rhyno)'
      : `color-mix(in srgb, ${props.primaryColor}, #2d2d2d)`};
  color: ${(props: TSelectSortPopUpStyled) => props.textColor};
  &:after {
    content: '';
    width: 20px;
    height: 20px;
    background-color: ${(props) =>
      props.primaryColor === '#dedede'
        ? 'var(--rhyno)'
        : `color-mix(in srgb, ${props.primaryColor}, #2d2d2d)`};
    position: absolute;
    transform: rotate(45deg);
    bottom: 63px;
    right: 20px;
    z-index: 29;
  }
`;

export const ModalContentPicture = styled.div`
  background-image: url(${(props) => props.picture || props.defaultImg});
  background-color: var(
    --${(props: TModalContentPictureStyled) => props.primaryColor}-transparent
  );
`;

export const StyledFilterIcon = styled(FilterIconNew)`
  path {
    stroke: ${(props: TFiltersTitleIconStyled) =>
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

export const StyledArrowUpIcon = styled(ArrowUp)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
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
export const StyledArrowDownIcon = styled(ArrowDown)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
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

export const StyledShevronIcon = styled(SimpleFilterArrow)`
  transform: ${(props: TStyledShevronIconStyled) =>
    props.rotate ? 'rotate(-180deg)' : ''};

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

export const StyledPopupArrowUpIcon = styled(ArrowUp)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
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
export const StyledPopupArrowDownIcon = styled(ArrowDown)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
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
