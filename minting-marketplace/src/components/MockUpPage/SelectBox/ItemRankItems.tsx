//unused-component

import styled from 'styled-components';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';

interface IItemRankContainerStyled {
  primaryColor?: ColorChoice;
  showItems?: boolean;
}

export const ItemRankContainer = styled.div<IItemRankContainerStyled>`
  background-color: ${(props) =>
    props.primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'};
`;

export const SelectBoxItemRank = styled.div<IItemRankContainerStyled>`
  display: ${(props) => (props.showItems ? 'block' : 'none')};
  background-color: ${(props) =>
    props.primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'};
  border: ${(props) =>
    props.primaryColor === 'rhyno' ? '1px solid #D37AD6' : 'none'};
  position: relative;
  z-index: 10;
`;

export const SelectBoxContainer = styled.div<IItemRankContainerStyled>`
  backgroundcolor: var(--${(props) => props.primaryColor});
`;
