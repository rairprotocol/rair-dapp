import React from 'react';
export type TGlobalModalState = any;
export type TGlobalModalActon = {
  type: string;
  payload: TGlobalModalState;
};
export type TGlobalModalContext = {
  globalModalState: TGlobalModalState | null;
  globalModaldispatch: React.Dispatch<TGlobalModalActon>;
};
export const GlobalModalContext = React.createContext<TGlobalModalContext>({
  globalModalState: null,
  globalModaldispatch: () => void 0
});
export type TModalStateProviderProps = {
  children?: React.ReactNode;
};
