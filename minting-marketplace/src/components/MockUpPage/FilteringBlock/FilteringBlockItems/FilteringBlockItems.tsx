import styled from 'styled-components';

export const SelectFiltersItem = styled.div`
  background-color: ${(props) =>
    props.filterPopUp ? '#E882D5' : `var(--${props.primaryColor})`};
  color: ${(props) =>
    props.filterPopUp ? '#fff' : `var(--${props.textColor})`};
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
  background-color: var(--${(props) => props.primaryColor});
  color: var(--${(props) => props.textColor});
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
