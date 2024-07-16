//@ts-nocheck
import styled from 'styled-components';

export const Col = styled.div`
  width: ${(props) => (props.width ? props.width : '50%')};
  display: flex;
  flex-direction: ${(props) => (props.direction ? props.direction : 'row')};
  justify-content: center;
  align-items: ${(props) => (props.align ? props.align : '')};
`;
