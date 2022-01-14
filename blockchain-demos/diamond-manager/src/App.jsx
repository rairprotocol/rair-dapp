import {useState, useEffect, useCallback} from 'react';
import logo from './logo.svg';
import './App.css';
import * as ethers from 'ethers';
import * as DiamondCutFacet from './contractAbis/DiamondCutFacet.json'; 
import * as FactoryDiamond from './contractAbis/FactoryDiamond.json';
import * as DiamondLoupeFacet from './contractAbis/DiamondLoupeFacet.json';
import * as ERC777ReceiverFacet from './contractAbis/ERC777ReceiverFacet.json';
import * as OwnershipFacet from './contractAbis/OwnershipFacet.json';
import * as creatorFacet from './contractAbis/creatorFacet.json';
import {getSelectors} from './utils/selectorUtils.js';

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const ContractData = ({FacetData, mainDiamond, setMainDiamond, signer, provider, usedSelectors, setUsedSelectors, setQueriedFacets, queriedFacets}) => {
	const {address, devdoc, abi} = FacetData;
	const [selectorsInDiamond, setSelectorsInDiamond] = useState();
	const [functions, setFunctions] = useState();
	const [contractInstance, setContractInstance] = useState();

	useEffect(() => {
		let facetInstance = new ethers.Contract(address, abi, signer);
		setContractInstance(facetInstance)
		setFunctions(Object.keys(facetInstance.functions).filter(item => item.includes('(')));
		let [facetData] = queriedFacets.filter(item => item.facetAddress === address);
		setSelectorsInDiamond(facetData);
		if (facetData !== undefined) {

		}
	}, [queriedFacets, usedSelectors]);

	return <div className='col-12 col-md-6 mb-5'>
		Contract address: <b>{address}</b>
		{Object.keys(devdoc.methods).length > 0 && <>
			<hr/>
			Functions:
			<ul className='w-100'>
				{functions && functions.map((methodName, index) => {
					let hashed = contractInstance.interface.getSighash(methodName);
					return <li key={index} className='w-100 row'>
						<b className='col-9'>{methodName}</b> <small className={`col-3 badge btn-${usedSelectors.includes(hashed) ? 'success' : 'warning'}`}>{hashed}</small>
					</li>
				})}
			</ul>
			{mainDiamond && <button disabled={selectorsInDiamond !== undefined} onClick={async () => {
				let facetInstance = new ethers.Contract(address, abi, signer);
				let aux = [...usedSelectors];
				const cutItem = {
					facetAddress: address,
					action: FacetCutAction_ADD,
					functionSelectors: getSelectors(facetInstance, aux).filter(item => !usedSelectors.includes(item))
				}
				console.log(cutItem);
				await mainDiamond.diamondCut(
					[cutItem], ethers.constants.AddressZero, ethers.utils.toUtf8Bytes('')
				);
			}} className='btn btn-primary'>
				Add Facet
			</button>}
		</>}
		<br/>
		{setMainDiamond && <button onClick={async () => {
			await window.ethereum.request({ method: 'eth_requestAccounts' });
			const diamondLouper = {...DiamondLoupeFacet};
			const diamondCutData = {...DiamondCutFacet};

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
		}} className='btn btn-primary'>
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

	useEffect(() => {
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum)
			setProvider(provider);
			setSigner(provider.getSigner(0));
		}
	}, []);

	return <div className='container-fluid p-5'>
		<div className='row h1'>
			Rair Diamond Manager
		</div>
		<hr/>
		<h5> Main Factory Diamond </h5>
		<ContractData FacetData={FactoryDiamond} {...{signer, provider, setMainDiamond, usedSelectors, setUsedSelectors, queriedFacets, setQueriedFacets}} />
		<hr/>
		<div className='row'>
			{[DiamondCutFacet, DiamondLoupeFacet, ERC777ReceiverFacet, OwnershipFacet, creatorFacet]
				.map((contract, index) => {
					return <ContractData key={index} FacetData={contract} {...{signer, provider, mainDiamond, usedSelectors, setUsedSelectors, queriedFacets, setQueriedFacets}} />
				})}
		</div>
		<div className='row'>
		</div>
	</div>
}

export default App;
