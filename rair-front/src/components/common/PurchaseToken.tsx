import React, { useState } from 'react';
import { Provider, useSelector, useStore } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, Contract } from 'ethers';

import { diamondFactoryAbi, erc721Abi } from '../../contracts';
import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useConnectUser from '../../hooks/useConnectUser';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { GrandpaWait } from '../../images';
import blockchainData from '../../utils/blockchainData';
import { getRandomValues } from '../../utils/getRandomValues';
import { rFetch } from '../../utils/rFetch';

import {
  IAgreementsPropsType,
  IPurchaseTokenButtonProps,
  IRangeDataType
} from './commonTypes/PurchaseTokenTypes.types';

const queryRangeDataFromDatabase = async (
  contractInstance: Contract | undefined,
  network: BlockchainType | undefined,
  offerIndex: string[] | undefined,
  diamond = false
): Promise<undefined | IRangeDataType> => {
  const { success, products } = await rFetch(
    `/api/contracts/network/${network}/${contractInstance?.address}/offers`,
    undefined,
    undefined,
    false // disables error messages for this rFetch call, because if this fails, the blockchain query starts
  );
  if (success) {
    if (diamond) {
      for (const product of products) {
        for (const offer of product.offers) {
          if (offerIndex?.includes(offer.offerIndex)) {
            return {
              start: offer.range[0],
              end: offer.range[1],
              product: offer.product,
              price: offer.price.toString(),
              sponsored: offer.sponsored
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
            price: selectedOffer.price.toString(),
            sponsored: false
          };
        }
      }
    }
  }
};

const findNextToken = async (
  contractInstance: Contract | undefined,
  start: string,
  end: string,
  product: string,
  amountOfTokensToPurchase = '1'
) => {
  if (BigNumber.from(1).eq(amountOfTokensToPurchase)) {
    return await contractInstance?.getNextSequentialIndex(product, start, end);
  } else {
    const array: string[] = [];
    for (let i = BigNumber.from(start); i.lt(end); i = i.add(1)) {
      i = await contractInstance?.getNextSequentialIndex(product, i, end);
      array.push(i.toString());
      if (BigNumber.from(array.length).eq(amountOfTokensToPurchase)) {
        return array;
      }
    }
    return;
  }
};

const Agreements: React.FC<IAgreementsPropsType> = ({
  amountOfTokensToPurchase,
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
  setPurchaseStatus
}) => {
  const [privacyPolicy, setPrivacyPolicy] = useState<boolean>(false);
  const [termsOfUse, setTermsOfUse] = useState<boolean>(false);
  const [buyingToken, setBuyingToken] = useState<boolean>(false);
  const [buttonMessage, setButtonMessage] = useState<string>('');

  const reactSwal = useSwal();
  const { web3Switch, correctBlockchain, web3TxHandler } = useWeb3Tx();

  const {
    currentUserAddress,
    minterInstance,
    diamondMarketplaceInstance,
    contractCreator
  } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const queryRangeDataFromBlockchain = async (
    marketplaceInstance: Contract | undefined,
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
          : minterOffer.price.toString(),
        // Blockchain queries cannot be verified as being sponsored, only database calls
        sponsored: false
      };
    }
  };

  const purchaseFunction = async (
    minterInstance: Contract | undefined,
    offerIndex: string[] | undefined,
    nextToken: any,
    price: string,
    diamond = false,
    sponsored = false
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
    let method = 'buyMintingOffer';
    if (!diamond) {
      args.push(offerIndex?.[1]);
      method = 'buyToken';
    }
    if (nextToken.length) {
      args.push(nextToken);
      args.push(nextToken.map(() => currentUserAddress));
      args.push({
        value: BigNumber.from(price).mul(nextToken.length)
      });
      method = 'buyMintingOfferBatch';
    } else {
      args.push(nextToken);
      args.push({
        value: price
      });
    }

    return await web3TxHandler(minterInstance, method, args, {
      intendedBlockchain: requiredBlockchain as BlockchainType,
      failureMessage:
        'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
      sponsored
    });
  };

  return (
    <div className={`text-${textColor}`}>
      <div className={`${!collection ? 'py-4 w-100 row' : ''}`}>
        <div className="col-12 col-sm-1 d-none d-md-inline" />
        <div className="col-12 col-sm-10 pe-2 pe-md-5">
          {!collection
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
                          <FontAwesomeIcon
                            icon={faCheck}
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
          className="col-12 col-sm-8 col-md-4 rounded-rair my-4 btn rair-button"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={async () => {
            setBuyingToken(true);
            if (setPurchaseStatus) {
              setPurchaseStatus(true);
            }
            // If currentUserAddress isn't set then the user hasn't connected their wallet
            if (!currentUserAddress) {
              connectUserData?.();
              setBuyingToken(false);
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            // If the currentChain is different from the contract's chain, switch
            if (!correctBlockchain(requiredBlockchain as BlockchainType)) {
              await web3Switch(requiredBlockchain as BlockchainType);
              setBuyingToken(false);
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            setButtonMessage('Connecting to contract...');
            // Create the instance of the function
            const contractInstance = contractCreator?.(
              contractAddress,
              diamond ? erc721Abi : diamondFactoryAbi
            );

            setButtonMessage('Finding mintable NFT...');

            let rangeData: IRangeDataType | undefined;
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

            const { start, end, product, price, sponsored } = rangeData;

            const nextToken = await findNextToken(
              contractInstance,
              start,
              end,
              product,
              amountOfTokensToPurchase
            );

            if (!nextToken) {
              reactSwal.fire(
                'Error',
                "Couldn't find enough tokens to mint!",
                'error'
              );
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            if (nextToken?.length) {
              setButtonMessage(`Minting tokens ${nextToken.join(',')}`);
            } else {
              setButtonMessage(`Minting token #${nextToken.toString()}`);
            }

            if (
              (
                await contractInstance?.provider.getBalance(currentUserAddress)
              )?.lt(BigNumber.from(price).mul(amountOfTokensToPurchase))
            ) {
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              reactSwal.fire('Error', 'Insufficient funds!', 'error');
              return;
            }

            const purchaseResult = await purchaseFunction(
              diamond ? diamondMarketplaceInstance : minterInstance,
              offerIndex,
              nextToken,
              price,
              diamond,
              sponsored
            );

            if (purchaseResult && customSuccessAction) {
              customSuccessAction(nextToken.length ? nextToken[0] : nextToken);
            }
            setBuyingToken(false);
            if (setPurchaseStatus) {
              setPurchaseStatus(false);
            }
          }}>
          <wbr />{' '}
          {currentUserAddress
            ? !correctBlockchain(requiredBlockchain as BlockchainType)
              ? `Switch to ${
                  requiredBlockchain && blockchainData[requiredBlockchain]?.name
                }`
              : buttonMessage || 'Purchase'
            : 'Connect your wallet!'}
        </button>
      </div>
      {buyingToken && (
        <div className="wait-minting-token">
          <div className="wait-minting-token-text">
            Blockchain in progress.. please wait!
          </div>
          <img src={`${GrandpaWait}`} alt="waiting minting token" />
        </div>
      )}
    </div>
  );
};

const PurchaseTokenButton: React.FC<IPurchaseTokenButtonProps> = ({
  amountOfTokensToPurchase = '1',
  altButtonFormat = false,
  customButtonClassName,
  customButtonTextClassName,
  customWrapperClassName,
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
  const { primaryColor, textColor, primaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const { web3TxHandler } = useWeb3Tx();
  const reactSwal = useSwal();

  const fireAgreementModal = () => {
    reactSwal.fire({
      title:
        collection === true ? (
          ''
        ) : (
          <h1 style={{ color: 'var(--bubblegum)' }}>Terms of Service</h1>
        ),
      html: (
        <Provider store={store}>
          <Agreements
            {...{
              amountOfTokensToPurchase,
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
      width: '87vw',
      customClass: {
        popup: `bg-${primaryColor} rounded-rair`,
        title: `text-${textColor}`
      }
    });
  };

  if (altButtonFormat) {
    return (
      <button
        className={customButtonClassName}
        onClick={handleClick ? handleClick : fireAgreementModal}>
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
          style={{
            background: `${
              primaryColor === '#dedede'
                ? import.meta.env.VITE_TESTNET === 'true'
                  ? 'var(--hot-drops)'
                  : 'linear-gradient(to right, #e882d5, #725bdb)'
                : import.meta.env.VITE_TESTNET === 'true'
                  ? primaryButtonColor ===
                    'linear-gradient(to right, #e882d5, #725bdb)'
                    ? 'var(--hot-drops)'
                    : primaryButtonColor
                  : primaryButtonColor
            }`
          }}
          onClick={handleClick ? handleClick : fireAgreementModal}>
          {buttonLabel}
        </button>
      </div>
    );
  }
  // }
};

export default PurchaseTokenButton;
