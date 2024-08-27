import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { TCollectionInfoBody } from '../../nftList.types';

export const BlockItemCollection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  padding: 13px 0;
  display: flex;
  justify-content: space-between;

  font-size: 19px;

  @media screen and (max-width: 1024px) {
    padding: 1rem;
  }
`;

export const CollectionInfoBody = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TCollectionInfoBody>`
  width: 100%;

  .block-item-collection:nth-child(odd) {
    background: ${({ isDarkMode }) =>
      !isDarkMode ? 'rgb(248, 248, 248)' : '#2D2B2C'};
  }

  @media screen and (max-width: 1024px) {
    &.mint {
      overflow-y: auto;
      max-height: 80vh;
      width: calc(20rem - 2vw);

      .block-item-collection {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;

        .item-name,
        .item-availa,
        .item-price {
          width: 100%;
          padding: 0;
          text-align: center;
          margin-bottom: 1rem;
        }

        .item-name {
          display: flex;
          justify-content: center;
        }
      }
    }
  }
`;
