import { useSelector } from 'react-redux';

import { NFTNYC_TITLE } from '../../components/SplashPage/images/NFTNYC/nftnyc';
import { TSplashDataType } from '../../components/SplashPage/splashPage.types';
import { hyperlink } from '../../components/SplashPage/SplashPageConfig/utils/hyperLink';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { metaMaskIcon } from '../../images';

export const useNFTNYC = (connectUserData) => {
  const { currentUserAddress } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const splashData: TSplashDataType = {
    NFTName: 'NFT',
    title: 'NFTNYC X RAIR',
    titleColor: '#F15621',
    description:
      'Connect your wallet to receive a free airdrop. Unlock exclusive encrypted streams',
    videoPlayerParams: {
      blockchain: '0x89',
      contract: '0xb41660b91c8ebc19ffe345726764d4469a4ab9f8',
      product: '0'
    },
    purchaseButton: {
      requiredBlockchain: '0x89',
      contractAddress: '0xb41660b91c8ebc19ffe345726764d4469a4ab9f8'
    },
    /*  this block needs to be changed */
    buttonLabel: 'Connect Wallet',
    buttonBackgroundHelp: 'rgb(3, 91, 188)',
    backgroundImage: NFTNYC_TITLE,
    button1: currentUserAddress
      ? {
          buttonColor: '#F15621',
          buttonLabel: 'Connect wallet',
          buttonImg: metaMaskIcon,
          buttonAction: connectUserData
        }
      : {},
    button2: {
      buttonColor: '#000000',
      buttonLabel: 'View on Opensea',
      buttonImg: null,
      buttonAction: () => hyperlink('https://opensea.io/collection/swagnftnyc')
    },
    exclusiveNft: {
      title: 'NFTs',
      titleColor: 'rgb(3, 91, 188)'
    },
    videoData: {
      video: null,
      videoTitle: '',
      videoModuleDescription:
        'NFT owners can learn more about the project by signing with metamask to unlock an encrypted stream ',
      videoModuleTitle: 'Exclusive 1: Degen Toonz Cartoon',
      demo: true
    }
  };

  return { splashData };
};
