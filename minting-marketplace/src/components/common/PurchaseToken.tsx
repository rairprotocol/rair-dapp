import React, { useState } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import { ethers } from 'ethers';

import { diamondFactoryAbi, erc721Abi } from '../../contracts';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useConnectUser from '../../hooks/useConnectUser';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { metaMaskIcon } from '../../images';
import blockchainData from '../../utils/blockchainData';
import { getRandomValues } from '../../utils/getRandomValues';
import { rFetch } from '../../utils/rFetch';
import { web3Switch } from '../../utils/switchBlockchain';

import {
  IAgreementsPropsType,
  IPurchaseTokenButtonProps,
  IRangeDataType
} from './commonTypes/PurchaseTokenTypes.types';

const queryRangeDataFromDatabase = async (
  contractInstance: ethers.Contract | undefined,
  network: BlockchainType | undefined,
  offerIndex: string[] | undefined,
  diamond = false
): Promise<undefined | IRangeDataType> => {
  const { success, products } = await rFetch(
    `/api/contracts/network/${network}/${contractInstance?.address}/products/offers`,
    undefined,
    undefined,
    false // disables error messages for this rFetch call, because if this fails, the blockchain query starts
  );
  if (success) {
    if (diamond) {
      for (const product of products) {
        for (const offer of product.offers) {
          if (offerIndex?.includes(offer.diamondRangeIndex)) {
            return {
              start: offer.range[0],
              end: offer.range[1],
              product: offer.product,
              price: offer.price.toString()
            };
          }
        }
      }
    } else {
      const [selectedOfferPool] = products.filter(
        (item) => item.offerPool.marketplaceCatalogIndex === offerIndex?.[0]
      );
      if (selectedOfferPool) {
        const [selectedOffer] = selectedOfferPool.offers.filter(
          (item) => item.offerIndex === offerIndex?.[1]
        );
        if (selectedOffer) {
          return {
            start: selectedOffer.range[0],
            end: selectedOffer.range[1],
            product: selectedOffer.product,
            price: selectedOffer.price.toString()
          };
        }
      }
    }
  }
};

const findNextToken = async (
  contractInstance: ethers.Contract | undefined,
  start: string,
  end: string,
  product: string
) => {
  return await contractInstance?.getNextSequentialIndex(product, start, end);
};

const Agreements: React.FC<IAgreementsPropsType> = ({
  presaleMessage,
  contractAddress,
  requiredBlockchain,
  offerIndex,
  connectUserData,
  diamond,
  customSuccessAction,
  blockchainOnly,
  databaseOnly,
  collection,
  setPurchaseStatus,
  web3TxHandler
}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
  const [termsOfUse, setTermsOfUse] = useState<boolean>(false);
  const [buyingToken, setBuyingToken] = useState<boolean>(false);
  const [buttonMessage, setButtonMessage] = useState<string>('');

  const reactSwal = useSwal();

  const {
    currentChain,
    currentUserAddress,
    minterInstance,
    diamondMarketplaceInstance,
    contractCreator
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const queryRangeDataFromBlockchain = async (
    marketplaceInstance: ethers.Contract | undefined,
    offerIndex: string[] | undefined,
    diamond: boolean | undefined
  ): Promise<undefined | IRangeDataType> => {
    let minterOfferPool;
    if (!marketplaceInstance) {
      return;
    }
    if (!diamond) {
      minterOfferPool = await web3TxHandler(
        marketplaceInstance,
        'getOfferInfo',
        [offerIndex?.[0]]
      );
    }
    const minterOffer = await web3TxHandler(
      marketplaceInstance,
      diamond ? 'getOfferInfo' : 'getOfferRangeInfo',
      offerIndex || []
    );

    if (minterOffer) {
      return {
        start: diamond
          ? minterOffer.rangeData.rangeStart.toString()
          : minterOffer.tokenStart.toString(),
        end: diamond
          ? minterOffer.rangeData.rangeEnd.toString()
          : minterOffer.tokenEnd.toString(),
        product: diamond
          ? minterOffer.productIndex.toString()
          : minterOfferPool.productIndex.toString(),
        price: diamond
          ? minterOffer.rangeData.rangePrice.toString()
          : minterOffer.price.toString()
      };
    }
  };

  const purchaseFunction = async (
    minterInstance: ethers.Contract | undefined,
    contractAddress: ethers.Contract | undefined,
    offerIndex: string[] | undefined,
    nextToken: number,
    price: string,
    diamond = false
  ) => {
    if (!minterInstance) {
      reactSwal.fire({
        title: 'An error has ocurred',
        html: 'Please try again later',
        icon: 'info'
      });
      return;
    }
    const args: any[] = [offerIndex?.[0]];
    if (!diamond) {
      args.push(offerIndex?.[1]);
    }
    args.push(nextToken);
    args.push({
      value: price
    });
    return await web3TxHandler(
      minterInstance,
      diamond ? 'buyMintingOffer' : 'buyToken',
      args,
      {
        failureMessage:
          'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!'
      }
    );
  };

  return (
    <div className={`text-${textColor}`}>
      <div
        className={`${
          collection === false || collection === undefined
            ? 'py-4 w-100 row'
            : ''
        }`}>
        <div className="col-12 col-sm-1 d-none d-md-inline" />
        <div className="col-12 col-sm-10 pe-2 pe-md-5">
          {collection === false || collection === undefined
            ? [
                {
                  label: 'I agree to the',
                  link: 'Privacy Policy',
                  linkTarget: '/privacy',
                  getter: privacyPolicy,
                  setter: setPrivacyPolicy
                },
                {
                  label: 'I accept the',
                  link: 'Terms of Use',
                  linkTarget: '/terms-use',
                  getter: termsOfUse,
                  setter: setTermsOfUse
                }
              ].map((item, index) => {
                const id = getRandomValues();
                return (
                  <div key={index} className="my-2 w-100 px-0 mx-0 row">
                    <label
                      className="h5 col-10 col-md-11 col-lg-10 col-xl-9 ps-md-5"
                      htmlFor={String(id)}>
                      {item.label} <wbr />
                      {item.link && (
                        <h4
                          className="d-inline"
                          onClick={() => window.open(item.linkTarget, '_blank')}
                          style={{ color: 'var(--bubblegum)' }}>
                          {item.link}
                        </h4>
                      )}
                    </label>
                    {item.setter && (
                      <div className="col-2 col-xl-3 col-sm-1 text-end text-md-center text-xl-start p-0">
                        <button
                          className={`btn btn-${
                            item.getter ? 'royal-ice' : 'secondary'
                          } rounded-rair`}
                          id={String(id)}
                          onClick={() => item.setter(!item.getter)}>
                          <i
                            className={'fas fa-check'}
                            style={{
                              color: item.getter ? 'inherit' : 'transparent'
                            }}
                          />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })
            : ''}
        </div>
        <div className="col-12 col-sm-1 d-none d-md-inline" />
      </div>
      <div className="w-100">{presaleMessage}</div>
      <div className="w-100">
        <button
          disabled={
            buyingToken ||
            Boolean(
              currentUserAddress &&
                !collection &&
                (!privacyPolicy || !termsOfUse)
            )
          }
          className="btn my-4 btn-stimorol rounded-rair col-12 col-sm-8 col-md-4"
          onClick={async () => {
            setBuyingToken(true);
            if (setPurchaseStatus) {
              setPurchaseStatus(true);
            }
            // If currentUserAddress isn't set then the user hasn't connected their wallet
            if (!currentUserAddress) {
              await connectUserData?.();
              setBuyingToken(false);
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            // If the currentChain is different from the contract's chain, switch
            if (currentChain !== requiredBlockchain) {
              await web3Switch(requiredBlockchain);
              setBuyingToken(false);
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              reactSwal.close();
              return;
            }

            setButtonMessage('Connecting to contract...');
            // Create the instance of the function
            const contractInstance = contractCreator?.(
              contractAddress,
              diamond ? erc721Abi : diamondFactoryAbi
            );

            setButtonMessage('Querying next mintable NFT...');

            let rangeData;
            if (!blockchainOnly) {
              // Get the range's data (start token, ending token, price)
              rangeData = await queryRangeDataFromDatabase(
                contractInstance,
                requiredBlockchain,
                offerIndex,
                diamond
              );
            }

            if (!rangeData && !databaseOnly) {
              // Get the range's data from the blockchain if the db has no data
              rangeData = await queryRangeDataFromBlockchain(
                diamond ? diamondMarketplaceInstance : minterInstance,
                offerIndex,
                diamond
              );
            }

            if (!rangeData) {
              reactSwal.fire('Error', 'An error has ocurred.', 'error');
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            const { start, end, product, price } = rangeData;

            const nextToken = await findNextToken(
              contractInstance,
              start,
              end,
              product
            );

            setButtonMessage(`Minting token #${nextToken.toString()}`);

            if (
              (
                await contractInstance?.provider.getBalance(currentUserAddress)
              )?.lt(price)
            ) {
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              reactSwal.fire('Error', 'Insufficient funds!', 'error');
              return;
            }

            const purchaseResult = await purchaseFunction(
              diamond ? diamondMarketplaceInstance : minterInstance,
              contractInstance,
              offerIndex,
              nextToken,
              price,
              diamond
            );

            if (purchaseResult && customSuccessAction) {
              customSuccessAction(nextToken);
            }
            setBuyingToken(false);
            if (setPurchaseStatus) {
              setPurchaseStatus(false);
            }
          }}>
          <img
            style={{ maxHeight: '7vh' }}
            src={metaMaskIcon}
            alt="metamask-logo"
          />
          <wbr />{' '}
          {currentUserAddress
            ? currentChain !== requiredBlockchain
              ? `Switch to ${
                  requiredBlockchain && blockchainData[requiredBlockchain]?.name
                }`
              : buttonMessage || 'Purchase'
            : 'Connect your wallet!'}
        </button>
      </div>
    </div>
  );
};

const PurchaseTokenButton: React.FC<IPurchaseTokenButtonProps> = ({
  altButtonFormat = false,
  customButtonClassName,
  customButtonIconClassName,
  customButtonTextClassName,
  customWrapperClassName,
  img,
  buttonLabel = 'Mint!',
  handleClick,
  contractAddress,
  requiredBlockchain,
  offerIndex,
  presaleMessage,
  diamond,
  customSuccessAction,
  blockchainOnly,
  databaseOnly,
  collection,
  setPurchaseStatus
}) => {
  const { connectUserData } = useConnectUser();
  const store = useStore();
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

  const { web3TxHandler } = useWeb3Tx();
  const reactSwal = useSwal();

  const fireAgreementModal = () => {
    if (collection === true) {
      reactSwal.fire({
        html: (
          <Provider store={store}>
            <Agreements
              {...{
                contractAddress,
                requiredBlockchain,
                connectUserData,
                diamond,
                offerIndex,
                presaleMessage,
                customSuccessAction,
                blockchainOnly,
                databaseOnly,
                collection,
                setPurchaseStatus,
                web3TxHandler
              }}
            />
          </Provider>
        ),
        showConfirmButton: false,
        width: '85vw',
        customClass: {
          popup: `bg-${primaryColor} rounded-rair`,
          title: `text-${textColor}`
        }
      });
    } else {
      reactSwal.fire({
        title: <h1 style={{ color: 'var(--bubblegum)' }}>Terms of Service</h1>,
        html: (
          <Provider store={store}>
            <Agreements
              {...{
                contractAddress,
                requiredBlockchain,
                connectUserData,
                diamond,
                offerIndex,
                presaleMessage,
                customSuccessAction,
                blockchainOnly,
                databaseOnly,
                web3TxHandler
              }}
            />
          </Provider>
        ),
        showConfirmButton: false,
        width: '90vw',
        customClass: {
          popup: `bg-${primaryColor} rounded-rair`,
          title: `text-${textColor}`
        }
      });
    }
  };

  if (altButtonFormat) {
    return (
      <button
        className={customButtonClassName}
        onClick={handleClick ? handleClick : fireAgreementModal}>
        <img className={customButtonIconClassName} src={img} />
        <div style={{ color: textColor }} className={customButtonTextClassName}>
          {' '}
          {buttonLabel}{' '}
        </div>
      </button>
    );
  } else {
    return (
      <div className={customWrapperClassName}>
        <button
          className={customButtonClassName}
          onClick={handleClick ? handleClick : fireAgreementModal}>
          {img && (
            <img alt="metamask-logo" className="metamask-logo" src={img} />
          )}{' '}
          {buttonLabel}
        </button>
      </div>
    );
  }
  // }
};

export default PurchaseTokenButton;
