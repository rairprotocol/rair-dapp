import React from 'react';
import { ISplashPageMainBlock } from '../splashPage.types';
import {
  ImageBlock,
  MainBlockImage,
  SplashMainBlockWrapper
} from './SplashMainBlockStyled.styles';

const SplashPageMainBlock: React.FC<ISplashPageMainBlock> = ({
  splashData
}) => {
  return (
    <SplashMainBlockWrapper bgColor="#ffffff">
      <MainBlockImage>
        <ImageBlock
          src={splashData.backgroundImage}
          widthDiff={'488px'}
          heightDiff="488px"
        />
      </MainBlockImage>
      Splash Page Main Block
    </SplashMainBlockWrapper>
  );
};

export default SplashPageMainBlock;
