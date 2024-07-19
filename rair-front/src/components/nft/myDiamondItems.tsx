import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';

import {
  IItemsForContract,
  IMyDiamondItems,
  ITokenLayout,
  TMyDiamondItemsToken,
  TSingleOfferData
} from './nft.types';

import { TMetadataType } from '../../axios.responseTypes';
import { diamondFactoryAbi } from '../../contracts';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import blockchainData from '../../utils/blockchainData';

const TokenLayout: React.FC<ITokenLayout> = ({
  item,
  openModal,
  setSelectedData
}) => {
  const defaultImg = `${
    import.meta.env.VITE_IPFS_GATEWAY
  }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`;

  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  return (
    <div
      onClick={() => {
        openModal();
        setSelectedData(item);
      }}
      style={{
        cursor: 'pointer',
        backgroundImage: `url(${item?.metadata?.image || defaultImg})`,
        backgroundColor: `var(--${primaryColor}-transparent)`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        position: 'relative'
      }}
      className="m-1 my-1 col-2 my-item-element">
      <div className="w-100 bg-my-items p-2">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'var(--stimorol)',
            position: 'absolute',
            width: '35px',
            height: '35px',
            paddingTop: '10px',
            borderRadius: '10px',
            top: 10,
            left: 10
          }}>
          <FontAwesomeIcon icon={faGem} />
        </div>
        <div className="col my-items-description-wrapper my-items-pic-description-wrapper">
          <span className="description-title">
            {item.metadata ? (
              <>
                <span>{item.title}</span>
              </>
            ) : (
              <b> No metadata available </b>
            )}
            <br />
          </span>
          <small className="description">
            {item.contract.slice(0, 5) +
              '....' +
              item.contract.slice(item.contract.length - 4)}
          </small>
          <div
            className="description-small"
            style={{
              paddingRight: '16px',
              position: 'relative',
              right: '-227px',
              top: '-48px'
            }}>
            <img
              className="my-items-blockchain-img"
              src={
                item.blockchain !== undefined
                  ? `${blockchainData[item?.blockchain]?.image}`
                  : ''
              }
              alt="Blockchain network"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const ItemsForContract: React.FC<IItemsForContract> = ({
  item,
  openModal,
  setSelectedData
}) => {
  const [tokens, setTokens] = useState<TMyDiamondItemsToken[]>([]);
  const [contractName, setContractName] = useState<string>('');
  const { contractCreator, currentUserAddress, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const getTokens = useCallback(async () => {
    const instance = contractCreator?.(item, diamondFactoryAbi);
    setContractName(await instance?.name());
    const balanceOfUser = await instance?.balanceOf(currentUserAddress);
    if (!balanceOfUser?.gt(0)) {
      return;
    }
    const tokenData: TMyDiamondItemsToken[] = [];
    for (let i = 0; i < balanceOfUser.toString(); i++) {
      const index = await instance?.tokenOfOwnerByIndex(currentUserAddress, i);
      const tokenURI = await instance?.tokenURI(index);
      let metadata: TMetadataType = {
        image: '',
        name: '',
        artist: '',
        description: ''
      };
      if (tokenURI !== '') {
        metadata = (await axios.get<TMetadataType>(tokenURI)).data;
      }
      tokenData.push({
        token: index.toString(),
        metadata,
        contract: item,
        title: metadata ? metadata.name : contractName,
        blockchain: currentChain
      });
    }
    setTokens(tokenData);
  }, [item, contractCreator, contractName, currentUserAddress, currentChain]);

  useEffect(() => {
    getTokens();
  }, [getTokens]);

  return (
    <>
      {tokens.map((token: TMyDiamondItemsToken, index: number) => {
        return (
          <TokenLayout
            item={token}
            key={index}
            {...{ openModal, setSelectedData }}
          />
        );
      })}
    </>
  );
};

const MyDiamondItems: React.FC<IMyDiamondItems> = (props) => {
  const [deploymentAddresses, setDeploymentAddresses] = useState<string[]>([]);
  const [status, setStatus] = useState<string>('Fetching data...');
  const { diamondMarketplaceInstance } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const fetchDiamondData = useCallback(async () => {
    if (!diamondMarketplaceInstance) {
      return;
    }
    const offerCount = Number(
      (await diamondMarketplaceInstance.getTotalOfferCount()).toString()
    );
    setStatus(`Found ${offerCount} addresses...`);
    const deployments: string[] = [];
    for (let i = 0; i < offerCount; i++) {
      setStatus(`Querying address ${i + 1} of ${offerCount}...`);
      const singleOfferData: TSingleOfferData =
        await diamondMarketplaceInstance.getOfferInfo(i);
      if (!deployments.includes(singleOfferData.mintOffer.erc721Address)) {
        deployments.push(singleOfferData.mintOffer.erc721Address);
      }
    }
    setDeploymentAddresses(deployments);
    setStatus(``);
  }, [diamondMarketplaceInstance]);

  useEffect(() => {
    fetchDiamondData();
  }, [fetchDiamondData]);

  return (
    <div className="my-items-product-wrapper row">
      <h5>{status}</h5>
      {deploymentAddresses.map((item, index) => {
        return <ItemsForContract key={index} item={item} {...props} />;
      })}
    </div>
  );
};

export default MyDiamondItems;
