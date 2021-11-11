import {useState, useEffect, useCallback} from 'react'
import {useSelector} from 'react-redux';
import {Link} from 'react-router-dom';

import CreateProduct from './CreateProduct.jsx';
import AddOffer from './AddOffer.jsx';
import LockRange from './LockRange.jsx';

import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch.js';
import CustomPayRate from './customizePayRate.jsx';

const Contract = ({address}) => {

	const [data, setData] = useState();

	const {primaryColor, textColor} = useSelector(state => state.colorStore)

	const fetchData = useCallback(async () => {
		if (!address) {
			return;
		}
		let response2 = await rFetch(`/api/contracts/${address}`);
		let response3 = await rFetch(`/api/contracts/${address}/products`);
		if (response3.success) {
			response2.contract.products = response3.products
		}
		let response4 = await rFetch(`/api/contracts/${address}/products/offers`);
		// Special case where a product exists but it has no offers
		if (response4.success) {
			response4.products.forEach(item => {
				response2.contract.products.forEach(existingItem => {
					if (item._id.toString() === existingItem._id.toString()) {
						existingItem.offers = item.offers;
					}
				})
			})
		}
		setData(response2.contract);
	}, [address])

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return <div className='col-4 p-2'>
		<div style={{
			border: `solid 1px ${textColor}`,
			backgroundImage: `url(${chainData[data?.blockchain]?.image})`,
			backgroundColor: `var(--${primaryColor}-transparent)`
		}} className='w-100 p-3 bg-blockchain'>
			{!data ? 'Fetching...' : 
				<>
					<small style={{
						fontSize: '0.8vw'
					}}>({data.contractAddress})</small>
					<h5>{data.title}</h5>
					<details>
						<summary>
							{data.products?.length} products!
						</summary>
						<hr />
						<CreateProduct address={data.contractAddress} blockchain={data.blockchain} />
						<div className='w-100 row px-0 mx-0'>
							{data.products
								?.sort((a,b) => a.creationDate > b.creationDate ? 1 : -1)
								.map((product, index) => {
									return <div key={index} style={{position: 'relative'}} className='col-12 text-center'>
										<div style={{position: 'absolute', top: 0, left: 0}}>
											{product.firstTokenIndex}...
										</div>
										<Link to={`/rair/${data.contractAddress}/${product.collectionIndexInContract}`}>
											{product.name}
										</Link>
										<br />
										<div style={{position: 'absolute', top: 0, right: 0}}>
											...{product.firstTokenIndex + product.copies - 1}
										</div>
										<progress
											className='w-100'
											max={product.firstTokenIndex + product.copies}
											value={product.soldCopies}
										/>
										{product.offers && <>
											<CustomPayRate
												address={data.contractAddress}
												blockchain={data.blockchain}
												catalogIndex={product.offers?.length ? product.offers[0]?.offerPool : undefined}
											/>
											<Link className='btn py-0 btn-stimorol' style={{borderLeft: 'none', borderTopLeftRadius: 0, borderBottomLeftRadius: 0}} to={`/metadata/${data.contractAddress}/${product.collectionIndexInContract}`}>
												Edit Metadata!
											</Link>
										</>}
										<details className='w-100 text-start row px-0 mx-0 pt-0 mb-2'>
											<summary>
												{product.offers ? product.offers.length : 'No'} offers
											</summary>
											{product.offers
												?.sort((a,b) => a.creationDate > b.creationDate ? 1 : -1)
												.map((offer, index) => {
													return <div key={index} style={{position: 'relative'}} className='col-12 text-center'>
														<div style={{position: 'absolute', top: 0, left: '1rem'}}>
															{offer.range[0]}...
														</div>
														{offer.offerName}<br />
														<div style={{position: 'absolute', top: 0, right: '1rem'}}>
															...{offer.range[1]}
														</div>
														<progress
															className='w-100'
															min={offer.range[0]}
															max={offer.range[1]}
															value={offer.soldCopies}
														/>
														<div className='row px-0 mx-0'>
															<div className='col-12'>
																{offer.soldCopies} of {Number(offer.range[1]) - Number(offer.range[0]) + 1} tokens sold
															</div>
															<LockRange
																firstToken={offer.range[0]}
																lastToken={offer.range[1]}
																address={data.contractAddress}
																blockchain={data.blockchain}
																productIndex={product.collectionIndexInContract}
															/>
														</div>
														<hr />
													</div>
												})}
											<AddOffer
												existingOffers={product.offers}
												address={data.contractAddress}
												productIndex={product.collectionIndexInContract}
												tokenLimit={product.copies - 1}
												blockchain={data.blockchain} />
											<hr />
										</details>
									</div>
							})}
						</div>
					</details>
				</>
			}
		</div>
	</div>
}

export default Contract;