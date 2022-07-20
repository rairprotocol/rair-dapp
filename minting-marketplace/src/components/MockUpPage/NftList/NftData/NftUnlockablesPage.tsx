//@ts-nocheck
import React, { useEffect, useState } from 'react';
import CustomButton from '../../utils/button/CustomButton';
import { BreadcrumbsView } from '../Breadcrumbs/Breadcrumbs';
import NftSingleUnlockables from './NftSingleUnlockables';
import VideoPlayerView from './UnlockablesPage/VideoPlayerView';
import { useDispatch } from 'react-redux';
import setDocumentTitle from '../../../../utils/setTitle';
import { setShowSidebarTrue } from '../../../../ducks/metadata/actions';
const NftUnlockablesPage = ({
  blockchain,
  contract,
  product,
  productsFromOffer,
  primaryColor,
  selectedData,
  selectedToken,
  tokenData,
  // currentUser,
  // data,
  // handleClickToken,
  // setSelectedToken,
  // totalCount,
  // textColor,
  // offerData,
  // offerPrice,
  setTokenDataFiltered
}) => {
  const [selectVideo, setSelectVideo] = useState(productsFromOffer[0]);

  const dispatch = useDispatch();

  useEffect(() => {
    setDocumentTitle('Unlockables');
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    window.scroll(0, 0);
  }, []);

  return (
    <div>
      <BreadcrumbsView />
      <div style={{ marginBottom: 108 }}>
        <VideoPlayerView
          productsFromOffer={productsFromOffer}
          primaryColor={primaryColor}
          selectVideo={selectVideo}
          setSelectVideo={setSelectVideo}
        />
        <div style={{ maxWidth: '1600px', margin: 'auto' }} className="">
          <NftSingleUnlockables
            blockchain={blockchain}
            contract={contract}
            product={product}
            productsFromOffer={productsFromOffer}
            selectedData={selectedData}
            setSelectVideo={setSelectVideo}
            selectedToken={selectedToken}
            tokenData={tokenData}
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
