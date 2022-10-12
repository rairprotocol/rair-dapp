import styled from 'styled-components';

interface IFavoriteStyled {
  image: string;
}

export const FavoriteItem = styled.div<IFavoriteStyled>`
  /* background-image: url(${(props) => props.image});
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center; */
`;

export const UserFavoriteItemInfo = styled.div`
  margin-top: 5px;

  img {
    width: 20px;
    height: 20;
    border-radius: 50%;
  }

  span {
    word-break: break-all;
    font-size: 12px;
    margin-left: 6px;
    margin-top: 2px;
  }

  @media screen and (max-width: 700px) {
    span {
      font-size: 9px;
    }
  }
`;
