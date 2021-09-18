import {useState, useEffect, useCallback} from 'react'
import {useSelector} from 'react-redux';

import CreateProduct from './CreateProduct.jsx';
import AddOffer from './AddOffer.jsx';

import BinanceDiamond from '../../images/binance-diamond.svg'
import MaticLogo from '../../images/polygon-matic.svg'
import EthereumLogo from '../../images/ethereum-logo.svg'

const chainData = {
	'BNB': {image: BinanceDiamond, name: 'Binance'},
	'tMATIC': {image: MaticLogo, name: 'Matic'},
	'ETH': {image: EthereumLogo, name: 'Ethereum'}
}

const Contract = ({address}) => {

	const [data, setData] = useState();

	const {primaryColor, textColor} = useSelector(state => state.colorStore)

	const fetchData = useCallback(async () => {
		if (!address) {
			return;
		}
		let response2 = await (await fetch(`/api/contracts/${address}`, {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json();
		let response3 = await (await fetch(`/api/contracts/${address}/products`, {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json();
		if (response3.success) {
			response2.contract.products = response3.products
		}
		let response4 = await (await fetch(`/api/contracts/${address}/products/offers`, {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json();
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
			borderRadius: '16px',
			backgroundImage: `url(${chainData[data?.blockchain]?.image})`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: '5rem 5rem',
			backgroundPosition: 'top right',
			backgroundColor: `var(--${primaryColor}-transparent)`,
			backgroundBlendMode: 'overlay'
		}} className='w-100 p-3'>
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
										{product.name}<br />
										<div style={{position: 'absolute', top: 0, right: 0}}>
											...{product.firstTokenIndex + product.copies - 1}
										</div>
										<progress
											className='w-100'
											max={product.firstTokenIndex + product.copies}
											value={product.soldCopies}
										/>
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
													</div>
												})}
											<AddOffer
												existingOffers={product.offers}
												address={data.contractAddress}
												productIndex={index}
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