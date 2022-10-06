import styled from 'styled-components';

import {
  TStyledButtonContainerMainBlock,
  TStyledButtonImage,
  TStyledButtonMainBlock
} from '../splashConfig.types';

export const StyledButtonContainerMainBlock = styled.div<TStyledButtonContainerMainBlock>`
  display: flex;
  width: ${({ width }) => width};
  max-width: 50%;
  height: ${({ height }) => height};
  margin: ${({ margin }) => margin};
  gap: ${({ gap }) => gap};
  background-color: red;
`;

export const StyledButtonMainBlock = styled.button<TStyledButtonMainBlock>`
  width: ${({ width }) => width};
  max-width: 100%;
  border-radius: ${({ borderRadius }) => borderRadius};
  height: ${({ height }) => height};
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
