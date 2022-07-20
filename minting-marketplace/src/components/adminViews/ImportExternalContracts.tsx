import React, { useState } from 'react';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import { rFetch } from '../../utils/rFetch';
import { utils } from 'ethers';
import blockchainData from '../../utils/blockchainData';
import { TExternalContractType } from './adminView.types';
import { validateInteger } from '../../utils/metamaskUtils';

const ImportExternalContract = () => {
  const [selectedContract, setSelectedContract] = useState<string>('');
  const [resultData, setResultData] = useState<TExternalContractType>();
  const [selectedBlockchain, setSelectedBlockchain] = useState<string>('null');
  const [sendingData, setSendingData] = useState<boolean>(false);
  const [limit, setLimit] = useState<number>(0);

  const blockchainOptions = Object.keys(blockchainData).map((blockchainId) => {
    return {
      label: blockchainData[blockchainId].name,
      value: blockchainId
    };
  });

  const callImport = async () => {
    if (!validateInteger(limit)) {
      return;
    }
    setSendingData(true);
    const { success, result } = await rFetch(
      `/api/contracts/import/network/${selectedBlockchain}/${selectedContract}/${limit}`
    );
    setSendingData(false);
    if (success) {
      setResultData(result);
    }
  };

  return (
    <div className="col-12 row">
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
      <div className="col-12 col-md-12">
        <InputField
          getter={limit}
          setter={setLimit}
          label="Limit of tokens to import (0 = all)"
          customClass="form-control"
          labelClass="col-12"
        />
      </div>
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
