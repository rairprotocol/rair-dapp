import { useCallback, useEffect, useState } from 'react';
import { faGem, faLandmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatEther } from 'ethers';
import { Hex, stringToHex } from 'viem';

import NavigatorFactory from './NavigatorFactory';

import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { dataStatuses } from '../../redux/commonTypes';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import LoadingComponent from '../common/LoadingComponent';

const Factory = () => {
  const [contractName, setContractName] = useState<string>('');

  const [deploymentPrice, setDeploymentPrice] = useState<bigint>();
  const [deploymentPriceDiamond, setDeploymentPriceDiamond] = useState<
    bigint | undefined
  >();

  const [allowance, setAllowance] = useState<bigint | undefined>();

  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const { web3Status } = useAppSelector((store) => store.web3);

  const [userBalance, setUserBalance] = useState<bigint>();
  const [tokenSymbol, setTokenSymbol] = useState<string>('');

  const [deploying, setDeploying] = useState<boolean>(false);

  const { web3TxHandler, web3Switch } = useWeb3Tx();
  const reactSwal = useSwal();

  const { currentUserAddress, connectedChain } = useAppSelector(
    (store) => store.web3
  );
  const {
    classicFactoryInstance,
    mainTokenInstance,
    diamondFactoryInstance,
    refreshSigner
  } = useContracts();
  const { primaryColor, secondaryColor, primaryButtonColor, textColor } =
    useAppSelector((store) => store.colors);
  const { adminRights } = useAppSelector((store) => store.user);
  const getAllowance = useCallback(async () => {
    if (mainTokenInstance && diamondFactoryInstance) {
      const allowanceCheck = await web3TxHandler(
        mainTokenInstance,
        'allowance',
        [currentUserAddress, await diamondFactoryInstance.getAddress()]
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
    if (
      classicFactoryInstance &&
      mainTokenInstance &&
      deploymentPrice === undefined
    ) {
      const value = await web3TxHandler(
        classicFactoryInstance,
        'deploymentCostForERC777',
        [mainTokenInstance.getAddress()]
      );
      if (value) {
        setDeploymentPrice(value);
      }
    }
  }, [
    classicFactoryInstance,
    mainTokenInstance,
    deploymentPrice,
    web3TxHandler
  ]);

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
      if (value) {
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
  }, [connectedChain]);

  const getUserBalance = useCallback(async () => {
    if (mainTokenInstance && userBalance === undefined) {
      const userBalance = await web3TxHandler(mainTokenInstance, 'balanceOf', [
        currentUserAddress
      ]);
      if (userBalance !== undefined) {
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
    async (chainId: Hex) => {
      if (chainId !== undefined) {
        await web3Switch(chainId);
        refreshSigner();
        setDeploymentPrice(BigInt(0));
        setDeploymentPriceDiamond(BigInt(0));
        setTokenSymbol('');
        setUserBalance(BigInt(0));
      }
    },
    [web3Switch, refreshSigner]
  );

  const deployClassic = useCallback(async () => {
    if (!mainTokenInstance || !classicFactoryInstance) {
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
      await classicFactoryInstance.getAddress(),
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
    classicFactoryInstance,
    reactSwal,
    web3TxHandler
  ]);

  const deployDiamond = useCallback(async () => {
    if (
      !mainTokenInstance ||
      !diamondFactoryInstance ||
      contractName === '' ||
      !deploymentPriceDiamond ||
      deploymentPriceDiamond === BigInt(0)
    ) {
      return;
    }
    setDeploying(true);
    if (allowance !== undefined && allowance < deploymentPriceDiamond) {
      reactSwal.fire({
        title: 'Step 1 of 2',
        html: `Approve ${formatEther(
          deploymentPriceDiamond
        ).toString()} ${tokenSymbol} to be transferred from your wallet`,
        icon: 'info',
        showConfirmButton: false
      });
      const approveResult = await web3TxHandler(mainTokenInstance, 'approve', [
        await diamondFactoryInstance.getAddress(),
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

  if (web3Status !== dataStatuses.Complete) {
    return <LoadingComponent />;
  }

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
          {typeof userBalance === 'bigint' &&
            formatEther(userBalance).toString()}{' '}
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
            getter={connectedChain}
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
          {false && classicFactoryInstance && (
            <button
              disabled={
                contractName === '' ||
                connectedChain === undefined ||
                adminRights === false ||
                deploymentPrice === BigInt(0) ||
                userBalance === BigInt(0) ||
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
                {!!deploymentPrice && formatEther(deploymentPrice!).toString()}{' '}
                {tokenSymbol} Tokens
              </b>
              <br />
              <small>
                A classic, monolithic contract with all the basic
                functionalities
              </small>
            </button>
          )}
          {classicFactoryInstance && diamondFactoryInstance && false && (
            <div className="col-12 col-md-2">or</div>
          )}
          {diamondFactoryInstance && (
            <button
              disabled={
                contractName === '' ||
                connectedChain === undefined ||
                adminRights === false ||
                deploymentPrice === BigInt(0) ||
                userBalance === BigInt(0) ||
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
                {!!deploymentPriceDiamond &&
                  formatEther(deploymentPriceDiamond).toString()}{' '}
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
