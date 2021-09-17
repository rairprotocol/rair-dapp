import {useState, useEffect, useCallback} from 'react'

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

const Contract = (address) => {

	const [data, setData] = useState();

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
					if (!existingItem.offers && item._id.toString() === existingItem._id.toString()) {
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
			border: 'solid 1px black',
			borderRadius: '16px',
			position: 'relative',
			background: `url(${chainData[data.blockchain]?.image})`,
			backgroundRepeat: 'no-repeat',
			backgroundSize: '5rem 5rem',
			backgroundPosition: 'top right',
			backgroundColor: '#FFFA',
			backgroundBlendMode: 'lighten'
		}} className='w-100 p-3'>
			<small>({data.contractAddress})</small>
			<h5>{data.title}</h5>
			{data.products?.length} products! <CreateProduct address={data.contractAddress} blockchain={data.blockchain} />
			<hr />
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
							{product.offers && <details className='w-100 text-start row px-0 mx-0'>
								<summary>
									{product.offers.length} offers
								</summary>
								{product.offers
									.sort((a,b) => a.creationDate > b.creationDate ? 1 : -1)
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
								<AddOffer address={data.contractAddress} blockchain={data.blockchain} />
								<hr />
							</details>}
						</div>
				})}
			</div>
		</div>
	</div>
}

export default Contract;