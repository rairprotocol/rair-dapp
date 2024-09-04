import { useCallback, useEffect, useState } from 'react';
import { NavLink, useParams } from 'react-router-dom';
import { faArrowRight, faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isAddress } from 'ethers';
import { Hex } from 'viem';

import { BannerCollection } from './BannerCollection';
import {
  TContractsNetworkContract,
  TContractsNetworkOffersResponse,
  TListCollectionsContractResponse,
  TListCollectionsNetworkProductsResponse,
  TListCollectionsOffers,
  TParamsContractDetails,
  TProductDataLocal,
  TSetDataUseState
} from './creatorStudio.types';
import NavigatorContract from './NavigatorContract';

import { TProducts } from '../../axios.responseTypes';
import { diamondFactoryAbi } from '../../contracts';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import { rFetch } from '../../utils/rFetch';

const ListCollections = () => {
  const { primaryColor, iconColor } = useAppSelector((store) => store.colors);
  const { connectedChain } = useAppSelector((store) => store.web3);
  const { contractCreator } = useContracts();
  const { address, blockchain } = useParams<TParamsContractDetails>();

  const [data, setData] = useState<
    TContractsNetworkContract | TSetDataUseState
  >();

  const getContractData = useCallback(async () => {
    if (!address) {
      return;
    }
    const response2: TListCollectionsContractResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}`
    );
    const response3: TListCollectionsNetworkProductsResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/products`
    );
    if (response3.success) {
      response2.contract.products = response3.products;
    }
    const response4: TContractsNetworkOffersResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/offers`
    );
    // Special case where a product exists but it has no offers
    if (response4.success) {
      response4.products.forEach((item: TListCollectionsOffers) => {
        response2.contract.products.forEach((existingItem: TProducts) => {
          if (item._id.toString() === existingItem._id.toString()) {
            existingItem.offers = item.offers;
          }
        });
      });
    }
    if (response2.contract) {
      setData(response2.contract);
    } else if (isAddress(address) && contractCreator) {
      // Try diamonds
      const instance = contractCreator(address as Hex, diamondFactoryAbi);
      if (!instance) {
        return;
      }
      const productCount = Number(
        (await instance.getProductCount()).toString()
      );
      const productData: TProductDataLocal[] = [];
      for (let i = 0; i < productCount; i++) {
        productData.push({
          collectionIndexInContract: i,
          name: (await instance.getProductInfo(i)).name,
          diamond: true
        });
      }
      setData({
        title: await instance?.name(),
        contractAddress: address,
        blockchain: connectedChain,
        products: productData
      });
    }
  }, [address, blockchain, contractCreator, connectedChain]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  return (
    <div className="row px-0 mx-0">
      {data ? (
        <NavigatorContract
          contractName={data.title}
          contractAddress={data.contractAddress}
          contractBlockchain={blockchain}>
          {data.products.map(
            (item: TProducts | TProductDataLocal, index: number) => {
              return (
                <div key={index} className="col-12 row collection-item-banner">
                  <BannerCollection
                    item={item}
                    getContractData={getContractData}
                  />
                  <NavLink
                    to={`/creator/contract/${blockchain}/${data.contractAddress}/collection/${item.collectionIndexInContract}/offers`}
                    style={{
                      position: 'relative',
                      backgroundColor: `color-mix(in srgb, ${primaryColor}, #888888)`
                    }}
                    className={`col-10 btn btn-${primaryColor} text-start rounded-rair my-1`}>
                    {item.diamond && <FontAwesomeIcon icon={faGem} />}{' '}
                    {item.name}
                    <FontAwesomeIcon
                      icon={faArrowRight}
                      style={{
                        position: 'absolute',
                        right: '10px',
                        top: '10px',
                        color:
                          import.meta.env.VITE_TESTNET === 'true'
                            ? `${
                                iconColor === '#1486c5' ? '#F95631' : iconColor
                              }`
                            : `${
                                iconColor === '#1486c5' ? '#E882D5' : iconColor
                              }`
                      }}
                    />
                  </NavLink>
                </div>
              );
            }
          )}
        </NavigatorContract>
      ) : (
        'Fetching data...'
      )}
    </div>
  );
};

export default ListCollections;
