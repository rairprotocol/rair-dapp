import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, utils } from 'ethers';
import Swal from 'sweetalert2';

import CreditManager from './CreditManager';
import NavigatorFactory from './NavigatorFactory';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../ducks/users/users.types';
import chainData from '../../utils/blockchainData';
import { metamaskCall } from '../../utils/metamaskUtils';
import setTitle from '../../utils/setTitle';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const Factory = () => {
  const [contractName, setContractName] = useState<string>('');
  const [chainId, setChainId] = useState<BlockchainType | undefined>(undefined);
  const [deploymentPrice, setDeploymentPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [deploymentPriceDiamond, setDeploymentPriceDiamond] =
    useState<BigNumber>(BigNumber.from(0));
  const [userBalance, setUserBalance] = useState<BigNumber>(BigNumber.from(0));
  const [tokenSymbol, setTokenSymbol] = useState<string>('');
  const [deploying, setDeploying] = useState<boolean>(false);
  const [exchangeData, setExchangeData] = useState({});

  const {
    currentUserAddress,
    programmaticProvider,
    factoryInstance,
    erc777Instance,
    diamondFactoryInstance,
    currentChain,
    tokenPurchaserInstance
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryColor, secondaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);
  const { adminRights } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const getExchangeData = useCallback(async () => {
    if (tokenPurchaserInstance) {
      const [ethPrices, rairPrices] =
        await tokenPurchaserInstance.getExhangeRates();
      const exchanges = {};
      ethPrices.forEach((item, index) => {
        exchanges[item] = rairPrices[index];
      });
      setExchangeData(exchanges);
    }
  }, [tokenPurchaserInstance]);

  const getPrice = useCallback(async () => {
    if (window.ethereum) {
      setChainId(currentChain);
    } else if (programmaticProvider) {
      setChainId(currentChain);
    }
    if (factoryInstance && erc777Instance) {
      setDeploymentPrice(
        await factoryInstance.deploymentCostForERC777(erc777Instance.address)
      );
      const userBalance = await erc777Instance.balanceOf(currentUserAddress);
      if (userBalance) {
        getExchangeData();
      }
      setUserBalance(userBalance);
      setTokenSymbol(await erc777Instance.symbol());
    }
    if (diamondFactoryInstance && erc777Instance) {
      setDeploymentPriceDiamond(
        await diamondFactoryInstance.getDeploymentCost(erc777Instance.address)
      );
    }
  }, [
    getExchangeData,
    currentUserAddress,
    factoryInstance,
    erc777Instance,
    programmaticProvider,
    diamondFactoryInstance,
    currentChain
  ]);

  useEffect(() => {
    getPrice();
  }, [getPrice]);

  useEffect(() => {
    if (chainId !== undefined) {
      if (window.ethereum) {
        if (chainId === currentChain) {
          return;
        }
        window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: chainId }]
        });
      } else {
        Swal.fire(
          'Blockchain Switch is disabled on Programmatic Connections!',
          'Switch to the proper chain manually!'
        );
      }
      setDeploymentPrice(BigNumber.from(0));
      setDeploymentPriceDiamond(BigNumber.from(0));
      setTokenSymbol('');
      setUserBalance(BigNumber.from(0));
    }
  }, [chainId, currentChain]);

  useEffect(() => {
    setTitle('Rair Factory');
  }, []);

  return (
    <div className="row my-5 px-0 mx-0">
      <NavigatorFactory>
        <div className="col-12 p-2">
          <InputField
            getter={contractName}
            setter={setContractName}
            placeholder="Name your contract"
            label="Contract name"
            customClass="rounded-rair form-control"
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
            labelClass="text-start w-100"
          />
        </div>
        <div className="col-12 p-2">
          <InputSelect
            options={Object.keys(chainData).map((item /*, index, array*/) => {
              return { label: chainData[item].name, value: item };
            })}
            getter={chainId}
            setter={setChainId}
            placeholder="Please select"
            label="Contract's Blockchain"
            customClass="rounded-rair form-control"
            customCSS={{
              backgroundColor: `var(--${primaryColor})`,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
            labelClass="text-start w-100"
            optionClass="text-white"
          />
        </div>
        <div className="col-12 p-2">
          <button
            disabled={
              contractName === '' ||
              chainId === undefined ||
              adminRights === false ||
              deploymentPrice === BigNumber.from(0) ||
              userBalance === BigNumber.from(0) ||
              deploying
            }
            className="btn btn-stimorol col-12 rounded-rair"
            onClick={async () => {
              setDeploying(true);
              Swal.fire({
                title: 'Deploying contract!',
                html: 'Please wait...',
                icon: 'info',
                showConfirmButton: false
              });
              const success = await metamaskCall(
                erc777Instance?.send(
                  factoryInstance?.address,
                  deploymentPrice,
                  utils.toUtf8Bytes(contractName)
                )
              );
              setDeploying(false);
              if (success) {
                Swal.fire({
                  title: 'Success',
                  html: 'Contract deployed',
                  icon: 'success',
                  showConfirmButton: true
                });
                setContractName('');
              }
            }}>
            Deploy a classic contract for{' '}
            {utils.formatEther(deploymentPrice).toString()} {tokenSymbol} Tokens
          </button>
          {diamondFactoryInstance && (
            <>
              <div className="col-12">or</div>
              <button
                disabled={
                  contractName === '' ||
                  chainId === undefined ||
                  adminRights === false ||
                  deploymentPrice === BigNumber.from(0) ||
                  userBalance === BigNumber.from(0) ||
                  deploying ||
                  diamondFactoryInstance === undefined
                }
                className="btn btn-stimorol col-12 rounded-rair"
                onClick={async () => {
                  setDeploying(true);
                  Swal.fire({
                    title: 'Deploying contract (with Diamonds)!',
                    html: 'Please wait...',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  const success = await metamaskCall(
                    erc777Instance?.send(
                      diamondFactoryInstance.address,
                      deploymentPriceDiamond,
                      utils.toUtf8Bytes(contractName)
                    )
                  );
                  setDeploying(false);
                  if (success) {
                    Swal.fire({
                      title: 'Success',
                      html: 'Contract deployed with Diamonds!',
                      icon: 'success',
                      showConfirmButton: true
                    });
                    setContractName('');
                  }
                }}>
                <i className="fas fa-gem" /> Deploy a <b>diamond</b> contract
                for {utils.formatEther(deploymentPriceDiamond).toString()}{' '}
                {tokenSymbol} Tokens <i className="fas fa-gem" />
              </button>
              <br />
            </>
          )}
          <hr />
          <h5>Your balance:</h5>
          <h2>
            {utils.formatEther(userBalance).toString()} {tokenSymbol} Tokens
          </h2>
        </div>
        {tokenPurchaserInstance &&
          Object.keys(exchangeData).map((ethPrice, index) => {
            return (
              <button
                className="btn btn-stimorol col-12 mt-3 rounded-rair"
                key={index}
                onClick={async () => {
                  Swal.fire({
                    title: 'Please wait',
                    text: 'Wating for user verification',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  if (
                    await metamaskCall(
                      tokenPurchaserInstance.getRAIR({ value: ethPrice })
                    )
                  ) {
                    Swal.fire({
                      title: 'Success',
                      html: `${utils
                        .formatEther(exchangeData[ethPrice])
                        .toString()} ${
                        currentChain && chainData[currentChain]?.symbol
                      }`,
                      icon: 'success',
                      showConfirmButton: true
                    });
                    getPrice();
                  }
                }}>
                Purchase {utils.formatEther(exchangeData[ethPrice]).toString()}{' '}
                {tokenSymbol} for {utils.formatEther(ethPrice).toString()}{' '}
                {currentChain && chainData[currentChain]?.symbol}
              </button>
            );
          })}
        <CreditManager tokenSymbol={tokenSymbol} updateUserBalance={getPrice} />
      </NavigatorFactory>
    </div>
  );
};

export default Factory;
