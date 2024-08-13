import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface IMintPopUpCollectionContainer {
  primaryColor: string;
}

export const MintPopUpCollectionContainer = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IMintPopUpCollectionContainer>`
  border-radius: 12px;
  height: auto;
  border: 1px solid
    ${(props) => (props.primaryColor === 'rhyno' ? '#2d2d2d' : '#fff')};
  color: #fff;

  @media screen and (max-width: 1000px) {
    overflow: auto;
    width: 100%;

    .wrapper-collection-info.mint {
      width: 100%;
    }
  }
`;
