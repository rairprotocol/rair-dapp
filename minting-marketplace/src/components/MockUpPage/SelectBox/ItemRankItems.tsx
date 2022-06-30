import styled from 'styled-components';

export const ItemRankContainer = styled.div`
  background-color: ${(props) =>
    props.primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'};
`;

export const SelectBoxItemRank = styled.div`
  display: ${(props) => (props.showItems ? 'block' : 'none')};
  background-color: ${(props) =>
    props.primaryColor === 'rhyno' ? 'var(--rhyno)' : '#383637'};
  border: ${(props) =>
    props.primaryColor === 'rhyno' ? '1px solid #D37AD6' : 'none'};
  position: relative;
  z-index: 10;
`;

export const SelectBoxContainer = styled.div`
  backgroundcolor: var(--${(props) => props.primaryColor});
`;
