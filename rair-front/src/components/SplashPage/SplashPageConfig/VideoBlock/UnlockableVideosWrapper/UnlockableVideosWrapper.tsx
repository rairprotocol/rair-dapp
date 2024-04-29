import React from 'react';

import { StyledUnlockableVideosWrapper } from './StyledVideoComponents';

import UnlockableVideosSingleTokenPage from '../../../../MockUpPage/NftList/NftData/UnlockableVideosSingleTokenPage';
import { TUnlockableVideosWrapper } from '../../splashConfig.types';

const UnlockableVideosWrapper: React.FC<TUnlockableVideosWrapper> = ({
  productsFromOffer,
  selectVideo,
  setSelectVideo,
  handlePlayerClick,
  openVideoplayer,
  setOpenVideoPlayer,
  primaryColor
}) => {
  return (
    <StyledUnlockableVideosWrapper primaryColor={primaryColor}>
      <UnlockableVideosSingleTokenPage
        selectVideo={selectVideo}
        setSelectVideo={setSelectVideo}
        productsFromOffer={productsFromOffer}
        openVideoplayer={openVideoplayer}
        setOpenVideoPlayer={setOpenVideoPlayer}
        handlePlayerClick={handlePlayerClick}
        primaryColor={primaryColor}
      />
    </StyledUnlockableVideosWrapper>
  );
};

export default UnlockableVideosWrapper;
