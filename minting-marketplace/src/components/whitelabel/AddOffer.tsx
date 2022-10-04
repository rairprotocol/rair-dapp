//@ts-nocheck
import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

import { erc721Abi } from '../../contracts';
import chainData from '../../utils/blockchainData';
import { metamaskCall } from '../../utils/metamaskUtils';
import InputField from '../common/InputField';

const rSwal = withReactContent(
  Swal.mixin({
    showConfirmButton: false
  })
);

const RangeManager = ({
  disabled,
  index,
  array,
  deleter,
  sync,
  hardLimit
  // productIndex
}) => {
  const [endingRange, setEndingRange] = useState(
    disabled
      ? array[index].endingToken
      : index === 0
      ? 0
      : Number(array[index - 1].endingToken) + 1
  );
  const [rangeName, setRangeName] = useState(array[index].name);
  const [rangePrice, setRangePrice] = useState(array[index].price);
  const syncOutside = useCallback(sync, [sync]);

  useEffect(() => {
    const aux = array[index].endingToken !== endingRange;
    array[index].endingToken = endingRange;
    if (aux) {
      syncOutside();
    }
  }, [endingRange, array, index, syncOutside]);

  useEffect(() => {
    const aux = array[index].name !== rangeName;
    array[index].name = rangeName;
    if (aux) {
      syncOutside();
    }
  }, [rangeName, array, index, syncOutside]);

  useEffect(() => {
    const aux = array[index].price !== rangePrice;
    array[index].price = rangePrice;
    if (aux) {
      syncOutside();
    }
  }, [rangePrice, array, index, syncOutside]);

  return (
    <tr>
      <th>
        {!disabled ? (
          <button
            onClick={() => deleter(index)}
            className="btn btn-danger h-50">
            <i className="fas fa-trash" />
          </button>
        ) : (
          ''
        )}
      </th>
      <th>#{index + 1}</th>
      <th>
        <InputField
          customClass="form-control"
          disabled={disabled}
          getter={rangeName}
          setter={setRangeName}
        />
      </th>
      <th>
        <InputField
          customClass="form-control"
          disabled
          getter={index === 0 ? 0 : Number(array[index - 1].endingToken + 1)}
          type="number"
        />
      </th>
      <th>
        <input
          style={
            (index === 0 ? 0 : array[index - 1].endingToken) > endingRange ||
            endingRange > hardLimit
              ? {
                  backgroundColor: 'red',
                  color: 'white'
                }
              : {}
          }
          disabled={disabled}
          className="form-control"
          type="number"
          min={index === 0 ? 0 : Number(array[index - 1].endingToken) + 1}
          max={hardLimit}
          value={endingRange}
          onChange={(e) => setEndingRange(Number(e.target.value))}
        />
      </th>
      <th>
        <input
          disabled={disabled}
          type="number"
          className="form-control"
          value={rangePrice}
          onChange={(e) => setRangePrice(e.target.value)}
        />
      </th>
    </tr>
  );
};

const ModalContent = ({
  instance,
  // blockchain,
  productIndex,
  tokenLimit,
  existingOffers
}) => {
  const [ranges, setRanges] = useState(
    existingOffers
      ? existingOffers.map((item) => {
          return {
            endingToken: item.range[1],
            name: item.offerName,
            price: item.price,
            disabled: true
          };
        })
      : []
  );
  const [forceSync, setForceSync] = useState(false);

  const [hasMinterRole, setHasMinterRole] = useState(undefined);

  const { minterInstance } = useSelector((store) => store.contractStore);

  const deleter = (index) => {
    const aux = [...ranges];
    aux.splice(index, 1);
    setRanges(aux);
  };

  const notDisabled = (item) => {
    return !item.disabled;
  };

  const fetchMintingStatus = useCallback(async () => {
    setHasMinterRole(
      await instance.hasRole(await instance.MINTER(), minterInstance.address)
    );
  }, [minterInstance, instance]);

  useEffect(() => {
    fetchMintingStatus();
  }, [fetchMintingStatus]);

  if (hasMinterRole === undefined) {
    return <>Please wait...</>;
  }

  return (
    <>
      {!hasMinterRole ? (
        <>
          To sell your tokens,
          <br />
          <button
            disabled={instance === undefined}
            className="btn btn-warning"
            onClick={async () => {
              if (
                await metamaskCall(
                  instance.grantRole(
                    await instance.MINTER(),
                    minterInstance.address
                  )
                )
              ) {
                rSwal.close();
              }
            }}>
            Approve the marketplace as a Minter!
          </button>
        </>
      ) : (
        <div style={{ maxHeight: '70vh', overflowY: 'auto' }}>
          <table className="w-100">
            <thead>
              <tr>
                <th />
                <th> # </th>
                <th>Name</th>
                <th>Starts</th>
                <th>Ends</th>
                <th>Price for each</th>
                <th>
                  <button
                    style={{ position: 'absolute', right: 0, top: 0 }}
                    disabled={!hasMinterRole}
                    onClick={() => {
                      const aux = [...ranges];
                      aux.push({
                        endingToken:
                          aux.length === 0
                            ? 0
                            : Number(aux[aux.length - 1].endingToken) + 1,
                        name: '',
                        price: 0
                      });
                      setRanges(aux);
                    }}
                    className="btn btn-royal-ice">
                    <i className="fas fa-plus" />
                  </button>
                </th>
              </tr>
            </thead>
            <tbody>
              {ranges.map((item, index, array) => {
                return (
                  <RangeManager
                    key={index}
                    disabled={item.disabled}
                    index={index}
                    array={array}
                    deleter={deleter}
                    sync={() => {
                      setForceSync(!forceSync);
                    }}
                    hardLimit={tokenLimit}
                    productIndex={productIndex}
                  />
                );
              })}
            </tbody>
          </table>
          <br />
          <button
            onClick={async () => {
              if (ranges.length > 0 && ranges[0].disabled) {
                await metamaskCall(
                  minterInstance.appendOfferRangeBatch(
                    await minterInstance.contractToOfferRange(
                      instance.address,
                      productIndex
                    ),
                    ranges.filter(notDisabled).map((item, index, array) => {
                      if (index === 0) {
                        let i = 0;
                        for (; i < ranges.length; i++) {
                          if (!ranges[i].disabled) {
                            return ranges[i - 1].endingToken + 1;
                          }
                        }
                      }
                      return Number(array[index - 1].endingToken) + 1;
                    }),
                    ranges.filter(notDisabled).map((item) => item.endingToken),
                    ranges.filter(notDisabled).map((item) => item.price),
                    ranges.filter(notDisabled).map((item) => item.name)
                  )
                );
              } else {
                await metamaskCall(
                  minterInstance.addOffer(
                    instance.address,
                    productIndex,
                    ranges.map((item, index, array) =>
                      index === 0 ? 0 : Number(array[index - 1].endingToken) + 1
                    ),
                    ranges.map((item) => item.endingToken),
                    ranges.map((item) => item.price),
                    ranges.map((item) => item.name),
                    process.env.REACT_APP_NODE_ADDRESS
                  )
                );
              }
              rSwal.close();
            }}
            disabled={!ranges.filter((item) => !item.disabled).length}
            className="btn btn-warning">
            {ranges.length > 0 && ranges[0].disabled
              ? `Append ${
                  ranges.filter((item) => !item.disabled).length
                } ranges to the marketplace`
              : `Create offer with ${ranges.length} ranges on the marketplace`}
          </button>
        </div>
      )}
    </>
  );
};

const AddOffer = ({
  address,
  blockchain,
  productIndex,
  tokenLimit,
  existingOffers
}) => {
  const { contractCreator, programmaticProvider } = useSelector(
    (store) => store.contractStore
  );
  const { primaryColor, textColor } = useSelector((store) => store.colorStore);

  const store = useStore();
  const onMyChain = window.ethereum
    ? chainData[blockchain]?.chainId === window.ethereum.chainId
    : chainData[blockchain]?.chainId ===
      programmaticProvider.provider._network.chainId;

  return (
    <button
      disabled={
        address === undefined ||
        contractCreator === undefined ||
        !window.ethereum
      }
      className={`btn btn-${onMyChain ? 'stimorol' : 'royal-ice'} py-0`}
      onClick={async () => {
        if (!onMyChain) {
          if (window.ethereum) {
            await window.ethereum.request({
              method: 'wallet_switchEthereumChain',
              params: [{ chainId: chainData[blockchain].chainId }]
            });
          } else {
            // Code for suresh goes here
          }
        } else {
          rSwal.fire({
            html: (
              <Provider store={store}>
                <ModalContent
                  existingOffers={existingOffers}
                  productIndex={productIndex}
                  blockchain={blockchain}
                  tokenLimit={tokenLimit}
                  instance={await contractCreator(address, erc721Abi)}
                />
              </Provider>
            ),
            width: '90vw',
            customClass: {
              popup: `bg-${primaryColor}`,
              htmlContainer: `text-${textColor}`
            }
          });
        }
      }}>
      {onMyChain ? (
        <>
          Add Offer <i className="fas fa-plus" />
        </>
      ) : (
        <>
          Switch to <b>{chainData[blockchain]?.name}</b>
        </>
      )}
    </button>
  );
};

export default AddOffer;
