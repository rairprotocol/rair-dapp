import styled from 'styled-components';

import {
  TStyledImageBlock,
  TStyledSplashMainBlockWrapper
} from '../splashConfig.types';

export const StyledSplashMainBlockWrapper = styled.div<TStyledSplashMainBlockWrapper>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  align-items: ${({ alignItems }) => alignItems || 'center'};
  border-radius: ${({ borderRadius }) => borderRadius || '24px'};
  background-color: ${({ bgColor }) => bgColor || 'none'};
  width: ${({ widthDiff }) => widthDiff || '100%'};
  height: ${({ heightDiff }) => heightDiff || '694px'};
  padding-left: ${({ paddingLeft }) => paddingLeft};
`;

export const StyledImageBlock = styled.div<TStyledImageBlock>`
  width: ${({ widthDiff }) => widthDiff || '1200px'};
  height: ${({ heightDiff }) => heightDiff || '694px'};
  margin: ${({ imageMargin }) => imageMargin};
`;
