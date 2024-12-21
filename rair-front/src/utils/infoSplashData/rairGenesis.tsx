//@ts-nocheck
import { Hex } from 'viem';

import { Genesis_TV } from '../../components/SplashPage/images/rairGenesis/rairGenesis';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { metaMaskIcon } from '../../images';

export const useSplashData = (connectUserData) => {
  const { currentUserAddress } = useAppSelector((store) => store.web3);

  const splashData = {
    NFTName: 'Genesis Pass artwork',
    title: 'RAIR Genesis Pass',
    titleColor: '#000000',
    description: 'The future of streaming. 222 spots. 222m RAIR tokens',
    textDescriptionCustomStyles: connectUserData
      ? { paddingTop: '3vw' }
      : undefined,
    videoPlayerParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73' as Hex,
      product: '0',
      blockchain: '0x5' as Hex
    },
    marketplaceDemoParams: {
      contract: '0x09926100eeab8ca2d636d0d77d1ccef323631a73' as Hex,
      product: '0',
      blockchain: '0x5' as Hex
    },
    purchaseButton: {
      requiredBlockchain: '0x38' as Hex,
      contractAddress: '0x03041d4fd727eae0337529e11287f6b499d48a4f' as Hex
    },
    /*  this block needs to be changed */
    buttonLabel: 'Connect Wallet',
    buttonBackgroundHelp: 'rgb(3, 91, 188)',
    backgroundImage: Genesis_TV,
    button1:
      currentUserAddress === undefined
        ? {
            buttonLabel: 'Connect wallet',
            buttonImg: metaMaskIcon,
            buttonAction: connectUserData
          }
        : undefined,
    button2: {
      buttonMarginTop: currentUserAddress === undefined ? '0' : '2vw',
      buttonMarginBottom: currentUserAddress === undefined ? '0' : '6vw',
      buttonBorder: '3px solid #77B9F3',
      buttonTextColor: '#000000',
      buttonColor: '#FFFFFF',
      buttonLabel: 'View on Opensea',
      buttonImg: null,
      buttonLink: 'https://opensea.io/collection/swagnftnyc'
    },
    exclusiveNft: {
      title: 'NFTs',
      titleColor: 'rgb(3, 91, 188)'
    }
  };

  return {
    splashData
  };
};
