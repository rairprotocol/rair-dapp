import React from 'react';
import { IMainBlockInfoText } from '../splashConfig.types';
import {
  MainBlockTextContainer,
  MainBlockTitle
} from '../styles/MainBlockTextContainer';

const MainBlockInfoText: React.FC<IMainBlockInfoText> = ({
  splashData,
  color,
  fontSize
}) => {
  return (
    <MainBlockTextContainer>
      {splashData.title && <MainBlockTitle color={color} fontSize={fontSize} />}
    </MainBlockTextContainer>
  );
};

export default MainBlockInfoText;
