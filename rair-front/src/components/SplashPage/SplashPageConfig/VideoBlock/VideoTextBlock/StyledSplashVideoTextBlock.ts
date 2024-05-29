import styled from 'styled-components';

export const StyledSplashVideoTextBlock = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-left: 1.15vw;
  margin-bottom: 23px;

  @media screen and (max-width: 844px) {
    flex-direction: column;
  }
`;
