import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';

import NftSingleUnlockables from './NftSingleUnlockables';

import { TFileType } from '../../../../axios.responseTypes';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
import setDocumentTitle from '../../../../utils/setTitle';
import LoadingComponent from '../../../common/LoadingComponent';
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
  const [isDiamond, setIsDiamond] = useState<undefined | boolean>(undefined);

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
    if (tokenData && Object.keys(tokenData).length > 0) {
      setIsDiamond(tokenData[0].offer.diamond);
    }
  }, [tokenData]);

  useEffect(() => {
    if (productsFromOffer) {
      setSelectVideo(productsFromOffer[0]);
    }
  }, [setSelectVideo, productsFromOffer]);

  if (productsFromOffer === undefined) {
    return <LoadingComponent />;
  }

  return (
    <div ref={myRef} className="wrapper-unlockables-page">
      <BreadcrumbsView embeddedParams={embeddedParams} />
      {tokenData && selectedToken && (
        <TitleCollection
          selectedData={tokenData && tokenData[selectedToken]?.metadata}
          title={collectionName}
          someUsersData={someUsersData}
          userName={tokenData[selectedToken]?.ownerAddress}
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
            isDiamond={isDiamond}
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
