import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { metamaskCall } from '../../utils/metamaskUtils.js';
import { diamondFactoryAbi } from '../../contracts'
import { utils } from 'ethers';
import blockchainData from '../../utils/blockchainData';
import InputField from '../common/InputField.jsx';

const TokenLayout = ({item}) => {
	const defaultImg = "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

	const { primaryColor } = useSelector(store => store.colorStore);

	return <div
			onClick={() => {
				//openModal();
				//setSelectedData(item);
			}}
			style={{ width: "291px", height: "291px" }}
			className="p-1 my-1 col-2" >
		<div
			className="w-100 bg-my-items p-2"
			style={{
				maxWidth: "291px",
				height: "291px",
				cursor: "pointer",
				backgroundImage: `url(${
					item?.metadata?.image || defaultImg
				})`,
				backgroundColor: `var(--${primaryColor}-transparent)`,
				overflow: "hidden",
				position: 'relative'
			}} >
			<div style={{
				position: 'absolute',
				top: 10,
				left: 10
			}}>
				<i className='fas h5 fa-gem' />
			</div>
			<div className="col my-items-description-wrapper my-items-pic-description-wrapper">
				<span className="description-title">
					{item.metadata ? (
						<>
							<span>{item.title}</span>
						</>
					) : (
						<b> No metadata available </b>
					)}
					<br />
				</span>
				<small className="description">
					{item.contract}
				</small>
				<div
					className="description-small"
					style={{
						paddingRight: "16px",
						position: "relative",
						right: "-227px",
						top: "-48px",
					}}	> 
					<img
						className="my-items-blockchain-img"
						src={`${blockchainData[item?.blockchain]?.image}`}
						alt=""
					/>
				</div>
			</div>
		</div>
	</div>;
}

const ItemsForContract = ({item}) => {
	const [tokens, setTokens] = useState([]);
	const [contractName, setContractName] = useState('');
	
	const { contractCreator, currentUserAddress } = useSelector(store => store.contractStore);

	const getTokens = useCallback(async () => {
		let instance = contractCreator(item, diamondFactoryAbi);
		setContractName(await instance.name());
		let balanceOfUser = await instance.balanceOf(currentUserAddress);
		if (!balanceOfUser?.gt(0)) {
			return;
		}
		let tokenData = [];
		for (let i = 0; i < balanceOfUser.toString(); i++) {
			let index = await instance.tokenOfOwnerByIndex(currentUserAddress, i);
			let tokenURI = await instance.tokenURI(index);
			let metadata;
			if (tokenURI !== '') {
				metadata = await (await fetch(tokenURI)).json();
			}
			tokenData.push({
				nftId: index,
				metadata,
				contract: item,
				title: metadata ? metadata.name : contractName,
				blockchain: window.ethereum.chainId
			});
		}
		setTokens(tokenData);
	}, [item])

	useEffect(getTokens, [getTokens]);

	return <>
		{tokens.map((token, index) => {
			return <TokenLayout item={token} key={index}/>
		})}
	</>
}

const MyDiamondItems = (props) => {
	const [offersArray, setOffersArray] = useState([]);
	const [deploymentAddresses, setDeploymentAddresses] = useState([]);
	const [transactionInProgress, setTransactionInProgress] = useState(false);

	const { diamondMarketplaceInstance, contractCreator } = useSelector(store => store.contractStore);

	const fetchDiamondData = useCallback(async () => {
		if (!diamondMarketplaceInstance) {
			return;
		}
		let offerCount = Number((await diamondMarketplaceInstance.getTotalOfferCount()).toString());
		let deployments = [];
		let offerData = [];
		for (let i = 0; i < offerCount; i++) {
			let singleOfferData = await diamondMarketplaceInstance.getOfferInfo(i);
			if (!deployments.includes(singleOfferData.mintOffer.erc721Address)) {
				deployments.push(singleOfferData.mintOffer.erc721Address);
			}
			offerData.push({
				offerIndex: i,
				contractAddress: singleOfferData.mintOffer.erc721Address,
				rangeIndex: singleOfferData.mintOffer.rangeIndex.toString(),
				visible: singleOfferData.mintOffer.visible,
				startingToken: singleOfferData.rangeData.rangeStart.toString(),
				endingToken: singleOfferData.rangeData.rangeEnd.toString(),
				name: singleOfferData.rangeData.rangeName,
				price: singleOfferData.rangeData.rangePrice,
				tokensAllowed: singleOfferData.rangeData.tokensAllowed.toString(),
				mintableTokens: singleOfferData.rangeData.mintableTokens.toString(),
				lockedTokens: singleOfferData.rangeData.lockedTokens.toString(),
				productIndex: singleOfferData.productIndex.toString()
			})
		}
		setDeploymentAddresses(deployments)
		setOffersArray(offerData);
	}, [diamondMarketplaceInstance]);

	useEffect(fetchDiamondData, [fetchDiamondData])

	return <div className='row'>
		{deploymentAddresses.map((item, index) => {
			return <ItemsForContract key={index} item={item} />
		})}
	</div>
}

export default MyDiamondItems;