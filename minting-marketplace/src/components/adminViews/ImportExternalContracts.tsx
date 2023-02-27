import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import { io } from 'socket.io-client';
import Swal from 'sweetalert2';

import { diamondFactoryAbi } from '../../contracts';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import blockchainData from '../../utils/blockchainData';
import { metamaskCall, validateInteger } from '../../utils/metamaskUtils';
import { rFetch } from '../../utils/rFetch';
import { web3Switch } from '../../utils/switchBlockchain';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const ImportExternalContract = () => {
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [resultData, setResultData] = useState<string>('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('null');
  const [owner, setOwner] = useState<string>('');
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);
  const [currentTokens, setCurrentTokens] = useState<number>();
  const [totalTokens, setTotalTokens] = useState<number>();
  const [sessionId, setSessionId] = useState('');

  const blockchainOptions = Object.keys(blockchainData).map((blockchainId) => {
    return {
      label: blockchainData[blockchainId].name,
      value: blockchainId
    };
  });

  const { contractCreator, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);

  useEffect(() => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    setSessionId(sessionId);
    const so = io(`/`, {
      transports: ['websocket'],
      protocols: ['http'],
      path: '/socket'
    });
    console.info(so);

    so.emit('init', sessionId);

    so.on('importReport', (data) => {
      const { current, total } = data;
      setResultData(`${current} of ${total}`);
      setCurrentTokens(current);
      setTotalTokens(total);
    });

    return () => {
      so.removeListener('importReport');
      so.emit('end', sessionId);
    };
  }, []);

  const callImport = async () => {
    if (!validateInteger(limit)) {
      return;
    }
    setSendingData(true);
    Swal.fire('Importing contract', 'Please wait', 'info');

    const { success, message } = await rFetch(`/api/contracts/import/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        networkId: selectedBlockchain,
        contractAddress: selectedContract.toLowerCase(),
        limit: limit,
        contractCreator: owner.toLowerCase(),
        socketSessionId: sessionId
      })
    });
    setSendingData(false);
    if (success) {
      Swal.fire('Success', message, 'success');
    }
  };

  const tryToGetCreator = async () => {
    if (currentChain !== selectedBlockchain) {
      web3Switch(selectedBlockchain as BlockchainType);
      return;
    }
    if (!contractCreator) {
      return;
    }
    const instance = await contractCreator(selectedContract, diamondFactoryAbi);
    if (instance) {
      const owner = await metamaskCall(
        instance.owner(),
        'Failed to get creator, the contract might not use Ownable standard'
      );
      if (owner) {
        setOwner(owner);
      } else {
        setOwner('');
      }
    }
  };

  return (
    <div className="col-12 row px-5">
      <h3>Import External Data</h3>
      <div className="col-12 col-md-6">
        <InputSelect
          getter={selectedBlockchain}
          setter={setSelectedBlockchain}
          options={blockchainOptions}
          customClass="form-control"
          label="Blockchain"
          placeholder="Select a blockchain"
        />
      </div>
      <div className="col-12 col-md-6">
        <InputField
          getter={selectedContract}
          setter={setSelectedContract}
          label="Contract address"
          customClass="form-control"
          labelClass="col-12"
        />
      </div>
      <div className="col-12 col-md-3">
        <InputField
          getter={limit}
          setter={setLimit}
          label="Number of tokens to import (0 = all)"
          customClass="form-control"
          labelClass="col-12"
        />
      </div>
      <div className="col-12 col-md-6">
        <InputField
          getter={owner}
          setter={setOwner}
          label="Contract's owner"
          customClass="form-control"
          labelClass="col-12"
        />
      </div>
      <div className="col-12 col-md-3 pt-4 px-0 mx-0">
        <button
          disabled={!contractCreator || !isAddress(selectedContract)}
          className="btn btn-royal-ice w-100"
          onClick={tryToGetCreator}>
          Try to get owner address
        </button>
      </div>
      <hr />
      <button
        onClick={callImport}
        disabled={
          sendingData ||
          !validateInteger(limit) ||
          selectedBlockchain === 'null' ||
          !utils.isAddress(selectedContract)
        }
        className="btn btn-stimorol col-12">
        {sendingData ? 'Please wait...' : 'Import Contract!'}
      </button>
      <hr />
      {resultData}
      <br />
      {totalTokens && <progress value={currentTokens} max={totalTokens} />}
      <br />
    </div>
  );
};

export default ImportExternalContract;
