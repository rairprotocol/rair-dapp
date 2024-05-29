import Swal from 'sweetalert2';

import PurchaseTokenButton from '../../components/common/PurchaseToken';
import {
  WallstreetA,
  WallstreetB,
  WallstreetC,
  WallstreetCounter,
  WallstreetD,
  WallstreetE,
  WallstreetF,
  WallstreetImg
} from '../../components/SplashPage/images/wallstreet80sclub/wallstreet80sclub';
import {
  TMainContractType,
  TSplashDataType
} from '../../components/SplashPage/splashPage.types';
import { discrodIconNoBorder, metaMaskIcon } from '../../images';
import { rFetch } from '../rFetch';

// default contract
export const mainContract: TMainContractType = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: ['0', '1']
};
// test contract
export const testContract: TMainContractType = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: ['52', '0']
};

export const contract =
  import.meta.env.VITE_TEST_CONTRACTS === 'true'
    ? testContract.contractAddress
    : mainContract.contractAddress;
export const blockchain =
  import.meta.env.VITE_TEST_CONTRACTS === 'true'
    ? testContract.requiredBlockchain
    : mainContract.requiredBlockchain;

export const splashData: TSplashDataType = {
  LicenseName: '#wallstreet80sclub',
  title: 'wallstreet80sclub',
  titleColor: '#000000',
  description: 'FREEMINT. ONLY 1987. EXCLUSIVE ALPHA. MINT NOW',
  carouselData: [
    {
      img: WallstreetA,
      description: 'SILIAN RAIL'
    },
    {
      img: WallstreetB,
      description: 'ROMAN TYPE'
    },
    {
      img: WallstreetC,
      description: 'GUERILAN SEMIBOLD'
    },
    {
      img: WallstreetD,
      description: 'AREAOL ROUND'
    },
    {
      img: WallstreetE,
      description: 'TASTEFUL THICKNESS'
    },
    {
      img: WallstreetF,
      description: 'RAISED LETTERING'
    }
  ],
  videoPlayerParams: {
    contract: contract,
    product: '0',
    blockchain: blockchain
  },
  buttonBackgroundHelp: 'rgb(90,27,3)',
  buttonBackgroundHelpText: 'NEED HELP',
  buttonLabel: 'freemint',
  customStyle: {
    background: 'rgb(89,25,8)'
  },
  backgroundImage: WallstreetImg,
  purchaseButton: {
    buttonComponent: PurchaseTokenButton,
    img: metaMaskIcon,
    ...(import.meta.env.VITE_TEST_CONTRACTS === 'true'
      ? testContract
      : mainContract),
    presaleMessage: '',
    customWrapperClassName: 'btn-submit-with-form',
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
  button2: {
    buttonTextColor: '#FFFFFF',
    buttonColor: '#000000',
    buttonLabel: 'Join our Discord',
    buttonImg: discrodIconNoBorder,
    buttonLink: 'https://discord.com/invite/y98EMXRsCE'
  },
  counterOverride: true,
  counterData: {
    titleColor: '#000000',
    title1: null,
    title2: 'YOUR TICKET TO THE BOARDROOM',
    backgroundImage: `url(${WallstreetCounter})`,
    btnColorIPFS: 'rgb(89,25,8)',
    nftCount: 1987,
    description: [
      `WE'RE BUYING`,
      '+ LUNCH WITH WARREN BUFFETT',
      '+ DOWNTOWN MANHATTAN LOFT SPACE',
      '+ TWO TICKETS TO PARADISE IN A RED TESTAROSSA',
      '\n',
      'SHARING EXCLUSIVE ALPHA',
      '+ STONKS',
      '+ CRYPTO',
      '+ PROTIPS'
    ]
  }
};
