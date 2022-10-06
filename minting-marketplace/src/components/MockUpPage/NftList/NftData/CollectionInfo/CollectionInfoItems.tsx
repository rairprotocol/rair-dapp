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
`;

export const CollectionInfoBody = styled.div<TCollectionInfoBody>`
  width: 100%;

  .block-item-collection:nth-child(odd) {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? '#b1b1b1' : '#2D2B2C'};
  }
`;
