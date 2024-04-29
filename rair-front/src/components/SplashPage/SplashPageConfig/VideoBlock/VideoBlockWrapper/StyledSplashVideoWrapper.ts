import styled from 'styled-components';

export const StyledSplashVideoWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  justify-content: space-between;
  margin-top: 134px;

  @media screen and (max-width: 844px) {
    margin-top: 100px;
  }

  @media screen and (max-width: 539px) {
    margin-top: 70px;
  }
`;
