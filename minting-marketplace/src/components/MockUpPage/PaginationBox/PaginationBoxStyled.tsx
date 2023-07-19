import { Pagination } from '@mui/material';
import styled from 'styled-components';

import { ColorChoice } from '../../../ducks/colors/colorStore.types';

interface IPaginationBoxStyled {
  primarycolor: ColorChoice;
}

export const PaginationBoxStyled = styled(Pagination)<IPaginationBoxStyled>`
  ul {
    li {
      button {
        -webkit-transition: all 0.2s ease;
        transition: all 0.2s ease;
        color: ${(props) =>
          props.primarycolor === 'rhyno' ? '#2d2d2d' : '#fff'};
        border-radius: 9.5px;
        border: 1px solid
          ${(props) => (props.primarycolor === 'rhyno' ? '#2d2d2d' : '#fff')};

        &.Mui-selected {
          background: var(--stimorol);
          color: #fff;
          border: none;
          -webkit-box-shadow: 0px 0px 7px 0.4px #b278a7;
          -moz-box-shadow: 0px 0px 7px 0.4px #b278a7;
          box-shadow: 0px 0px 7px 0.4px #b278a7;
        }
        &:hover {
          background: var(--stimorol);
          color: #fff;
        }
      }
      div {
        color: ${(props) =>
          props.primarycolor === 'rhyno' ? '#2d2d2d' : '#fff'};
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
