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
  diamondRangeIndex: string;
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
  blockchain: BlockchainType;
  start: string;
  end: string;
  price: any;
  offerIndex: string;
  rangeIndex: string;
  offerName: string;
  minterAddress: string;
  diamonds?: boolean;
  buyTokenFunction?: (
    offerIndex: number,
    tokenIndex: number,
    price: number
  ) => void;
  buyTokenBatchFunction?: (
    offerIndex: number,
    tokens: number[],
    addresses: string[],
    price: number
  ) => void;
};

export type TItemBatchMint = {
  'Public Address': string;
  NFTID: number;
};

export type TBatchMintDataType = TItemBatchMint[];
