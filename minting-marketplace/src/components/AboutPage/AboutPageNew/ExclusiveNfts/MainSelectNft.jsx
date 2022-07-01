import styled from 'styled-components';

export const MainSelectNft = styled.div`
  background: url(${(props) => (props.NftImage ? props.NftImage : '')})
    no-repeat;
  background-size: cover;
  background-position: center center;
`;
