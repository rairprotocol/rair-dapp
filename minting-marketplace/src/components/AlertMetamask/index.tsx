import React from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { IAlertMetamask } from './alertMetamask.types';
import { Alert } from './styles';

import { CheckEthereumChain } from '../../utils/CheckEthereumChain';

const AlertMetamask: React.FC<IAlertMetamask> = ({
  selectedChain,
  realNameChain,
  selectedChainId,
  setShowAlert
}) => {
  return (
    <Alert>
      <span>
        Your wallet is connected to the{' '}
        <b className="switch-network-incorrect-chain">{selectedChain}</b>{' '}
        network. Please switch to{' '}
        <b
          className="switch-network-text"
          onClick={() => CheckEthereumChain(selectedChainId)}>
          {realNameChain}
        </b>{' '}
        network
      </span>
      <span
        className="switch-network-close"
        onClick={() => setShowAlert(false)}>
        <CloseIcon />
      </span>
    </Alert>
  );
};

export default AlertMetamask;
