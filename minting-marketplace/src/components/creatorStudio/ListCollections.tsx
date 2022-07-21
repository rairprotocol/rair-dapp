import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { rFetch } from '../../utils/rFetch';
import { useParams, useNavigate, NavLink } from 'react-router-dom';
import { diamondFactoryAbi } from '../../contracts';

import FixedBottomNavigation from './FixedBottomNavigation';
import NavigatorContract from './NavigatorContract';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import {
  TContractsNetworkContract,
  TContractsNetworkOffersResponse,
  TListCollectionsNetworkProductsResponse,
  TListCollectionsContractResponse,
  TListCollectionsOffers,
  TListCollectionsProducts,
  TParamsContractDetails,
  TProductDataLocal,
  TSetDataUseState
} from './creatorStudio.types';

const ListCollections = () => {
  const { primaryColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );
  const { contractCreator, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const { address, blockchain } = useParams<TParamsContractDetails>();

  const [data, setData] = useState<
    TContractsNetworkContract | TSetDataUseState
  >();

  const navigate = useNavigate();

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
      `/api/contracts/network/${blockchain}/${address}/products/offers`
    );
    // Special case where a product exists but it has no offers
    if (response4.success) {
      response4.products.forEach((item: TListCollectionsOffers) => {
        response2.contract.products.forEach(
          (existingItem: TListCollectionsProducts) => {
            if (item._id.toString() === existingItem._id.toString()) {
              existingItem.offers = item.offers;
            }
          }
        );
      });
    }
    if (response2.contract) {
      setData(response2.contract);
    } else {
      // Try diamonds
      const instance = contractCreator?.(address, diamondFactoryAbi);
      const productCount = Number(
        (await instance?.getProductCount()).toString()
      );
      const productData: TProductDataLocal[] = [];
      for (let i = 0; i < productCount; i++) {
        productData.push({
          collectionIndexInContract: i,
          name: (await instance?.getProductInfo(i)).name,
          diamond: true
        });
      }
      setData({
        title: await instance?.name(),
        contractAddress: address,
        blockchain: currentChain,
        products: productData
      });
    }
  }, [address, blockchain, contractCreator, currentChain]);

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
            (
              item: TListCollectionsProducts | TProductDataLocal,
              index: number
            ) => {
              return (
                <NavLink
                  to={`/creator/contract/${blockchain}/${data.contractAddress}/collection/${item.collectionIndexInContract}/offers`}
                  key={index}
                  style={{
                    position: 'relative',
                    backgroundColor: `var(--${primaryColor}-80)`
                  }}
                  className={`col-12 btn btn-${primaryColor} text-start rounded-rair my-1`}>
                  {item.diamond && <i className="fas fa-gem" />} {item.name}
                  <i
                    className="fas fa-arrow-right"
                    style={{
                      position: 'absolute',
                      right: '10px',
                      top: '10px',
                      color: 'var(--bubblegum)'
                    }}
                  />
                </NavLink>
              );
            }
          )}
        </NavigatorContract>
      ) : (
        'Fetching data...'
      )}
      <FixedBottomNavigation
        backwardFunction={() => {
          navigate(-1);
        }}
      />
    </div>
  );
};

export default ListCollections;
