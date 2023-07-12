import styled from 'styled-components';

export const MainLogoContaier = styled.div`
  img {
    width: auto;
    height: 26px;
    cursor: pointer;
  }

  img.logo-hotdrops-image {
    width: auto;
    height: 50px;
    cursor: pointer;
  }

  @media screen and (max-width: 1130px) {
    img {
      height: 23px;
    }
  }

  @media screen and (max-width: 1024px) {
    img {
      height: 40px;
      width: 32px;
    }
  }
`;
