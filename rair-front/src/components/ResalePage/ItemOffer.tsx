import React, { memo, useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useStateIfMounted } from 'use-state-if-mounted';

import { INftItemComponent } from './listOffers.types';

import { TTokenData } from '../../axios.responseTypes';
import { diamondFactoryAbi } from '../../contracts';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { UserType } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import useWindowDimensions from '../../hooks/useWindowDimensions';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import { ContractType } from '../adminViews/adminView.types';
import { SvgKey } from '../MockUpPage/NftList/SvgKey';
import { gettingPrice } from '../MockUpPage/NftList/utils/gettingPrice';
import defaultAvatar from '../UserProfileSettings/images/defaultUserPictures.png';

const ItemOfferComponent: React.FC<INftItemComponent> = ({
  price,
  contract,
  operator,
  tradeid,
  tokenId
}) => {
  const [tokenMetadata, setTokenMetadata] = useStateIfMounted<
    TTokenData | undefined
  >(undefined);
  const [accountData, setAccountData] = useStateIfMounted<UserType | null>(
    null
  );
  const [playing, setPlaying] = useState<boolean>(false);
  const [isFileUrl, setIsFileUrl] = useState<string>();
  const [contractData, setContractData] = useState<ContractType>();
  const { width } = useWindowDimensions();
  const { maxPrice, minPrice } = gettingPrice([price]);

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const {
    diamondMarketplaceInstance,
    currentUserAddress,
    currentChain,
    contractCreator
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );

  const getTokenMetadata = useCallback(async () => {
    if (!contractData) {
      return;
    }
    const tokenMetadata = await rFetch(
      `/api/nft/network/${contractData?.blockchain}/${contractData?.contractAddress}/token/${tokenId}`
    );
    setTokenMetadata(tokenMetadata?.result);
  }, [setTokenMetadata, contractData, tokenId]);

  useEffect(() => {
    getTokenMetadata();
  }, [getTokenMetadata]);

  const getOperatorData = useCallback(async () => {
    if (!operator) {
      return;
    }
    const operatorData = await rFetch(
      `/api/users/${operator.toLowerCase()}`,
      undefined,
      undefined,
      false
    );
    setAccountData(operatorData?.user);
  }, [operator, setAccountData]);

  useEffect(() => {
    getOperatorData();
  }, [getOperatorData]);

  const getContractData = useCallback(async () => {
    if (contract) {
      const contractData = (await rFetch(`/api/contracts/${contract}`))
        ?.contract;
      setContractData(contractData);
    }
  }, [contract]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  const checkUrl = useCallback(() => {
    if (
      tokenMetadata &&
      tokenMetadata.metadata &&
      tokenMetadata.metadata.animation_url
    ) {
      const fileUrl: string | undefined = tokenMetadata.metadata?.animation_url;
      const parts: string[] | undefined = fileUrl?.split('/').pop()?.split('.');
      const ext: string | undefined =
        parts && parts?.length > 1 ? parts?.pop() : '';
      setIsFileUrl(ext);
    }
  }, [tokenMetadata, setIsFileUrl]);

  const handlePlaying = () => {
    setPlaying((prev) => !prev);
  };

  const purchaseToken = async () => {
    if (!contractData) {
      return;
    }
    if (correctBlockchain(contractData.blockchain)) {
      web3Switch(contractData.blockchain);
      return;
    } else if (diamondMarketplaceInstance) {
      if (contractCreator) {
        const instance = contractCreator(
          contractData.contractAddress,
          diamondFactoryAbi
        );
        if (instance) {
          const TRADERHash = await web3TxHandler(instance, 'TRADER');
          const can =
            TRADERHash &&
            (await web3TxHandler(instance, 'hasRole', [
              TRADERHash,
              diamondMarketplaceInstance.address
            ]));
          if (!can) {
            reactSwal.fire(
              'Error',
              'Resale marketplace has no access to this contract, TRADER role required',
              'error'
            );
            return;
          }
        }
      }
      //return;
      if (
        await web3TxHandler(diamondMarketplaceInstance, 'buyResaleOffer', [
          tradeid,
          { value: price.toString() }
        ])
      ) {
        reactSwal.fire('Success', 'Token purchased', 'success');
      }
    }
  };

  function checkPrice() {
    if (maxPrice === minPrice) {
      const samePrice = maxPrice;
      return `${samePrice ? samePrice : samePrice} 
      ${chainData['0x1']?.symbol}`;
    }
    return (
      <div className="container-nft-fullPrice">
        <div className="description description-price description-price-unlockables-page">
          {`${minPrice} – ${maxPrice}`}
        </div>
        <div className="description description-price description-price-unlockables-page">
          {`${chainData['0x1']?.symbol}`}
        </div>
      </div>
    );
  }
  useEffect(() => {
    checkUrl();
  }, [checkUrl]);

  const operatorIsUser = currentUserAddress === operator.toLowerCase();
  // console.info(tokenId, tokenMetadata);

  return (
    <>
      <div className="text-start video-wrapper nft-item-collection mobile-respinsove">
        <div
          className="col-12 rounded font-size"
          style={{
            top: 0,
            position: 'relative',
            height: '100%',
            width: '100%',
            cursor: 'pointer'
          }}>
          {tokenMetadata?.metadata?.animation_url &&
            (isFileUrl === 'gif' ? (
              <></>
            ) : (
              <div onClick={handlePlaying} className="btn-play">
                {playing ? (
                  <div>
                    <FontAwesomeIcon icon={faPause} />
                  </div>
                ) : (
                  <div>
                    <FontAwesomeIcon icon={faPlay} />
                  </div>
                )}
              </div>
            ))}
          <img
            alt="thumbnail"
            src={
              tokenMetadata?.metadata?.image
                ? tokenMetadata?.metadata?.image
                : `${
                    import.meta.env.VITE_IPFS_GATEWAY
                  }/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW`
            }
            style={{
              position: 'absolute',
              bottom: 0,
              borderRadius: '16px',
              objectFit: 'contain'
            }}
            className="col-12 h-100 w-100"
          />
          {
            <SvgKey
              color={'white'}
              bgColor={'rgba(34, 32, 33, 0.5)'}
              mobile={width > 700 ? false : true}
            />
          }
          <div className="col description-wrapper pic-description-wrapper">
            <div className="description-title">
              <div
                className="description-item-name"
                style={{
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}>
                <div className="brief-info-nftItem">
                  <div>
                    <div className="collection-block-user-creator">
                      <img
                        src={
                          accountData?.avatar
                            ? accountData?.avatar
                            : defaultAvatar
                        }
                        alt="user"
                      />{' '}
                      {accountData
                        ? accountData.nickName
                          ? accountData.nickName
                          : `${operator?.slice(0, 14)}...`
                        : `${operator?.slice(0, 14)}...`}
                    </div>
                  </div>
                </div>
                {contractData?.title} #{tokenId}
              </div>
            </div>
            <div className="description-big">
              <img
                className="blockchain-img"
                src={`${chainData['0x1']?.image}`}
                alt="blockchain-img"
              />
              <span className="description description-price">
                {checkPrice()}
              </span>
              <button
                onClick={purchaseToken}
                disabled={operatorIsUser}
                className="btn btn-rhyno mt-5">
                {currentChain !== contractData?.blockchain
                  ? 'Switch network'
                  : operatorIsUser
                    ? 'Cannot purchase your own offer'
                    : 'Purchase'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export const NftItem = memo(ItemOfferComponent);
