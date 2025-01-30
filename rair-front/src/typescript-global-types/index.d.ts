import { MetaMaskInpageProvider, Provider } from '@metamask/providers';
import { Maybe } from '@metamask/providers/dist/utils';

declare module '@metamask/providers/dist/BaseProvider' {
  interface RequestArguments {
    from?: Maybe<unknown>;
  }
}

declare global {
  interface Window {
    ethereum: BaseProvider;
    dataLayer: Array<object>;
  }
}
