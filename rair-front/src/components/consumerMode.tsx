import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { MultiOwnerModularAccount } from '@alchemy/aa-accounts';
import { AccountSigner } from '@alchemy/aa-ethers';
import { faRedo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as ethers from 'ethers';

import { IConsumerMode, TOfferDataType } from './creatorAndConsumerModes.types';

import { erc721Abi } from '../contracts';
import { RootState } from '../ducks';
import { ContractsInitialType } from '../ducks/contracts/contracts.types';
import setTitle from '../utils/setTitle';

import ERC721Consumer from './ConsumerMode/ERC721Consumer';

const ConsumerMode: React.FC<IConsumerMode> = () => {
  const [offerCount, setOfferCount] = useState<string>();
  const [, /*treasuryAddress*/ setTreasuryAddress] = useState<string>();
  const [salesCount, setSalesCount] = useState<string>();
  const [collectionsData, setCollectionsData] = useState<TOfferDataType>();
  const [refetchingFlag, setRefetchingFlag] = useState<boolean>(false);

  const { minterInstance, programmaticProvider } = useSelector<
    RootState,
    ContractsInitialType
  >((state) => state.contractStore);

  const fetchData = useCallback(async () => {
    setRefetchingFlag(true);
    let signer:
      | AccountSigner<MultiOwnerModularAccount>
      | ethers.providers.JsonRpcSigner
      | ethers.Wallet
      | undefined = programmaticProvider;
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      signer = provider.getSigner(0);
    }
    const aux = (await minterInstance?.getOfferCount()).toString();
    setSalesCount((await minterInstance?.openSales()).toString());
    setOfferCount(aux);
    setTreasuryAddress(await minterInstance?.treasury());

    const offerData: TOfferDataType = [];
    for await (const index of [
      // eslint-disable-next-line
      ...Array.apply<null, any, unknown[]>(null, { length: aux }).keys()
    ]) {
      const data = await minterInstance?.getOfferInfo(index);
      offerData.push({
        contractAddress: data.contractAddress,
        productIndex: data.productIndex.toString(),
        nodeAddress: data.nodeAddress,
        ranges: data.availableRanges.toString(),
        instance: new ethers.Contract(data.contractAddress, erc721Abi, signer)
      });
    }
    setCollectionsData(offerData);
    setRefetchingFlag(false);
  }, [programmaticProvider, minterInstance, setTreasuryAddress]);

  useEffect(() => {
    if (minterInstance) {
      fetchData();
    }
  }, [minterInstance, fetchData]);

  useEffect(() => {
    setTitle('Old Minter Marketplace');
  }, []);

  return (
    <div className="col-12" style={{ position: 'relative' }}>
      <button
        onClick={fetchData}
        disabled={refetchingFlag}
        style={{ position: 'absolute', right: 0, color: 'inherit' }}
        className="btn btn-warning">
        {refetchingFlag ? '...' : <FontAwesomeIcon icon={faRedo} />}
      </button>

      {collectionsData && (
        <div className="row mx-0 px-0">
          <div className="col-12">
            <h5>Minter Marketplace</h5>
            <small>
              {offerCount} Offers found
              <br />
              with {salesCount} price ranges!
            </small>
          </div>
          <br />
          {collectionsData.map((item, index) => {
            return (
              <ERC721Consumer key={index} index={index} offerInfo={item} />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ConsumerMode;
