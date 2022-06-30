import styled from 'styled-components';

export const ShowMoreContainer = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  margin: ${(props) => props.margin};
`;

export const ShowMoreItem = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? 'var(--rhyno)' : '#434343'};
`;
