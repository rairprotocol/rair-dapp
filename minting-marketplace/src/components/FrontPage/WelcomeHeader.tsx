import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../ducks';
import { setInfoSEO } from '../../ducks/seo/actions';
import { InitialState } from '../../ducks/seo/reducers';
import { TInfoSeo } from '../../ducks/seo/seo.types';
import MockUpPage from '../MockUpPage/MockUpPage';
import MetaTags from '../SeoTags/MetaTags';

const WelcomeHeader = ({
  // // seoInformation,
  tabIndex,
  setTabIndex,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);

  useEffect(() => {
    dispatch(setInfoSEO(InitialState));
    //eslint-disable-next-line
  }, []);
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
