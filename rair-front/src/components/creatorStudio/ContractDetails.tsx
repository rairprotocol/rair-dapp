import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { isAddress } from 'ethers';
import { Hex } from 'viem';

import {
  TContractsNetworkContract,
  TContractsNetworkProductsResponse,
  TContractsNetworkResponseType,
  TParamsContractDetails,
  TSetData
} from './creatorStudio.types';
import FixedBottomNavigation from './FixedBottomNavigation';
import NavigatorContract from './NavigatorContract';

import { diamond721Abi, erc721Abi } from '../../contracts';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

const ContractDetails = () => {
  const [collectionName, setCollectionName] = useState<string>('');
  const [isDiamond, setIsDiamond] = useState<boolean>(false);
  const [collectionLength, setCollectionLength] = useState<number>(0);

  const [creatingCollection, setCreatingCollection] = useState<boolean>(false);

  const { getBlockchainData } = useServerSettings();

  const { primaryColor, secondaryColor } = useAppSelector(
    (store) => store.colors
  );
  const { connectedChain } = useAppSelector((store) => store.web3);
  const { contractCreator } = useContracts();
  const { address, blockchain } = useParams<TParamsContractDetails>();

  const [data, setData] = useState<TContractsNetworkContract | TSetData>();

  const reactSwal = useSwal();
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const getContractData = useCallback(async () => {
    if (!address) {
      return;
    }
    const dataRequest: TContractsNetworkResponseType = await rFetch(
      `/api/contracts/network/${blockchain}/${address}`
    );
    const productsRequest: TContractsNetworkProductsResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/products`
    );
    if (dataRequest.success) {
      if (productsRequest.success) {
        dataRequest.contract.products = productsRequest.products;
      }
      setData(dataRequest.contract);
      setIsDiamond(dataRequest.contract.diamond);
    } else if (contractCreator && isAddress(address)) {
      // Try diamonds
      const instance = contractCreator(address as Hex, diamond721Abi);
      if (instance) {
        const productCount = Number(
          (await instance.getProductCount()).toString()
        );
        setIsDiamond(true);
        setData({
          title: await instance?.name(),
          contractAddress: address,
          blockchain: connectedChain,
          products: Array(productCount)
        });
      }
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
          contractBlockchain={data.blockchain}>
          <div className="col-8 p-2">
            <InputField
              disabled={creatingCollection}
              getter={collectionName}
              setter={setCollectionName}
              placeholder="Name your collection"
              label="New Collection name"
              customClass="rounded-rair form-control"
              customCSS={{
                backgroundColor: primaryColor,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
              labelClass="text-start w-100"
            />
          </div>
          <div className="col-4 p-2">
            <InputField
              disabled={creatingCollection}
              getter={collectionLength}
              setter={setCollectionLength}
              placeholder="Length"
              label="Length"
              type="number"
              min={0}
              customClass="rounded-rair form-control"
              customCSS={{
                backgroundColor: primaryColor,
                color: 'inherit',
                borderColor: `var(--${secondaryColor}-40)`
              }}
              labelClass="text-start w-100"
            />
          </div>
          <div
            className="col-12 p-3 mt-5 rounded-rair"
            style={{
              border: `1.3px dashed color-mix(in srgb, ${primaryColor}, #888888)`
            }}>
            Contract Information: <br />
            <ul className="col-12 mt-3 px-4 text-start">
              <li className="row">
                <span className="col-12 py-1 text-start">
                  Total Supply: <b>0</b>
                </span>
                <span className="col-12 py-1 text-start">
                  Collections Created:{' '}
                  <b>{data?.products?.length ? data?.products?.length : 0}</b>
                </span>
                <span className="col-12 py-1 text-start">
                  Current Balance: <b>0</b>
                </span>
              </li>
            </ul>
          </div>
        </NavigatorContract>
      ) : (
        'Fetching data...'
      )}
      <FixedBottomNavigation
        forwardFunctions={[
          {
            action:
              collectionLength > 0 && collectionName !== ''
                ? async () => {
                    if (!data?.blockchain) {
                      return;
                    }
                    if (!correctBlockchain(data.blockchain)) {
                      web3Switch(data.blockchain);
                    } else if (isAddress(data?.contractAddress)) {
                      const instance = await contractCreator?.(
                        data.contractAddress as Hex,
                        isDiamond ? diamond721Abi : erc721Abi
                      );
                      if (!instance) {
                        return;
                      }
                      reactSwal.fire({
                        title: 'Creating collection!',
                        html: 'Please wait...',
                        icon: 'info',
                        showConfirmButton: false
                      });
                      setCreatingCollection(true);
                      const success = await web3TxHandler(
                        instance,
                        'createProduct',
                        [collectionName, collectionLength]
                      );
                      if (success) {
                        reactSwal.fire({
                          title: 'Success!',
                          html: 'Collection created',
                          icon: 'success',
                          showConfirmButton: true
                        });
                        setCollectionName('');
                        setCollectionLength(0);
                      }
                      setCreatingCollection(false);
                    }
                  }
                : undefined,
            label:
              data && data.blockchain && !correctBlockchain(data.blockchain)
                ? `Switch to ${getBlockchainData(data.blockchain)?.name}`
                : 'Create collection!',
            disabled:
              creatingCollection ||
              collectionLength === 0 ||
              collectionName === ''
          }
        ]}
      />
    </div>
  );
};

export default ContractDetails;
