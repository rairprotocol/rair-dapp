import { useState, useEffect } from 'react';
import './App.css';
import * as ethers from 'ethers';

import {getSelectors} from './utils/selectorUtils.js';

// Import order is relevant and important, don't rearrange!
const facetNames = [
	'FactoryDiamond', // Main Factory Diamond
	'DiamondCutFacet', // Standard Diamond Functions
	'DiamondLoupeFacet',
	'OwnershipFacet',
	'ERC777ReceiverFacet', // Factory Facets
	'creatorFacet',
	'TokensFacet',
	'ERC721Facet', // Deployed Token Facets
	'RAIRMetadataFacet',
	'RAIRProductFacet',
	'RAIRRangesFacet'
]

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const ContractData = ({
	connectMainDiamondFactory,
	FacetData,
	mainDiamond,
	setMainDiamond,
	signer,
	provider,
	usedSelectors,
	setUsedSelectors,
	setQueriedFacets,
	queriedFacets
}) => {
	const {address, abi} = FacetData;
	const [selectorsInDiamond, setSelectorsInDiamond] = useState();
	const [functions, setFunctions] = useState();

	useEffect(() => {
		let facetInstance = new ethers.Contract(address, abi, signer);
		let [facetData] = queriedFacets.filter(item => item.facetAddress === address);
		setSelectorsInDiamond(facetData);
		setFunctions(Object.keys(facetInstance.functions)
			.filter(item => item.includes('('))
			.map(item => {
				let hash = facetInstance.interface.getSighash(item);
				return {
					hashed: hash,
					signatureInDiamond: usedSelectors.includes(hash),
					functionVersionInDiamond: facetData?.functionSelectors.includes(hash),
					name: item,
					selected: true
				}
			}));
		if (facetData !== undefined) {

		}
	}, [queriedFacets, usedSelectors, abi, address, signer]);

	const updateSelected = (index) => {
		let aux = [...functions];
		aux[index].selected = !aux[index].selected;
		setFunctions(aux);
	}

	const callItemCuts = async (FacetCutAction) => {
		const cutItem = {
			facetAddress: FacetCutAction === FacetCutAction_REMOVE ? ethers.constants.AddressZero : address,
			action: FacetCutAction,
			functionSelectors: functions.filter(item => item.selected).map(item => item.hashed)
			//getSelectors(facetInstance, aux).filter(item => !usedSelectors.includes(item))
		}
		await mainDiamond.diamondCut(
			[cutItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')
		);
	}

	return <div className='col-12 col-md-6 mb-5'>
		Contract address: <b>{address}</b>
		{functions && functions.length > 0 && <>
			<hr/>
			Functions:
			<ul className='w-100'>
				{functions.map((method, index) => {
					return <li key={index} className='w-100 row'>
						<b className='col-8'>
							{method.name}
						</b> <small
							className={`col-3 badge btn-${method.signatureInDiamond ? (method.functionVersionInDiamond ? 'primary' : 'success') : 'danger'}`}>
							<abbr title={method.signatureInDiamond ? (method.functionVersionInDiamond ? 'This version is connected to the diamond ' : 'This function exists within the diamond') : 'Not in diamond!'}>
								{method.hashed}
							</abbr>
						</small>
						<input
							type='checkbox'
							checked={method.selected}
							onChange={() => updateSelected(index)}
							className='col-1 form-check-input' />
					</li>
				})}
			</ul>
			{mainDiamond && <div className='row'>
				<button
					disabled={queriedFacets === undefined || functions === undefined}
					onClick={() => callItemCuts(FacetCutAction_ADD)}
					className='btn btn-primary col-12 col-md-4'>
						Add Selected Facets
				</button>
				<button
					disabled={queriedFacets === undefined || functions === undefined || selectorsInDiamond === undefined}
					onClick={() => callItemCuts(FacetCutAction_REPLACE)}
					className='btn btn-warning col-12 col-md-4'>
						Replace Selected Facets
				</button>
				<button
					disabled={queriedFacets === undefined || functions === undefined || selectorsInDiamond === undefined}
					onClick={() => callItemCuts(FacetCutAction_REMOVE)}
					className='btn btn-danger col-12 col-md-4'>
						Remove Selected Facets
				</button>
			</div>}
		</>}
		<br/>
		{connectMainDiamondFactory &&
			<button onClick={() => connectMainDiamondFactory(address, abi)} className='btn btn-primary'>
				Connect Diamond
			</button>}
	</div>
}

const App = () => {
	const [mainDiamond, setMainDiamond] = useState();
	const [usedSelectors, setUsedSelectors] = useState([]);
	const [queriedFacets, setQueriedFacets] = useState([]);
	const [provider, setProvider] = useState();
	const [signer, setSigner] = useState();
	const [combinedAbiData, setCombinedAbiData] = useState();
	const [facetArray, setFacetArray] = useState([]);
	const [mainFactoryDiamondContract, setMainFactoryDiamondContract] = useState();

	const connectMainDiamondFactory = async (address, abi) => {
		await window.ethereum.request({ method: 'eth_requestAccounts' });
		const diamondCutData = {...facetArray[0]};
		const diamondLouper = {...facetArray[1]};

		let instance = new ethers.Contract(address, abi, signer);
		let aux = [...usedSelectors];

		getSelectors(instance, aux);
		instance = new ethers.Contract(address, diamondLouper.abi, signer);
		let facets = await instance.facets();
		let selectors = []
		facets.forEach((item, index) => {
			selectors = selectors.concat([...item.functionSelectors]);
		});
		setUsedSelectors(selectors);
		console.log(selectors);
		setQueriedFacets(facets);
		getSelectors(instance, aux);
		instance = new ethers.Contract(address, diamondCutData.abi, signer);
		setMainDiamond(instance);
	}

	useEffect(() => {
		const queryContractData = async (chainId) => {
			let data = [];
			let first = true;
			for await (let facetName of facetNames) {
				let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
				if (first) {
					first = false;
					setMainFactoryDiamondContract(facetData);
				} else {
					data.push(facetData);
				}
			}
			setFacetArray(data);
		}

		window.ethereum.on('chainChanged', (chainId) => {
			console.log('ChainID changed!');
			queryContractData(chainId);
		});

		window.ethereum.on('connect', async (connectionInfo) => {
			console.log('Metamask connected!');
			queryContractData(connectionInfo.chainId);
		});
	}, []);

	useEffect(() => {
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum)
			setProvider(provider);
			setSigner(provider.getSigner(0));
		}
	}, []);

	return <div className='container-fluid bg-dark text-white p-5'>
		<div className='row h1'>
			Rair Diamond Manager
		</div>
		<hr/>
		<h5> Main Factory Diamond </h5>
		{mainFactoryDiamondContract && 
			<ContractData
				FacetData={mainFactoryDiamondContract}
				{...{
					connectMainDiamondFactory,
					signer,
					provider,
					setMainDiamond,
					usedSelectors,
					setUsedSelectors,
					queriedFacets,
					setQueriedFacets
				}} />}
		<hr/>
		<div className='row'>
			{facetArray.length > 0 && facetArray
				.map((contract, index) => {
					return <ContractData key={index} FacetData={contract} {...{signer, provider, mainDiamond, usedSelectors, setUsedSelectors, queriedFacets, setQueriedFacets}} />
				})}
		</div>
		<div className='row'>
			<button onClick={async () => {
				let usedFunctions = [];
				let combinedABI = [...facetArray, mainFactoryDiamondContract]
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
				let dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({abi: combinedABI}));
				setCombinedAbiData(dataStr);
			}} className='btn btn-primary'>
				Combine ABI
			</button>
			{combinedAbiData && <a className='btn btn-success' href={combinedAbiData} download='combinedAbi.json'>
				Download
			</a>}
		</div>
	</div>
}

export default App;
