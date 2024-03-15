import styled from 'styled-components';

interface IInquireItems {
  primaryColor: string;
  background?: any;
}

export const InquireWrapper = styled.div<IInquireItems>`
  padding: 0 0 20px 0;

  .inquiries-title {
    font-weight: 700;
    font-size: 32px;
    line-height: 28px;
    color: ${(props) =>
      props.primaryColor === '#dedede' ? '#222021' : '#fff'};
    margin-bottom: 38px;
  }

  @media screen and (max-width: 750px) {
    margin: 0px;
  }
`;

export const InquireContainer = styled.div<IInquireItems>`
  max-width: 700px;
  margin: 0 auto;
  background: ${(props) =>
    props.primaryColor === '#dedede'
      ? 'var(--rhyno-60)'
      : `color-mix(in srgb, ${props.primaryColor} 40%, #888888)`};
  border-radius: 16px;
  padding: 35px;

  input {
    color: ${(props) => (props.primaryColor === '#dedede' ? '222021' : '#fff')};
  }

  span.field-error-message {
    margin-bottom: 16px;
    display: flex;
    align-items: center;
    color: #f63419;
    width: 100%;
    text-align: left;

    svg {
      margin-right: 10px;
    }
  }

  @media screen and (max-width: 800px) {
    width: 90%;
    span.field-error-message {
      font-size: 14px;
    }
  }

  @media screen and (max-width: 550px) {
    span.field-error-message {
      font-size: 12px;
      word-break: break-all;
    }
  }

  @media screen and (max-width: 500px) {
    width: 100%;
  }

  @media screen and (max-width: 470px) {
    padding: 20px;
  }
`;

export const InquireField = styled.div<IInquireItems>`
  display: flex;
  justify-content: space-between;
  align-items: center;

  margin-bottom: 20px;

  &.block-user-inquire-message {
    flex-direction: column;
    justify-content: center;
  }

  .btn-box-inquire {
    button:first-child {
      margin-right: 136px;
      color: ${(props) =>
        props.primaryColor === '#dedede' ? '#363435' : '#fff'};
    }

    button:last-child {
      background: ${(props) => `${props.background}`};
    }
  }

  .error-dot {
    width: 6px;
    height: 6px;
    background: #f63419;
    border-radius: 50%;
    margin-right: 10px;
  }

  @media screen and (max-width: 800px) {
    .btn-box-inquire {
      width: 100%;
      display: flex;
      justify-content: space-between;
    }

    .btn-hidden {
      display: none;
    }
  }

  @media screen and (max-width: 550px) {
    .btn-box-inquire {
      flex-direction: column;
      justify-content: center;
      align-items: center;
      button {
        font-size: 12px;
      }
      button:first-child {
        margin-right: 0;
        margin-bottom: 15px;
      }
    }
  }
`;

export const InquireTextarea = styled.textarea`
  width: 462px;
  height: 130px;
  border: 1px solid #4e4d4d;
  border-radius: 16px;
  background: none;
  font-size: 14px;
  color: #fff;
  padding: 10px;

  &::placeholder {
    color: #a7a6a6;
    word-break: break-all;
  }

  @media screen and (max-width: 800px) {
    width: 70%;
  }

  @media screen and (max-width: 550px) {
    width: 60%;
    font-size: 12px;
  }
`;

export const InquireInput = styled.input`
  width: 462px;
  height: 44px;
  border: 1px solid #4e4d4d;
  border-radius: 16px;
  background: none;
  font-size: 14px;

  padding-left: 12px;

  &.imquire-message-input {
    height: 100px;
  }

  &::placeholder {
    color: #a7a6a6;
    word-break: break-all;
  }

  @media screen and (max-width: 800px) {
    width: 70%;
  }

  @media screen and (max-width: 550px) {
    width: 60%;
    font-size: 12px;
  }
`;

export const InquireSelect = styled.select<IInquireItems>`
  width: 462px;
  height: 44px;
  border: 1px solid #4e4d4d;
  border-radius: 16px;
  background: none;
  font-size: 14px;
  color: ${(props) => (props.primaryColor === '#dedede' ? '#222021' : '#fff')};
  appearance: none;

  &::after {
    content: '123';
    width: 0.8em;
    height: 0.5em;
    background-color: var(--select-arrow);
    clip-path: polygon(100% 0%, 0 0%, 50% 100%);
  }

  padding: 0 12px;

  @media screen and (max-width: 800px) {
    width: 70%;
  }

  @media screen and (max-width: 520px) {
    width: 60%;
    font-size: 12px;
  }
`;

export const InquireLabel = styled.label<IInquireItems>`
  display: flex;
  align-items: center;

  &.label-user-inquire-message {
    margin-bottom: 25px;
    font-size: 20px;
  }

  font-size: 16px;
  color: ${(props) => (props.primaryColor === '#dedede' ? '#363435' : '#fff')};
  line-height: 20px;

  @media screen and (max-width: 800px) {
    font-size: 14px;
  }

  @media screen and (max-width: 550px) {
    font-size: 12px;
  }
`;

export const InquireButton = styled.button`
  width: 162px;
  height: 44px;
  color: #fff;
  border: 1px solid #4e4d4d;
  border-radius: 16px;
  background: none;

  @media screen and (max-width: 550px) {
    width: 124px;
    border-radius: 10px;
  }
`;
