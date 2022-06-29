import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import { IAlertMetamask } from './alertMetamask.types';
import { Alert } from './styles';

const AlertMetamask: React.FC<IAlertMetamask> = ({
  selectedChain,
  realNameChain,
  setShowAlert
}) => (
  <Alert>
    <span>
      Your wallet is connected to the <b>{selectedChain}</b> network. Please
      switch to <b>{realNameChain}</b> network.
    </span>
    <span onClick={() => setShowAlert(false)}>
      <CloseIcon />
    </span>
  </Alert>
);

export default AlertMetamask;
