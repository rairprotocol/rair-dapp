import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';

import NftSingleUnlockables from './NftSingleUnlockables';

import { TFileType } from '../../../../axios.responseTypes';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import setDocumentTitle from '../../../../utils/setTitle';
import CustomButton from '../../utils/button/CustomButton';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import { INftUnlockablesPage } from '../nftList.types';

import TitleCollection from './TitleCollection/TitleCollection';
import VideoPlayerView from './UnlockablesPage/VideoPlayerView';

const NftUnlockablesPage: React.FC<INftUnlockablesPage> = ({
  embeddedParams,
  productsFromOffer,
  primaryColor,
  selectedToken,
  tokenData,
  someUsersData,
  collectionName,
  setTokenDataFiltered
}) => {
  const [selectVideo, setSelectVideo] = useState<TFileType>();
  const myRef = useRef<HTMLDivElement>(null);

  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentTitle('Unlockables');
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    if (embeddedParams) {
      myRef.current?.scrollIntoView();
    } else {
      window.scroll(0, 0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    setSelectVideo(productsFromOffer[0]);
  }, [setSelectVideo, productsFromOffer]);

  if (productsFromOffer.length === 0) {
    return (
      <div className="list-wrapper-empty">
        <CircularProgress
          sx={{ color: '#E882D5' }}
          size={100}
          thickness={4.6}
        />
      </div>
    );
  }

  return (
    <div ref={myRef} className="wrapper-unlockables-page">
      <BreadcrumbsView embeddedParams={embeddedParams} />
      {tokenData && selectedToken && (
        <TitleCollection
          selectedData={tokenData && tokenData[selectedToken]?.metadata}
          title={collectionName}
          someUsersData={someUsersData}
          userName={tokenData[selectedToken]?.owner}
        />
      )}
      <div style={{ marginBottom: 108 }}>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
          unlockables={true}
        />
        <div style={{ width: '85vw', margin: 'auto' }} className="">
          <NftSingleUnlockables
            embeddedParams={embeddedParams}
            productsFromOffer={productsFromOffer}
            setSelectVideo={setSelectVideo}
            setTokenDataFiltered={setTokenDataFiltered}
            primaryColor={primaryColor}
          />
        </div>

        {productsFromOffer?.length < 2 ? (
          <CustomButton
            text="Show More"
            width="288px"
            height="48px"
            margin={'0 auto'}
          />
        ) : (
          <></>
        )}
      </div>
    </div>
  );
};

export default NftUnlockablesPage;
