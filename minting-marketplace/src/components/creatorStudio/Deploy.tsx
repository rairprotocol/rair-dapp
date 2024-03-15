import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { BigNumber, utils } from 'ethers';
import { stringToHex } from 'viem';

import CreditManager from './CreditManager';
import NavigatorFactory from './NavigatorFactory';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import chainData from '../../utils/blockchainData';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const Factory = () => {
  const [contractName, setContractName] = useState<string>('');

  const [deploymentPrice, setDeploymentPrice] = useState<BigNumber>(
    BigNumber.from(0)
  );
  const [deploymentPriceDiamond, setDeploymentPriceDiamond] =
    useState<BigNumber>(BigNumber.from(0));
  const [userBalance, setUserBalance] = useState<BigNumber>(BigNumber.from(0));
  const [tokenSymbol, setTokenSymbol] = useState<string>('');

  const [deploying, setDeploying] = useState<boolean>(false);
  const [exchangeData, setExchangeData] = useState({});

  const { web3TxHandler, web3Switch } = useWeb3Tx();
  const reactSwal = useSwal();

  const {
    currentUserAddress,
    factoryInstance,
    erc777Instance,
    diamondFactoryInstance,
    currentChain,
    tokenPurchaserInstance
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryColor, secondaryColor, primaryButtonColor, textColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const { adminRights } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const getExchangeData = useCallback(async () => {
    if (tokenPurchaserInstance) {
      const [ethPrices, rairPrices] = await web3TxHandler(
        tokenPurchaserInstance,
        'getExhangeRates'
      );
      const exchanges = {};
      ethPrices.forEach((item, index) => {
        exchanges[item] = rairPrices[index];
      });
      setExchangeData(exchanges);
    }
  }, [tokenPurchaserInstance, web3TxHandler]);

  const getLegacyDeploymentCost = useCallback(async () => {
    if (factoryInstance && erc777Instance && deploymentPrice.eq(0)) {
      const value = await web3TxHandler(
        factoryInstance,
        'deploymentCostForERC777',
        [erc777Instance.address]
      );
      if (value?._isBigNumber) {
        setDeploymentPrice(value);
      }
    }
  }, [factoryInstance, erc777Instance, deploymentPrice]);

  const getDiamondDeploymentCost = useCallback(async () => {
    if (
      diamondFactoryInstance &&
      erc777Instance &&
      deploymentPriceDiamond.eq(0)
    ) {
      const value = await web3TxHandler(
        diamondFactoryInstance,
        'getDeploymentCost',
        [erc777Instance.address]
      );
      if (value?._isBigNumber) {
        setDeploymentPriceDiamond(value);
      }
    }
  }, [diamondFactoryInstance, erc777Instance, deploymentPriceDiamond]);

  const getUserBalance = useCallback(async () => {
    if (erc777Instance && userBalance?.eq(0)) {
      const userBalance = await web3TxHandler(erc777Instance, 'balanceOf', [
        currentUserAddress
      ]);
      if (userBalance?._isBigNumber) {
        getExchangeData();
        setUserBalance(userBalance);
      }
      const symbolValue = await web3TxHandler(erc777Instance, 'symbol');
      if (symbolValue) {
        setTokenSymbol(symbolValue);
      }
    }
  }, [erc777Instance, currentUserAddress]);

  useEffect(() => {
    getLegacyDeploymentCost();
  }, [getLegacyDeploymentCost]);
  useEffect(() => {
    getDiamondDeploymentCost();
  }, [getDiamondDeploymentCost]);
  useEffect(() => {
    getUserBalance();
  }, [getUserBalance]);

  const updateChain = useCallback(
    async (chainId: BlockchainType) => {
      if (chainId !== undefined) {
        await web3Switch(chainId);
        setDeploymentPrice(BigNumber.from(0));
        setDeploymentPriceDiamond(BigNumber.from(0));
        setTokenSymbol('');
        setUserBalance(BigNumber.from(0));
      }
    },
    [web3Switch]
  );

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
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
            labelClass="text-start w-100"
          />
        </div>
        <div className="col-12 p-2">
          <InputSelect
            options={Object.keys(chainData)
              .filter((chain) => chainData[chain].disabled !== true)
              .map((item) => {
                return { label: chainData[item].name, value: item };
              })}
            getter={currentChain}
            setter={updateChain}
            placeholder="Please select"
            label="Contract's Blockchain"
            customClass="rounded-rair form-control"
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
            labelClass="text-start w-100"
            optionClass="text-white"
          />
        </div>
        <div className="col-12 p-2">
          {factoryInstance && (
            <button
              disabled={
                contractName === '' ||
                currentChain === undefined ||
                adminRights === false ||
                deploymentPrice === BigNumber.from(0) ||
                userBalance === BigNumber.from(0) ||
                deploying ||
                !erc777Instance
              }
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button col-12 rounded-rair"
              onClick={async () => {
                if (!erc777Instance) {
                  return;
                }
                setDeploying(true);
                reactSwal.fire({
                  title: 'Deploying contract!',
                  html: 'Please wait...',
                  icon: 'info',
                  showConfirmButton: false
                });
                const success = await web3TxHandler(erc777Instance, 'send', [
                  factoryInstance?.address,
                  deploymentPrice,
                  stringToHex(contractName)
                ]);
                setDeploying(false);
                if (success) {
                  reactSwal.fire({
                    title: 'Success',
                    html: 'Contract deployed',
                    icon: 'success',
                    showConfirmButton: true
                  });
                  setContractName('');
                }
              }}>
              Deploy a classic contract for{' '}
              {deploymentPrice && utils.formatEther(deploymentPrice).toString()}{' '}
              {tokenSymbol} Tokens
            </button>
          )}
          {factoryInstance && diamondFactoryInstance && (
            <div className="col-12">or</div>
          )}
          {diamondFactoryInstance && (
            <button
              disabled={
                contractName === '' ||
                currentChain === undefined ||
                adminRights === false ||
                deploymentPrice === BigNumber.from(0) ||
                userBalance === BigNumber.from(0) ||
                deploying ||
                diamondFactoryInstance === undefined ||
                !erc777Instance
              }
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button col-12 rounded-rair mt-3"
              onClick={async () => {
                if (!erc777Instance) {
                  return;
                }
                setDeploying(true);
                reactSwal.fire({
                  title: 'Deploying contract (with Diamonds)!',
                  html: 'Please wait...',
                  icon: 'info',
                  showConfirmButton: false
                });
                const success = await web3TxHandler(erc777Instance, 'send', [
                  diamondFactoryInstance.address,
                  deploymentPriceDiamond,
                  stringToHex(contractName)
                ]);
                setDeploying(false);
                if (success) {
                  reactSwal.fire({
                    title: 'Success',
                    html: 'Contract deployed with Diamonds!',
                    icon: 'success',
                    showConfirmButton: true
                  });
                  setContractName('');
                }
              }}>
              <i className="fas fa-gem" /> Deploy a <b>diamond</b> contract for{' '}
              {deploymentPriceDiamond &&
                utils.formatEther(deploymentPriceDiamond).toString()}{' '}
              {tokenSymbol} Tokens <i className="fas fa-gem" />
            </button>
          )}
          <br />
          <hr />
          <h5>Your balance:</h5>
          <h2>
            {userBalance && utils.formatEther(userBalance).toString()}{' '}
            {tokenSymbol} Tokens
          </h2>
        </div>
        {tokenPurchaserInstance &&
          Object.keys(exchangeData).map((ethPrice, index) => {
            return (
              <button
                style={{
                  background: primaryButtonColor,
                  color: textColor
                }}
                className="btn rair-button col-12 mt-3 rounded-rair"
                key={index}
                onClick={async () => {
                  reactSwal.fire({
                    title: 'Please wait',
                    text: 'Wating for user verification',
                    icon: 'info',
                    showConfirmButton: false
                  });
                  if (
                    await web3TxHandler(tokenPurchaserInstance, 'getRAIR', [
                      {
                        value: ethPrice.toString()
                      }
                    ])
                  ) {
                    reactSwal.fire({
                      title: 'Success',
                      html: `${utils
                        .formatEther(exchangeData[ethPrice])
                        .toString()} ${
                        currentChain && chainData[currentChain]?.symbol
                      }`,
                      icon: 'success',
                      showConfirmButton: true
                    });
                    await getLegacyDeploymentCost();
                    await getDiamondDeploymentCost();
                    await getUserBalance();
                  }
                }}>
                Purchase {utils.formatEther(exchangeData[ethPrice]).toString()}{' '}
                {tokenSymbol} for {utils.formatEther(ethPrice).toString()}{' '}
                {currentChain && chainData[currentChain]?.symbol}
              </button>
            );
          })}
        <CreditManager
          tokenSymbol={tokenSymbol}
          updateUserBalance={() => {
            getLegacyDeploymentCost();
            getDiamondDeploymentCost();
            getUserBalance();
          }}
        />
      </NavigatorFactory>
    </div>
  );
};

export default Factory;
