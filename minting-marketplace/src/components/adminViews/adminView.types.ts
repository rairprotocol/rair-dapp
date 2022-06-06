
export type NativeCurrencyType = {
    name: string;
    symbol: string;
    decimals: number;
  };
  
  export type ChainDataType = {
    chainId?: BlockchainType;
    chainName: string;
    nativeCurrency?: NativeCurrencyType;
    rpcUrls?: string[];
    blockExplorerUrls?: string[];
  };

  export type BlockchainInfo = {
    chainData: ChainDataType;
    bootstrapColor: string;
  };

  export type MetamaskError = {
    code: number;
    message: string;
  };

  export type OfferPoolType = {
    contract: string;
    creationDate: string;
    marketplaceCatalogIndex: number;
    minterAddress: string;
    product: number;
    rangeNumber: number;
    transactionHash: string;
    _id: string;
  };
  
  export type ProductsType = {
    _id: string;
    collectionIndexInContract: number;
    contract: string;
    copies: number;
    cover: string;
    creationDate: string;
    firstTokenIndex: number;
    name: string;
    offers: OffersType;
    royalty: number;
    sold: boolean;
    soldCopies: number;
    diamond: boolean;
    offerPool: OfferPoolType;
    transactionHash: string;
  };
  
  export type OfferType = {
    contract: string;
    copies: number;
    creationDate: string;
    diamond: boolean;
    offerIndex: number;
    offerName: string;
    offerPool: number;
    price: number;
    product: number;
    range: number[];
    sold: boolean;
    soldCopies: number;
    transactionHash: string;
    _id: string;
  };
  
  export type OffersType = OfferType[];
  
  export type ContractsResponseType = {
    contracts: ContractType[];
    success: boolean;
    // totalNumber: number;
  };
  
  export type UsersContractsType = {
    label: string;
    value: string;
  };
  
  export type BlockchainInfoType = {
    image: string;
    name: string;
    chainId: BlockchainType;
    symbol: string;
    addChainData: {
      chainId: string;
      chainName: string;
      nativeCurrency?: {
        name?: string;
        symbol?: string;
        decimals?: number;
      };
      rpcUrls?: string[];
      blockExplorerUrls?: string[];
    };
  };
  
  type ContractInfo = {
    title: string;
    contractAddress: string;
  };

  export type ContractType = {
    diamond: boolean;
    _id: string;
    title: string;
    blockchain: BlockchainType;
    contractAddress: string;
  };
  
  export type ContractDataType = ContractInfo | ContractType | undefined;
  
  export type NFTSelectedNumberResponseType = {
    success: boolean;
    result: {
      totalCount: number;
      tokens: MintedTokenType[];
    };
  };
  
  export type MintedTokenType = {
    _id: string;
    contract: string;
    creationDate: string;
    authenticityLink: string;
    metadata: {};
    offer: number;
    offerPool: number;
    ownerAddress: string;
    token: number;
    uniqueIndexInContract: number;
    isMinted: boolean;
    metadataURI: string;
  };

  export type TContractSchema = {
    blockchain: BlockchainType;
    contractAddress: string;
    diamond: boolean;
    title: string;
    _id: string;
    creationDate: string;
    external: boolean;
    lastSyncedBlock: string;
    user: string;

  }

  export type TExternalContractType =  {
    contract: TContractSchema;
    numberOfTokensAdded: number;
  }
  
 
  
