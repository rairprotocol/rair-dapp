import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchPanel from './SearchPanel';

// import RairFavicon from './assets/rair_favicon.ico';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { setShowSidebarTrue } from '../../ducks/metadata/actions';
import { rFetch } from '../../utils/rFetch';

import MainBanner from './MainBanner/MainBanner';
import { IMockUpPage } from './SelectBox/selectBox.types';

const MockUpPage: React.FC<IMockUpPage> = ({ tabIndex, setTabIndex }) => {
  const [mainBannerInfo, setMainBannerInfo] = useState<any>(undefined);
  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const getCollectionBanner = async () => {
    const response = await rFetch(`/api/settings/featured`);
    if (response.success) {
      setMainBannerInfo(response.data);
    }
  };

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
      <MainBanner mainBannerInfo={mainBannerInfo} />
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
