export interface IAlertMetamask {
  selectedChain: string;
  selectedChainId: BlockchainType;
  realNameChain: string;
  setShowAlert: (value: boolean) => void;
}
