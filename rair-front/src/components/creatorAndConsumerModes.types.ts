import { ethers } from 'ethers';

export type TSingleOfferDataObject = {
  contractAddress: string;
  productIndex: string;
  nodeAddress: string;
  ranges: string;
  instance: ethers.Contract | undefined;
};

export type TOfferDataType = TSingleOfferDataObject[];
