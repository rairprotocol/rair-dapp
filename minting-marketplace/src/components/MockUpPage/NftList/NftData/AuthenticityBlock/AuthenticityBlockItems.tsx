import styled from 'styled-components';
import { TAuthenticityStyled } from '../../nftList.types';

export const TableAuthenticity = styled.div<TAuthenticityStyled>`
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? 'rgb(189, 189, 189)' : '#383637'};
  border-radius: 16px;
  padding-top: 10px;
  margin-top: 24px;

  font-size: 20px;
  font-weight: 700;

  .authenticity-box:nth-child(2):hover {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? '#b1b1b1' : '#2D2B2C'};
    cursor: pointer;
  }

  .authenticity-box:nth-child(3):hover {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? '#b1b1b1' : '#2D2B2C'};
    border-end-end-radius: 16px;
    border-end-start-radius: 16px;
    cursor: pointer;
  }

  .authenticity-box .link-block span {
    color: white;
    width: 48px;
    height: 48px;

    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? '#939393'
        : 'linear-gradient(0deg, #4E4D4D, #4E4D4D)'};
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;

    margin-right: 16px;
  }

  .authenticity-box .block-arrow {
    color: ${(props) => (props.primaryColor === 'rhyno' ? 'white' : '#E882D5')};

    width: 48px;
    height: 48px;
    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? '#939393'
        : 'linear-gradient(0deg, #4E4D4D, #4E4D4D)'};
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .nftDataPageTest-a-hover:hover {
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '' : 'var(--bubblegum)'};
  }
`;
