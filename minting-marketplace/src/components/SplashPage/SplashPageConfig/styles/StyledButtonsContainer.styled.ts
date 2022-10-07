import styled from 'styled-components';

import {
  TStyledButtonContainerMainBlock,
  TStyledButtonImage,
  TStyledButtonMainBlock,
  TStyledButtonMainBlockWrapper
} from '../splashConfig.types';

export const StyledButtonContainerMainBlock = styled.div<TStyledButtonContainerMainBlock>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection};
  flex-wrap: wrap;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  width: ${({ width }) => width || '100%'};
  max-width: 50%;
  height: ${({ height }) => height};
  margin: ${({ margin }) => margin};
  gap: ${({ gap }) => gap};
  /* background-color: yellow; */
`;

export const StyledButtonMainBlock = styled.button<TStyledButtonMainBlock>`
  flex-grow: ${({ flexGrow }) => flexGrow};
  width: ${({ width }) => width};
  max-width: 100%;
  border-radius: ${({ borderRadius }) => borderRadius};
  height: ${({ height }) => height || '100%'};
  margin: ${({ margin }) => margin};
  font-family: ${({ fontFamily }) => fontFamily};
  font-weight: ${({ fontWeight }) => fontWeight};
  font-size: ${({ fontSize }) => fontSize};
  line-height: ${({ lineHeight }) => lineHeight};
  background: ${({ background }) => background};
  color: ${({ color }) => color};
  border: ${({ border }) => border || 'none'};
`;

export const StyledButtonImage = styled.img<TStyledButtonImage>`
  width: ${({ buttonImageWidth }) => buttonImageWidth};
  height: ${({ buttonImageHeight }) => buttonImageHeight};
  margin-right: ${({ buttonImageMarginRight }) => buttonImageMarginRight};
`;

export const StyledButtonMainBlockWrapper = styled.div<TStyledButtonMainBlockWrapper>`
  display: flex;
  flex-direction: ${({ flexDirection }) => flexDirection || 'row'};
  height: ${({ height }) => height};
  width: 100%;
  justify-content: ${({ justifyContent }) => justifyContent || 'space-between'};
  /* background-color: red; */
`;
