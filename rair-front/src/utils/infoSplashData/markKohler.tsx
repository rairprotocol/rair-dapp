import Swal from 'sweetalert2';

import { MarkKohlerImage } from '../../components/SplashPage/images/markKohler/markHohler';
import {
  TMainContractType,
  TSplashDataType
} from '../../components/SplashPage/splashPage.types';
import { hyperlink } from '../../components/SplashPage/SplashPageConfig/utils/hyperLink';
import { metaMaskIcon } from '../../images';
import { rFetch } from '../rFetch';

const mainContract: TMainContractType = {
  contractAddress: '0x711fe7fccdf84875c9bdf663c89b5f5f726a11d7',
  requiredBlockchain: '0x1',
  offerIndex: ['11']
};

export const contract = mainContract.contractAddress;
export const blockchain = mainContract.requiredBlockchain;
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
  button3: {
    buttonLabel: 'CONNECT WALLET',
    buttonImg: metaMaskIcon,
    buttonColor: '#000',
    buttonAction: () =>
      hyperlink('https://opensea.io/collection/tax-hacks-summit')
  },
  purchaseButton: {
    buttonLabel: 'Mint for .27',
    img: metaMaskIcon,
    requiredBlockchain: blockchain,
    contractAddress: contract,
    offerIndex: offerIndex,
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
