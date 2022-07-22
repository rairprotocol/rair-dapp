import styled from 'styled-components';

export const ShowMoreContainer = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  margin: ${(props) => props.margin};
  @media screen and (max-width: 1260px) and (min-width: 850px) {
    min-width: 48rem;
  }
  @media screen and (max-width: 849px) and (min-width: 660px) {
    min-width: 35rem;
  }
  @media screen and (max-width: 659px) and (min-width: 410px) {
    margin: 0.5rem;
    min-width: 22rem;
  }
  @media screen and (max-width: 409px) and (min-width: 250px) {
    width: 13rem;
  }
`;

export const ShowMoreItem = styled.div`
  width: ${(props) => props.width};
  height: ${(props) => props.height};
  color: ${(props) => props.textColor};
  background: ${(props) =>
    props.background
      ? 'none'
      : props.primaryColor === 'rhyno'
      ? '#F2F2F2'
      : '#434343'};
  @media screen and (max-width: 409px) and (min-width: 250px) {
    width: -webkit-fill-available;
  }
  @media screen and (max-width: 659px) and (min-width: 410px) {
    width: -webkit-fill-available;
  }
  @media screen and (max-width: 849px) and (min-width: 660px) {
    width: -webkit-fill-available;
  }
  @media screen and (max-width: 1260px) and (min-width: 850px) {
    width: -webkit-fill-available;
  }
`;

export const ModalContentCloseBtn = styled.div`
  width: 32px;
  height: 32px;
  border-radius: 11.5px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  cursor: pointer;
  background: ${(props) =>
    props.primaryColor === 'rhyno' ? '#FFFFFF' : '#4E4D4D'};
  &:hover {
    background: ${(props) =>
      props.primaryColor === 'rhyno' ? '#4E4D4D' : '#FFFFFF'};
  }
  i {
    color: #e882d5;
    transform: scale(1.6);
    font-weight: 100;
    line-height: normal;
  }
`;
