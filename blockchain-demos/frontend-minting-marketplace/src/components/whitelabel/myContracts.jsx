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
			let contractData = [];
			for await (let contract of response.contracts) {
				
			} 
			setContractArray(contractData);
		}
	}, [])

	useEffect(() => {
		fetchContracts()
	}, [fetchContracts])

	console.log(contractArray);

	return <div style={{position: 'relative'}} className='w-100 text-start row mx-0 px-0'>
		<h1>Your deployed contracts</h1>
		<DeployContracts />
		{contractArray && contractArray.map((item, index) => 
			<Contract address={item.address} key={index} />
		)}
	</div>
};

export default Factory;