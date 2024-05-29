import Swal from 'sweetalert2';

import PurchaseTokenButton from '../../components/common/PurchaseToken';
import {
  nftCountUkraine,
  UKR_rounded,
  UKR126,
  UKR497,
  UKR1294
} from '../../components/SplashPage/images/UkraineGlitch/urkaineGlitch';
import {
  TMainContractType,
  TSplashDataType
} from '../../components/SplashPage/splashPage.types';
import { discrodIconNoBorder, metaMaskIcon } from '../../images';
import { rFetch } from '../rFetch';

// This will be the default contract used in this splash page
const mainContract: TMainContractType = {
  contractAddress: '0xbd034e188f35d920cf5dedfb66f24dcdd90d7804',
  requiredBlockchain: '0x1',
  offerIndex: ['0', '1']
};
// By setting VITE_TEST_CONTRACTS
const testContract: TMainContractType = {
  contractAddress: '0x971ee6dd633cb6d8cc18e5d27000b7dde30d8009',
  requiredBlockchain: '0x5',
  offerIndex: ['52', '0']
};

export const splashData: TSplashDataType = {
  title: '#UkraineGlitch',
  titleColor: '#FFD505',
  description:
    '1991 generative pixelated glitch art pieces represent pseudo random shelling, aimless fire, a flag in distress 100% of proceeds fund tactical first aid supplies and Ukrainian developers',
  buttonLabel: 'Mint for .1991 Eth',
  buttonBackgroundHelp: 'rgb(3, 91, 188)',
  backgroundImage: UKR_rounded,
  purchaseButton: {
    // Reusable component
    buttonComponent: PurchaseTokenButton,
    // OPTIONAL: Image on the purchase button
    img: metaMaskIcon,
    // Contract address
    ...(import.meta.env.VITE_TEST_CONTRACTS === 'true'
      ? testContract
      : mainContract),
    // Custom style for the button
    customButtonClassName: 'ukranian-custom-button',
    presaleMessage:
      'By accepting these terms, I agree to glitch the flag and support the country in distress.',
    // Custom class for the div surrounding the button
    customWrapperClassName: 'btn-submit-with-form',
    blockchainOnly: true,
    // Custom function that will be called if the minting is a success
    // First parameter will be the minted token's number
    customSuccessAction: async (nextToken: number) => {
      const tokenMetadata = await rFetch(
        `/api/nft/network/0x1/0xbd034e188f35d920cf5dedfb66f24dcdd90d7804/0/token/${nextToken}`
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

  // button1: {
  //   buttonColor: "#035BBC",
  //   buttonLabel: "Mint for .1 ETH",
  //   buttonImg: MetaMaskIcon,
  //   buttonLink: "https://placekitten.com/200/300",
  // },

  button2: {
    buttonColor: '#FFD505',
    buttonLabel: 'Join Our Discord',
    buttonImg: discrodIconNoBorder,
    buttonLink: 'https://discord.com/invite/y98EMXRsCE'
  },
  exclusiveNft: {
    title: 'NFTs',
    titleColor: 'rgb(3, 91, 188)'
  },
  carouselTitle: 'Our Developers',
  carouselData: [
    {
      title: 'Alex & Arsenii',
      img: UKR126,
      description:
        'Originally based in Kharkiv, Alex and Arsenii are experienced frontend REACT developers that created the site you see here'
    },
    {
      title: 'Masha',
      img: UKR497,
      description:
        'Born in Odessa, Masha emigrated with her family to the US when she was a small child. They remained closely connected to the Post-Soviet immigrant community of the Pacific NW while growing up. She created these pieces of glitch art as a way to process the grief of a country in dispair, and to continue funding the shipment of medical supplies to the war-torn area.'
    },
    {
      title: 'Valerii & Natalia',
      img: UKR1294,
      description:
        'Originally based in Kharkiv, Valerii and Natalia are respsonsible for backend database architecture and syncing to allow for seemless purchase'
    }
  ],
  videoData: {
    video: null,
    videoTitle: 'Watch the Transformation',
    videoModuleDescription: 'Flag owners sign in with metamask to watch',
    videoModuleTitle: 'For Supporters Only',
    baseURL: 'https://storage.googleapis.com/rair-videos/',
    mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ'
  },
  tilesTitle: null,
  NFTName: '#ukraineglitch',
  counterData: {
    titleColor: '#FFD505',
    title1: '#ukraineglitch',
    title2: 'origins',
    backgroundImage: `url(${nftCountUkraine})`,
    btnColorIPFS: '#035BBC',
    nftCount: 1991,
    royaltiesNft: {
      firstBlock: [
        'Ukrainian Dev Fund: 42%',
        'Medical Supplies: 42%',
        'RAIR Node Fee: 10%',
        'Contract Gas Fund: 6%'
      ],
      secondBlock: [
        '1 UkraineGlitch Flag Supports',
        '- weeks of lodging for 1 Ukrainian',
        '- 10 Tourniquets sent to those in need'
      ]
    },
    properties: [
      {
        titleProperty: 'Fermion Freckles',
        titleColor: '#FFD505',
        propertyDesc: '14',
        percent: '32%'
      },
      {
        titleProperty: 'Boson Movement',
        titleColor: '#035BBC',
        propertyDesc: 'Sparklink / Still',
        percent: '1.7%'
      }
    ],
    description: [
      'This (de)generative art project was created to provide 100% direct aid to Ukraine.',
      '2014',
      'Ukrainian immigrants in the Pacific Northwest of the United States had taken it into their own hands to provide a direct supply chain of specialty tactical medical equipment to Ukraine’s grassroots militias. We are here to continue their story.',
      '2022',
      'This website was built by Ukrainian Web3 developers. The logic of the algorithm written by a Ukranian generative artist. Prior to the war they were making NFTs for fun, now for a purpose.',
      'About the piece',
      'The algorithm is set such that as the number of the NFT increases, the chaotic opposite square masses also increase, eventually inverting or turning the flag upside-down. Some NFTs are animated (sparkling) to show parts of this progression, and others are still. Only holders of a UkraineGlitch NFT can watch the full animation of the flag transformation occur below.'
    ]
  }
};
