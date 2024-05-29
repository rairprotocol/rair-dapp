/* eslint-disable react/no-unescaped-entities */
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

import { teamNutArray } from './AboutUsTeam';

import { erc721Abi } from '../../../contracts/index';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { setRealChain } from '../../../ducks/contracts/actions';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import { setInfoSEO } from '../../../ducks/seo/actions';
import { InitialState } from '../../../ducks/seo/reducers';
import { TInfoSeo } from '../../../ducks/seo/seo.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import { metaMaskIcon } from '../../../images';
import { rFetch } from '../../../utils/rFetch';
import PurchaseTokenButton from '../../common/PurchaseToken';
import { ImageLazy } from '../../MockUpPage/ImageLazy/ImageLazy';
import MetaTags from '../../SeoTags/MetaTags';
import ExclusiveNft from '../ExclusiveNft/ExclusiveNft';
import { NutsMain } from '../images/commingSoon/commingSoonImages';
import {
  Cracker,
  Nft_1,
  Nft_2,
  Nft_3,
  Nft_4,
  NftImage
} from '../images/nutcrackers/nutcrackers';
import { PoweredRair } from '../images/splashPageImages/splashPage';
// import photoNut from '../images/block-nuts-photos.png';
import TeamMeet from '../TeamMeet/TeamMeetList';

const Nutcrackers = ({ connectUserData, setIsSplashPage }) => {
  const dispatch = useDispatch();
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const [, /*percentTokens*/ setPresentTokens] = useState(0);
  const seo = useSelector<RootState, TInfoSeo>((store) => store.seoStore);
  const leftTokensNumber = 50;
  const wholeTokens = 50;
  const { currentUserAddress, minterInstance, contractCreator } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  const reactSwal = useSwal();
  const { web3TxHandler, web3Switch, correctBlockchain } = useWeb3Tx();

  useEffect(() => {
    dispatch(setInfoSEO(InitialState));
    //eslint-disable-next-line
  }, []);

  const targetBlockchain = '0x89';
  const nutcrackerAddress =
    '0xF4ca90d4a796f57133c6de47c2261BF237cfF780'.toLowerCase();
  const mintNutcracker = async () => {
    if (!currentUserAddress) {
      connectUserData();
      return;
    }

    if (correctBlockchain(targetBlockchain)) {
      web3Switch(targetBlockchain);
      return;
    }

    const { success, products } = await rFetch(
      `/api/contracts/network/0x89/${nutcrackerAddress}/offers`
    );
    if (success && contractCreator && minterInstance) {
      const instance = contractCreator(nutcrackerAddress, erc721Abi);
      if (!instance) {
        return;
      }
      const nextToken = await instance.getNextSequentialIndex(0, 0, 50);
      reactSwal.fire({
        title: 'Please wait...',
        html: `Buying Nutcracker #${nextToken.toString()}`,
        icon: 'info',
        showConfirmButton: false
      });
      const [nutsOffer] = products[0].offers.filter(
        (item) => item.offerName === 'Nuts'
      );
      if (!nutsOffer) {
        reactSwal.fire('Error', 'An error has ocurred', 'error');
        return;
      }
      if (
        await web3TxHandler(
          minterInstance,
          'buyToken',
          [
            products[0].offerPool.marketplaceCatalogIndex,
            nutsOffer.offerIndex,
            nextToken,
            {
              value: nutsOffer.price
            }
          ],
          {
            intendedBlockchain: targetBlockchain,
            failureMessage:
              'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
          }
        )
      ) {
        reactSwal.fire('Success', `Bought token #${nextToken}!`, 'success');
      }
    }
  };

  useEffect(() => {
    dispatch(setRealChain('0x89'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (leftTokensNumber <= wholeTokens) {
      const percentLeft = (leftTokensNumber * 100) / wholeTokens;
      if (percentLeft > 1) {
        setPresentTokens(Math.floor(percentLeft));
      } else if (percentLeft > 990) {
        setPresentTokens(Math.floor(percentLeft));
      } else {
        setPresentTokens(Math.ceil(percentLeft));
      }
    }
    if (leftTokensNumber > wholeTokens) {
      setPresentTokens(100);
    }
  }, [setPresentTokens, leftTokensNumber, wholeTokens]);

  useEffect(() => {
    setIsSplashPage(true);
  }, [setIsSplashPage]);

  return (
    <div className="wrapper-splash-page nutcrackers">
      <MetaTags seoMetaTags={seo} />
      <div className="home-splash--page">
        <div className="information-author nutcrackers">
          <div className="block-splash">
            <ImageLazy
              className="nut-block-img"
              src={NutsMain}
              alt="Nutcrackers"
            />
            <div className="text-splash">
              <div className="title-splash nipsey">
                <h3>Introducing</h3>
                <span>The Nut Cranksy</span>
              </div>
              <div className="text-description">
                <div>
                  50 Unique NFTs unlock holiday cheer. Mint yours for 50 MATIC
                </div>
              </div>

              <PurchaseTokenButton
                {...{
                  customWrapperClassName: 'btn-buy-metamask',
                  img: metaMaskIcon,
                  contractAddress: nutcrackerAddress,
                  diamond: false,
                  requiredBlockchain: '0x89',
                  offerIndex: ['1', '0'],
                  connectUserData,
                  buttonLabel: 'Mint with Matic',
                  customSuccessAction: (nextToken) => {
                    reactSwal.fire(
                      'Success',
                      `Bought token #${nextToken}!`,
                      'success'
                    );
                  }
                }}
              />

              {false && (
                <div className="btn-buy-metamask">
                  <button onClick={mintNutcracker}>
                    <img
                      className="metamask-logo"
                      src={metaMaskIcon}
                      alt="metamask-logo"
                    />{' '}
                    Mint with Matic
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="left-tokens">
          <div className="block-left-tokens">
            <div
              className="progress-tokens"
              style={{
                background: `${
                  primaryColor === 'rhyno'
                    ? 'rgba(34, 32, 33, 0.4)'
                    : 'rgba(34, 32, 33, 0.6)'
                }`
              }}>
              <div className="title-progress-left">NFTs remaining</div>
              <Box className="box-progress" sx={{ position: 'relative' }}>
                <CircularProgress
                  className="progress-grey"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.grey[
                        theme.palette.mode === 'light' ? 200 : 800
                      ]
                  }}
                  size={40}
                  thickness={1.5}
                  value={100}
                />
                <CircularProgress
                  className="progress-main"
                  variant="determinate"
                  sx={{
                    color: (theme) =>
                      theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8',
                    position: 'absolute',
                    left: 0
                  }}
                  size={40}
                  thickness={4}
                  value={100}
                />
              </Box>
              <div
                className="text-progress"
                style={{ fontSize: `${leftTokensNumber === 50 && '32px'}` }}>
                <div className="progress-info">
                  <div className="text-numbers">
                    <div className="text-left-tokens text-gradient">
                      {leftTokensNumber}
                    </div>
                    <div className="text-whole-tokens"> / {wholeTokens}</div>
                  </div>
                  <div>left</div>
                </div>
              </div>
            </div>
          </div>
          <div className="left-tokens-content nutcrackers">
            <div className="title-tokens">
              <h3>
                <span className="text-gradient">The Nut</span> Cranksy
              </h3>
            </div>
            <div className="tokens-description">
              <p
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                What at first glance seems to be a motionless object, the true
                symbol of our childlike imaginations, comes to life after each
                set. Nut Cranksy, a self-proclaimed, "selfie expert" living
                among the props in a Florida theater, watches and dreams into
                existence the next thrilling character- until it's time for the
                next big debut of course.
              </p>

              <p
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                A large prop used for the classicly famous holiday Broadway hit,
                The Nutcracker, Nut Cranksy sees the fun and adventure within
                the everyday shows. The Nut Cransky is intrigued by the set, the
                costumes, the characters.. all of it! Watching the shows come
                and go throughout the years, Nut Cranksy morphs into the many
                characters and comes to life —you'll never guess what eccentric
                costume is next!
              </p>
            </div>
          </div>
        </div>
        <div className="crackers-text">
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            Nut Cranksy takes on historic and present-day theater personalities;
            set creators, musicians, crew handlers, directors, caterers,
            lighting engineers, and even the guests, who come from all walks of
            life to watch the off and on Broadway productions.
          </p>
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            The Nut Cranksy is the master conductor of fun, with flashes of
            rascal in-between! There is no boredom in between sets, just
            creativity and a mastermind jack of all trades or should we say,
            costume connoisseur.
          </p>
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            Witness the expressions, the many moods, the eclectic colorful
            displays of emotions, as Nut Cranksy mimics, solo, through an
            orchestra of song and dance performances!
          </p>
          <p
            style={{
              color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
            }}>
            Watch The Nut Cranksy come to life behind the scenes at a Broadway
            theater! Are you ready to get your backstage peak to unleash your
            inner Nut Cranksy?
          </p>
        </div>
        <ExclusiveNft
          amountTokens={50}
          Nft_1={Nft_1}
          Nft_2={Nft_2}
          Nft_3={Nft_3}
          Nft_4={Nft_4}
          NftImage={NftImage}
          linkComing={'/coming-soon-nutcrackers'}
        />
        <div className="join-community">
          <div className="title-join">
            <h3>
              <span className="text-gradient">Nut Cranksy</span> Specs
            </h3>
          </div>
          <div
            className="community-description"
            style={{
              background: `${primaryColor === 'rhyno' ? '#fff' : '#383637'}`
            }}>
            <div className="community-text">
              <p
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                In this series, each Nut Cranksy is unique and custom
                illustrated from over 6 or more possible traits, including
                facial hair, mustashe, hat, a prop, eye color, clothing and
                more. Our Nut Cranksy’s truely unique and illustrative and some
                will connect with you more than others.
              </p>
              <p
                style={{
                  color: `${primaryColor === 'rhyno' ? '#000' : '#A7A6A6'}`
                }}>
                Each Nut Cranksy is stored as an ERC-721 token on the MATIC
                blockchain. This gives your Cranksy provenance while also being
                good for the environment so the North Pole doesn’t melt too
                fast.
              </p>
            </div>
            <div className="join-pic">
              <ImageLazy src={Cracker} alt="Cracker" />
            </div>
          </div>
        </div>
        <div className="block-photos-nuts"></div>
        <TeamMeet
          arraySplash={'nuts'}
          classNameGap={true}
          teamArray={teamNutArray}
        />
        <div className="powered-by-rair">
          <img src={PoweredRair} alt="Powered by Rair tech" />
        </div>
      </div>
    </div>
  );
};

export default Nutcrackers;
