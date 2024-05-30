import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';

import { diamondFactoryAbi } from '../../contracts';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import chainData from '../../utils/blockchainData';
import { validateInteger } from '../../utils/metamaskUtils';
import { rFetch } from '../../utils/rFetch';
import sockets from '../../utils/sockets';
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
  const [progress, setProgress] = useState<number>();

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  useEffect(() => {
    const report = (socketData) => {
      const { message, data } = socketData;
      const [progress, contractAddress, blockchain, creator, limit] = data;

      setSendingData(true);
      setProgress(progress);
      setResultData(message);
      setSelectedContract(contractAddress);
      setSelectedBlockchain(blockchain);
      setOwner(creator);
      setLimit(limit);
      if (progress === 100) {
        setSendingData(false);
      }
    };
    sockets.nodeSocket.on('importProgress', report);
    return () => {
      sockets.nodeSocket.off('importProgress', report);
    };
  }, []);

  const blockchainOptions = Object.keys(chainData)
    .filter((chain) => chainData[chain].disabled !== true)
    .map((blockchainId) => {
      return {
        label: chainData[blockchainId].name,
        value: blockchainId
      };
    });

  const { contractCreator } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryButtonColor, secondaryButtonColor, textColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const callImport = async () => {
    if (!validateInteger(limit)) {
      return;
    }
    setSendingData(true);

    const { success } = await rFetch(`/api/contracts/import/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        networkId: selectedBlockchain,
        contractAddress: selectedContract.toLowerCase(),
        limit: limit,
        contractCreator: owner.toLowerCase()
      })
    });
    if (success) {
      reactSwal.fire(
        'Importing contract',
        'You can navigate away while the tokens are being imported',
        'info'
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
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          className="btn rair-button w-100"
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
        className="btn rair-button col-12"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}>
        {sendingData ? 'Please wait...' : 'Import Contract!'}
      </button>
      <hr />
      <h5 className="text-center">{resultData}</h5>
      <br />
      {progress && <progress value={progress} max={100} />}
      <br />
    </div>
  );
};

export default ImportExternalContract;
