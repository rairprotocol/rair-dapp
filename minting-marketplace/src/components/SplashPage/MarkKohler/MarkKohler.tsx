import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { teamTaxHacksSummit } from './AboutUsTeam';
import { AccessTextMarkKohler } from './InformationText';

import { RootState } from '../../../ducks';
import { ColorChoice } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import { metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
import MetaTags from '../../SeoTags/MetaTags';
import { MarkKohlerImage } from '../images/markKohler/markHohler';
import { TaxHacksDemoGif } from '../images/markKohler/markHohler';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import { ISplashPageProps, TMainContractType } from '../splashPage.types';
import { TSplashDataType } from '../splashPage.types';
import SplashPageCardWrapper from '../SplashPageConfig/CardBlock/CardBlockWrapper/SplashPageCardWrapper';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import SplashCardButtonsWrapper from '../SplashPageConfig/CardBlock/CardButtonWrapper/SplashCardButtonsWrapper';
import SplashCardImage from '../SplashPageConfig/CardBlock/CardImage/SplashCardImage';
import SplashCardInfoBlock from '../SplashPageConfig/CardBlock/CardInfoBlock/SplashCardInfoBlock';
import SplashCardText from '../SplashPageConfig/CardBlock/CardText/SplashCardText';
import CardParagraphText from '../SplashPageConfig/CardParagraphText/CardParagraphText';
import { hyperlink } from '../SplashPageConfig/utils/hyperLink';
import { handleReactSwal } from '../SplashPageConfig/utils/reactSwalModal';
import UnlockableVideosWrapper from '../SplashPageConfig/VideoBlock/UnlockableVideosWrapper/UnlockableVideosWrapper';
import SplashVideoWrapper from '../SplashPageConfig/VideoBlock/VideoBlockWrapper/SplashVideoWrapper';
import SplashVideoText from '../SplashPageConfig/VideoBlock/VideoText/SplashVideoText';
import SplashVideoTextBlock from '../SplashPageConfig/VideoBlock/VideoTextBlock/SplashVideoTextBlock';
import { useGetProducts } from '../splashPageProductsHook';
import ModalHelp from '../SplashPageTemplate/ModalHelp';
import TeamMeet from '../TeamMeet/TeamMeetList';

import KohlerFavicon from './assets/favicon.ico';

import './markKohler.css';

const mainContract: TMainContractType = {
  contractAddress: '0x711fe7fccdf84875c9bdf663c89b5f5f726a11d7',
  requiredBlockchain: '0x1',
  offerIndex: ['11']
};

// Code for test contracts
const testContract: TMainContractType = {
  contractAddress: '0xdf9067bee90a26f03b777c82213d0785638c23fc',
  requiredBlockchain: '0x5',
  offerIndex: ['126']
};

const contract = mainContract.contractAddress;
const blockchain = mainContract.requiredBlockchain;
const offerIndex = mainContract.offerIndex;

export const splashData: TSplashDataType = {
  title: 'TAX HACKS SUMMIT',
  description: (
    <>
      Thursday December <span className="nebulosa-font-style">8</span>
      th <span className="nebulosa-font-style">11</span>
      AM —<span className="nebulosa-font-style"> 7</span>
      PM ET <br /> An NFT Gated Event
    </>
  ),
  backgroundImage: MarkKohlerImage,
  button2: {
    buttonLabel: 'OpenSea',
    buttonAction: () =>
      hyperlink('https://opensea.io/collection/tax-hacks-summit')
  },
  purchaseButton: {
    buttonLabel: 'Mint for .27',
    img: metaMaskIcon,
    requiredBlockchain: blockchain,
    contractAddress: contract,
    offerIndex: offerIndex,
    customButtonClassName: 'mark-kohler-purchase-button',
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

  useEffect(() => {
    setSelectVideo(productsFromOffer[0]);
  }, [setSelectVideo, productsFromOffer]);

  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [carousel, setCarousel] = useState<boolean>(carousel_match.matches);
  /* UTILITIES FOR NFT PURCHASE */

  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);

  const primaryColor = useSelector<RootState, ColorChoice>(
    (store) => store.colorStore.primaryColor
  );
  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

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
        favicon: KohlerFavicon,
        faviconMobile: KohlerFavicon
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
                diamond={true}
              />
              <SplashCardButton
                className="card-button-mark-kohler"
                buttonLabel={splashData.button2?.buttonLabel}
                buttonAction={splashData.button2?.buttonAction}
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
            The IRS is spending $80 billion dollars to find your crypto!
            <br />
            <br />
            You need to<span> protect yourself and your assets!</span>
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
          <div className="about-conference-description schedule">SCHEDULE</div>
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
        <CardParagraphText
          fontFamilyTitle={'Nebulosa Black Display Stencil'}
          title={'How To Access'}
          arrayParagragh={AccessTextMarkKohler}
        />
        <SplashCardButtonsWrapper justifyContent={'center'} marginTop="50px">
          <SplashCardButton
            className="enter-summit-kohler"
            buttonAction={() => console.info('Enter the summit')}
            buttonLabel={'ENTER THE SUMMIT (COMING SOON)'}
          />
        </SplashCardButtonsWrapper>

        {/* Reusable Video Component */}
        {productsFromOffer.length !== 0 && (
          <SplashVideoWrapper>
            <SplashVideoTextBlock>
              <SplashVideoText
                className="video-text-kohler"
                text={'HOLDERS ONLY CONTENT'}
              />
              <SplashCardButton
                className="need-help-kohler"
                buttonAction={handleReactSwal}
                buttonLabel={'Need Help'}
              />
            </SplashVideoTextBlock>
            <UnlockableVideosWrapper
              selectVideo={selectVideo}
              setSelectVideo={setSelectVideo}
              productsFromOffer={productsFromOffer}
              openVideoplayer={openVideoplayer}
              setOpenVideoPlayer={setOpenVideoPlayer}
              handlePlayerClick={handlePlayerClick}
              primaryColor={primaryColor}
            />
          </SplashVideoWrapper>
        )}
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

{
  /* <div className="container-about-conference">
          <button className="btn-enter-summit">
            ENTER THE SUMMIT (COMING SOON)
          </button>
        </div> */
}
