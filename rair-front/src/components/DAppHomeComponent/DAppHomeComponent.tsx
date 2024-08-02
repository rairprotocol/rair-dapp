import React from 'react'
import { useSelector } from 'react-redux';
import ClaimKittenButton from '../../catDApp/components/claim-kitten-button';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useServerSettings from '../adminViews/useServerSettings'
import "./DAppHomeComponent.css";

const DAppHomeComponent = () => {
    const { signupMessage } = useServerSettings();
    const {
        primaryColor,
        primaryButtonColor,
      } = useSelector<RootState, ColorStoreType>((store) => store.colorStore);

  return (
    <div className="dApp-container">
        <button style={{
            background: `${
                primaryColor === '#dedede'
                  ? import.meta.env.VITE_TESTNET === 'true'
                    ? 'var(--hot-drops)'
                    : 'linear-gradient(to right, #e882d5, #725bdb)'
                  : import.meta.env.VITE_TESTNET === 'true'
                    ? primaryButtonColor ===
                      'linear-gradient(to right, #e882d5, #725bdb)'
                      ? 'var(--hot-drops)'
                      : primaryButtonColor
                    : primaryButtonColor
              }`,
        }} className="btn rair-button btn-connect-wallet btn-dapp-cat">{signupMessage}</button>
        <ClaimKittenButton />
    </div>
  )
}

export default DAppHomeComponent