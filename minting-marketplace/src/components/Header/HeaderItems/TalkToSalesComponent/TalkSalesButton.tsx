import styled from 'styled-components';

interface ITalkSalesButton {
  currentUserAddress: string | undefined;
  primaryColor?: string;
  adminPanel?: boolean;
  isAboutPage?: boolean;
}

export const TalkSalesButton = styled.button<ITalkSalesButton>`
  position: absolute;
  top: ${(props) =>
    props.currentUserAddress
      ? '79.5px'
      : props.isAboutPage && props.isAboutPage
        ? '72px'
        : '84px'};
  right: ${(props) =>
    props.currentUserAddress && props.adminPanel
      ? '163px'
      : props.currentUserAddress && !props.adminPanel
        ? '131px'
        : '120px'};
  background: var(--royal-ice);
  border: none;
  color: #fff;
  height: 40px;
  width: ${(props) => (props.currentUserAddress ? '186px' : '200px')};
  font-weight: 700;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
  transition: all 0.3s ease;

  &.inquiries-sales {
    position: inherit;
    background: none;
    width: auto;
    height: auto;
    padding: 0;
    font-weight: 500;
    font-size: 16px;
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '#7A797A' : 'white'};
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

  @media screen and (max-width: 1320px) {
    right: ${(props) =>
      props.currentUserAddress && props.adminPanel
        ? '83px'
        : props.currentUserAddress && !props.adminPanel
          ? '51px'
          : '40px'};
  }

  @media screen and (max-width: 1100px) {
    right: ${(props) =>
      props.currentUserAddress && props.adminPanel
        ? '63px'
        : props.currentUserAddress && !props.adminPanel
          ? '31px'
          : '20px'};
  }
`;
