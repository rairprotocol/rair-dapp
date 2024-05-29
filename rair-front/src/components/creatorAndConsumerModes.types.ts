import { ethers } from 'ethers';

import { ContractContents } from '../ducks/contracts/contracts.types';

export interface IConsumerMode {
  addresses: ContractContents | undefined;
}

export type TSingleOfferDataObject = {
  contractAddress: string;
  productIndex: string;
  nodeAddress: string;
  ranges: string;
  instance: ethers.Contract | undefined;
};

export type TOfferDataType = TSingleOfferDataObject[];

export type TCreatorMode = {
  account: any;
  addresses: any;
};
