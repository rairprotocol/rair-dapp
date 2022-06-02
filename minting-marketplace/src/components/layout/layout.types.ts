import { BlockchainType } from "../../ducks/contracts/contracts.types";

export interface ILayout {
    userData: any;
    account: any;
    connectUserData: any;
    contractAddresses: any;
    chainId: BlockchainType;
  }