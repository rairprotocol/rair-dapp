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
			return <div className='col-4 p-2'>
				<div style={{border: 'solid 1px black', borderRadius: '16px', position: 'relative'}} className='w-100 p-3'>
					<h5>{item.title}</h5>
					<small>({item.contractAddress})</small>
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
				</div>
			</div>
		})}
	</div>
};

export default Factory;