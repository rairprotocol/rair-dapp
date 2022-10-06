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
  background-color: var(
    --${(props: TSelectFiltersItemStyled) => (props.primaryColor === 'charcoal' ? 'charcoal-90' : 'rhyno-40')}
  );
  color: ${(props: TSelectFiltersItemStyled) =>
    props.filterPopUp ? '#fff' : `var(--${props.textColor})`};
  border: ${(props: TSelectFiltersItemStyled) =>
    props.primaryColor === 'charcoal'
      ? 'solid 1px var(--charcoal-80)'
      : 'solid 1px var(--rhyno)'};
  border: ${(props: TSelectFiltersItemStyled) =>
    props.filterPopUp ? '1px solid #E882D5' : ''};
`;

export const FiltersTitleIcon = styled.i`
  color: ${(props: TFiltersTitleIconStyled) =>
    props.filterPopUp ? '#fff' : '#E882D5'};
`;

export const SelectFiltersPopUp = styled.div`
  background-color: var(
    --${(props: TSelectFiltersPopUpStyled) => props.primaryColor}
  );
  z-index: 100;
`;

export const SelectSortItem = styled.div`
  background-color: var(
    --${(props: TSelectSortItemStyled) => (props.primaryColor.includes('charcoal') ? 'charcoal-90' : 'rhyno-40')}
  );
  color: var(--${(props: TSelectSortItemStyled) => props.textColor});
  border: ${(props: TSelectSortItemStyled) =>
    props.primaryColor.includes('charcoal')
      ? 'solid 1px var(--charcoal-80)'
      : 'solid 1px var(--rhyno)'};
  border: ${(props: TSelectSortItemStyled) =>
    props.sortPopUp ? '1px solid #E882D5' : ''};
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
  background-color: var(
    --${(props: TSelectSortPopUpStyled) => props.primaryColor}
  );
  color: var(--${(props: TSelectSortPopUpStyled) => props.textColor});
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
      props.filterPopUp ? '#fff' : '#E882D5'};
  }
  margin-right: 8px;
`;

export const StyledArrowUpIcon = styled(ArrowUp)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
      props.sortItem === 'up' ? '#E882D5' : '#A7A6A6'};
  }
`;
export const StyledArrowDownIcon = styled(ArrowDown)`
  path {
    stroke: ${(props: TSortArrowUpIconStyled) =>
      props.sortItem === 'down' ? '#E882D5' : '#A7A6A6'};
  }
`;

export const StyledShevronIcon = styled(SimpleFilterArrow)`
  transform: ${(props: TStyledShevronIconStyled) =>
    props.rotate ? 'rotate(-180deg)' : ''};
`;

export const StyledPopupArrowUpIcon = styled(ArrowUp)`
  path {
    stroke: #e882d5;
  }
`;
export const StyledPopupArrowDownIcon = styled(ArrowDown)`
  path {
    stroke: #e882d5;
  }
`;
