import { FC, useReducer } from 'react';

import {
  GlobalModalContext,
  TGlobalModalActon,
  TGlobalModalState,
  TModalStateProviderProps
} from './index';
const globalModalReducer = (
  state: TGlobalModalState,
  action: TGlobalModalActon
): TGlobalModalState => {
  switch (action.type) {
    case 'CREATE_MODAL':
      return action && action.payload;
    case 'TOGLLE_IS_MODAL_OPEN':
      return state && { ...state, isOpen: !state.isOpen };
    case 'UPDATE_MODAL':
      return state && { ...state, ...action.payload };
    default:
      return state;
  }
};
export const GlobalModalStateProvider: FC<TModalStateProviderProps> = ({
  children
}) => {
  const [modalState, modalDispatch] = useReducer<typeof globalModalReducer>(
    globalModalReducer,
    null
  );
  return (
    <GlobalModalContext.Provider
      value={{
        globalModalState: modalState,
        globalModaldispatch: modalDispatch
      }}>
      {children}
    </GlobalModalContext.Provider>
  );
};
