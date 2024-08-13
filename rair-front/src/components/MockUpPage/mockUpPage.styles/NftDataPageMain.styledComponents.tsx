import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface INftCollectionProps {
  primaryColor: string;
}

export const NftCollection = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<INftCollectionProps>`
  position: relative;
  border-radius: 16px;
  height: '475px';
  padding: 0;
  background-color: ${(props) =>
    props.primaryColor === 'rhyno' ? 'rgba(235, 235, 235, 1)' : '#383637'};
`;

export const NFTcollectionIcons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 113px;
  position: absolute;
  top: 19px;
  right: 16px;
`;
