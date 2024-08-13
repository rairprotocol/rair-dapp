import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

export const MainSelectNft = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})`
  background: url(${(props) => (props.NftImage ? props.NftImage : '')})
    no-repeat;
  background-size: cover;
  background-position: center center;
`;
