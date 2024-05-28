import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { TCreatorMode } from './creatorAndConsumerModes.types';

import { RootState } from '../ducks';
import { ContractsInitialType } from '../ducks/contracts/contracts.types';
import setTitle from '../utils/setTitle';

import ERC721Manager from './CreatorMode/ERC721Manager';
import ERC777Manager from './CreatorMode/erc777';
import FactoryManager from './CreatorMode/factory';

const CreatorMode: React.FC<TCreatorMode> = ({ account }) => {
  const [deployedTokens, setDeployedTokens] = useState<string[]>();

  const { erc777Instance, factoryInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  useEffect(() => {
    setTitle('Old Factory');
  }, []);

  return (
    <>
      <br />
      <div className="w-100 text-center row mx-0 px-0">
        {erc777Instance && factoryInstance ? (
          <ERC777Manager
            instance={erc777Instance}
            account={account}
            factoryAddress={factoryInstance.address}
          />
        ) : (
          'Connecting to ERC777...'
        )}
        {factoryInstance && (
          <FactoryManager
            instance={factoryInstance}
            erc777Instance={erc777Instance}
            account={account}
            setDeployedTokens={setDeployedTokens}
          />
        )}
        <div className="col-12 py-4 border border-white rounded">
          {deployedTokens !== undefined && (
            <>
              <h3> Your Deployed ERC721 Contracts </h3>
              {deployedTokens.map((item, index) => {
                return <ERC721Manager key={index} tokenAddress={item} />;
              })}
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default CreatorMode;
