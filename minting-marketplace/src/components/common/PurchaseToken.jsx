import { useState } from 'react';
import { useSelector, Provider, useStore } from 'react-redux';

import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import Metamask from "../../images/metamask-fox.svg";
import blockchainData from '../../utils/blockchainData';
import {web3Switch} from '../../utils/switchBlockchain';
import {rFetch} from '../../utils/rFetch';
import {metamaskCall} from '../../utils/metamaskUtils';
import {erc721Abi, diamondFactoryAbi} from '../../contracts'

const reactSwal = withReactContent(Swal);

const queryRangeDataFromBlockchain = async (marketplaceInstance, offerIndex, diamond) => {
	let minterOfferPool;
	if (!diamond) {
		minterOfferPool = await metamaskCall(marketplaceInstance.getOfferInfo(offerIndex[0]));
	}
	let minterOffer = await metamaskCall(marketplaceInstance[diamond ? 'getOfferInfo' : 'getOfferRangeInfo'](...offerIndex));
	if (minterOffer) {
		return {
			start: diamond ? minterOffer.rangeData.rangeStart.toString() : minterOffer.tokenStart.toString(),
			end: diamond ? minterOffer.rangeData.rangeEnd.toString() : minterOffer.tokenEnd.toString(),
			product: diamond ? minterOffer.productIndex.toString() : minterOfferPool.productIndex.toString(),
			price: diamond ? minterOffer.rangeData.rangePrice.toString() : minterOffer.price.toString()
		}
	}
}

const queryRangeDataFromDatabase = async (contractInstance, network, offerIndex, diamond = false) => {
	console.log(contractInstance, network, offerIndex)
	let { success, products } = await rFetch(`/api/contracts/network/${network}/${contractInstance.address}/products/offers`);
	if (success) {
		let [selectedOfferPool] = products.filter(item => item.offerPool.marketplaceCatalogIndex === offerIndex[0]);
		if (!selectedOfferPool) {
			success = false;
		} else {
			let [selectedOffer] = selectedOfferPool.offers.filter(item => item.offerIndex === offerIndex[1]);
			if (!selectedOffer) {
				success = false;
			} else {
				return {
					start: selectedOffer.range[0],
					end: selectedOffer.range[1],
					product: selectedOffer.product,
					price: selectedOffer.price
				}
			}
		}
	}
}

const getNextSequentialIndex = async (contractInstance, start, end, product, diamond) => {
	return await contractInstance.getNextSequentialIndex(product, start, end);
}

const purchaseFunction = async (
	minterInstance,
	contractAddress,
	offerIndex,
	nextToken,
	price,
	diamond = false
) => {
	if (!minterInstance) {
		Swal.fire({
			title: "An error has ocurred",
			html: `Please try again later`,
			icon: "info",
		});
		return;
	}
	let args = [offerIndex[0]];
	if (!diamond) {
		args.push(offerIndex[1])
	}
	args.push(nextToken);
	args.push({ value: price });
	console.log(args)
	if (await metamaskCall(
		minterInstance[diamond ? 'buyMintingOffer' : 'buyToken'](
			...args
			),	"Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
		)
	) {
		Swal.fire('Success', `Bought token #${nextToken}!`, 'success');
	}
}
/*
	
	let greymanOffer = await metamaskCall(diamondMarketplaceInstance.getOfferInfo(offerIndexInMarketplace));
	if (!greymanOffer) {
	Swal.fire({
	title: "An error has ocurred",
	html: `Please try again later`,
	icon: "info",
	});
	return;
	}
	if (greymanOffer) {
	let instance = contractCreator(GraymanSplashPageTESTNET, diamondFactoryAbi);
	let nextToken = await metamaskCall(instance.getNextSequentialIndex(
	greymanOffer.productIndex,
	greymanOffer.rangeData.rangeStart,
	greymanOffer.rangeData.rangeEnd
	));
	if (!nextToken) {
	Swal.fire({
	title: "An error has ocurred",
	html: `Please try again later`,
	icon: "info",
	});
	return;
	}
	Swal.fire({
	title: "Please wait...",
	html: `Buying Greyman #${nextToken.toString()}`,
	icon: "info",
	showConfirmButton: false,
	});
	if (await metamaskCall(
	diamondMarketplaceInstance.buyMintingOffer(
	offerIndexInMarketplace,
	nextToken,
	{
	value: greymanOffer.rangeData.rangePrice,
	}
	),
	"Sorry your transaction failed! When several people try to buy at once - only one transaction can get to the blockchain first. Please try again!"
	)) {
	Swal.fire({
	// title : "Success", 
	imageUrl: GreyMan,
	imageHeight: "auto",
	imageWidth: "65%",
	imageAlt: 'GreyMan image',
	title: `You own #${nextToken}!`,
	icon: "success"
	});
	}
	}
	*/

const Agreements = ({
	presaleMessage,
	contractAddress,
	requiredBlockchain,
	offerIndex,
	connectUserData,
	diamond
}) => {
	const [privacyPolicy, setPrivacyPolicy] = useState(false);	
	const [termsOfUse, setTermsOfUse] = useState(false);
	const [buyingToken, setBuyingToken] = useState(false);
	const [buttonMessage, setButtonMessage] = useState();

	const {
		currentChain,
		currentUserAddress,
		minterInstance,
		diamondMarketplaceInstance,
		contractCreator
	} = useSelector(store => store.contractStore);
	const { textColor } = useSelector(store => store.colorStore);

	return <div className={`text-${textColor}`}>
		<div className={`py-4 w-100 row`}>
			<div className='col-3 d-none d-md-inline' />
			<div className='col-12 col-md-6 pe-5'>
				{[{
					label: 'I agree to the',
					link: 'Privacy Policy',
					linkTarget: '/privacy',
					getter: privacyPolicy,
					setter: setPrivacyPolicy
				},{
					label: 'I accept the',
					link: 'Terms of Use',
					linkTarget: '/terms-use',
					getter: termsOfUse,
					setter: setTermsOfUse
				}].map((item, index) => {
					return <div key={index} className='m-2 w-100 row'>
						<label
							className='h5 col-10'
							htmlFor="policy"
						>
							{item.label}
							{" "}
							{item.link && <h4
								className='d-inline'
								onClick={() => window.open(item.linkTarget, "_blank")}
								style={{color: 'var(--bubblegum)'}}
							>
								{item.link}
							</h4>}
						</label>
						{item.setter && <button
							className={`btn btn-${item.getter ? 'royal-ice' : 'secondary'} rounded-rair col`}
							id='policy'
							onClick={() => item.setter(!item.getter)}
							>
							<i className={`fas fa-check`} style={{color: item.getter ? 'inherit' : 'transparent'}} />
						</button>}
					</div>
				})}
			</div>
			<div className='col-3 d-none d-md-inline' />
		</div>
		<div className="w-100">
			{presaleMessage}
		</div>
		<div className="w-100">
			<button
				disabled={buyingToken || !currentUserAddress || (!privacyPolicy || !termsOfUse)}
				style={{width: '30vw'}}
				className='btn my-4 btn-stimorol rounded-rair'
				onClick={async () => {
					setBuyingToken(true);
					// If currentUserAddress isn't set then the user hasn't connected their wallet
					if (!currentUserAddress) {
						await connectUserData();
						setBuyingToken(false);
						return;
					}

					// If the currentChain is different from the contract's chain, switch
					if (currentChain !== requiredBlockchain) {
						await web3Switch(requiredBlockchain);
						setBuyingToken(false);
						return;
					}

					setButtonMessage("Connecting to contract...");
					// Create the instance of the function
					let contractInstance = contractCreator(contractAddress, diamond ? erc721Abi : diamondFactoryAbi);

					setButtonMessage("Querying next mintable NFT...");
					// Get the range's data (start token, ending token, price)
					let rangeData = await queryRangeDataFromDatabase(contractInstance, requiredBlockchain, offerIndex, diamond);
					
					// Get the range's data from the blockchain if the db has no data
					if (!rangeData) {
						rangeData = await queryRangeDataFromBlockchain(diamond ? diamondMarketplaceInstance : minterInstance, offerIndex, diamond);
					}

					if (!rangeData) {
						setButtonMessage("An error has ocurred.");
					}

					let {start, end, product, price} = rangeData;

					let nextToken = await getNextSequentialIndex(contractInstance, start, end, product, diamond);

					setButtonMessage(`Minting token #${nextToken.toString()}`)

					await purchaseFunction(
						diamond ? diamondMarketplaceInstance : minterInstance,
						contractInstance,
						offerIndex,
						nextToken,
						price,
						diamond
					);
					setBuyingToken(false);
				}}>
				<img
					style={{maxHeight: '7vh'}}
					src={Metamask}
					alt="metamask-logo"
				/>
				{' '}
				{currentUserAddress ?
					currentChain !== requiredBlockchain ?
						`Switch to ${blockchainData[requiredBlockchain].name}`
						:
						(buttonMessage || "Purchase")
					:
					"Connect your wallet!"
				}
			</button>
		</div>
	</div>
}

const PurchaseTokenButton = ({
	customStyle,
	customWrapperClassName,
	img,
	contractAddress,
	requiredBlockchain,
	offerIndex,
	buttonLabel = "Mint!",
	connectUserData,
	presaleMessage,
	diamond
}) => {
	const store = useStore();
	const { primaryColor, textColor } = useSelector(store => store.colorStore);

	const fireAgreementModal = () => {
		reactSwal.fire({
			title: 'Terms of Service',
			html: <Provider store={store}>
				<Agreements
					{...{
						contractAddress,
						requiredBlockchain,
						connectUserData,
						diamond,
						offerIndex,
						presaleMessage
					}}
				/>
			</Provider>,
			showConfirmButton: false,
			width: '80vw',
			customClass: {
                popup: `bg-${primaryColor} rounded-rair`,
                title: `text-${textColor}`,
            }
		})
	}

	return <div className={customWrapperClassName}>
		<button
			style={customStyle}
			onClick={fireAgreementModal}>
			{img && <img alt='metamask-logo' className='metamask-logo' src={img} />} {buttonLabel}
		</button>
	</div>
}

export default PurchaseTokenButton;