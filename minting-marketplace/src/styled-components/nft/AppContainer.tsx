//@ts-nocheck
import styled from 'styled-components';

export const AppContainerFluid = styled.div`
  ${(props) => props.backgroundImageEffect};
  background-size: 100vw 100vh;
  min-height: 90vh;
  position: relative;
  background-color: ${(props) =>
    props.primaryColor === 'rhyno'
      ? '#fafafa'
      : 'var(--' + props.primaryColor + ')'};
  color: ${(props) => props.textColor};
  background-image: url(${(props) => props.backgroundImage});
  background-position: center top;
  background-repeat: no-repeat;
  overflow: hidden;

  @media screen and (max-width: 1024px) {
    background-size: contain;
  }
`;
