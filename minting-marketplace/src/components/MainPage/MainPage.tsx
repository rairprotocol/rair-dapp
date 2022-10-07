import { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
/* image imports */
import { metaMaskIcon } from '../../images/index';
import {
  MainPageImage1A,
  MainPageImage1B,
  MainPageImage2A,
  MainPageImage2B,
  MainPageImage3A,
  MainPageImage3B
} from '../../images/rair-website-webp/website-graphics/dark and light mode top icons/index';
import {
  MainPageImage0,
  MainPageImage4,
  MainPageImage5,
  MainPageImage6,
  MainPageImage7,
  MainPageImage8,
  MainPageImageA,
  MainPageImageB,
  MainPageImageC,
  MainPageImageD,
  MainPageImageE,
  MainPageImageF
} from '../../images/rair-website-webp/website-graphics/index';
import {
  MainPageLogoA,
  MainPageLogoB,
  MainPageLogoC,
  MainPageLogoD,
  MainPageLogoE,
  MainPageLogoF
} from '../../images/rair-website-webp/website-logos/index';
import { rFetch } from '../../utils/rFetch';
import PurchaseTokenButton from '../common/PurchaseToken';
import UnlockableVideosSingleTokenPage from '../MockUpPage/NftList/NftData/UnlockableVideosSingleTokenPage';
import TeamMeet from '../SplashPage/TeamMeet/TeamMeetList';

import LogoCarousel from './components/LogoCarousel';
import { useGetProductsGeneral } from './hooks/getProductsHookGeneral';
import { IMainPage } from './types/mainpage.types';

import './MainPage_ConflictingGlobalStyles.css';
import styles from './MainPage.module.css';

/* GLOBAL VALUES */
const blockchain: BlockchainType = '0x61';
const contract = '0x9b8ba2fbbe55a0c4e0ff4a56eb3b4fdb9920396b';
const product = '0';
const offerIndexInMarketplace = [0, 4];
const iframeLink =
  'https://iframetester.com/?url=https://staging.rair.market/watch/0x48e89cb354a30d4ce0dafac77205792040ef485f/FaR4Z7kLDOZ87Rx1UU6CaLce_bip0X7vnrPjBu2t3APd9s/stream.m3u8';

const MainPage: React.FC<IMainPage> = ({
  loginDone,
  connectUserData,
  setIsSplashPage,
  seoInformation
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  /* SCROLL TO VIEW */
  const hookMint = useRef(null);
  const hookStream = useRef(null);
  const hookDistribute = useRef(null);

  const executeScroll = (ref) => ref.current.scrollIntoView();

  /*VIDEO PLAYER VIEW*/
  const [productsFromOffer, selectVideo, setSelectVideo] =
    useGetProductsGeneral({ blockchain, contract, product });
  const [openVideoplayer, setOpenVideoPlayer] = useState<boolean>(false);
  const handlePlayerClick = () => {
    setOpenVideoPlayer(true);
  };

  /*TURN OFF SEARCH BAR */
  useEffect(() => {
    setIsSplashPage?.(true);
  }, [setIsSplashPage]);

  return (
    <div className={styles.mainpage_wrapper}>
      <div className={styles.title}>
        <span className={styles.typography_0}>A Platform for next</span>
        <span className={styles.typography_1}> generation</span>
        <span className={styles.typography_2}> nFTs</span>
      </div>
      <img className={styles.graphic} src={MainPageImage0} />
      <PurchaseTokenButton
        {...{
          customStyle: {},
          customWrapperClassName: '',
          altButtonFormat: true,
          customButtonClassName: styles.button,
          customButtonIconClassName: styles.button_icon,
          customButtonTextClassName: styles.button_text,
          img: metaMaskIcon,
          contractAddress: contract,
          requiredBlockchain: blockchain,
          offerIndex: offerIndexInMarketplace,
          connectUserData,
          buttonLabel: 'Test our Streaming',
          presaleMessage: '',
          diamond: true,
          customSuccessAction: (nextToken) =>
            Swal.fire('Success', `You own token #${nextToken}!`, 'success')
        }}
      />
      <div className={styles.subtitle}>
        Minting Engine | Encrypted Streams | Marketplace
      </div>
      <div className={styles.logo_carousel}>
        <LogoCarousel
          logos={[
            MainPageLogoA,
            MainPageLogoB,
            MainPageLogoC,
            MainPageLogoD,
            MainPageLogoE,
            MainPageLogoF
          ]}
        />
      </div>
      <div className={styles.navigate_title}>
        We help you navigate NFT infrastructure
      </div>
      <div className={styles.navigate_description}>
        NFT Creation. Encrypted Streaming. Data Collection. Distribution. <br />{' '}
        All in one platform.
      </div>
      <div className={styles.navigate_wrapper}>
        <img
          src={primaryColor === 'rhyno' ? MainPageImage1B : MainPageImage1A}
          className={styles.navigate_item_zero}
          onClick={() => executeScroll(hookMint)}
        />
        <img
          src={primaryColor === 'rhyno' ? MainPageImage2B : MainPageImage2A}
          className={styles.navigate_item_one}
          onClick={() => executeScroll(hookStream)}
        />
        <img
          src={primaryColor === 'rhyno' ? MainPageImage3B : MainPageImage3A}
          className={styles.navigate_item_two}
          onClick={() => executeScroll(hookDistribute)}
        />
      </div>
      <div className={styles.navigate_tag}>
        {' '}
        RAIR API AVAILABLE FOR ALL SERVICES{' '}
      </div>
      <div className={styles.hook_mint} ref={hookMint} />
      <img className={styles.demonstration_img_0} src={MainPageImage4} />
      <div className={styles.demonstration_title_0}>
        RAIR
        <span className={styles.demonstration_title_alt_0}>mint</span>
      </div>
      <div className={styles.demonstration_subtitle_0}>
        Industry leading NFT minting engine
      </div>
      <br />
      <div className={styles.demonstration_description_0}>
        <br />
        <p>
          &#8226; Mint on an EVM compatible blockchain. ETH, MATIC, BSC &#38;
          EVM integrations
        </p>
        <p>&#8226; Gas Optimized. Free mints, Shareable JSONs</p>
        <p>
          &#8226; Prevent Sudoswap attacks. RAIRpay royalty engine protects
          resales
        </p>
      </div>
      <div className={styles.hook_stream} ref={hookStream}></div>
      <img className={styles.demonstration_img_1} src={MainPageImage5} />
      <div className={styles.demonstration_title_1}>
        RAIR
        <span className={styles.demonstration_title_alt_0}>stream</span>
      </div>
      <div className={styles.demonstration_subtitle_1}>
        Patent-pending streaming engine. Securely stream via NFT
      </div>
      <br />
      <div className={styles.demonstration_description_1}>
        <p>&#8226; Multimedia streaming video/music/data</p>
        <p>&#8226; Capture wallet analytics </p>
        <p>&#8226; Wallet authenticated access</p>
      </div>
      <img className={styles.demonstration_img_2} src={MainPageImage6} />
      <div className={styles.demonstration_title_2}>
        RAIR
        <span className={styles.demonstration_title_alt_0}>player</span>
      </div>
      <div className={styles.demonstration_subtitle_2}>
        Upgrade any website to Web3 streaming
      </div>
      <br />
      <div className={styles.demonstration_description_2}>
        <p>&#8226; Embeddable </p>
        <p>&#8226; No Web3 integration required </p>
        <p>&#8226; Collect analytics</p>
        <p> &#8226; Make sales directly via player</p>
      </div>
      <div className={styles.hook_distribute} ref={hookDistribute}></div>
      <img className={styles.demonstration_img_3} src={MainPageImage7} />
      <div className={styles.demonstration_title_3}>
        RAIR
        <span className={styles.demonstration_title_alt_0}>market</span>
      </div>
      <div className={styles.demonstration_subtitle_3}>
        Deploy your own NFT marketplace. <br /> Sell unlockable content
      </div>
      <br />
      <div className={styles.demonstration_description_3}>
        <p>&#8226; Sell any 0x NFT, secure royalties </p>
        <p>&#8226; Minting sales pages</p>
        <p>&#8226; Attach unlockable content</p>
      </div>
      <img className={styles.demonstration_img_4} src={MainPageImage8} />
      <div className={styles.demonstration_title_4}>
        RAIR
        <span className={styles.demonstration_title_alt_0}>API</span>
      </div>
      <div className={styles.demonstration_subtitle_4}>
        All services available via API
      </div>
      <br />
      <div className={styles.demonstration_description_4}>
        <p>&#8226; Endpoints for minting </p>
        <p> &#8226; Scraping blockchain & analytics</p>
        <p> &#8226; Uploading & managing content</p>
      </div>
      <div className={styles.use_cases_textbox}>
        <span>Use</span>
        <span className={styles.use_cases_title_alt}> Cases</span>
        <br />
        <br />
        <span>RAIR provides Web3 streaming infrastructure for: </span>
      </div>
      <img className={styles.use_cases_item_image_0} src={MainPageImageA} />
      <div className={styles.use_cases_item_name_0}>Brand Engagement</div>
      <img className={styles.use_cases_item_image_1} src={MainPageImageB} />
      <div className={styles.use_cases_item_name_1}>Music & Podcasts</div>
      <img className={styles.use_cases_item_image_2} src={MainPageImageC} />
      <div className={styles.use_cases_item_name_2}>Media & Entertainment</div>
      <img className={styles.use_cases_item_image_3} src={MainPageImageD} />
      <div className={styles.use_cases_item_name_3}>Live Events</div>
      <img className={styles.use_cases_item_image_4} src={MainPageImageE} />
      <div className={styles.use_cases_item_name_4}>E-Learning</div>
      <img className={styles.use_cases_item_image_5} src={MainPageImageF} />
      <div className={styles.use_cases_item_name_5}>Gaming</div>
      <div className={styles.videoplayer_textbox}>
        <span>Test our</span>
        <span className={styles.videoplayer_title_alt}> Player</span>
      </div>
      <div className="rairpage-videoplayer-wrapper">
        <div
          className="nft-collection nft-collection-video-wrapper"
          style={{
            backgroundColor: `${
              primaryColor === 'rhyno' ? 'var(--rhyno-40)' : '#383637'
            }`
          }}>
          <UnlockableVideosSingleTokenPage
            selectVideo={selectVideo}
            setSelectVideo={setSelectVideo}
            productsFromOffer={productsFromOffer}
            openVideoplayer={openVideoplayer}
            setOpenVideoPlayer={setOpenVideoPlayer}
            handlePlayerClick={handlePlayerClick}
            primaryColor={primaryColor}
          />
        </div>
      </div>
      <div className={styles.embeddeddemo_textbox}>
        <span>Embed this</span>
        <span className={styles.embeddeddemo_title_alt}> code</span>
      </div>
      <div className={styles.embeddeddemo_description}>
        Incorporate our Web 3 Streaming player into your existing Web2 site{' '}
      </div>
      <div className={styles.embeddeddemo}>
        <div
          onClick={() => {
            navigator.clipboard.writeText(iframeLink);
          }}
          className={styles.embeddeddemo_button}>
          {' '}
          COPY TO CLIPBOARD{' '}
        </div>
      </div>
      <div className={styles.meet_team_wrapper}>
        <div className="about-page--team">
          <TeamMeet arraySplash={'rair'} />
        </div>
        <div className="about-page--team">
          <TeamMeet arraySplash={'rair-advisors'} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
