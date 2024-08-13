import emotionIsPropValid from '@emotion/is-prop-valid';
import styled from 'styled-components';

import { TStyledUnlockableVideosWrapper } from '../../splashConfig.types';

export const StyledUnlockableVideosWrapper = styled.div.withConfig({
  shouldForwardProp: (prop) => emotionIsPropValid(prop)
})<TStyledUnlockableVideosWrapper>`
  width: 100%;
  border-radius: 16px;
  height: 475px;
  background-color: ${({ primaryColor }) =>
    primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'};

  @media screen and (max-width: 844px) {
    height: auto;
  }
`;
