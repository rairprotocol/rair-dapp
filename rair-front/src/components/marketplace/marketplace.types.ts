import { BigNumber } from 'ethers';

export type TBatchRowPropsType = {
  index: number;
  deleter: () => void;
  array: TBatchMintDataType;
};

export type TOfferType = {
  contract: string;
  copies: number;
  creationDate: string;
  diamond: boolean;
  offerIndex: string;
  offerName: string;
  offerPool: string;
  price: string;
  product: string;
  range: string[];
  sold: boolean;
  soldCopies: number;
  transactionHash: string;
  _id: string;
  diamondRangeIndex?: string;
  hidden: boolean;
  sponsored?: boolean;
};

export type TOfferData = TOfferType & {
  blockchain: BlockchainType;
  contractAddress: string;
  productIndex: string;
  productName: string;
  totalCopies: number;
  minterAddress: string;
};

export type TMinterMarketplaceItemType = {
  item: TOfferData;
  index: number;
  colWidth?: number;
};

export type TBuyTokenModalContentType = {
  blockchain: BlockchainType | undefined;
  start: string;
  end: string;
  price: BigNumber;
  offerIndex: string;
  rangeIndex?: string;
  offerName: string;
  minterAddress: string | undefined;
  diamonds?: boolean;
  buyTokenFunction?: (
    offerIndex: string,
    tokenIndex: string,
    price: BigNumber
  ) => void;
  buyTokenBatchFunction?: (
    offerIndex: string,
    tokens: number[],
    addresses: string[],
    price: BigNumber
  ) => void;
};

export type TItemBatchMint = {
  'Public Address': string;
  NFTID: number;
};

export type TBatchMintDataType = TItemBatchMint[];
