//I marked these types as any, cos' I will continue giving them types a bit later
export type TAddOffer = {
  address: any;
  blockchain: BlockchainType | undefined;
  productIndex: any;
  tokenLimit: any;
  existingOffers: any;
};

export type TRangeManager = {
  disabled: boolean;
  index: number;
  array: any;
  deleter: any;
  sync: any;
  hardLimit: any;
};

export type TModalContent = {
  instance: any;
  productIndex: any;
  tokenLimit: any;
  existingOffers: any;
};
