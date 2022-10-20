import { CSSProperties } from 'react';

export interface IAgreementsPropsType {
  presaleMessage: string | React.ReactNode;
  contractAddress: string;
  requiredBlockchain: BlockchainType;
  offerIndex: number[];
  connectUserData: () => void;
  diamond: boolean;
  customSuccessAction: (nextToken: number) => void;
  blockchainOnly?: boolean;
  databaseOnly?: boolean;
}

export interface IPurchaseTokenButtonProps {
  altButtonFormat?: boolean;
  customButtonClassName?: string;
  customButtonIconClassName?: string;
  customButtonTextClassName?: string;
  customStyle: CSSProperties;
  customWrapperClassName: string;
  img?: string;
  contractAddress: string;
  requiredBlockchain: BlockchainType;
  offerIndex: number[];
  buttonLabel: string;
  connectUserData: () => void;
  presaleMessage?: string | React.ReactNode;
  diamond: boolean;
  customSuccessAction: (nextToken: number) => void;
  blockchainOnly?: boolean;
  databaseOnly?: boolean;
}

export interface IRangeDataType {
  start: string;
  end: string;
  product: string;
  price: string;
}
