import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2';
import { metamaskCall } from '../../utils/metamaskUtils.js';
import { diamondFactoryAbi } from '../../contracts'
import { utils } from 'ethers';
import blockchainData from '../../utils/blockchainData';

const DiamondMarketplace = (props) => {
	const [offersArray, setOffersArray] = useState([]);
	const [transactionInProgress, setTransactionInProgress] = useState(false);

	const { diamondMarketplaceInstance, contractCreator } = useSelector(store => store.contractStore);

	const fetchDiamondData = useCallback(async () => {
		if (!diamondMarketplaceInstance) {
			return;
		}
		let offerCount = Number((await diamondMarketplaceInstance.getTotalOfferCount()).toString());
		let offerData = [];
		for (let i = 0; i < offerCount; i++) {
			let singleOfferData = await diamondMarketplaceInstance.getOfferInfo(i);
			console.log(singleOfferData);
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
		setOffersArray(offerData);
	}, [diamondMarketplaceInstance])

	useEffect(fetchDiamondData, [fetchDiamondData])

	return <div className='row w-100'>
		<div className='col-12 text-center'>
			<h1> 
				<i className='fas fa-gem' />
			</h1>
			<h5> Diamond Marketplace </h5>
			{offersArray.length} offers found.
		</div>
		{offersArray.map((offer, index) => {
			return <div style={{
				position: 'relative'
			}} key={index}
			className='col-12 p-2 col-md-6 my-3 rounded-rair'>
				<div style={{position: 'absolute', top: 0, left: 0}}>
					#{index + 1}
				</div>
				<small> @{offer.contractAddress}:{offer.productIndex} </small>
				<br />
				Range #{offer.rangeIndex}
				<h3>{offer.name}</h3>
				<h5 style={{display: 'inline'}}>
					{offer.tokensAllowed}
				</h5> tokens available for <h5 style={{display: 'inline'}}>
					{utils.formatEther(offer.price)} {blockchainData[window.ethereum.chainId].symbol}
				</h5>
				<br/>
				<h5 className='w-100 text-center px-5'>
					<div className='float-start'>
						{offer.startingToken}...
					</div>
					<progress
						max={offer.endingToken - offer.startingToken}
						value={offer.tokensAllowed}
					/>
					<div className='float-end'>
						...{offer.endingToken}
					</div>
				</h5>
				<button
					disabled={transactionInProgress || !offer.visible}
					onClick={async () => {
					setTransactionInProgress(true);
					let instance = contractCreator(offer.contractAddress, diamondFactoryAbi);
					let nextToken = await instance.getNextSequentialIndex(offer.productIndex, offer.startingToken, offer.endingToken);
					Swal.fire({
						title: `Buying token #${nextToken}!`,
						html: 'Please wait...',
						icon: 'info',
						showConfirmButton: false
					});
					if (await metamaskCall(diamondMarketplaceInstance.buyMintingOffer(
						offer.offerIndex,
						nextToken,
						{value: offer.price}
					))) {
						Swal.fire({
							title: 'Success',
							html: 'Token bought',
							icon: 'success',
							showConfirmButton: true
						});
					}
					setTransactionInProgress(false);
				}} className={`btn my-2 py-0 btn-${offer.visible ? 'stimorol' : 'danger'}`}>
					{offer.visible ? 'Buy a token' : "Not for sale!"}
				</button>
			</div>
		})}
	</div>
}

export default DiamondMarketplace;