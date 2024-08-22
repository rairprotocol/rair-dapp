import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import { setSEOInfo } from '../../redux/seoSlice';
import MockUpPage from '../MockUpPage/MockUpPage';
import MetaTags from '../SeoTags/MetaTags';

const WelcomeHeader = ({
  // // seoInformation,
  tabIndex,
  setTabIndex,
  setIsSplashPage
}) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);

  useEffect(() => {
    dispatch(setSEOInfo());
  }, [dispatch]);
  useEffect(() => {
    setIsSplashPage(false);
  }, [setIsSplashPage]);

  return (
    <div className="main-wrapper">
      <MetaTags seoMetaTags={seo} />
      <div className="col-12 mt-3 row">
        <MockUpPage tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    </div>
  );
};

export default WelcomeHeader;
