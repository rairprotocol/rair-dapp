import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { teamTaxHacksSummit } from './AboutUsTeam';

import RairFavicon from '../../../components/MockUpPage/assets/rair_favicon.ico';
import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
import VideoPlayerView from '../../MockUpPage/NftList/NftData/UnlockablesPage/VideoPlayerView';
import MetaTags from '../../SeoTags/MetaTags';
import { MarkKohlerImage } from '../images/markKohler/markHohler';
import { RairLogo_Koholertext } from '../images/teamMeetList/teamMeetList';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import { ISplashPageProps, TMainContractType } from '../splashPage.types';
import { TSplashDataType } from '../splashPage.types';
import SplashCardButton from '../SplashPageConfig/CardBlock/SplashCardButton';
import SplashCardButtonsWrapper from '../SplashPageConfig/CardBlock/SplashCardButtonsWrapper';
import SplashCardImage from '../SplashPageConfig/CardBlock/SplashCardImage';
import SplashCardInfoBlock from '../SplashPageConfig/CardBlock/SplashCardInfoBlock';
import SplashCardText from '../SplashPageConfig/CardBlock/SplashCardText';
import SplashPageCardWrapper from '../SplashPageConfig/CardBlock/SplashPageCardWrapper';
import { hyperlink } from '../SplashPageConfig/utils/hyperLink';
import { useGetProducts } from '../splashPageProductsHook';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import TeamMeet from '../TeamMeet/TeamMeetList';

import './markKohler.css';

const mainContract: TMainContractType = {
  contractAddress: '0x711fe7fccdf84875c9bdf663c89b5f5f726a11d7',
  requiredBlockchain: '0x1',
  offerIndex: ['1']
};
// const testContract: TMainContractType = {
//   contractAddress: '0xdf9067bee90a26f03b777c82213d0785638c23fc',
//   requiredBlockchain: '0x5',
//   offerIndex: ['126']
// };

const contract = mainContract.contractAddress;
const blockchain = mainContract.requiredBlockchain;
const offerIndex = mainContract.offerIndex;

// const contract =
//   process.env.REACT_APP_TEST_CONTRACTS === 'true'
//     ? testContract.contractAddress
//     : mainContract.contractAddress;
// const blockchain =
//   process.env.REACT_APP_TEST_CONTRACTS === 'true'
//     ? testContract.requiredBlockchain
//     : mainContract.requiredBlockchain;

// const offerIndex =
//   process.env.REACT_APP_TEST_CONTRACTS === 'true'
//     ? testContract.offerIndex
//     : mainContract.offerIndex;

export const splashData: TSplashDataType = {
  title: 'TAX HACKS SUMMIT',
  description: (
    <>
      Thursday December 8th 11AM—7PM ET <br /> An NFT Gated Event
    </>
  ),
  backgroundImage: MarkKohlerImage,
  button2: {
    buttonLabel: 'Email Updates',
    buttonAction: () => hyperlink('https://www.google.com')
  },
  purchaseButton: {
    buttonLabel: 'Mint for .27',
    img: metaMaskIcon,
    requiredBlockchain: blockchain,
    contractAddress: contract,
    offerIndex: offerIndex,
    customStyle: {
      width: '100%',
      height: '64px',
      background: `linear-gradient(96.34deg, #035BBC 0%, #805FDA 10.31%, #8C63DA 20.63%, #9867D9 30.94%, #A46BD9 41.25%, #AF6FD8 51.56%, #AF6FD8 51.56%, #BB73D7 61.25%, #C776D7 70.94%, #D27AD6 80.62%, #DD7ED6 90.31%, #E882D5 100%)`,
      fontFamily: 'Plus Jakarta Sans',
      fontWeight: '700',
      fontSize: '22px',
      lineHeight: '28px',
      padding: '14px 0px',
      color: '#FFFFFF',
      borderRadius: '16px'
    },
    blockchainOnly: true,
    customSuccessAction: async (nextToken) => {
      const tokenMetadata = await rFetch(
        `/api/nft/network/${blockchain}/${contract}/0/token/${nextToken}`
      );
      if (tokenMetadata.success && tokenMetadata?.result?.metadata?.image) {
        Swal.fire({
          imageUrl: tokenMetadata.result.metadata.image,
          imageHeight: 'auto',
          imageWidth: '65%',
          imageAlt: "Your NFT's image",
          title: `You own #${nextToken}!`,
          icon: 'success'
        });
      } else {
        Swal.fire('Success', `Bought token #${nextToken}`, 'success');
      }
    }
  },
  videoPlayerParams: {
    blockchain: blockchain,
    contract: contract,
    product: '0'
  }
};

const MarkKohler: React.FC<ISplashPageProps> = ({
  loginDone,
  connectUserData,
  setIsSplashPage
}) => {
  const dispatch = useDispatch();
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);

  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);

  /* UTILITIES FOR NFT PURCHASE */

  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );

  useEffect(() => {
    dispatch(
      setInfoSEO({
        title: '#Mark Kohler',
        ogTitle: '#Mark Kohler',
        twitterTitle: '#Mark Kohler',
        contentName: 'author',
        content: '#Mark Kohler',
        description: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        ogDescription: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        twitterDescription:
          'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        image:
          'https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW',
        favicon: RairFavicon,
        faviconMobile: RairFavicon
      })
    );
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  useEffect(() => {
    window.addEventListener('resize', () =>
      setCarousel(carousel_match.matches)
    );
    return () =>
      window.removeEventListener('resize', () =>
        setCarousel(carousel_match.matches)
      );
  }, [carousel_match.matches]);

  useEffect(() => {
    dispatch(setRealChain('0x5'));
    //eslint-disable-next-line
  }, []);

  const toggleCheckList = () => {
    setOpenCheckList((prev) => !prev);
  };

  const togglePurchaseList = () => {
    setPurchaseList((prev) => !prev);
  };

  return (
    <div className="wrapper-splash-page mark-kohler">
      <MetaTags seoMetaTags={seo} />
      <div className="template-home-splash-page">
        <ModalHelp
          openCheckList={openCheckList}
          purchaseList={purchaseList}
          togglePurchaseList={togglePurchaseList}
          toggleCheckList={toggleCheckList}
          templateOverride={true}
          backgroundColor={{
            darkTheme: 'var(--stimorol)',
            lightTheme: 'var(--stimorol)'
          }}
        />
        <SplashPageCardWrapper>
          <SplashCardInfoBlock paddingLeft="5.9vw">
            <SplashCardText
              color="#DF76DF"
              fontSize="3.47vw"
              fontWeight={400}
              text={splashData.title}
              fontFamily={'Nebulosa Black Display Stencil'}
              lineHeight={'113.7%'}
              width={'37.3vw'}
              marginBottom="1vw"
              mediafontSize="4.5vw"
            />
            <SplashCardText
              color="#000000"
              fontSize="1.9vw"
              fontWeight={400}
              text={splashData.description}
              fontFamily={'Nebulosa Black Display Stencil'}
              lineHeight={'129%'}
              width="33.68vw"
              mediafontSize="3vw"
            />
            <SplashCardButtonsWrapper
              marginTop={'53px'}
              height="148px"
              width="335px"
              gap="20px"
              flexDirection="column">
              <PurchaseTokenButton
                connectUserData={connectUserData}
                {...splashData.purchaseButton}
                // isSplashPage={isSplashPage}
                diamond={true}
              />
              <SplashCardButton
                borderRadius="16px"
                background="#000000"
                buttonLabel={splashData.button2?.buttonLabel}
                buttonAction={splashData.button2?.buttonAction}
                fontFamily={'Plus Jakarta Sans'}
                fontWeight={'700'}
                lineHeight={'28px'}
                fontSize={'22px'}
                color={'#FFFFFF'}
                height="64px"
                width="100%"
              />
            </SplashCardButtonsWrapper>
          </SplashCardInfoBlock>
          {splashData.backgroundImage && (
            <SplashCardImage
              image={splashData.backgroundImage}
              imageMargin="4.79vw 4.23vw 4.16vw 1.38vw"
            />
          )}
        </SplashPageCardWrapper>
        <div className="container-about-conference">
          <h2>About the Conference</h2>
          <div className="about-conference-description">
            The IRS is spending $80 billion dollars to find your crypto.
            <br />
            You need to<span> protect yourself and your assets.</span>
          </div>
          <div className="block-paragragh-conference">
            Every American must now answer at the top of the 1040 “At any time
            during 2022, did you receive, sell, exchange, or otherwise dispose
            of any financial interest in any virtual currency?” IF you lie (and
            the IRS can see the Blockchain)- it’s Perjury and Jail time!
          </div>
          <div className="block-paragragh-conference">
            YOU MUST take this seriously and learn the strategies to educate
            and/or find a better accountant.
          </div>
          <div className="block-paragragh-conference">
            Do you know the best tax reporting strategy? Do you have a strategy
            at all?
          </div>
          <div className="block-paragragh-conference">
            Join Mark J. Kohler as he hosts the first ever, end of year crypto
            tax strategy livestream on December 8th, 2022.
          </div>
          <div className="about-conference-description">SCHEDULE</div>
          <div className="about-conference-container-list-mobile">
            <ul>
              <li>11am – 11:15</li>
              <li>Welcome</li>
            </ul>
            <ul>
              <li>11:15 – 12:00</li>
              <li>Trading Crypto Strategies: ST and LT Gains and Losses</li>
            </ul>
            <ul>
              <li>12:00 – 12:45</li>
              <li>Crypto Mining Income: The Trifecta and S-Corps</li>
            </ul>
            <ul>
              <li>12:45 – 1:00 BREAK</li>
            </ul>
            <ul>
              <li>1:00 – 1:45</li>
              <li>Staking and Defi: “The Illusion”</li>
            </ul>
            <ul>
              <li>1:45 – 2:15</li>
              <li>NFTs: Utility versus Collectables</li>
            </ul>
            <ul>
              <li>2:15 – 3:15 LUNCH</li>
            </ul>
            <ul>
              <li>3:15 – 4:00</li>
              <li>Crypto Strategies in Roth IRAs & 401ks</li>
            </ul>
            <ul>
              <li>4:00 – 4:45</li>
              <li>Charitable Remainder Trusts Unleashed</li>
            </ul>
            <ul>
              <li>4:45 – 5:00 BREAK</li>
            </ul>
            <ul>
              <li>5:00 – 5:30</li>
              <li>Virtual Real Estate Tax Strategies and Pitfalls to avoid</li>
            </ul>
            <ul>
              <li>5:30 – 6:00</li>
              <li>DAOs and Taxing Meta-Ventures</li>
            </ul>
            <ul>
              <li>6:00 – 7:00</li>
              <li>
                Bringing it all together with Asset Protection and General Q&A
              </li>
            </ul>
          </div>
          <div className="about-conference-description-list desktop">
            <div className="about-conference-container-list">
              <ul>
                <li>11am – 11:15</li>
                <li>11:15 – 12:00</li>
                <li>12:00 – 12:45</li>
              </ul>
              <ul>
                <li>Welcome</li>
                <li>Trading Crypto Strategies: ST and LT Gains and Losses</li>
                <li>Crypto Mining Income: The Trifecta and S-Corps</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>12:45 – 1:00 BREAK</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>1:00 – 1:45</li>
                <li>1:45 – 2:15</li>
              </ul>
              <ul>
                <li>Staking and Defi: “The Illusion”</li>
                <li>NFTs: Utility versus Collectables</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>2:15 – 3:15 LUNCH</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>3:15 – 4:00</li>
                <li>4:00 – 4:45</li>
              </ul>
              <ul>
                <li>Crypto Strategies in Roth IRAs & 401ks</li>
                <li>Charitable Remainder Trusts Unleashed</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>4:45 – 5:00 BREAK</li>
              </ul>
            </div>
            <div className="about-conference-container-list">
              <ul>
                <li>5:00 – 5:30</li>
                <li>5:30 – 6:00</li>
                <li>6:00 – 7:00</li>
              </ul>
              <ul>
                <li>
                  Virtual Real Estate Tax Strategies and Pitfalls to avoid
                </li>
                <li>DAOs and Taxing Meta-Ventures</li>
                <li>
                  Bringing it all together with Asset Protection and General Q&A
                </li>
              </ul>
            </div>
            <div className="about-conference-description end-summit">
              All times are in EAstern Standard
            </div>
          </div>
        </div>
        <div className="container-about-conference">
          <h2>How To Access</h2>
          <div className="container-about-conference-image">
            <div className="container-about-conference-image-text">
              <div className="block-paragragh-conference">
                To get access to this 6-hour livestream dedicated to educating
                you on the most cutting-edge tax strategy as it pertains to your
                Crypto, NFTs, and Metaverse assets, you must follow the steps in
                the GIF.
              </div>
              <div className="block-paragragh-conference">
                After completing the mint steps, you will gain exclusive access
                to the event NFT ticket sale before it goes public for a mint
                price of 0.27 ETH. Following this, the public mint price will be
                0.35 ETH.
              </div>
            </div>
            <>
              <img src={RairLogo_Koholertext} alt="Rair Logo Koholertext" />
            </>
          </div>

          <div className="block-paragragh-conference">
            These NFT tickets will provide you access to tune into the
            livestream, the NFT will allow you to view a recording of the
            livestream immediately following the conclusion of the livestream-
            until December 31st, 2022.
          </div>
          <div className="block-paragragh-conference">
            This gives you three weeks to reference the material and build your
            tax strategy yourself, or with your personal CPA. The livestream
            event will ONLY be accessible to those who actively hold the NFT
            ticket in their crypto wallet. Think of this NFT as your movie
            ticket or DVD that you get to take home after the movie!
          </div>
          <div className="block-paragragh-conference">
            For only 0.27 ETH
            <span>
              {' '}
              we guarantee that you will save money on your tax bill{' '}
            </span>
            and you will walk away from this educational experience feeling like
            you can own the tax game
          </div>

          <button className="btn-enter-summit">
            ENTER THE SUMMIT (COMING SOON)
          </button>
        </div>
        <div className="block-video-the-summit">
          <div className="container-title-of-video">
            <h2 className="splashpage-subtitle">HOLDERS only Content</h2>
            <button
              className="btn-help-the-summit"
              onClick={() => toggleCheckList()}>
              Need Help
            </button>
          </div>
          <VideoPlayerView
            productsFromOffer={productsFromOffer}
            primaryColor={primaryColor}
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            whatSplashPage={'genesis-font'}
          />
        </div>
        <TeamMeet
          arraySplash={'taxHacksSummit'}
          titleHeadFirst={'About'}
          teamArray={teamTaxHacksSummit}
          classNameGap={true}
        />
        <div className="gap-for-aboutus" />
        <NotCommercialTemplate
          primaryColor={primaryColor}
          NFTName={'#taxhackNFT'}
        />
      </div>
    </div>
  );
};

export default MarkKohler;
