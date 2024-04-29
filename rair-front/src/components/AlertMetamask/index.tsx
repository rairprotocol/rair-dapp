import { FC } from 'react';
import CloseIcon from '@mui/icons-material/Close';

import { IAlertMetamask } from './alertMetamask.types';
import { Alert } from './styles';

import useWeb3Tx from '../../hooks/useWeb3Tx';

const AlertMetamask: FC<IAlertMetamask> = ({
  selectedChain,
  realNameChain,
  selectedChainId,
  setShowAlert
}) => {
  const { web3Switch } = useWeb3Tx();

  return (
    <Alert>
      <span>
        Your wallet is connected to the{' '}
        <b className="switch-network-incorrect-chain">{selectedChain}</b>{' '}
        network. Please switch to{' '}
        <b
          className="switch-network-text"
          onClick={() => web3Switch(selectedChainId)}>
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
