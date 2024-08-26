import { useCallback, useEffect, useState } from 'react';
import { Contract, isAddress, ZeroAddress } from 'ethers';
import { Hex } from 'viem';

import { ContractDataType, ContractsResponseType } from './adminView.types';

import { TTokenData } from '../../axios.responseTypes';
import { diamondFactoryAbi, erc721Abi } from '../../contracts';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const TransferTokens = () => {
  const { connectedChain, currentUserAddress } = useAppSelector(
    (store) => store.web3
  );
  const { primaryButtonColor, textColor, secondaryButtonColor } =
    useAppSelector((store) => store.colors);
  const { getBlockchainData } = useServerSettings();

  const [traderRole, setTraderRole] = useState<boolean | undefined>();
  const [manualAddress, setManualAddress] = useState<boolean>(false);
  const [manualDiamond, setManualDiamond] = useState<boolean>(false);

  const [contractData, setContractData] = useState<
    ContractDataType | undefined
  >();
  const [userContracts, setUserContracts] = useState<OptionsType[]>([]);
  const [selectedContract, setSelectedContract] = useState<string>('null');

  const [contractProducts, setContractProducts] = useState<OptionsType[]>([]);
  const [selectedProduct, setSelectedProducts] = useState<string>('null');

  const [ownedTokens, setOwnedTokens] = useState<TTokenData[]>([]);
  const [tokenId, setTokenId] = useState<string>('0');
  const [targetAddress, setTargetAddress] = useState<string>('');
  const [allTokensFilter, setAllTokensFilter] = useState<boolean>(true);

  const [contractBlockchain, setContractBlockchain] = useState<any>();
  const [contractInstance, setContractInstance] = useState<
    Contract | undefined
  >();

  const { contractCreator } = useContracts();

  const reactSwal = useSwal();
  const { web3TxHandler, web3Switch, correctBlockchain } = useWeb3Tx();

  const getUserContracts = useCallback(async () => {
    const response: ContractsResponseType = await rFetch(
      '/api/contracts/factoryList'
    );
    if (response.success) {
      setUserContracts(
        response.contracts
          .map((item) => {
            return {
              label: `${item.title} (${item.blockchain}) (${
                item.diamond ? 'Diamond' : 'Classic'
              })`,
              value: `/network/${item.blockchain}/${item.contractAddress}`
            };
          })
          .sort((a, b) => {
            if (a.label > b.label) {
              return 1;
            } else {
              return -1;
            }
          })
      );
    }
  }, [setUserContracts]);

  useEffect(() => {
    getUserContracts();
  }, [getUserContracts]);

  const connectAddressManual = async () => {
    if (connectedChain === undefined) return;
    if (selectedContract === '') return;
    if (!isAddress(selectedContract)) return;
    let instance;
    try {
      instance = contractCreator?.(
        selectedContract as Hex,
        manualDiamond ? diamondFactoryAbi : erc721Abi
      );
    } catch (err) {
      console.error("Can't connect to address");
    }
    const name = await web3TxHandler(
      instance,
      'name',
      [],
      {
        intendedBlockchain: connectedChain,
        failureMessage:
          'Unable to connect to the contract, please verify the address, blockchain and type of the contract'
      }
      // name return string
    );

    if (name !== false && typeof name === 'string') {
      setContractData({
        title: name,
        contractAddress: await instance.getAddress()
      });
      setContractBlockchain(getBlockchainData(connectedChain));
      setContractInstance(instance);
    } else {
      return;
    }
  };
  const getContractData = useCallback(async () => {
    if (manualAddress) {
      return;
    }
    setContractInstance(undefined);
    setContractBlockchain(undefined);
    setTraderRole(undefined);
    if (selectedContract !== 'null') {
      setContractData(undefined);
      const response1 = await rFetch(`/api/contracts/${selectedContract}`);
      if (response1.success) {
        setContractData(response1.contract);
      }
      setSelectedProducts('null');
      setContractProducts([]);
      setOwnedTokens([]);
      const response2 = await rFetch(
        `/api/contracts/${selectedContract}/product/offers`
      );
      if (response2.success) {
        setContractProducts(
          response2.products.map((item) => {
            return {
              label: `${item.name}`,
              value: item.collectionIndexInContract
            };
          })
        );
      }
      const [, , selectedBlockchain, contractAddress] =
        selectedContract.split('/');
      setContractBlockchain(
        getBlockchainData(selectedBlockchain as `0x${string}`)
      );
      if (
        correctBlockchain(selectedBlockchain as Hex) &&
        isAddress(contractAddress)
      ) {
        const instance = contractCreator?.(
          contractAddress as Hex,
          response1.contract.diamond ? diamondFactoryAbi : erc721Abi
        );
        setContractInstance(instance);
      }
    }
  }, [
    manualAddress,
    selectedContract,
    getBlockchainData,
    correctBlockchain,
    contractCreator
  ]);

  useEffect(() => {
    getContractData();
  }, [getContractData]);

  const getProductNFTs = useCallback(async () => {
    if (manualAddress) {
      return;
    }
    if (selectedProduct !== 'null') {
      const response4 = await rFetch(
        `/api/nft/${selectedContract}/${selectedProduct.toString()}`
      );
      if (response4.success) {
        setOwnedTokens(response4.result.tokens);
      }
    }
  }, [manualAddress, selectedProduct, selectedContract]);

  useEffect(() => {
    getProductNFTs();
  }, [getProductNFTs]);

  const hasTraderRole = useCallback(async () => {
    if (contractInstance && !traderRole) {
      const TRADER = await contractInstance.TRADER();
      if (!TRADER) {
        setTraderRole(false);
        return;
      }
      const response = await web3TxHandler(contractInstance, 'hasRole', [
        TRADER,
        currentUserAddress
      ]);
      // eslint-disable-next-line
      if (typeof (response === 'boolean')) {
        setTraderRole(response);
      }
    }
  }, [contractInstance, currentUserAddress, traderRole, web3TxHandler]);

  useEffect(() => {
    hasTraderRole();
  }, [hasTraderRole]);

  return (
    <div className="w-100 row px-5">
      <div className="col-12">
        <button
          onClick={() => {
            setManualAddress(false);
            setSelectedContract('null');
            setContractData(undefined);
          }}
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          className="btn col-xs-12 col-md-6 rair-button">
          Database
        </button>
        <button
          onClick={() => {
            setManualAddress(true);
            setSelectedContract('');
            setContractData(undefined);
          }}
          className="col-12 col-md-6 btn rair-button"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}>
          Blockchain
        </button>
      </div>
      <div className="col-12">
        {manualAddress === false ? (
          <>
            <InputSelect
              getter={selectedContract}
              setter={setSelectedContract}
              options={userContracts}
              customClass="form-control"
              label="Contract"
              placeholder="Select your contract"
            />
            {selectedContract !== null && contractProducts.length > 0 && (
              <InputSelect
                getter={selectedProduct}
                setter={setSelectedProducts}
                options={contractProducts}
                customClass="form-control"
                label="Product"
                placeholder="Select your product"
              />
            )}
          </>
        ) : (
          <div className="row">
            <div className="col-12 col-md-10">
              <InputField
                getter={selectedContract}
                setter={setSelectedContract}
                label="Contract address"
                customClass="form-control"
                labelClass="col-12"
              />
            </div>
            <div className="col-12 col-md-2 pt-4">
              <button
                onClick={() => setManualDiamond(!manualDiamond)}
                style={{
                  color: textColor,
                  background: manualDiamond
                    ? secondaryButtonColor
                    : primaryButtonColor
                }}
                className="btn rair-button">
                {manualDiamond ? 'Diamond' : 'Classic'} Contract
              </button>
            </div>
            <div className="col-12">
              <button
                disabled={
                  !isAddress(selectedContract) ||
                  (contractData &&
                    contractData.contractAddress === selectedContract)
                }
                onClick={connectAddressManual}
                className="btn btn-success">
                Connect to address!
              </button>
            </div>
          </div>
        )}
      </div>
      <br />
      <hr />
      {(selectedProduct !== 'null' || (contractData && manualAddress)) && (
        <>
          <div className="col-12 row">
            {contractData && (
              <div className="col-12">
                {`Connected to: ${contractData.title} (${contractData.contractAddress})`}
              </div>
            )}
            <div className="col-xs-12 col-md-6">
              <div className="col-12 mx-2">
                <InputField
                  getter={tokenId}
                  setter={setTokenId}
                  label="Token #"
                  customClass="form-control"
                  labelClass="col-12"
                  type="number"
                />
              </div>
              {ownedTokens.length !== 0 && (
                <button
                  style={{
                    color: textColor,
                    background: manualDiamond
                      ? secondaryButtonColor
                      : primaryButtonColor
                  }}
                  className={'col-12 mx-2 btn rair-button'}
                  onClick={() => setAllTokensFilter(!allTokensFilter)}>
                  {allTokensFilter ? 'Minted' : 'Owned'} tokens
                </button>
              )}
              {ownedTokens
                .filter((item) =>
                  allTokensFilter
                    ? item.ownerAddress !== ZeroAddress
                    : item.ownerAddress === currentUserAddress
                )
                .map((item, index) => {
                  return (
                    <button
                      className={
                        'btn btn-outline-primary text-white mx-2 col-12'
                      }
                      onClick={() => {
                        setTokenId(item.uniqueIndexInContract);
                      }}
                      key={index}>
                      <small>{item?.offer?.offerName}</small>
                      <h5>{item?.metadata?.name}</h5>
                      NFT #{item?.uniqueIndexInContract}
                      <br />
                      <small>Owned by {item?.ownerAddress}</small>
                    </button>
                  );
                })}
            </div>
            <div className="col-12 col-md-6">
              <div className="col-12">
                {contractBlockchain && (
                  <button
                    disabled={connectedChain === contractBlockchain.hash}
                    className="btn rair-button"
                    style={{
                      background: secondaryButtonColor,
                      color: textColor
                    }}
                    onClick={() => web3Switch(contractBlockchain.hash)}>
                    1.-{' '}
                    {connectedChain === contractBlockchain.hash
                      ? 'Connected to'
                      : 'Switch to'}{' '}
                    {contractBlockchain.name}
                  </button>
                )}
              </div>
              <div className="col-12">
                <InputField
                  getter={targetAddress}
                  setter={setTargetAddress}
                  label="Send to"
                  customClass="form-control"
                  labelClass="col-12"
                />
              </div>
              <div className="col-12">
                {contractInstance && (
                  <button
                    disabled={
                      connectedChain !== contractBlockchain?.hash ||
                      traderRole !== false
                    }
                    className="btn rair-button"
                    style={{
                      background: secondaryButtonColor,
                      color: textColor
                    }}
                    onClick={async () => {
                      reactSwal.fire({
                        title: 'Please wait',
                        html: 'Granting TRADER role',
                        icon: 'info',
                        showConfirmButton: false
                      });
                      if (
                        await web3TxHandler(contractInstance, 'grantRole', [
                          await contractInstance.TRADER(),
                          currentUserAddress
                        ])
                      ) {
                        reactSwal.fire({
                          title: 'Success',
                          html: 'Role granted',
                          icon: 'success'
                        });
                      }
                    }}>
                    2.-{' '}
                    {traderRole === undefined
                      ? 'Querying roles...'
                      : traderRole === true
                        ? 'Already have Trader role'
                        : 'Grant yourself the Trader role'}
                  </button>
                )}
              </div>
              <div className="col-12">
                {contractInstance && (
                  <button
                    disabled={
                      connectedChain !== contractBlockchain?.hash ||
                      !traderRole ||
                      !isAddress(targetAddress) ||
                      !contractInstance
                    }
                    className="btn rair-button"
                    style={{
                      background: secondaryButtonColor,
                      color: textColor
                    }}
                    onClick={async () => {
                      reactSwal.fire({
                        title: 'Please wait',
                        html: `Transferring token to ${targetAddress}`,
                        icon: 'info',
                        showConfirmButton: false
                      });

                      if (
                        await web3TxHandler(
                          contractInstance,
                          'safeTransferFrom(address,address,uint256)',
                          [currentUserAddress, targetAddress, tokenId]
                        )
                      ) {
                        reactSwal.fire({
                          title: 'Success',
                          html: 'Token sent',
                          icon: 'success'
                        });
                      }
                    }}>
                    Transfer #{tokenId} to {targetAddress}
                  </button>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TransferTokens;
