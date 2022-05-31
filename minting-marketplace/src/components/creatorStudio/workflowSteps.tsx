//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { withSentryRouting } from "@sentry/react";
import { rFetch } from "../../utils/rFetch";
import { metamaskCall } from "../../utils/metamaskUtils";
import { useSelector } from "react-redux";
import {
	useParams,
	Router,
	Switch,
	Route,
	useHistory,
	NavLink,
} from "react-router-dom";
import WorkflowContext from "../../contexts/CreatorWorkflowContext";
import { web3Switch } from "../../utils/switchBlockchain";
import { minterAbi, erc721Abi, diamondFactoryAbi } from "../../contracts";
import chainData from "../../utils/blockchainData";

import ListOffers from "./creatorSteps/ListOffers";
import ListLocks from "./creatorSteps/ListLocks";
import CustomizeFees from "./creatorSteps/CustomizeFees";
import BatchMetadata from "./creatorSteps/batchMetadata";
import SingleMetadataEditor from "./creatorSteps/singleMetadataEditor";
import MediaUpload from "./creatorSteps/MediaUpload";

import ListOffersDiamond from "./diamondCreatorSteps/ListOffersDiamond";
import DiamondMinterMarketplace from "./diamondCreatorSteps/DiamondMinterMarketplace";
import ResaleMarketplace from './creatorSteps/ResaleMarketplace';


const SentryRoute = withSentryRouting(Route);

const WorkflowSteps = ({ sentryHistory }) => {
	const { address, collectionIndex, blockchain } = useParams();

	const {
		minterInstance,
		contractCreator,
		programmaticProvider,
		diamondMarketplaceInstance,
		currentChain,
		currentUserAddress
	} = useSelector((store) => store.contractStore);

	const [mintingRole, setMintingRole] = useState();
	const [traderRole, setTraderRole] = useState();

	const [contractData, setContractData] = useState();
	
	const [tokenInstance, setTokenInstance] = useState();
	
	const [correctMinterInstance, setCorrectMinterInstance] = useState();
	
	const [currentStep, setCurrentStep] = useState(0);
	
	const [forceFetchData, setForceFetchData] = useState(false);
	
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
				path: "/creator/contract/:blockchain/:address/collection/:collectionIndex/resaleMarketplace",
				populatedPath: `/creator/contract/${blockchain}/${address}/collection/${collectionIndex}/resaleMarketplace`,
				component: ResaleMarketplace,
				simple: false,
				classic: true,
				diamond: true,
				shortName: "Resale Setup",
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
						existingItem.tokenLock = item.tokenLock;
					}
				});
			});
		}
		if (response2.contract) {
			response2.contract.product = (response2?.contract?.products?.filter(
				(i) => i?.collectionIndexInContract === collectionIndex
			))[0];
			delete response2.contract.products;
			if (response2.contract.blockchain === currentChain) {
				response2.contract.instance = contractCreator(address, response2.contract.diamond ? diamondFactoryAbi : erc721Abi);
			}
			if (response2.contract.diamond && response2.contract.product.offers) {
				for await (let offer of response2.contract.product.offers) {
					if (response2.contract.product.tokenLock.lockIndex === offer.diamondRangeIndex) {
						offer.lockedTokens = response2.contract.product.tokenLock.lockedTokens;
					}
					if (offer.offerIndex && diamondMarketplaceInstance) {
						let aux = await diamondMarketplaceInstance.getOfferInfo(offer.offerIndex);
						offer.marketData = {
							visible: aux.mintOffer.visible,
							fees: aux.mintOffer.fees.map(fee => ({
								message: 'Marketplace Data',
								recipient: fee.recipient,
								percentage: fee.percentage,
								editable: true
							}))
						}
					} else {
						offer.marketData = {
							visible: true,
							fees: [{
								message: 'Creator Address (You!)',
								recipient: currentUserAddress,
								percentage: 90000,
								editable: true
							}]
						}
						offer.selected = !offer.offerIndex;
					}
				}
			}
			if (response2?.contract?.product?.offers) {
				response2.contract.product.offers = response2.contract.product.offers.sort((a, b) => {
					return a.diamondRangeIndex < b.diamondRangeIndex ? -1 : 1;
				})
			}
			if (response2?.contract?.product?.offers) {
				let response5 = await rFetch(`/api/nft/network/${response2.contract.blockchain}/${address.toLowerCase()}/${collectionIndex}`);
				if (response5.success) {
					response2.contract.nfts = response5.result;		
				}
			}
		}
		setContractData(response2.contract);
	}, [
		currentChain,
		address,
		blockchain,
		collectionIndex,
		contractCreator,
		currentUserAddress,
		diamondMarketplaceInstance
	]);

	useEffect(() => {
		if (contractData && contractData.instance) {
			(async () => {
				setMintingRole(
					await metamaskCall(
						contractData.instance.hasRole(
							await metamaskCall(contractData.instance.MINTER()),
							contractData.diamond ? diamondMarketplaceInstance.address : minterInstance.address
						)
					)
				);
				setTraderRole(
					await metamaskCall(
						contractData.instance.hasRole(
							await contractData.instance.TRADER(),
							contractData.diamond ? diamondMarketplaceInstance.address : minterInstance.address
						)
					)
				);
			})();
		}
	}, [contractData, diamondMarketplaceInstance, minterInstance])

	/*const fetchMintingStatus = useCallback(async () => {
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
	}, [correctMinterInstance, tokenInstance, onMyChain]);*/

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

	useEffect(fetchData, [fetchData, forceFetchData]);

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
		mintingRole,
		traderRole,
		onMyChain,
		correctMinterInstance,
		tokenInstance,
		simpleMode,
		forceRefetch: () => setForceFetchData(!forceFetchData)
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
