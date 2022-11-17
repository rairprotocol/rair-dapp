import { useState } from 'react';
import { useSelector } from 'react-redux';
import { utils } from 'ethers';
import { isAddress } from 'ethers/lib/utils';
import Swal from 'sweetalert2';

import { TExternalContractType } from './adminView.types';

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
  const [resultData, setResultData] = useState<TExternalContractType>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('null');
  const [owner, setOwner] = useState<string>('');
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);

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

  const callImport = async () => {
    if (!validateInteger(limit)) {
      return;
    }
    setSendingData(true);
    Swal.fire(
      'Importing contract',
      'This will take a LOT of time (depending on the limit of tokens)',
      'info'
    );
    const { success, result } = await rFetch(`/api/contracts/import/`, {
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
    setSendingData(false);
    if (success) {
      setResultData(result);
      Swal.fire(
        'Success',
        `Successfully imported ${result.numberOfTokensAdded} tokens`,
        'success'
      );
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
      {resultData && (
        <div className="mt-5 col-12 text-center">
          Imported <br />
          <h3 className="d-inline">{resultData.contract.title}</h3> <br />
          with <br />
          <h3 className="d-inline">{resultData.numberOfTokensAdded}</h3> <br />
          NFTs
        </div>
      )}
    </div>
  );
};

export default ImportExternalContract;
