import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';

import { diamondFactoryAbi } from '../../contracts';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import chainData from '../../utils/blockchainData';
import { validateInteger } from '../../utils/metamaskUtils';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const ImportExternalContract = () => {
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [resultData, setResultData] = useState<string>('');
  const [selectedBlockchain, setSelectedBlockchain] = useState<
    BlockchainType | 'null'
  >('null');
  const [owner, setOwner] = useState<string>('');
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);
  const [currentTokens /*, setCurrentTokens*/] = useState<number>();
  const [totalTokens /*, setTotalTokens */] = useState<number>();
  const [sessionId, setSessionId] = useState('');

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const blockchainOptions = Object.keys(chainData).map((blockchainId) => {
    return {
      label: chainData[blockchainId].name,
      value: blockchainId
    };
  });

  const { contractCreator } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  useEffect(() => {
    const sessionId = Math.random().toString(36).substr(2, 9);
    setSessionId(sessionId);
    /*
    Disabled until sessions are implemented

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
    */
  }, []);

  const callImport = async () => {
    if (!validateInteger(limit)) {
      return;
    }
    setSendingData(true);
    reactSwal.fire('Importing contract', 'Please wait', 'info');

    const { success, result } = await rFetch(`/api/contracts/import/`, {
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
      reactSwal.fire(
        'Success',
        `Imported ${result.numberOfTokensAdded} tokens from ${result.contract.title}`,
        'success'
      );
      setResultData(
        `Imported ${result.numberOfTokensAdded} tokens from ${result.contract.title}`
      );
    }
  };

  const tryToGetCreator = async () => {
    if (selectedBlockchain === 'null') {
      return;
    }
    if (!correctBlockchain(selectedBlockchain)) {
      web3Switch(selectedBlockchain as BlockchainType);
      return;
    }
    if (!contractCreator) {
      return;
    }
    const instance = await contractCreator(selectedContract, diamondFactoryAbi);
    if (instance) {
      const owner = await web3TxHandler(instance, 'owner', [], {
        intendedBlockchain: selectedBlockchain,
        failureMessage:
          'Failed to get creator, the contract might not use Ownable standard'
      });
      if (owner) {
        setOwner(owner.toString());
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
      <h5 className="text-center">{resultData}</h5>
      <br />
      {totalTokens && <progress value={currentTokens} max={totalTokens} />}
      <br />
    </div>
  );
};

export default ImportExternalContract;
