import { useEffect } from 'react';
import MockUpPage from '../MockUpPage/MockUpPage';

const WelcomeHeader = ({
  // // seoInformation,
  tabIndex,
  setTabIndex,
  setIsSplashPage
}) => {
  useEffect(() => {
    setIsSplashPage(false);
  }, [setIsSplashPage]);

  return (
    <div className="main-wrapper">
      {/* <MetaTags seoMetaTags={seoInformation} /> */}
      <div className="col-6 text-left main">
        <h1 className="w-100 general-title">
          Digital <b className="title">Ownership</b>
          <br />
          Encryption
        </h1>
        <p className="w-100 general-title">
          RAIR is a Blockchain-based digital rights management platform that
          uses NFTs to gate access to streaming content
        </p>
      </div>
      <div className="col-12 mt-3 row">
        <MockUpPage tabIndex={tabIndex} setTabIndex={setTabIndex} />
      </div>
    </div>
  );
};

export default WelcomeHeader;
