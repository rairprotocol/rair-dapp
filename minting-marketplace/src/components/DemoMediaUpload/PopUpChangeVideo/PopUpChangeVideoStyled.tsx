import styled from 'styled-components';

import { ColorChoice } from '../../../ducks/colors/colorStore.types';

interface IPopUpVideoChangeBox {
  primaryColor: ColorChoice;
}

export const PopUpVideoChangeBox = styled.div<IPopUpVideoChangeBox>`
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
        : 'var(--charcoal-80)'};
    color: ${(props) =>
      props.primaryColor === 'rhyno' ? '#000 !important' : '#fff !important'};
  }

  input:focus {
    background: ${(props) =>
      props.primaryColor === 'rhyno'
        ? 'var(--rhyno-80)'
        : 'var(--charcoal-80)'};
  }
`;
