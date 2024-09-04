import React from 'react';

import { StyledUnlockableVideosWrapper } from './StyledVideoComponents';

import { useAppSelector } from '../../../../../hooks/useReduxHooks';
import UnlockableVideosSingleTokenPage from '../../../../MockUpPage/NftList/NftData/UnlockableVideosSingleTokenPage';
import { TUnlockableVideosWrapper } from '../../splashConfig.types';

const UnlockableVideosWrapper: React.FC<TUnlockableVideosWrapper> = ({
  productsFromOffer,
  selectVideo,
  setSelectVideo,
  handlePlayerClick,
  openVideoplayer,
  setOpenVideoPlayer
}) => {
  const { isDarkMode } = useAppSelector((store) => store.colors);
  return (
    <StyledUnlockableVideosWrapper isDarkMode={isDarkMode}>
      <UnlockableVideosSingleTokenPage
        selectVideo={selectVideo}
        setSelectVideo={setSelectVideo}
        productsFromOffer={productsFromOffer}
        openVideoplayer={openVideoplayer}
        setOpenVideoPlayer={setOpenVideoPlayer}
        handlePlayerClick={handlePlayerClick}
      />
    </StyledUnlockableVideosWrapper>
  );
};

export default UnlockableVideosWrapper;
