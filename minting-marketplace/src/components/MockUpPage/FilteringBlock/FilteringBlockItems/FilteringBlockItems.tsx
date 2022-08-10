//@ts-nocheck
import styled from 'styled-components';
import { FilterIconNew, ArrowDown, ArrowUp, SimpleFilterArrow } from './incons';

export const SelectFiltersItem = styled.div`
  background-color: var(
    --${(props) => (props.primaryColor === 'charcoal-90' ? props.primaryColor : 'rhyno-40')}
  );
  color: ${(props) =>
    props.filterPopUp ? '#fff' : `var(--${props.textColor})`};
  border: ${(props) =>
    props.primaryColor === 'charcoal-90'
      ? 'solid 1px var(--charcoal-80)'
      : 'solid 1px var(--rhyno)'};
  border: ${(props) => (props.filterPopUp ? '1px solid #E882D5' : '')};
`;

export const FiltersTitleIcon = styled.i`
  color: ${(props) => (props.filterPopUp ? '#fff' : '#E882D5')};
`;

export const SelectFiltersPopUp = styled.div`
  background-color: var(--${(props) => props.primaryColor});
  z-index: 100;
`;

export const SelectSortItem = styled.div`
  background-color: var(
    --${(props) => (props.primaryColor.includes('charcoal') ? 'charcoal-90' : 'rhyno-40')}
  );
  color: var(--${(props) => props.textColor});
  border: ${(props) =>
    props.primaryColor.includes('charcoal')
      ? 'solid 1px var(--charcoal-80)'
      : 'solid 1px var(--rhyno)'};
  border: ${(props) => (props.sortPopUp ? '1px solid #E882D5' : '')};
`;

export const SortArrowUpIcon = styled.i`
  color: ${(props) => (props.sortItem === 'up' ? '#E882D5' : '#A7A6A6')};
`;

export const SortArrowDownIcon = styled.i`
  color: ${(props) => (props.sortItem === 'down' ? '#E882D5' : '#A7A6A6')};
`;

export const SelectSortPopUp = styled.div`
  background-color: var(--${(props) => props.primaryColor});
  color: var(--${(props) => props.textColor});
`;

export const ModalContentPicture = styled.div`
  background-image: url(${(props) => props.picture || props.defaultImg});
  background-color: var(--${(props) => props.primaryColor}-transparent);
`;

export const StyledFilterIcon = styled(FilterIconNew)`
  path {
    stroke: ${(props) => (props.filterPopUp ? '#fff' : '#E882D5')};
  }
  margin-right: 8px;
`;

export const StyledArrowUpIcon = styled(ArrowUp)`
  path {
    stroke: ${(props) => (props.sortItem === 'up' ? '#E882D5' : '#A7A6A6')};
  }
`;
export const StyledArrowDownIcon = styled(ArrowDown)`
  path {
    stroke: ${(props) => (props.sortItem === 'down' ? '#E882D5' : '#A7A6A6')};
  }
`;

export const StyledShevronIcon = styled(SimpleFilterArrow)`
  transform: ${(props) => (props.rotate ? 'rotate(-180deg)' : '')};
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
