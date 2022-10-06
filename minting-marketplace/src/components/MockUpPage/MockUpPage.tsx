import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import SearchPanel from './SearchPanel';

// import RairFavicon from './assets/rair_favicon.ico';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { setShowSidebarTrue } from '../../ducks/metadata/actions';

import { IMockUpPage } from './SelectBox/selectBox.types';

const MockUpPage: React.FC<IMockUpPage> = ({ tabIndex, setTabIndex }) => {
  //unused-snippet
  // const seoInformation = {
  //   title: 'Rair Tech Marketplace',
  //   contentName: 'author',
  //   content: 'Digital Ownership Encryption',
  //   description:
  //     'RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
  //   favicon: RairFavicon,
  //   faviconMobile: RairFavicon
  // };

  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  useEffect(() => {
    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={'mock-up-page-wrapper'}>
      {/* <MetaTags seoMetaTags={seoInformation} /> */}
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
