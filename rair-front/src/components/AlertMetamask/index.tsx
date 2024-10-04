import { FC, useEffect } from 'react';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { IAlertMetamask } from './alertMetamask.types';
import { Alert } from './styles';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useWeb3Tx from '../../hooks/useWeb3Tx';

const AlertMetamask: FC<IAlertMetamask> = ({ setShowAlert }) => {
  const { web3Switch, correctBlockchain } = useWeb3Tx();
  const { requestedChain, connectedChain } = useAppSelector(
    (store) => store.web3
  );
  const { getBlockchainData } = useServerSettings();

  useEffect(() => {
    if (requestedChain) {
      setShowAlert(!correctBlockchain(requestedChain));
    }
  }, [correctBlockchain, requestedChain, setShowAlert]);

  return (
    <Alert>
      <span>
        Your wallet is connected to the{' '}
        <b className="switch-network-incorrect-chain">
          {getBlockchainData(connectedChain)?.name}
        </b>{' '}
        network. Please switch to{' '}
        <b
          className="switch-network-text"
          onClick={() => web3Switch(requestedChain)}>
          {getBlockchainData(requestedChain)?.name}
        </b>{' '}
        network
      </span>
      <button className="btn rair-button" onClick={() => setShowAlert(false)}>
        <FontAwesomeIcon icon={faTimes} />
      </button>
    </Alert>
  );
};

export default AlertMetamask;
