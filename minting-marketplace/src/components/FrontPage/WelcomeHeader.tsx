import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../../ducks';
import { setInfoSEO } from '../../ducks/seo/actions';
import { InitialState } from '../../ducks/seo/reducers';
import { TInfoSeo } from '../../ducks/seo/seo.types';
import MockUpPage from '../MockUpPage/MockUpPage';
import MetaTags from '../SeoTags/MetaTags';

import setTitle from './../../utils/setTitle';

const WelcomeHeader = ({
  // // seoInformation,
  tabIndex,
  setTabIndex,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const hotdropsVar = process.env.REACT_APP_HOTDROPS;

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
      {process.env.REACT_APP_HOTDROPS === 'true' ? (
        <></>
      ) : (
        <div className="col-6 text-left main">
          <h1 className="w-100 general-title">
            RAIR CLOSED <b className="title">BETA</b>
          </h1>
          <p className="w-100 general-title">
            This marketplace is currently in closed beta access. Contact us for
            a RAIR Genesis Pass if you would like to test our tools. Mint NFTs,
            Create Metadata, Upload token-gated content, Collect Analytics.
          </p>
        </div>
      )}
      <div className="col-12 mt-3 row">
        <MockUpPage tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    </div>
  );
};

export default WelcomeHeader;
