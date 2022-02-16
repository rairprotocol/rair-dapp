import { useState, useCallback } from 'react';
import * as ethers from 'ethers';
import ContractABIManager from './ContractABIManager.jsx';
import {getSelectors} from '../utils/selectorUtils.js';

const DiamondFacetsGroup = ({signer, provider, facets, standardFacetsArray}) => {
	const [mainDiamond, setMainDiamond] = useState();
	const [usedSelectors, setUsedSelectors] = useState([]);
	const [queriedFacets, setQueriedFacets] = useState([]);
	const [combinedAbiData, setCombinedAbiData] = useState();
	const [queryingFacets, setQueryingFacets] = useState(false);
	
	const connectMainDiamondFactory = useCallback(async (address, abi) => {
		setUsedSelectors([]);
		setQueriedFacets([]);
		setMainDiamond();
		setQueryingFacets(true);
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		const diamondCutData = {...standardFacetsArray[0]};
		const diamondLouper = {...standardFacetsArray[1]};

		let instance = new ethers.Contract(address, abi, signer);
		let aux = [...usedSelectors];
		getSelectors(instance, aux);

		try {
			instance = new ethers.Contract(address, diamondLouper.abi, signer);
			let facets = await instance.facets();
			let selectors = []
			facets.forEach((item, index) => {
				selectors = selectors.concat([...item.functionSelectors]);
			});
			setUsedSelectors(selectors);
			setQueriedFacets(facets);
			getSelectors(instance, aux);
		} catch (e) {
			console.error(e);
		}

		instance = new ethers.Contract(address, diamondCutData.abi, signer);
		setMainDiamond(instance);
		setQueryingFacets(false);
	}, [signer, provider, setMainDiamond, standardFacetsArray, usedSelectors]);

	return <div className='col-12 col-md-6'>
		{facets.length > 0 && facets
			.map((contract, index) => {
				return <ContractABIManager
					key={index}
					FacetData={contract}
					{...{
						queryingFacets,
						signer,
						provider,
						mainDiamond: index === 0 ? undefined : mainDiamond,
						usedSelectors,
						setUsedSelectors,
						queriedFacets,
						setQueriedFacets,
						connectMainDiamondFactory: index === 0 ? connectMainDiamondFactory : undefined
					}} />
			})}
		<hr />
		<button onClick={async () => {
			let usedFunctions = [];
			let combinedABI = facets
				.reduce((finalList, contract) => {
					let cleanAbi = contract.abi.filter(item => {
						if (!usedFunctions.includes(item.name)) {
							usedFunctions.push(item.name);
							return true;
						}
						return false;
					});
					return finalList.concat(cleanAbi);
				}, [])
				console.log('Events', combinedABI.filter(item => item.type === 'event').map(item => {
					return `${item.name}(${item.inputs.map(input => input.internalType).join(',')})`
				}));
			let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({abi: combinedABI}));
			setCombinedAbiData(dataStr);
		}} className='btn btn-primary'>
			Combine ABI
		</button>
		{combinedAbiData && <a className='btn btn-success' href={combinedAbiData} download='combinedAbi.json'>
			Download
		</a>}
	</div>
}

export default DiamondFacetsGroup;