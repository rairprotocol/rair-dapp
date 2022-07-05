//@ts-nocheck
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setShowSidebarTrue } from '../../ducks/metadata/actions';

import SearchPanel from './SearchPanel';
import MetaTags from '../SeoTags/MetaTags';
import RairFavicon from './assets/rair_favicon.ico';
// import setDocumentTitle from "../../utils/setTitle";

const MockUpPage = ({ tabIndex, setTabIndex }) => {
  const seoInformation = {
    title: 'Rair Tech Marketplace',
    contentName: 'author',
    content: 'Digital Ownership Encryption',
    description:
      'RAIR is a Blockchain-based digital rights management platform that uses NFTs to gate access to streaming content',
    favicon: RairFavicon,
    faviconMobile: RairFavicon
  };

  const dispatch = useDispatch();
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);
  useEffect(() => {
    // setDocumentTitle(`All`);

    dispatch(setShowSidebarTrue());
  }, [dispatch]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={'mock-up-page-wrapper'}>
      <MetaTags seoMetaTags={seoInformation} />
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
