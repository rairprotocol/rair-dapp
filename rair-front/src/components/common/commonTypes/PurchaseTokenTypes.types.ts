// import { CSSProperties } from 'react';

export interface IAgreementsPropsType {
  amountOfTokensToPurchase: string;
  presaleMessage: string | React.ReactNode;
  contractAddress?: string;
  requiredBlockchain?: BlockchainType | undefined;
  offerIndex: string[] | undefined;
  connectUserData?: () => void;
  diamond: boolean;
  customSuccessAction?:
    | ((nextToken: number) => void | Promise<void>)
    | undefined;
  blockchainOnly?: boolean;
  databaseOnly?: boolean;
  collection?: boolean | undefined;
  setPurchaseStatus?: any;
  web3TxHandler: any;
}

export interface IPurchaseTokenButtonProps {
  amountOfTokensToPurchase?: string;
  altButtonFormat?: boolean;
  customButtonClassName?: string;
  customButtonIconClassName?: string;
  customButtonTextClassName?: string;
  customWrapperClassName?: string;
  img?: string;
  contractAddress?: string;
  requiredBlockchain?: BlockchainType | undefined;
  offerIndex?: string[] | undefined;
  buttonLabel?: string;
  presaleMessage?: string | React.ReactNode;
  diamond: boolean;
  customSuccessAction?: (nextToken: number) => any;
  blockchainOnly?: boolean;
  databaseOnly?: boolean;
  handleClick?: () => void;
  collection?: boolean;
  setPurchaseStatus?: any | undefined;
}

export interface IRangeDataType {
  start: string;
  end: string;
  product: string;
  price: string;
  sponsored?: boolean;
}
