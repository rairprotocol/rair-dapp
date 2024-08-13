import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface customProps {
  width: string;
  direction: string;
  align: string;
}

export const Col = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<customProps>`
  width: ${(props) => (props.width ? props.width : '50%')};
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : 'row')};
  justify-content: center;
  align-items: ${(props) => (props.align ? props.align : '')};
`;
