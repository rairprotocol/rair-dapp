import { FC, useEffect, useState } from 'react';

import { teamTaxHacksSummit } from './AboutUsTeam';
import { AccessTextMarkKohler } from './InformationText';

import useConnectUser from '../../../hooks/useConnectUser';
import { useOpenVideoPlayer } from '../../../hooks/useOpenVideoPlayer';
import { useAppDispatch, useAppSelector } from '../../../hooks/useReduxHooks';
import useSwal from '../../../hooks/useSwal';
import { setSEOInfo } from '../../../redux/seoSlice';
import { setRequestedChain } from '../../../redux/web3Slice';
import { SplashPageProps } from '../../../types/commonTypes';
import {
  blockchain,
  contract,
  splashData
} from '../../../utils/infoSplashData/markKohler';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
import MetaTags from '../../SeoTags/MetaTags';
import NotCommercialTemplate from '../NotCommercial/NotCommercialTemplate';
import SplashPageCardWrapper from '../SplashPageConfig/CardBlock/CardBlockWrapper/SplashPageCardWrapper';
import SplashCardButton from '../SplashPageConfig/CardBlock/CardButton/SplashCardButton';
import SplashCardButtonsWrapper from '../SplashPageConfig/CardBlock/CardButtonWrapper/SplashCardButtonsWrapper';
import SplashCardImage from '../SplashPageConfig/CardBlock/CardImage/SplashCardImage';
import SplashCardInfoBlock from '../SplashPageConfig/CardBlock/CardInfoBlock/SplashCardInfoBlock';
import SplashCardText from '../SplashPageConfig/CardBlock/CardText/SplashCardText';
import CardParagraphText from '../SplashPageConfig/CardParagraphText/CardParagraphText';
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

const MarkKohler: FC<SplashPageProps> = ({ setIsSplashPage }) => {
  const dispatch = useAppDispatch();
  const seo = useAppSelector((store) => store.seo);

  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProducts(splashData);

  useEffect(() => {
    setSelectVideo(productsFromOffer[0]);
  }, [setSelectVideo, productsFromOffer]);

  const carousel_match = window.matchMedia('(min-width: 900px)');
  const [, /*carousel*/ setCarousel] = useState<boolean>(
    carousel_match.matches
  );
  /* UTILITIES FOR NFT PURCHASE */

  const { connectUserData } = useConnectUser();
  const { isLoggedIn } = useAppSelector((store) => store.user);

  const rSwal = useSwal();

  const [openCheckList, setOpenCheckList] = useState<boolean>(false);
  const [purchaseList, setPurchaseList] = useState<boolean>(true);
  const [hasNFT, setHasNFT] = useState<boolean>();
  const [meetingInvite, setMeetingInvite] = useState<string>();

  if (splashData?.purchaseButton?.customSuccessAction) {
    splashData.purchaseButton.customSuccessAction = async (nextToken) => {
      const tokenMetadata = await rFetch(
        `/api/nft/network/${blockchain}/${contract}/0/token/${nextToken}`
      );
      if (tokenMetadata.success && tokenMetadata?.result?.metadata?.image) {
        rSwal.fire({
          imageUrl: tokenMetadata.result.metadata.image,
          imageHeight: 'auto',
          imageWidth: '65%',
          imageAlt: "Your NFT's image",
          title: `You own #${nextToken}!`,
          icon: 'success'
        });
      } else {
        rSwal.fire('Success', `Bought token #${nextToken}`, 'success');
      }
      setHasNFT(undefined);
    };
  }

  const [openVideoplayer, setOpenVideoPlayer, handlePlayerClick] =
    useOpenVideoPlayer();

  const joinZoom = () => {
    if (meetingInvite) {
      window.open(meetingInvite, '_blank');
    }
  };

  const unlockZoom = async () => {
    try {
      const unlockResponse = await rFetch('/api/auth/unlock/', {
        method: 'POST',
        body: JSON.stringify({
          type: 'zoom',
          fileId: 'Kohler'
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (unlockResponse.data.success) {
        setHasNFT(true);
        setMeetingInvite(unlockResponse?.data?.invite?.join_url);
      }
    } catch (requestError) {
      rSwal.fire('NFT Required to unlock this meeting', '', 'info');
      setHasNFT(false);
    }
  };

  useEffect(() => {
    dispatch(
      setSEOInfo({
        title: '#Mark Kohler',
        ogTitle: '#Mark Kohler',
        twitterTitle: '#Mark Kohler',
        contentName: 'author',
        content: '#Mark Kohler',
        description: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        ogDescription: 'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        twitterDescription:
          'THURSDAY DECEMBER 8TH 10AM-6PM ET AN NFT GATED EVENT',
        image: `${
          import.meta.env.VITE_IPFS_GATEWAY
        }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`,
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
    dispatch(setRequestedChain('0x5'));
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
        <SplashCardText
          color="#DF76DF"
          fontSize="3vw"
          fontWeight={400}
          text={'SIGN WITH WALLET TO JOIN ZOOM'}
          fontFamily={'Nebulosa Black Display Stencil'}
          lineHeight={'113.7%'}
          textAlign="center"
          marginBottom="2vw"
          padding="50px 0 0 0"
          mediafontSize="4.5vw"
        />
        <SplashPageCardWrapper height="80px">
          <SplashCardButtonsWrapper
            marginTop={'10px !important'}
            height="148px"
            width="335px"
            gap="20px"
            flexDirection="column"
            margin="auto">
            {hasNFT !== undefined && !hasNFT ? (
              <PurchaseTokenButton
                {...splashData.purchaseButton}
                buttonLabel="PURCHASE"
                diamond={true}
                customButtonClassName="mark-kohler-purchase-button-black"
              />
            ) : (
              <SplashCardButton
                className="card-button-mark-kohler"
                buttonImg={splashData.button3?.buttonImg || ''}
                buttonLabel={
                  !isLoggedIn
                    ? splashData.button3?.buttonLabel
                    : hasNFT
                      ? 'Join Zoom'
                      : 'Unlock Meeting'
                }
                buttonAction={
                  isLoggedIn
                    ? hasNFT
                      ? joinZoom
                      : unlockZoom
                    : () => connectUserData()
                }
              />
            )}
          </SplashCardButtonsWrapper>
        </SplashPageCardWrapper>
        <br />
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
                {...splashData.purchaseButton}
                customButtonClassName="mark-kohler-purchase-button"
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
        {/* {productsFromOffer.length !== 0 && ( */}
        <SplashVideoWrapper>
          <SplashVideoTextBlock>
            <SplashVideoText
              className="video-text-kohler"
              text={'HOLDERS ONLY CONTENT'}
            />
            <SplashCardButton
              className="need-help-kohler"
              buttonAction={handleReactSwal(rSwal)}
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
          />
        </SplashVideoWrapper>
        {/* )} */}
        <TeamMeet
          arraySplash={'taxHacksSummit'}
          titleHeadFirst={'About'}
          teamArray={teamTaxHacksSummit}
          classNameGap={true}
        />
        <div className="gap-for-aboutus" />
        <NotCommercialTemplate NFTName={'#taxhackNFT'} />
      </div>
    </div>
  );
};

export default MarkKohler;
