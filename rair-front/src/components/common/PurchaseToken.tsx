import React, { useCallback, useEffect, useState } from 'react';
import { Provider, useStore } from 'react-redux';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Contract } from 'ethers';
import { Hex } from 'viem';

import LoadingComponent from './LoadingComponent';

import { diamondFactoryAbi, erc721Abi } from '../../contracts';
import useConnectUser from '../../hooks/useConnectUser';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { GrandpaWait } from '../../images';
import { getRandomValues } from '../../utils/getRandomValues';
import { rFetch } from '../../utils/rFetch';

import {
  IAgreementsPropsType,
  IPurchaseTokenButtonProps,
  IRangeDataType
} from './commonTypes/PurchaseTokenTypes.types';

const queryRangeDataFromDatabase = async (
  contractInstance: Contract | undefined,
  network: Hex | undefined,
  offerIndex: string[] | undefined,
  diamond = false
): Promise<undefined | IRangeDataType> => {
  if (!contractInstance) {
    return;
  }
  const { success, products } = await rFetch(
    `/api/contracts/network/${network}/${await contractInstance?.getAddress()}/offers`,
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
              sponsored: offer.sponsored,
              _id: offer._id
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
  const { getBlockchainData } = useServerSettings();

  const { diamondMarketplaceInstance, contractCreator, refreshSigner } =
    useContracts();

  const { currentUserAddress } = useAppSelector((store) => store.web3);
  const { isLoggedIn } = useAppSelector((store) => store.user);
  const { textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  useEffect(() => {
    refreshSigner();
  }, []);

  const findNextToken = useCallback(
    async (
      contractInstance: Contract,
      start: string,
      end: string,
      product: string,
      amountOfTokensToPurchase = '1',
      offerId
    ) => {
      if (offerId) {
        const { success, availableTokens } = await rFetch(
          `/api/offers/${offerId}/available`
        );
        if (success) {
          if (
            BigInt(amountOfTokensToPurchase) > BigInt(availableTokens.length)
          ) {
            return;
          } else if (
            BigInt(amountOfTokensToPurchase) === BigInt(availableTokens.length)
          ) {
            return availableTokens.map((item) => item.token);
          }
          const selectedTokens: Array<bigint> = Array(
            Number(amountOfTokensToPurchase)
          ).fill(BigInt(0));

          selectedTokens.forEach((_, index) => {
            let randomNumber: bigint;
            do {
              randomNumber = BigInt(
                availableTokens[
                  Math.floor(Math.random() * availableTokens.length)
                ].token
              );
            } while (selectedTokens.includes(randomNumber));
            selectedTokens[index] = randomNumber;
          });
          return selectedTokens;
        }
      }
      // Fallback to sequential minting if there's no offer ID or the api call fails
      if (BigInt(1) === BigInt(amountOfTokensToPurchase)) {
        const singleNextToken = await web3TxHandler(
          contractInstance,
          'getNextSequentialIndex',
          [product, start, end]
        );
        return singleNextToken;
      } else {
        const array: string[] = [];
        for (let i = BigInt(start); i <= BigInt(end); i = i + BigInt(1)) {
          i = await web3TxHandler(contractInstance, 'getNextSequentialIndex', [
            product,
            i,
            end
          ]);
          array.push(i.toString());
          if (BigInt(array.length) === BigInt(amountOfTokensToPurchase)) {
            return array;
          }
        }
        return;
      }
    },
    [web3TxHandler]
  );

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
        title: 'Error',
        html: 'Could not connect to marketplace contract, please try again later',
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
        value: BigInt(price) * BigInt(nextToken.length)
      });
      method = 'buyMintingOfferBatch';
    } else {
      args.push(nextToken);
      args.push({
        value: price
      });
    }

    return await web3TxHandler(minterInstance, method, args, {
      intendedBlockchain: requiredBlockchain,
      failureMessage:
        'Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!',
      sponsored
    });
  };

  if (!isLoggedIn) {
    reactSwal.fire('Please login', '', 'info');
  }

  if (!diamondMarketplaceInstance) {
    return <LoadingComponent />;
  }

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
            if (!requiredBlockchain) {
              return;
            }
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

            // If the connectedChain is different from the contract's chain, switch
            if (!correctBlockchain(requiredBlockchain)) {
              await web3Switch(requiredBlockchain);
              setBuyingToken(false);
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            setButtonMessage('Connecting to contract...');

            if (!contractCreator) {
              reactSwal.fire(
                'Error',
                'Cannot connect to contracts, please try again later',
                'error'
              );
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }
            // Create the instance of the function
            const contractInstance = contractCreator(
              contractAddress,
              diamond ? erc721Abi : diamondFactoryAbi
            );

            if (!contractInstance) {
              reactSwal.fire(
                'Error',
                'Could not connect to token contract.',
                'error'
              );
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

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
                diamondMarketplaceInstance,
                offerIndex,
                diamond
              );
            }

            if (!rangeData) {
              reactSwal.fire(
                'Error',
                'Could not fetch range information.',
                'error'
              );
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              return;
            }

            const { start, end, product, price, sponsored, _id } = rangeData;

            const nextToken = await findNextToken(
              contractInstance,
              start,
              end,
              product,
              amountOfTokensToPurchase,
              _id
            );

            if (nextToken === undefined) {
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

            const userBalance =
              await contractInstance?.runner?.provider?.getBalance(
                currentUserAddress
              );

            const tokenPrice = BigInt(price) + BigInt(amountOfTokensToPurchase);

            if (userBalance === undefined) {
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              reactSwal.fire('Error', "Couldn't load user balance", 'error');
              return;
            }

            if (BigInt(userBalance.toString()) < tokenPrice && !sponsored) {
              if (setPurchaseStatus) {
                setPurchaseStatus(false);
              }
              reactSwal.fire('Error', 'Insufficient funds!', 'error');
              return;
            }

            const purchaseResult = await purchaseFunction(
              diamondMarketplaceInstance,
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
            ? !correctBlockchain(requiredBlockchain)
              ? `Switch to ${
                  requiredBlockchain &&
                  getBlockchainData(requiredBlockchain)?.name
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
  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

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
