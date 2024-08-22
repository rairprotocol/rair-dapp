import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

interface IPopUpVideoChangeBox {
  primaryColor?: string;
}

export const PopUpVideoChangeBox = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<IPopUpVideoChangeBox>`
  width: 100%;

  label {
    width: 100%;
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '#000 !important' : '#fff !important'};
    text-align: center;
    margin-top: 10px;
  }

  input {
    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? 'var(--rhyno-80)'
        : `color-mix(in srgb, ${props.primaryColor}, #888888)`};
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '#000 !important' : '#fff !important'};
  }

  input:focus {
    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? 'var(--rhyno-80)'
        : `color-mix(in srgb, ${props.primaryColor}, #888888)`};
  }
`;
