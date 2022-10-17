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
import PurchaseTokenButton from '../common/PurchaseToken';
import UnlockableVideosSingleTokenPage from '../MockUpPage/NftList/NftData/UnlockableVideosSingleTokenPage';
import TeamMeet from '../SplashPage/TeamMeet/TeamMeetList';

import LogoCarousel from './components/LogoCarousel';
import { useGetProductsGeneral } from './hooks/getProductsHookGeneral';
import { IMainPage } from './types/mainpage.types';

import './MainPage_ConflictingGlobalStyles.css';
import styles from './MainPage.module.css';

/* GLOBAL VALUES */
const blockchain: BlockchainType = '0x38';
const contract = '0xb6163454da87e9f3fd63683c5d476f7d067f75a2';
const product = '1';
const offerIndexInMarketplace = [1];
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

  /* SHOW MORE BUTTONS */
  const [showMore0, setShowMore0] = useState(true);
  const [showMore1, setShowMore1] = useState(true);

  /* SCROLL TO VIEW */
  const hookMint = useRef(null);
  const hookStream = useRef(null);
  const hookDistribute = useRef(null);
  const hookApi = useRef(null);

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

  /* ABOUT ME OFFSET */
  const breakpoint_0 = window.matchMedia('(max-width: 900px)');
  const breakpoint_1 = window.matchMedia('(max-width: 700px)');
  const breakpoint_2 = window.matchMedia('(max-width: 450px)');
  const [breakpoint_0_match, setBreakpoint_0_match] = useState(false);
  const [breakpoint_1_match, setBreakpoint_1_match] = useState(false);
  const [breakpoint_2_match, setBreakpoint_2_match] = useState(false);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setBreakpoint_0_match(breakpoint_0.matches);
      setBreakpoint_1_match(breakpoint_1.matches);
      setBreakpoint_2_match(breakpoint_2.matches);
    });
    return () =>
      window.removeEventListener('resize', () => {
        setBreakpoint_0_match(breakpoint_0.matches);
        setBreakpoint_1_match(breakpoint_1.matches);
        setBreakpoint_2_match(breakpoint_2.matches);
      });
  }, [breakpoint_0.matches, breakpoint_1.matches, breakpoint_2.matches]);
  const [offset, setOffset] = useState(0);
  useEffect(() => {
    if (breakpoint_2_match) {
      setOffset(2100);
    } else if (breakpoint_1_match) {
      setOffset(3000);
    } else if (breakpoint_0_match) {
      setOffset(700);
    } else {
      setOffset(2400);
    }
  }, [breakpoint_0_match, breakpoint_1_match, breakpoint_2_match]);
  const [readMoreCount, setReadMoreCount] = useState(0);
  useEffect(() => {
    const r = document.querySelector(':root') as HTMLElement;
    if (readMoreCount) {
      const offsetNum = (offset / 12) * readMoreCount;
      const offsetStr = `${offsetNum}px`;
      r.style.setProperty('--readmore_offset', offsetStr);
    } else {
      r.style.setProperty('--readmore_offset', '0px');
    }
  }, [readMoreCount, offset]);

  return (
    <div className={styles.mainpage_wrapper}>
      <div className={styles.title}>
        <span className={styles.typography_2}>
          Powering next <br className={styles.title_break} /> generation
        </span>
        <span className={styles.typography_1}> NFTs</span>
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
        We help you navigate <br className={styles.navigate_title_break} /> NFT
        infrastructure
      </div>
      <div className={styles.navigate_description}>
        NFT Creation | Encrypted Streaming | Data Collection | Distribution{' '}
        <br />
        All-in-one platform
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
      <div
        className={styles.navigate_tag}
        onClick={() => executeScroll(hookApi)}>
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
        <p>&#8226; Gas Optimized. Free mints. Upgradable JSONs</p>
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
      <button
        className={styles.showmore_button_0}
        onClick={() => {
          const r = document.querySelector(':root') as HTMLElement;
          if (showMore0) {
            r.style.setProperty('--demo_offset', '335vw');
            r.style.setProperty('--demo_display', 'block');
            setShowMore0(false);
          } else {
            r.style.setProperty('--demo_offset', '0vw');
            r.style.setProperty('--demo_display', 'none');
            setShowMore0(true);
          }
        }}>
        SHOW {showMore0 ? 'MORE' : 'LESS'}
      </button>
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
      <div className={styles.hook_api} ref={hookApi}></div>
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
        <span className={styles.use_cases_subtitle}>
          RAIR provides Web3 streaming infrastructure for:{' '}
        </span>
      </div>
      <img className={styles.use_cases_item_image_0} src={MainPageImageA} />
      <div className={styles.use_cases_item_name_0}>Brand Engagement</div>
      <img className={styles.use_cases_item_image_1} src={MainPageImageB} />
      <div className={styles.use_cases_item_name_1}>Music & Podcasts</div>
      <img className={styles.use_cases_item_image_2} src={MainPageImageC} />
      <div className={styles.use_cases_item_name_2}>Media & Entertainment</div>
      <button
        className={styles.showmore_button_1}
        onClick={() => {
          const r = document.querySelector(':root') as HTMLElement;
          if (showMore1) {
            r.style.setProperty('--usecase_offset', '85vw');
            r.style.setProperty('--usecase_display', 'block');
            setShowMore1(false);
          } else {
            r.style.setProperty('--usecase_offset', '0vw');
            r.style.setProperty('--usecase_display', 'none');
            setShowMore1(true);
          }
        }}>
        SHOW {showMore1 ? 'MORE' : 'LESS'}
      </button>
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
        Incorporate our Web3 Streaming player:{' '}
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
        <div className="rairpage about-page--team">
          <TeamMeet arraySplash={'main-page'} />
        </div>
        <div className="rairpage about-page--team">
          <TeamMeet
            readMoreCount={readMoreCount}
            setReadMoreCount={setReadMoreCount}
            arraySplash={'rair-advisors'}
          />
        </div>
      </div>
    </div>
  );
};

export default MainPage;
