import { useState, useEffect, useCallback } from "react";
import { withSentryRouting } from "@sentry/react";
import { rFetch } from "../../utils/rFetch.js";
import { useSelector } from "react-redux";
import {
  useParams,
  Router,
  Switch,
  Route,
  useHistory,
  NavLink,
} from "react-router-dom";
import WorkflowContext from "../../contexts/CreatorWorkflowContext.js";
import { web3Switch } from "../../utils/switchBlockchain.js";
import { minterAbi, erc721Abi, diamondFactoryAbi } from "../../contracts";
import chainData from "../../utils/blockchainData.js";

import ListOffers from "./creatorSteps/ListOffers.jsx";
import ListLocks from "./creatorSteps/ListLocks.jsx";
import CustomizeFees from "./creatorSteps/CustomizeFees.jsx";
import BatchMetadata from "./creatorSteps/batchMetadata.jsx";
import SingleMetadataEditor from "./creatorSteps/singleMetadataEditor.jsx";
import MediaUpload from "./creatorSteps/MediaUpload.jsx";

import ListOffersDiamond from "./diamondCreatorSteps/ListOffersDiamond.jsx";
import DiamondMinterMarketplace from "./diamondCreatorSteps/DiamondMinterMarketplace.jsx";

const SentryRoute = withSentryRouting(Route);

const WorkflowSteps = ({ sentryHistory }) => {
  const { address, collectionIndex, blockchain } = useParams();

  const {
    minterInstance,
    contractCreator,
    programmaticProvider,
    diamondMarketplaceInstance,
    currentChain
  } = useSelector((store) => store.contractStore);
  const [contractData, setContractData] = useState();
  const [tokenInstance, setTokenInstance] = useState();
  const [correctMinterInstance, setCorrectMinterInstance] = useState();
  const [currentStep, setCurrentStep] = useState(0);
  const [simpleMode, setSimpleMode] = useState(true);
  const { primaryColor } = useSelector((store) => store.colorStore);
  const [steps, setSteps] = useState([]);
  const history = useHistory();

  useEffect(() => {
    if (!contractData) {
      return;
    }
    let filteredSteps = [
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/offers",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/offers`,
        component: contractData.diamond ? ListOffersDiamond : ListOffers,
        simple: true,
        classic: true,
        diamond: true,
        shortName: "Ranges",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/locks",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/locks`,
        component: ListLocks,
        simple: false,
        classic: true,
        diamond: false,
        shortName: "Locks",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/customizeFees",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/customizeFees`,
        component: CustomizeFees,
        simple: false,
        classic: true,
        diamond: false,
        shortName: "Custom Fees",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/minterMarketplace",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/minterMarketplace`,
        component: DiamondMinterMarketplace,
        simple: true,
        classic: false,
        diamond: true,
        shortName: "Offers",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/metadata/batch",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/metadata/batch`,
        component: BatchMetadata,
        simple: true,
        classic: true,
        diamond: true,
        shortName: "Batch Metadata",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/metadata/single",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/metadata/single`,
        component: SingleMetadataEditor,
        simple: true,
        classic: true,
        diamond: true,
        shortName: "Single Metadata",
        hasAdvancedFeatures: true,
      },
      {
        path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/media",
        populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/media`,
        component: MediaUpload,
        simple: true,
        classic: true,
        diamond: true,
        shortName: "Media Files",
        hasAdvancedFeatures: false,
      },
    ];
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
    blockchain,
  ]);

  const onMyChain = window.ethereum
    ? chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
    : chainData[contractData?.blockchain]?.chainId ===
      programmaticProvider?.provider?._network?.chainId;

  const fetchData = useCallback(async () => {
    if (!address) {
      return;
    }
    let response2 = await rFetch(
      `/api/contracts/network/${blockchain}/${address}`
    );
    let response3 = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/products`
    );
    if (response3.success) {
      response2.contract.products = response3.products;
    }
    let response4 = await rFetch(
      `/api/contracts/network/${blockchain}/${address}/products/offers`
    );
    // Special case where a product exists but it has no offers
    if (response4.success) {
      response4.products.forEach((item) => {
        response2.contract.products.forEach((existingItem) => {
          if (item._id.toString() === existingItem._id.toString()) {
            existingItem.offers = item.offers;
          }
        });
      });
    }
    if (response2.contract) {
      response2.contract.product = (response2?.contract?.products?.filter(
        (i) => i?.collectionIndexInContract === Number(collectionIndex)
      ))[0];
      delete response2.contract.products;
      if (response2.contract.blockchain === currentChain) {
      	response2.contract.instance = contractCreator(response2.contract.contractAddress, erc721Abi);
      }
      setContractData(response2.contract);
    } else if (process.env.REACT_APP_DIAMONDS_ENABLED === "true") {
      try {
        // Try diamonds
        let instance = contractCreator(address, diamondFactoryAbi);
        let productData = await instance.getProductInfo(collectionIndex);
        let rangesData = [];
        for await (let rangeIndex of productData.rangeList) {
          let rangeData = await instance.rangeInfo(rangeIndex);
          if (rangeData) {
            rangesData.push({
              rangeIndex: Number(rangeIndex.toString()),
              offerName: rangeData.data.rangeName,
              range: [
                Number(rangeData.data.rangeStart.toString()),
                Number(rangeData.data.rangeEnd.toString()),
              ],
              price: rangeData.data.rangePrice.toString(),
              lockedTokens: Number(rangeData.data.lockedTokens.toString()),
              tokensAllowed: Number(rangeData.data.tokensAllowed.toString()),
              mintableTokens: Number(rangeData.data.mintableTokens.toString()),
              fixed: true,
            });
          }
        }
        if (diamondMarketplaceInstance) {
          let offersCount =
            await diamondMarketplaceInstance.getOffersCountForAddress(
              instance.address
            );
          for (let i = 0; i < offersCount.toString(); i++) {
            let marketData =
              await diamondMarketplaceInstance.getOfferInfoForAddress(
                instance.address,
                i
              );
            let [selectedOffer] = rangesData.filter(
              (item) => item.offerName === marketData.rangeData.rangeName
            );
            if (selectedOffer) {
              selectedOffer.marketData = {
                mintingOfferIndex: marketData.offerIndex.toString(),
                visible: marketData.mintOffer.visible,
                fees: marketData.mintOffer.fees,
                fromMarket: true,
              };
            }
          }
        }
        rangesData.forEach((item) => {
          if (!item.marketData) {
            item.marketData = {
              mintingOfferIndex: undefined,
              visible: true,
              fees: undefined,
              fromMarket: false,
            };
          }
        });
        setContractData({
          title: await instance.name(),
          contractAddress: address,
          blockchain: window.ethereum.chainId,
          diamond: instance,
          product: {
            collectionIndexInContract: collectionIndex,
            name: productData.name,
            firstTokenIndex: Number(productData.startingToken.toString()),
            soldCopies:
              Number(productData.endingToken.toString()) -
              Number(productData.startingToken.toString()) +
              1 -
              Number(productData.mintableTokens.toString()),
            copies:
              Number(productData.endingToken.toString()) -
              Number(productData.startingToken.toString()) +
              1,
            offers: rangesData,
          },
          instance,
        });
      } catch (err) {
        console.error("Error parsing diamonds", err);
      }
    }
  }, [address, blockchain, collectionIndex, contractCreator, currentChain, diamondMarketplaceInstance]);

  useEffect(() => {
    if (diamondMarketplaceInstance) {
      diamondMarketplaceInstance.on("AddedMintingOffer", fetchData);
      diamondMarketplaceInstance.on("UpdatedMintingOffer", fetchData);
      return () => {
        diamondMarketplaceInstance.off("AddedMintingOffer", fetchData);
        diamondMarketplaceInstance.on("UpdatedMintingOffer", fetchData);
      };
    }
  }, [diamondMarketplaceInstance, fetchData]);

  useEffect(() => {
    if (contractData?.instance && contractData.diamond) {
      contractData.instance.on("CreatedRange", fetchData);
      contractData.instance.on("RoleGranted", fetchData);
      return () => {
        contractData.instance.off("CreatedRange", fetchData);
        contractData.instance.off("RoleGranted", fetchData);
      };
    }
  }, [contractData, fetchData]);

  const fetchMintingStatus = useCallback(async () => {
    if (!tokenInstance || !onMyChain) {
      return;
    }
    try {
      return await tokenInstance.hasRole(
        await tokenInstance.MINTER(),
        correctMinterInstance.address
      );
    } catch (err) {
      console.error(err);
      return false;
    }
  }, [correctMinterInstance, tokenInstance, onMyChain]);

  useEffect(() => {
    // Fix this
    if (onMyChain) {
      let createdInstance = contractCreator(minterInstance.address, minterAbi);
      setCorrectMinterInstance(createdInstance);
    }
  }, [address, onMyChain, contractCreator, minterInstance.address]);

  useEffect(() => {
    // Fix this
    if (onMyChain) {
      let createdInstance = contractCreator(address, erc721Abi);
      setTokenInstance(createdInstance);
    }
  }, [address, onMyChain, contractCreator]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const goBack = useCallback(() => {
    history.push(steps[currentStep - 1].populatedPath);
  }, [steps, currentStep, history]);

  const initialValue = {
    contractData,
    steps,
    setStepNumber: setCurrentStep,
    gotoNextStep: () => {
      history.push(steps[currentStep + 1].populatedPath);
    },
    switchBlockchain: async () =>
      web3Switch(chainData[contractData?.blockchain]?.chainId),
    goBack,
    minterRole: fetchMintingStatus(),
    onMyChain,
    correctMinterInstance,
    tokenInstance,
    simpleMode,
  };

  return (
    <WorkflowContext.Provider value={initialValue}>
      <WorkflowContext.Consumer>
        {({ contractData, steps /*, setStepNumber*/ }) => {
          return (
            <div className="row px-0 mx-0">
              <div className="col-12 my-5" style={{ position: "relative" }}>
                {steps.length > 0 && currentStep !== 0 && (
                  <div
                    style={{ position: "absolute", left: 0 }}
                    className="border-stimorol btn rounded-rair p-0"
                  >
                    <button
                      onClick={goBack}
                      style={{ border: "none" }}
                      className={`btn rounded-rair w-100 btn-${primaryColor}`}
                    >
                      <i className="fas fa-arrow-left" /> Back
                    </button>
                  </div>
                )}
                {contractData && contractData.diamond && (
                  <div className="w-100 text-center h1">
                    <i className="fas fa-gem" />
                  </div>
                )}
                <h4>{contractData?.title}</h4>
                <small>{contractData?.product?.name}</small>
                <div className="w-75 mx-auto px-auto text-center mb-5">
                  {steps.map((item, index) => {
                    return (
                      <NavLink
                        to={item.populatedPath}
                        key={index}
                        className="d-inline-block"
                        style={{
                          width: `${
                            (100 / steps.length) * (index === 0 ? 0.09 : 1)
                          }%`,
                          height: "3px",
                          position: "relative",
                          textAlign: "right",
                          backgroundColor: `var(--${
                            currentStep >= index ? "bubblegum" : `charcoal-80`
                          })`,
                        }}
                      >
                        <div
                          style={{
                            position: "absolute",
                            right: 0,
                            top: "-10px",
                            borderRadius: "50%",
                            background: `var(--${
                              currentStep >= index ? "bubblegum" : primaryColor
                            })`,
                            height: "1.7rem",
                            width: "1.7rem",
                            margin: "auto",
                            border: "solid 1px var(--charcoal-60)",
                            textAlign: "center",
                            color: currentStep >= index ? undefined : "gray",
                          }}
                        >
                          <div className="rair-abbr" steplabel={item.shortName}>
                            {index + 1}
                          </div>
                        </div>
                      </NavLink>
                    );
                  })}
                </div>
                {steps?.at(currentStep)?.hasAdvancedFeatures && (
                  <div className="row mt-3 w-100" style={{paddingTop: '50px'}}>
                    <div className="col-12 col-md-6 text-end">
                      <button
                        onClick={() => setSimpleMode(true)}
                        className={`btn btn-${
                          simpleMode ? "stimorol" : primaryColor
                        } rounded-rair col-12 col-md-6`}
                      >
                        Simple
                      </button>
                    </div>
                    <div className="col-12 col-md-6 text-start mb-3">
                      <button
                        onClick={() => setSimpleMode(false)}
                        className={`btn btn-${
                          simpleMode ? primaryColor : "stimorol"
                        } rounded-rair col-12 col-md-6`}
                      >
                        Advanced
                      </button>
                    </div>
                  </div>
                )}
                <h5>{steps?.at(currentStep)?.shortName}</h5>
              </div>
            </div>
          );
        }}
      </WorkflowContext.Consumer>
      <Router history={sentryHistory}>
        <Switch>
          {steps.map((item, index) => {
            return (
              <SentryRoute
                key={index}
                path={item.path}
                render={() => <item.component stepNumber={index} />}
              />
            );
          })}
        </Switch>
      </Router>
    </WorkflowContext.Provider>
  );
};

export default WorkflowSteps;
