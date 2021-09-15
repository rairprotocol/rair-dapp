import {useState, useEffect, useCallback} from 'react'

import BinanceDiamond from '../../images/binance-diamond.svg'

const images = {
	'BNB': BinanceDiamond
}

const Factory = () => {

	const [contractArray, setContractArray] = useState([]);
	
	const fetchContracts = useCallback(async () => {
		let response = await (await fetch('/api/contracts', {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json();
		if (response.success) {
			let contractData = [];
			for await (let contract of response.contracts) {
				let response2 = await (await fetch(`/api/contracts/${contract.contractAddress}`, {
					headers: {
						'x-rair-token': localStorage.token
					}
				})).json();
				let response3 = await (await fetch(`/api/contracts/${contract.contractAddress}/products/offers`, {
					headers: {
						'x-rair-token': localStorage.token
					}
				})).json();
				if (response3.success) {
					response2.contract.products = response3.products
				}
				contractData.push(response2.contract)
			} 
			setContractArray(contractData);
		}
	}, [])

	useEffect(() => {
		fetchContracts()
	}, [fetchContracts])

	console.log(contractArray);

	return <div className='w-100 text-start row mx-0 px-0'>
		<h1>Your deployed contracts</h1>
		{contractArray && contractArray.map((item, index) => {
			return <div className='col-4 p-2' key={index}>
				<div style={{border: 'solid 1px black', borderRadius: '16px', position: 'relative'}} className='w-100 p-3'>
					<abbr title={'Binance Testnet'}>
						<img style={{
							border: 'solid 1px black',
							position: 'absolute',
							top: '5px',
							right: '5px',
							borderRadius: '50%',
							maxWidth: '2rem',
							maxHeight: '2rem'
						}} src={images[item.blockchain]} />
					</abbr>
					<small>({item.contractAddress})</small>
					<h5>{item.title}</h5>
					{item.products.length} products!
					<hr />
					<div className='w-100 row px-0 mx-0'>
						{item.products
							.sort((a,b) => a.creationDate > b.creationDate ? 1 : -1)
							.map((product, index) => {
								return <div key={index} style={{position: 'relative'}} className='col-12 text-center'>
									<div style={{position: 'absolute', top: 0, left: 0}}>
										{product.firstTokenIndex}...
									</div>
									{product.name}<br />
									<div style={{position: 'absolute', top: 0, right: 0}}>
										...{product.firstTokenIndex + product.copies}
									</div>
									<progress
										className='w-100'
										max={product.firstTokenIndex + product.copies}
										value={product.soldCopies}
									/>
									<div className='w-100 row px-0 mx-0'>
										{product.offers
											.sort((a,b) => a.creationDate > b.creationDate ? 1 : -1)
											.map((offer, index) => {
											return <div key={index} style={{position: 'relative'}} className='col-6 text-center'>
												<div style={{position: 'absolute', top: 0, left: '1rem'}}>
													{offer.range[0]}...
												</div>
												{offer.offerName}<br />
												<div style={{position: 'absolute', top: 0, right: '1rem'}}>
													...{offer.range[1]}
												</div>
												<progress
													className='w-100'
													max={offer.range[0]}
													max={offer.range[1]}
													value={offer.soldCopies}
												/>
											</div>
										})}
										<hr />
									</div>
								</div>
						})}
					</div>
				</div>
			</div>
		})}
	</div>
};

export default Factory;