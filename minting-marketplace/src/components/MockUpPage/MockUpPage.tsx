import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import SearchPanel from './SearchPanel';

// import RairFavicon from './assets/rair_favicon.ico';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { setShowSidebarTrue } from '../../ducks/metadata/actions';
import { defaultAvatar, hotDropsDefaultBanner } from '../../images';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';

import { ImageLazy } from './ImageLazy/ImageLazy';
import { changeIPFSLink } from './NftList/utils/changeIPFSLink';
import { IMockUpPage } from './SelectBox/selectBox.types';

const MockUpPage: React.FC<IMockUpPage> = ({ tabIndex, setTabIndex }) => {
  const [mainBannerInfo, setMainBannerInfo] = useState<any>(undefined);
  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const navigate = useNavigate();

  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

  const getCollectionBanner = async () => {
    const response = await rFetch(`/api/settings/featured`);
    if (response.success) {
      setMainBannerInfo(response.data);
    }
  };

  const goMainCollection = useCallback(() => {
    if (mainBannerInfo) {
      navigate(
        `/collection/${mainBannerInfo.blockchain}/${mainBannerInfo.contract}/${mainBannerInfo.product}/0`
      );
    }
  }, [mainBannerInfo, navigate]);

  useEffect(() => {
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    getCollectionBanner();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={'mock-up-page-wrapper'}>
      <div
        className={`collection-background main-banner`}
        onClick={() => goMainCollection()}>
        <ImageLazy
          className="picture-banner"
          alt="Collection Banner"
          src={
            mainBannerInfo && mainBannerInfo?.collectionBanner
              ? `${changeIPFSLink(mainBannerInfo?.collectionBanner)}`
              : hotdropsVar === 'true'
              ? hotDropsDefaultBanner
              : 'https://storage.googleapis.com/rair_images/1683038949498-1548817833.jpeg'
          }
        />
        {mainBannerInfo && (
          <div className="collection-background-main-info">
            <div className="collection-info-contract">
              <div className="collection-info-product-name">
                {mainBannerInfo.collectionName}
              </div>
              {mainBannerInfo && mainBannerInfo.user && (
                <div className="collection-info-user">
                  {mainBannerInfo && mainBannerInfo.user ? (
                    <img src={mainBannerInfo.user.avatar} alt="avatar" />
                  ) : (
                    <img src={defaultAvatar} alt="avatar" />
                  )}
                  <div>
                    {mainBannerInfo && mainBannerInfo.user
                      ? mainBannerInfo.user.nickName
                      : '123'}
                  </div>
                </div>
              )}
            </div>
            {mainBannerInfo.blockchain && (
              <div className="collection-info-blockchain">
                <img
                  src={chainData[mainBannerInfo.blockchain]?.image}
                  alt="blockchain"
                />
                {chainData[mainBannerInfo.blockchain]?.symbol}
              </div>
            )}
          </div>
        )}
      </div>
      <SearchPanel
        tabIndex={tabIndex}
        setTabIndex={setTabIndex}
        primaryColor={primaryColor}
        textColor={textColor}
      />
    </div>
  );
};
export default MockUpPage;
