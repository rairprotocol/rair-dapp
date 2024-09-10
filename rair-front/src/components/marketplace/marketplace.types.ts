import { Hex } from 'viem';

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
  blockchain: Hex;
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
  blockchain: Hex | undefined;
  start: string;
  end: string;
  price: bigint;
  offerIndex: string;
  rangeIndex?: string;
  offerName: string;
  diamonds?: boolean;
  buyTokenFunction?: (
    offerIndex: string,
    tokenIndex: string,
    price: bigint
  ) => void;
  buyTokenBatchFunction?: (
    offerIndex: string,
    tokens: number[],
    addresses: string[],
    price: bigint
  ) => void;
};

export type TItemBatchMint = {
  'Public Address': string;
  NFTID: number;
};

export type TBatchMintDataType = TItemBatchMint[];
