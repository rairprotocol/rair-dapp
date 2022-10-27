import styled from 'styled-components';

import { TStyledUnlockableVideosWrapper } from '../../splashConfig.types';

export const StyledUnlockableVideosWrapper = styled.div<TStyledUnlockableVideosWrapper>`
  width: 100%;
  border-radius: 16px;
  height: 475px;
  background-color: ${({ primaryColor }) =>
    primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'};

  @media screen and (max-device-width: 539px) {
    height: inherit;
  }
`;
