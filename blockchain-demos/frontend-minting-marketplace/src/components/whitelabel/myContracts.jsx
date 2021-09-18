import {useState, useEffect, useCallback} from 'react'

import DeployContracts from './DeployContracts.jsx';

import Contract from './Contract.jsx';

const Factory = () => {

	const [contractArray, setContractArray] = useState([]);

	const fetchContracts = useCallback(async () => {
		let response = await (await fetch('/api/contracts', {
			headers: {
				'x-rair-token': localStorage.token
			}
		})).json();
		if (response.success) {
			setContractArray(response.contracts.map(item => item.contractAddress));
		}
	}, [])

	useEffect(() => {
		fetchContracts()
	}, [fetchContracts])

	return <div style={{position: 'relative'}} className='w-100 text-start row mx-0 px-0'>
		<h1>Your deployed contracts</h1>
		<DeployContracts />
		{contractArray && contractArray.map((item, index) => 
			<Contract address={item} key={index} />
		)}
	</div>
};

export default Factory;