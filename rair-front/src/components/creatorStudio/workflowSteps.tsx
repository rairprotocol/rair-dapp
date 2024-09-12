import { FC, useCallback, useEffect, useState } from 'react';
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams
} from 'react-router-dom';
import { faArrowLeft, faGem } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { withSentryReactRouterV6Routing } from '@sentry/react';
import { ethers } from 'ethers';

import {
  TContractData,
  TSteps,
  TWorkflowContextType,
  TWorkflowParams
} from './creatorStudio.types';

import WorkflowContext from '../../contexts/CreatorWorkflowContext';
import { diamond721Abi, erc721Abi } from '../../contracts';
import useContracts from '../../hooks/useContracts';
import { useAppSelector } from '../../hooks/useReduxHooks';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import { rFetch } from '../../utils/rFetch';

import BatchMetadata from './creatorSteps/batchMetadata';
import CustomizeFees from './creatorSteps/CustomizeFees';
import ListLocks from './creatorSteps/ListLocks';
import ListOffers from './creatorSteps/ListOffers';
import MediaUpload from './creatorSteps/MediaUpload';
import ResaleMarketplace from './creatorSteps/ResaleMarketplace';
import SingleMetadataEditor from './creatorSteps/singleMetadataEditor';
import DiamondMinterMarketplace from './diamondCreatorSteps/DiamondMinterMarketplace';
import ListOffersDiamond from './diamondCreatorSteps/ListOffersDiamond';

const SentryRoutes = withSentryReactRouterV6Routing(Routes);

const WorkflowSteps: FC = () => {
  const { address, collectionIndex, blockchain } = useParams<TWorkflowParams>();

  const { contractCreator, diamondMarketplaceInstance } = useContracts();
  const { connectedChain, currentUserAddress } = useAppSelector(
    (store) => store.web3
  );

  const { web3TxHandler, web3Switch, correctBlockchain } = useWeb3Tx();

  const [mintingRole, setMintingRole] = useState<boolean>();
  const [traderRole, setTraderRole] = useState<boolean>();
  const [MINTERHash, setMINTERHash] = useState<string | undefined>(undefined);

  const [contractData, setContractData] = useState<TContractData>();
  const [fetchingData, setFetchingData] = useState<boolean>(false);

  const [tokenInstance, setTokenInstance] = useState<
    TContractData | ethers.Contract
  >();

  const [currentStep, setCurrentStep] = useState<number>(0);

  const [forceFetchData, setForceFetchData] = useState<boolean>(false);

  const [simpleMode, setSimpleMode] = useState<boolean>(true);

  const { primaryColor, textColor, primaryButtonColor } = useAppSelector(
    (store) => store.colors
  );

  const [steps, setSteps] = useState<TSteps[]>([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!contractData) {
      return;
    }
    let filteredSteps: TSteps[] = [
      {
        path: 'offers',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/offers`,
        component: contractData.diamond ? ListOffersDiamond : ListOffers,
        simple: true,
        classic: true,
        diamond: true,
        shortName: 'Ranges',
        hasAdvancedFeatures: true,
        external: false,
        description:
          'Define a range of tokens and give them their own minting price'
      },
      {
        path: 'locks',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/locks`,
        component: ListLocks,
        simple: false,
        classic: true,
        diamond: false,
        shortName: 'Locks',
        hasAdvancedFeatures: true,
        external: false,
        description:
          'With locks you can prevent token trades before a certain number of tokens are minted'
      },
      {
        path: 'customizeFees',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/customizeFees`,
        component: CustomizeFees,
        simple: false,
        classic: true,
        diamond: false,
        shortName: 'Custom Fees',
        hasAdvancedFeatures: true,
        external: false,
        description: 'Add custom royalty fees for token mints'
      },
      {
        path: 'minterMarketplace',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/minterMarketplace`,
        component: DiamondMinterMarketplace,
        simple: true,
        classic: false,
        diamond: true,
        shortName: 'Offers',
        hasAdvancedFeatures: true,
        external: false,
        description:
          "Put your ranges on the marketplace contract, you can also customize the royalties you'll receive when a token is minted"
      },
      {
        path: 'resaleMarketplace',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/resaleMarketplace`,
        component: ResaleMarketplace,
        simple: false,
        classic: true,
        diamond: true,
        shortName: 'Resale Setup',
        hasAdvancedFeatures: true,
        external: false,
        description: 'Set up royalty fees for the reselling of the NFTs'
      },
      {
        path: 'metadata/batch',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/metadata/batch`,
        component: BatchMetadata,
        simple: true,
        classic: true,
        diamond: true,
        shortName: 'Metadata',
        hasAdvancedFeatures: true,
        external: false,
        description:
          'Upload a CSV file with all of the metadata for your tokens'
      },
      {
        path: 'metadata/single',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/metadata/single`,
        component: SingleMetadataEditor,
        simple: true,
        classic: true,
        diamond: true,
        shortName: 'Single Metadata',
        hasAdvancedFeatures: true,
        external: false,
        description: 'Update the metadata of a single token'
      },
      {
        path: 'media',
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/media`,
        component: MediaUpload,
        simple: true,
        classic: true,
        diamond: true,
        shortName: 'Media Files',
        hasAdvancedFeatures: false,
        external: true,
        description:
          'Upload media files, users will need NFTs from your contract to unlock them'
      }
    ];
    if (contractData.external) {
      filteredSteps = filteredSteps.filter((step) => step.external);
    }
    if (simpleMode) {
      filteredSteps = filteredSteps.filter((step) => step.simple);
    }
    if (contractData.diamond) {
      filteredSteps = filteredSteps.filter((step) => step.diamond === true);
    } else {
      filteredSteps = filteredSteps.filter((step) => step.classic === true);
    }
    setSteps(filteredSteps);
  }, [
    contractData,
    address,
    collectionIndex,
    steps.length,
    simpleMode,
    blockchain
  ]);

  useEffect(() => {
    if (contractData?.external && steps.length) {
      navigate(steps[0].path);
    }
  }, [contractData, steps, navigate]);

  const refreshNFTMetadata = async () => {
    if (!contractData) {
      return;
    }
    const aux = { ...contractData };
    aux.nfts = await getNFTMetadata(
      contractData.blockchain,
      contractData.contractAddress,
      collectionIndex
    );
    setContractData(aux);
    return aux.nfts;
  };

  const getNFTMetadata = async (blockchain, address, collectionIndex) => {
    const { success, tokens } = await rFetch(
      `/api/nft/network/${blockchain}/${address.toLowerCase()}/${collectionIndex}`,
      undefined,
      undefined,
      false
    );
    if (success) {
      return tokens;
    }
  };

  const fetchData = useCallback(async () => {
    if (!address) {
      return;
    }
    const contractDataResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}`,
      undefined,
      undefined,
      false
    );
    const productDataResponse = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/products`,
      undefined,
      undefined,
      false
    );
    if (productDataResponse.success) {
      contractDataResponse.contract.products = productDataResponse.products;
    }
    const offersAndLocksResponse = await rFetch(
      `/api/offers?contract=${contractDataResponse.contract._id}&product=${collectionIndex}`,
      undefined,
      undefined,
      false
    );
    const response4 = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/offers`,
      undefined,
      undefined,
      false
    );
    if (response4.success) {
      response4.products.forEach((item) => {
        contractDataResponse.contract.products.forEach((existingItem) => {
          if (item._id.toString() === existingItem._id.toString()) {
            existingItem.offers = item.offers;
          }
        });
      });
    }
    if (contractDataResponse.contract) {
      contractDataResponse.contract.product =
        contractDataResponse?.contract?.products?.filter(
          (i) => i?.collectionIndexInContract === collectionIndex
        )?.[0];
      delete contractDataResponse.contract.products;
      if (offersAndLocksResponse.success) {
        contractDataResponse.contract.product.offers =
          offersAndLocksResponse.data.doc;
      }
      if (contractDataResponse.contract.blockchain === connectedChain) {
        contractDataResponse.contract.instance = contractCreator?.(
          address,
          contractDataResponse.contract.diamond ? diamond721Abi : erc721Abi
        );
      }
      if (
        contractDataResponse.contract.diamond &&
        contractDataResponse.contract.product.offers
      ) {
        for await (const offer of contractDataResponse.contract.product
          .offers) {
          if (
            offer.offerIndex &&
            diamondMarketplaceInstance &&
            connectedChain === contractDataResponse.contract.blockchain
          ) {
            const aux = await diamondMarketplaceInstance.getOfferInfo(
              offer.offerIndex
            );
            offer.marketData = {
              visible: aux.mintOffer.visible,
              fees: aux.mintOffer.fees.map((fee) => ({
                message: 'Marketplace Data',
                recipient: fee.recipient,
                percentage: fee.percentage,
                editable: true
              }))
            };
          } else {
            offer.marketData = {
              visible: true,
              fees: [
                {
                  message: 'Creator Address (You!)',
                  recipient: currentUserAddress,
                  percentage: 95000,
                  editable: true
                }
              ]
            };
            offer.selected = !offer.offerIndex;
          }
        }
      }
      if (contractDataResponse?.contract?.product?.offers) {
        contractDataResponse.contract.nfts = await getNFTMetadata(
          contractDataResponse.contract.blockchain,
          address,
          collectionIndex
        );
      }
    }
    setContractData(contractDataResponse.contract);
  }, [
    connectedChain,
    address,
    blockchain,
    collectionIndex,
    contractCreator,
    currentUserAddress,
    diamondMarketplaceInstance
  ]);

  const checkMarketRoles = useCallback(async () => {
    if (
      !contractData?.instance ||
      contractData.external ||
      !correctBlockchain(contractData.blockchain) ||
      !diamondMarketplaceInstance
    ) {
      return;
    }
    const MINTER = await web3TxHandler(contractData.instance, 'MINTER');
    if (MINTER) {
      setMINTERHash(MINTER);
      setMintingRole(
        await web3TxHandler(contractData.instance, 'hasRole', [
          MINTER,
          await diamondMarketplaceInstance?.getAddress()
        ])
      );
    }
    const TRADER = await web3TxHandler(contractData.instance, 'TRADER');
    if (TRADER) {
      setTraderRole(
        await web3TxHandler(contractData.instance, 'hasRole', [
          TRADER,
          await diamondMarketplaceInstance?.getAddress()
        ])
      );
    }
  }, [
    contractData,
    correctBlockchain,
    diamondMarketplaceInstance,
    web3TxHandler
  ]);

  useEffect(() => {
    checkMarketRoles();
  }, [checkMarketRoles]);

  useEffect(() => {
    // Fix this
    if (contractData && correctBlockchain(contractData.blockchain)) {
      const createdInstance = contractCreator?.(address, erc721Abi);
      setTokenInstance(createdInstance);
    }
  }, [address, contractData, correctBlockchain, contractCreator]);

  useEffect(() => {
    fetchData();
  }, [forceFetchData, fetchData]);

  const goBack = useCallback(() => {
    if (currentStep === 0) {
      navigate(-1);
      return;
    }
    navigate(steps[currentStep - 1].populatedPath);
  }, [steps, currentStep, navigate]);

  const initialValue: TWorkflowContextType = {
    MINTERHash,
    contractData,
    steps,
    setStepNumber: setCurrentStep,
    gotoNextStep: () => {
      navigate(steps[currentStep + 1].populatedPath);
    },
    switchBlockchain: () => web3Switch(contractData?.blockchain),
    goBack,
    mintingRole,
    traderRole,
    checkMarketRoles,
    onMyChain: correctBlockchain(contractData?.blockchain),
    tokenInstance,
    simpleMode,
    forceRefetch: () => {
      setFetchingData(true);
      setTimeout(async () => {
        await setForceFetchData(!forceFetchData);
        setFetchingData(false);
      }, 2000);
    },
    fetchingData,
    refreshNFTMetadata
  };

  const navigateRoute = () => {
    let notSimple = false;
    setSimpleMode(true);
    steps.forEach((item) => {
      if (!item.simple) {
        notSimple = true;
      }
    });
    if (notSimple) navigate(`${steps[0].populatedPath}`);
  };

  return (
    <>
      <WorkflowContext.Provider value={initialValue}>
        <WorkflowContext.Consumer>
          {() => {
            return (
              <div className="row px-0 mx-0">
                <div className="col-12 my-5" style={{ position: 'relative' }}>
                  <div
                    style={{
                      position: 'absolute',
                      left: 20,
                      background: primaryButtonColor
                    }}
                    className="btn rounded-rair p-0">
                    <button
                      onClick={goBack}
                      style={{
                        border: 'none',
                        color: textColor,
                        backgroundColor: primaryColor
                      }}
                      className="btn rounded-rair w-100 rair-button">
                      <FontAwesomeIcon icon={faArrowLeft} /> Back
                    </button>
                  </div>
                  {contractData && contractData.diamond && (
                    <div className="w-100 text-center h1">
                      <FontAwesomeIcon icon={faGem} />
                    </div>
                  )}
                  <h4>{contractData?.title}</h4>
                  {!contractData?.external && (
                    <small>{contractData?.product?.name}</small>
                  )}
                  <div className="w-75 mx-auto px-auto text-center mb-5">
                    {steps.length > 1 &&
                      steps.map((item, index) => {
                        return (
                          <NavLink
                            to={item.populatedPath}
                            key={index}
                            className="d-inline-block"
                            style={{
                              width: `${
                                (100 / steps.length) * (index === 0 ? 0.09 : 1)
                              }%`,
                              height: '3px',
                              position: 'relative',
                              textAlign: 'right',
                              backgroundColor: `var(--${
                                currentStep >= index
                                  ? 'bubblegum'
                                  : `charcoal-80`
                              })`
                            }}>
                            <div
                              style={{
                                position: 'absolute',
                                right: 0,
                                top: '-10px',
                                borderRadius: '50%',
                                background: `var(--${
                                  currentStep >= index
                                    ? 'bubblegum'
                                    : `${
                                        primaryColor === '#dedede'
                                          ? 'rhyno'
                                          : 'charcoal'
                                      }`
                                })`,
                                height: '1.7rem',
                                width: '1.7rem',
                                margin: 'auto',
                                border: 'solid 1px var(--charcoal-60)',
                                textAlign: 'center',
                                color: currentStep >= index ? undefined : 'gray'
                              }}>
                              <div className="rair-abbr" id={item.shortName}>
                                {index + 1}
                              </div>
                            </div>
                          </NavLink>
                        );
                      })}
                  </div>
                  <div className="mx-5 px-5">
                    {steps?.at(currentStep)?.description}
                  </div>
                  {steps?.at(currentStep)?.hasAdvancedFeatures && (
                    <div
                      className="row mt-3 w-100"
                      style={{ paddingTop: '50px' }}>
                      <div className="col-12 col-md-6 text-end">
                        <button
                          onClick={() => navigateRoute()}
                          style={{
                            color: textColor,
                            background: simpleMode
                              ? primaryButtonColor
                              : primaryColor,
                            border: `solid 1px ${textColor}`
                          }}
                          className="btn rair-button rounded-rair col-12 col-md-6">
                          Simple
                        </button>
                      </div>
                      <div className="col-12 col-md-6 text-start mb-3">
                        <button
                          onClick={() => setSimpleMode(false)}
                          style={{
                            color: textColor,
                            background: !simpleMode
                              ? primaryButtonColor
                              : primaryColor,
                            border: `solid 1px ${textColor}`
                          }}
                          className={`btn rair-button rounded-rair col-12 col-md-6`}>
                          Advanced
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            );
          }}
        </WorkflowContext.Consumer>
        <SentryRoutes>
          {steps.map((item, index) => {
            return (
              <Route
                key={index}
                path={item.path}
                element={
                  <item.component
                    setContractData={setContractData}
                    stepNumber={index}
                  />
                }
              />
            );
          })}
        </SentryRoutes>
      </WorkflowContext.Provider>
    </>
  );
};

export default WorkflowSteps;
