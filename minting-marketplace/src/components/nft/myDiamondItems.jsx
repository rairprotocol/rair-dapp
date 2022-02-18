import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { diamondFactoryAbi } from '../../contracts'
import blockchainData from '../../utils/blockchainData';

const TokenLayout = ({item, openModal, setSelectedData}) => {
	const defaultImg = "https://rair.mypinata.cloud/ipfs/QmNtfjBAPYEFxXiHmY5kcPh9huzkwquHBcn9ZJHGe7hfaW";

	const { primaryColor } = useSelector(store => store.colorStore);

	return <div
			onClick={() => {
				openModal();
				setSelectedData(item);
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

const ItemsForContract = ({item, openModal, setSelectedData}) => {
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
				token: index.toString(),
				metadata,
				contract: item,
				title: metadata ? metadata.name : contractName,
				blockchain: window.ethereum.chainId
			});
		}
		setTokens(tokenData);
	}, [item, contractCreator, contractName, currentUserAddress])

	useEffect(getTokens, [getTokens]);

	return <>
		{tokens.map((token, index) => {
			return <TokenLayout item={token} key={index} {...{openModal, setSelectedData}}/>
		})}
	</>
}

const MyDiamondItems = (props) => {
	const [deploymentAddresses, setDeploymentAddresses] = useState([]);
	const [status, setStatus] = useState('Fetching data...');

	const { diamondMarketplaceInstance } = useSelector(store => store.contractStore);

	const fetchDiamondData = useCallback(async () => {
		if (!diamondMarketplaceInstance) {
			return;
		}
		let offerCount = Number((await diamondMarketplaceInstance.getTotalOfferCount()).toString());
		setStatus(`Found ${offerCount} addresses...`);
		let deployments = [];
		for (let i = 0; i < offerCount; i++) {
			setStatus(`Querying address ${i + 1} of ${offerCount}...`);
			let singleOfferData = await diamondMarketplaceInstance.getOfferInfo(i);
			if (!deployments.includes(singleOfferData.mintOffer.erc721Address)) {
				deployments.push(singleOfferData.mintOffer.erc721Address);
			}
		}
		setDeploymentAddresses(deployments);
		setStatus(``);
	}, [diamondMarketplaceInstance]);

	useEffect(fetchDiamondData, [fetchDiamondData])

	return <div className='row'>
		<h5>{status}</h5>
		{deploymentAddresses.map((item, index) => {
			return <ItemsForContract key={index} item={item} {...props} />
		})}
	</div>
}

export default MyDiamondItems;