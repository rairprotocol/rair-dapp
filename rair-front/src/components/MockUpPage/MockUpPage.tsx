import React, { useEffect, useState } from 'react';

import SearchPanel from './SearchPanel';

// import RairFavicon from './assets/rair_favicon.ico';
import { rFetch } from '../../utils/rFetch';

import MainBanner from './MainBanner/MainBanner';
import { IMockUpPage } from './SelectBox/selectBox.types';

const MockUpPage: React.FC<IMockUpPage> = ({ tabIndex, setTabIndex }) => {
  const [mainBannerInfo, setMainBannerInfo] = useState<any>(undefined);

  const getCollectionBanner = async () => {
    const response = await rFetch(`/api/settings/featured`);
    if (response.success) {
      setMainBannerInfo(response.data);
    }
  };

  useEffect(() => {
    getCollectionBanner();
  }, []);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={'mock-up-page-wrapper'}>
      <MainBanner mainBannerInfo={mainBannerInfo} />
      <SearchPanel tabIndex={tabIndex} setTabIndex={setTabIndex} />
    </div>
  );
};
export default MockUpPage;
