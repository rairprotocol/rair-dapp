import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { faGem, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';
import { stringToHex } from 'viem';

import NavigatorFactory from './NavigatorFactory';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { TUsersInitialState } from '../../ducks/users/users.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import useServerSettings from '../adminViews/useServerSettings';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const Factory = () => {
  const [contractName, setContractName] = useState<string>('');

  const [deploymentPrice, setDeploymentPrice] = useState<BigNumber>();
  const [deploymentPriceDiamond, setDeploymentPriceDiamond] = useState<
    BigNumber | undefined
  >();

  const [allowance, setAllowance] = useState<BigNumber | undefined>();

  const { blockchainSettings } = useServerSettings();

  const [userBalance, setUserBalance] = useState<BigNumber>();
  const [tokenSymbol, setTokenSymbol] = useState<string>('');

  const [deploying, setDeploying] = useState<boolean>(false);

  const { web3TxHandler, web3Switch } = useWeb3Tx();
  const reactSwal = useSwal();

  const {
    currentUserAddress,
    factoryInstance,
    mainTokenInstance,
    diamondFactoryInstance,
    currentChain
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { primaryColor, secondaryColor, primaryButtonColor, textColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const { adminRights } = useSelector<RootState, TUsersInitialState>(
    (store) => store.userStore
  );

  const getAllowance = useCallback(async () => {
    if (mainTokenInstance && diamondFactoryInstance) {
      const allowanceCheck = await web3TxHandler(
        mainTokenInstance,
        'allowance',
        [currentUserAddress, diamondFactoryInstance.address]
      );
      setAllowance(allowanceCheck);
    }
  }, [
    mainTokenInstance,
    diamondFactoryInstance,
    currentUserAddress,
    web3TxHandler
  ]);

  useEffect(() => {
    if (allowance !== undefined) {
      return;
    }
    getAllowance();
  }, [getAllowance, allowance]);

  const getLegacyDeploymentCost = useCallback(async () => {
    if (factoryInstance && mainTokenInstance && deploymentPrice === undefined) {
      const value = await web3TxHandler(
        factoryInstance,
        'deploymentCostForERC777',
        [mainTokenInstance.address]
      );
      if (value?._isBigNumber) {
        setDeploymentPrice(value);
      }
    }
  }, [factoryInstance, mainTokenInstance, deploymentPrice, web3TxHandler]);

  const getDiamondDeploymentCost = useCallback(async () => {
    if (
      diamondFactoryInstance &&
      mainTokenInstance &&
      deploymentPriceDiamond === undefined
    ) {
      const value = await web3TxHandler(
        diamondFactoryInstance,
        'getDeploymentCost'
      );
      if (value?._isBigNumber) {
        setDeploymentPriceDiamond(value);
      }
    }
  }, [
    diamondFactoryInstance,
    mainTokenInstance,
    deploymentPriceDiamond,
    web3TxHandler
  ]);

  useEffect(() => {
    setUserBalance(undefined);
    setAllowance(undefined);
    setDeploymentPrice(undefined);
    setDeploymentPriceDiamond(undefined);
  }, [currentChain]);

  const getUserBalance = useCallback(async () => {
    if (mainTokenInstance && userBalance === undefined) {
      const userBalance = await web3TxHandler(mainTokenInstance, 'balanceOf', [
        currentUserAddress
      ]);
      if (userBalance?._isBigNumber) {
        setUserBalance(userBalance);
      }
      const symbolValue = await web3TxHandler(mainTokenInstance, 'symbol');
      if (symbolValue) {
        setTokenSymbol(symbolValue);
      }
    }
  }, [mainTokenInstance, currentUserAddress, userBalance, web3TxHandler]);

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

  const deployClassic = useCallback(async () => {
    if (!mainTokenInstance || !factoryInstance) {
      return;
    }
    setDeploying(true);
    reactSwal.fire({
      title: 'Deploying contract!',
      html: 'Please wait...',
      icon: 'info',
      showConfirmButton: false
    });
    const success = await web3TxHandler(mainTokenInstance, 'send', [
      factoryInstance.address,
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
  }, [
    mainTokenInstance,
    contractName,
    deploymentPrice,
    factoryInstance,
    reactSwal,
    web3TxHandler
  ]);

  const deployDiamond = useCallback(async () => {
    if (
      !mainTokenInstance ||
      !diamondFactoryInstance ||
      contractName === '' ||
      !deploymentPriceDiamond ||
      deploymentPriceDiamond.eq(0)
    ) {
      return;
    }
    setDeploying(true);
    if (allowance?.lt(deploymentPriceDiamond)) {
      reactSwal.fire({
        title: 'Step 1 of 2',
        html: `Approve ${utils
          .formatEther(deploymentPriceDiamond)
          .toString()} ${tokenSymbol} to be transferred from your wallet`,
        icon: 'info',
        showConfirmButton: false
      });
      const approveResult = await web3TxHandler(mainTokenInstance, 'approve', [
        diamondFactoryInstance.address,
        deploymentPriceDiamond
      ]);
      if (!approveResult) {
        setDeploying(false);
        return;
      }
    }
    reactSwal.fire({
      title: 'Step 2 of 2',
      html: 'Deploying a RAIR diamond contract',
      icon: 'info',
      showConfirmButton: false
    });
    const success = await web3TxHandler(
      diamondFactoryInstance,
      'deployContract',
      [contractName, 'RAIR']
    );
    setDeploying(false);
    if (success) {
      reactSwal.fire({
        title: 'Success',
        html: 'Diamond Contract deployed',
        icon: 'success',
        showConfirmButton: true
      });
      setContractName('');
    }
  }, [
    tokenSymbol,
    contractName,
    mainTokenInstance,
    diamondFactoryInstance,
    allowance,
    deploymentPriceDiamond,
    web3TxHandler,
    reactSwal
  ]);

  return (
    <div className="row my-5 px-0 mx-0">
      <NavigatorFactory>
        <b className="p-5">
          {
            "Use your RAIR tokens to create an NFT smart contract you'll be able to upload your files, "
          }
          {'set up minting prices, resale prices, rarity and metadata.'}
        </b>
        <hr />
        <span className="text-start">
          <b>Your balance:</b>{' '}
          {userBalance && utils.formatEther(userBalance).toString()}{' '}
          {tokenSymbol} Tokens
        </span>
        <div className="col-12 p-2">
          <InputSelect
            options={blockchainSettings
              .filter((chain) => {
                return chain.display && chain.hash && chain.name;
              })
              .map((chain) => {
                return { label: chain.name!, value: chain.hash! };
              })}
            getter={currentChain}
            setter={updateChain}
            placeholder="Please select"
            label="Deploy on"
            customClass="rounded-rair form-control"
            customCSS={{
              backgroundColor: primaryColor,
              color: textColor,
              borderColor: secondaryColor
            }}
            labelClass="text-start w-100"
            optionClass="text-white"
          />
        </div>
        <div className="col-12 p-2">
          <InputField
            getter={contractName}
            setter={setContractName}
            placeholder="Name your contract"
            label="Contract name"
            customClass="rounded-rair form-control"
            customCSS={{
              backgroundColor: primaryColor,
              color: textColor ? textColor : 'inherit',
              borderColor: secondaryColor
            }}
            labelClass="text-start w-100"
          />
        </div>
        <div className="col-12 row p-2">
          {false && factoryInstance && (
            <button
              disabled={
                contractName === '' ||
                currentChain === undefined ||
                adminRights === false ||
                deploymentPrice === BigNumber.from(0) ||
                userBalance === BigNumber.from(0) ||
                deploying ||
                !mainTokenInstance
              }
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button col-12 col-md-5 rounded-rair"
              onClick={deployClassic}>
              <FontAwesomeIcon icon={faLandmark} className="h1" />
              <br />
              Deploy a classic contract
              <br />
              <b>
                {deploymentPrice &&
                  utils.formatEther(deploymentPrice).toString()}{' '}
                {tokenSymbol} Tokens
              </b>
              <br />
              <small>
                A classic, monolithic contract with all the basic
                functionalities
              </small>
            </button>
          )}
          {factoryInstance && diamondFactoryInstance && false && (
            <div className="col-12 col-md-2">or</div>
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
                !mainTokenInstance
              }
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              className="btn rair-button col-12 rounded-rair mt-3"
              onClick={deployDiamond}>
              <FontAwesomeIcon icon={faGem} className="h1" />
              <br />
              Deploy a diamond contract
              <br />
              <b>
                {deploymentPriceDiamond &&
                  utils.formatEther(deploymentPriceDiamond).toString()}{' '}
                {tokenSymbol} Tokens
              </b>
              <br />
              <small>
                Using the ERC-2535 Diamonds functionality, updates can be made
                to the codebase of the contract over time, adding new
                functionalities
              </small>
            </button>
          )}
          <br />
          <hr />
        </div>
      </NavigatorFactory>
    </div>
  );
};

export default Factory;
