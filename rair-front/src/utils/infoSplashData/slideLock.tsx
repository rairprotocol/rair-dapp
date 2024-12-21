//@ts-nocheck
import Swal from 'sweetalert2';

import PurchaseTokenButton from '../../components/common/PurchaseToken';
import {
  SlideLock_IMG,
  titleImage
} from '../../components/SplashPage/images/slideLock/slideLock';
import {
  TMainContractType,
  TSplashDataType
} from '../../components/SplashPage/splashPage.types';
import { metaMaskIcon } from '../../images';
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
  title: '',
  titleImage: titleImage,
  titleColor: '#57B69C',
  description: 'The most secure way to stream encrypted documents',
  // seoInformation: {
  //   title: "Слава Україні!",
  //   contentName: "author",
  //   content: "#UkraineGlitch",
  //   description: "1991 Generative Abstract Glitch Art pieces to aid Ukraine",
  //   favicon: faviconUkraine,
  //   image: UKR_rounded
  // },
  buttonLabel: 'Unlock Document',
  backgroundImage: SlideLock_IMG,
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
    customButtonClassName: 'slide-lock-custom-button',
    // presaleMessage: 'By accepting these terms, I agree to glitch the flag and support the country in distress.',
    // Custom class for the div surrounding the button
    customWrapperClassName: 'btn-submit-with-form',
    blockchainOnly: true,
    // Custom function that will be called if the minting is a success
    // First parameter will be the minted token's number
    customSuccessAction: async (nextToken) => {
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

  // button2: {
  //   buttonColor: "#FFD505",
  //   buttonLabel: "Join Our Discord",
  //   buttonImg: DiscordIcon,
  //   buttonLink: "https://discord.com/invite/y98EMXRsCE",
  // },

  exclusiveNft: {
    title: 'NFTs',
    titleColor: '#57B69C'
  },
  // carouselTitle: "Our Developers",
  // carouselData: [
  //   {
  //     title: "Alex & Arsenii",
  //     img: UKR126,
  //     description:
  //       "Originally based in Kharkiv, Alex and Arsenii are experienced frontend REACT developers that created the site you see here",
  //   },
  //   {
  //     title: "Masha",
  //     img: UKR497,
  //     description:
  //       "Born in Odessa, Masha emigrated with her family to the US when she was a small child. They remained closely connected to the Post-Soviet immigrant community of the Pacific NW while growing up. She created these pieces of glitch art as a way to process the grief of a country in dispair, and to continue funding the shipment of medical supplies to the war-torn area.",
  //   },
  //   {
  //     title: "Valerii & Natalia",
  //     img: UKR1294,
  //     description:
  //       "Originally based in Kharkiv, Valerii and Natalia are respsonsible for backend database architecture and syncing to allow for seemless purchase",
  //   },
  // ],
  videoData: {
    video: undefined
    // videoTitle: "Watch the Transformation",
    // videoModuleDescription: "NFT owners can learn more about the project by signing with metamask to unlock an encrypted document",
    // videoModuleTitle: "Only NFT owners can see these slides",
    // baseURL: 'https://storage.googleapis.com/rair-videos/',
    // mediaId: 'VUPLZvYEertdAQMiZ4KTI9HgnX5fNSN036GAbKnj9XoXbJ',
  },
  tilesTitle: 'More streaming documents',
  // videoArr: [
  //   {
  //       typeVideo: "NFTLA-EXCLUSIVE-1",
  //       unlockVideoName: "Slide Streaming",
  //       timeVideo: "00:00:00",
  //       locked: true
  //   },
  //   {
  //       typeVideo: "NFTLA-EXCLUSIVE-2",
  //       unlockVideoName: "Sales Pipeline",
  //       timeVideo: "00:00:00",
  //       locked: false
  //   },
  //   {
  //       typeVideo: "NFTLA-EXCLUSIVE-3",
  //       unlockVideoName: "Marketing Plan",
  //       timeVideo: "00:00:00",
  //       locked: false
  //   },
  //   {
  //       typeVideo: "NFTLA-EXCLUSIVE-4",
  //       unlockVideoName: "Security Threat Model",
  //       timeVideo: "00:00:00",
  //       locked: true
  //   }
  // ],
  NFTName: 'NFT',
  counterData: {
    titleColor: '#57B69C',
    title1: 'Your files',
    title2: ' secured',
    backgroundImage: SlideLock_IMG,
    btnColorIPFS: '#035BBC',
    nftCount: 960,
    nftTitle: 'Access passes',
    royaltiesNft: null,
    properties: [
      // {
      //   titleProperty: "Fermion Freckles",
      //   titleColor: "#FFD505",
      //   propertyDesc: "14",
      //   percent: "32%",
      // },
      // {
      //   titleProperty: "Boson Movement",
      //   titleColor: "#035BBC",
      //   propertyDesc: "Sparklink / Still",
      //   percent: "1.7%",
      // },
    ],
    description: [
      'NFTs are the access credentials of the future',
      '-Automated public record of accounting',
      '-One user one stream . No password sharing',
      '-Offchain control of private data repositories'
    ]
  }
};
