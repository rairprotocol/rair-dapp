import { Pagination } from '@mui/material';
import styled from 'styled-components';

interface IPaginationBoxStyled {
  primarycolor: string;
  primaryButtonColor?: any;
}

export const PaginationBoxStyled = styled(Pagination)<IPaginationBoxStyled>`
  ul {
    li {
      button {
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
        color: ${(props) =>
          props.primarycolor === '#dedede' ? '#2d2d2d' : '#fff'};
        border-radius: 9.5px;
        border: 1px solid
          ${(props) => (props.primarycolor === '#dedede' ? '#2d2d2d' : '#fff')};

        &.Mui-selected {
          background: ${(props) =>
            `${
              props.primarycolor === '#dedede'
                ? import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : 'linear-gradient(to right, #e882d5, #725bdb)'
                : import.meta.env.VITE_TESTNET === 'true'
                  ? props.primaryButtonColor ===
                    'linear-gradient(to right, #e882d5, #725bdb)'
                    ? 'var(--hot-drops)'
                    : props.primaryButtonColor
                  : props.primaryButtonColor
            }`};
          color: #fff;
          border: none;
          -webkit-box-shadow: 0px 0px 7px 0.4px #b278a7;
          -moz-box-shadow: 0px 0px 7px 0.4px #b278a7;
          box-shadow: 0px 0px 7px 0.4px #b278a7;
        }
        &:hover {
          background: ${(props) =>
            `${
              props.primarycolor === '#dedede'
                ? import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : 'linear-gradient(to right, #e882d5, #725bdb)'
                : import.meta.env.VITE_TESTNET === 'true'
                  ? props.primaryButtonColor ===
                    'linear-gradient(to right, #e882d5, #725bdb)'
                    ? 'var(--hot-drops)'
                    : props.primaryButtonColor
                  : props.primaryButtonColor
            }`};
          color: #fff;
        }
      }
      div {
        color: ${(props) =>
          props.primarycolor === '#dedede' ? '#2d2d2d' : '#fff'};
      }
    }
  }

  &.hotdrops-color {
    ul {
      li {
        button {
          &.Mui-selected {
            background: var(--hot-drops-gradient);
            color: #fff;
            border: none;
            -webkit-box-shadow: 0px 0px 7px 0.4px #b278a7;
            -moz-box-shadow: 0px 0px 7px 0.4px #b278a7;
            box-shadow: 0px 0px 7px 0.4px #b278a7;
          }

          &:hover {
            background: var(--hot-drops);
            color: #fff;
          }
        }
      }
    }
  }

  @media screen and (max-width: 540px) {
    ul li {
      margin: 3px !important;
    }
  }
`;
