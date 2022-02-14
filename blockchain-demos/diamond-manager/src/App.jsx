import { useState, useEffect, useCallback } from 'react';
import './App.css';
import * as ethers from 'ethers';
import DiamondFacetsGroup from './components/DiamondFacetsGroup.jsx';

const standardFacetNames = [
	'DiamondCutFacet', // Standard Diamond Functions
	'DiamondLoupeFacet',
	'OwnershipFacet'
]

// Import order is important, don't rearrange!
const factoryFacetNames = [
	'FactoryDiamond', // Main Factory Diamond
	'ERC777ReceiverFacet', // Factory Facets
	'creatorFacet',
	'TokensFacet',
	'ERC721Facet', // Deployed Token Facets
	'RAIRMetadataFacet',
	'RAIRProductFacet',
	'RAIRRangesFacet'
]

// Import order is important, don't rearrange!
const marketplaceFacetNames = [
	'MarketplaceDiamond', // Main Marketplace Diamond
	'MintingOffersFacet', // Minting Facets
	'FeesFacet'
]

const App = () => {
	const [provider, setProvider] = useState();
	const [signer, setSigner] = useState();
	const [factoryFacetsArray, setFactoryFacetsArray] = useState([]);
	const [marketplaceFacetsArray, setMarketplaceFacetsArray] = useState([]);
	const [standardFacetsArray, setStandardFacetsArray] = useState([]);

	const connectProvider = useCallback(() => {
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum)
			setProvider(provider);
			setSigner(provider.getSigner(0));
		}
	}, [setProvider, setSigner]);

	useEffect(() => {
		const queryFacetABIData = async (chainId) => {
			let data = [];
			for await (let facetName of factoryFacetNames) {
				console.log('importing', facetName)
				let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
				facetData.facetName = facetName;
				data.push(facetData);
			}
			setFactoryFacetsArray(data);

			data = [];
			for await (let facetName of marketplaceFacetNames) {
				console.log('importing', facetName)
				let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
				facetData.facetName = facetName;
				data.push(facetData);
			}
			setMarketplaceFacetsArray(data);
			
			data = [];
			for await (let facetName of standardFacetNames) {
				console.log('importing', facetName)
				let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
				facetData.facetName = facetName;
				data.push(facetData);
			}
			setStandardFacetsArray(data);
		}

		window.ethereum.on('chainChanged', (chainId) => {
			console.log('ChainID changed!');
			queryFacetABIData(chainId);
			connectProvider();
		});

		window.ethereum.on('connect', async (connectionInfo) => {
			console.log('Metamask connected!');
			queryFacetABIData(connectionInfo.chainId);
			connectProvider();
		});
	}, [connectProvider]);

	useEffect(() => {
		connectProvider();
	}, [connectProvider]);

	return <div className='container-fluid row bg-dark text-white p-5'>
		<div className='h1'>
			Rair Diamond Manager
		</div>
		<hr />
		{standardFacetsArray.length > 0 && [
			factoryFacetsArray.concat(standardFacetsArray),
			marketplaceFacetsArray.concat(standardFacetsArray)
		].map((facets, colIndex) => {
			return <DiamondFacetsGroup
				key={colIndex}
				{...{
					standardFacetsArray,
					facets,
					signer,
					provider
				}}
			/>
		})}
	</div>
}

export default App;
