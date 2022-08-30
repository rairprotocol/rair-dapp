import styled from 'styled-components';
import { ColorChoice } from '../../../../ducks/colors/colorStore.types';

interface ITalkSalesButton {
  currentUserAddress: string | undefined;
  primaryColor?: ColorChoice;
}

export const TalkSalesButton = styled.button<ITalkSalesButton>`
  position: absolute;
  top: ${(props) => (props.currentUserAddress ? '79.5px' : '84px')};
  right: 0;
  background: var(--royal-ice);
  border: none;
  color: #fff;
  height: 40px;
  width: 150px;
  font-weight: 700;
  border-bottom-left-radius: 12px;
  transition: all 0.3s ease;

  &.inquiries-sales {
    position: inherit;
    background: none;
    width: auto;
    height: auto;
    padding: 0;
    font-weight: 500;
    font-size: 15px;
    color: ${(props) => (props.primaryColor === 'rhyno' ? '#7A797A' : 'white')};
  }

  &:hover {
    background: var(--royal-ice-hover);
  }

  &.inquiries-sales:hover,
  &.inquiries-sales:active {
    background: none;
  }

  &:active {
    background: var(--royal-ice-click);
  }
`;
