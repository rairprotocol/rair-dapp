import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { faKey, faLock } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ethers, utils } from 'ethers';

import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import { erc721Abi } from '../../../contracts';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../../ducks/contracts/contracts.types';
import useSwal from '../../../hooks/useSwal';
import useWeb3Tx from '../../../hooks/useWeb3Tx';
import chainData from '../../../utils/blockchainData';
import { validateInteger } from '../../../utils/metamaskUtils';
import colors from '../../../utils/offerLockColors';
import InputField from '../../common/InputField';
import {
  ILockRow,
  TListLocks,
  TListLocksArrayItem,
  TParamsListLocks
} from '../creatorStudio.types';
import FixedBottomNavigation from '../FixedBottomNavigation';

const LockRow: React.FC<ILockRow> = ({
  index,
  locker,
  name,
  starts,
  ends,
  price,
  array,
  rerender,
  maxCopies,
  lockedNumber,
  blockchainSymbol
}) => {
  const { primaryColor, secondaryColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const [itemName, setItemName] = useState<string>(name);
  const [startingToken, setStartingToken] = useState<string>(starts);
  const [endingToken, setEndingToken] = useState<string>(ends);
  const [lockedTokens, setLockedTokens] = useState<number>(lockedNumber);
  const [statePrice, setStatePrice] = useState<string>(price);
  const randColor = colors[index];
  const updateLockedNumber = useCallback(
    (value: string) => {
      array[index].lockedNumber = Number(value);
      setLockedTokens(Number(value));
      rerender();
    },
    [array, index, rerender, setLockedTokens]
  );

  useEffect(() => {
    setLockedTokens(lockedNumber);
  }, [lockedNumber]);

  return (
    <tr>
      <th>
        <button disabled className={`btn btn-${primaryColor} rounded-rair`}>
          <FontAwesomeIcon icon={faKey} style={{ color: randColor }} />
        </button>
      </th>
      <th className="p-1">
        <InputField
          disabled={true}
          getter={itemName}
          setter={setItemName}
          customClass="form-control rounded-rair"
          customCSS={{
            backgroundColor: primaryColor,
            color: 'inherit',
            borderColor: `var(--${secondaryColor}-40)`
          }}
        />
      </th>
      <th className="p-1">
        <InputField
          disabled={true}
          getter={startingToken}
          setter={setStartingToken}
          type="number"
          min={0}
          customClass="form-control rounded-rair"
          customCSS={{
            backgroundColor: primaryColor,
            color: 'inherit',
            borderColor: `var(--${secondaryColor}-40)`
          }}
        />
      </th>
      <th className="p-1">
        <InputField
          disabled={true}
          getter={endingToken}
          setter={setEndingToken}
          customClass="form-control rounded-rair"
          type="number"
          min={0}
          max={maxCopies}
          customCSS={{
            backgroundColor: primaryColor,
            color: 'inherit',
            borderColor: `var(--${secondaryColor}-40)`
          }}
        />
      </th>
      <th className="p-1">
        <InputField
          disabled={true}
          getter={`${utils
            .formatEther(
              statePrice === '' || !validateInteger(Number(statePrice))
                ? 0
                : statePrice
            )
            .toString()} ${blockchainSymbol}`}
          setter={setStatePrice}
          customClass="form-control rounded-rair"
          customCSS={{
            backgroundColor: primaryColor,
            color: 'inherit',
            borderColor: `var(--${secondaryColor}-40)`
          }}
        />
      </th>
      <th className="p-1">
        <div className="border-stimorol rounded-rair w-100">
          <InputField
            getter={lockedTokens}
            setter={updateLockedNumber}
            type="number"
            min={0}
            max={Number(endingToken) - Number(startingToken)}
            customClass="form-control rounded-rair"
            customCSS={{
              backgroundColor: primaryColor,
              color: 'inherit',
              borderColor: `var(--${secondaryColor}-40)`
            }}
          />
        </div>
      </th>
      <th>
        <div className="border-stimorol rounded-rair">
          <button
            onClick={locker}
            className={`btn btn-${primaryColor} rounded-rair`}>
            <FontAwesomeIcon icon={faLock} />
          </button>
        </div>
      </th>
    </tr>
  );
};

const ListLocks: React.FC<TListLocks> = ({
  contractData,
  setStepNumber,
  gotoNextStep,
  stepNumber
}) => {
  const { web3TxHandler, correctBlockchain, web3Switch } = useWeb3Tx();

  const [offerList, setOfferList] = useState<TListLocksArrayItem[]>([]);
  const [forceRerender, setForceRerender] = useState<boolean>(false);
  const [instance, setInstance] = useState<ethers.Contract | undefined>();
  const [onMyChain, setOnMyChain] = useState<boolean>(
    correctBlockchain(contractData?.blockchain as BlockchainType)
  );

  const reactSwal = useSwal();

  const { contractCreator, programmaticProvider, currentChain } = useSelector<
    RootState,
    ContractsInitialType
  >((store) => store.contractStore);
  const { address } = useParams<TParamsListLocks>();
  const locker = async (data: TListLocksArrayItem) => {
    if (!instance) {
      return;
    }
    reactSwal.fire({
      title: `Locking ${Number(data.ends) - Number(data.starts)} tokens from ${
        data.name
      }`,
      html: `${data.lockedNumber} tokens will have to be minted to unlock them again.`,
      icon: 'info',
      showConfirmButton: false
    });
    if (
      await web3TxHandler(instance, 'createRangeLock', [
        data.productIndex,
        data.starts,
        data.ends,
        data.lockedNumber
      ])
    ) {
      reactSwal.fire({
        title: `Success!`,
        html: `The range has been locked`,
        icon: 'success'
      });
    }
  };

  useEffect(() => {
    setOfferList(
      contractData?.product?.offers
        ? contractData?.product?.offers.map((item) => {
            return {
              productIndex: item.product,
              name: item.offerName,
              starts: item.range[0],
              ends: item.range[1],
              price: item.price.toString(),
              lockedNumber: 0
            };
          })
        : []
    );
  }, [contractData]);

  useEffect(() => {
    setStepNumber(stepNumber);
  }, [setStepNumber, stepNumber]);

  useEffect(() => {
    if (onMyChain) {
      const createdInstance = contractCreator?.(address, erc721Abi);
      setInstance(createdInstance);
    }
  }, [address, onMyChain, contractCreator]);

  useEffect(() => {
    setOnMyChain(
      !!contractData &&
        correctBlockchain(contractData.blockchain as BlockchainType)
    );
  }, [contractData, programmaticProvider, currentChain, correctBlockchain]);

  return (
    <div className="row px-0 mx-0">
      {contractData ? (
        <>
          {offerList?.length !== 0 && (
            <table className="col-12 text-start">
              <thead>
                <tr>
                  <th className="px-1" style={{ width: '5vw' }} />
                  <th>Item name</th>
                  <th style={{ width: '10vw' }}>Starts</th>
                  <th style={{ width: '10vw' }}>Ends</th>
                  <th style={{ width: '20vw' }}>Price for each</th>
                  <th style={{ width: '10vw' }}>Tokens Locked</th>
                  <th />
                </tr>
              </thead>
              <tbody style={{ maxHeight: '50vh', overflowY: 'scroll' }}>
                {offerList.map((item, index, array) => {
                  return (
                    <LockRow
                      array={array}
                      locker={() => locker(item)}
                      key={index}
                      index={index}
                      {...item}
                      blockchainSymbol={
                        chainData[contractData?.blockchain]?.symbol
                      }
                      rerender={() => setForceRerender(!forceRerender)}
                      maxCopies={Number(contractData?.product?.copies) - 1}
                    />
                  );
                })}
              </tbody>
            </table>
          )}
          {chainData && (
            <FixedBottomNavigation
              forwardFunctions={[
                {
                  action: !onMyChain
                    ? () =>
                        web3Switch(
                          chainData[contractData?.blockchain]
                            ?.chainId as BlockchainType
                        )
                    : gotoNextStep,
                  label: !onMyChain
                    ? `Switch to ${chainData[contractData?.blockchain]?.name}`
                    : `Proceed`,
                  disabled: false
                }
              ]}
            />
          )}
        </>
      ) : (
        'Fetching data...'
      )}
    </div>
  );
};

const ContextWrapper = (props: TListLocks) => {
  return (
    <WorkflowContext.Consumer>
      {(value) => {
        return <ListLocks {...value} {...props} />;
      }}
    </WorkflowContext.Consumer>
  );
};

export default ContextWrapper;
