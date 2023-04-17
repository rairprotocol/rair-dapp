import { useState, useEffect, useCallback } from 'react';
import './App.css';
import { BrowserProvider } from 'ethers';
import DiamondFacetsGroup from './components/DiamondFacetsGroup.jsx';
import { useSelector, useDispatch } from 'react-redux';
import { loadProvider, loadSigner, loadChainId } from './store/web3Slice';

const diamondContracts = {
	Factory: {
		mainDiamondContract: 'FactoryDiamond',
		// Import order is important, don't rearrange!
		facetContracts: [
			'ERC777ReceiverFacet', // Factory Facets
			'creatorFacet',
			'TokensFacet',
			'ERC721Facet', // Deployed Token Facets
			'RAIRMetadataFacet',
			'RAIRProductFacet',
			'RAIRRangesFacet'
		]
	},
	Marketplace: {
		mainDiamondContract: 'MarketplaceDiamond',
		// Import order is important, don't rearrange!
		facetContracts: [
			'MintingOffersFacet',
			'FeesFacet'
		]
	},
	Credit: {
		mainDiamondContract: 'CreditHandler',
		// Import order is important, don't rearrange!
		facetContracts: [
			'CreditDeposit',
			'CreditQuery',
			'CreditWithdraw',
		]
	}
}

const App = () => {
	const [selectedDiamond, setSelectedDiamond] = useState('null');

	const { signer } = useSelector(store => store.web3);
	const dispatch = useDispatch();
	const connectProvider = useCallback(() => {
		if (window.ethereum) {
			(async () => {
				let provider = new BrowserProvider(window.ethereum)
				dispatch(loadProvider(provider));
				dispatch(loadSigner(await provider.getSigner(0)));
				dispatch(loadChainId(window.ethereum.chainId));
			})();
		}
	}, [dispatch]);
	/*
	useEffect(() => {
		const queryFacetABIData = async (chainId) => {
			try {
				let data = [];
				for await (let facetName of factoryFacetNames) {
					console.log('importing', facetName)
					let facetData = await import(`./deployments/${chainId}/${facetName}.json`);
					facetData.facetName = facetName;
					data.push(facetData);
				}
				setFactoryFacetsArray(data);
			} catch (err) {
				console.error("Error importing facets for Diamond Factory");
			}

			try {
				let data = [];
				for await (let facetName of marketplaceFacetNames) {
					console.log('importing', facetName)
					let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
					facetData.facetName = facetName;
					data.push(facetData);
				}
				setMarketplaceFacetsArray(data);
			} catch (err) {
				console.error("Error importing facets for Diamond Marketplace");
			}

			try {
				let data = [];
				for await (let facetName of standardFacetNames) {
					console.log('importing', facetName)
					let facetData = await import(`./contractAbis/${chainId}/${facetName}.json`);
					facetData.facetName = facetName;
					data.push(facetData);
				}
				setStandardFacetsArray(data);
			} catch (err) {
				console.error("Error importing basic facets for Diamonds");
			}
		}

		

		window.ethereum.on('connect', async (connectionInfo) => {
			console.log('Metamask connected!');
			queryFacetABIData(connectionInfo.chainId);
			connectProvider();
		});
	}, [connectProvider]);
	*/

	useEffect(() => {
		window.ethereum.on('chainChanged', (chainId) => {
			console.log('ChainID changed!');
			dispatch(loadChainId(chainId));
			connectProvider();
		});

		window.ethereum.on('connect', async (connectionInfo) => {
			console.log('Metamask connected!');
			dispatch(loadChainId(connectionInfo.chainId));
			connectProvider();
		});
	}, [connectProvider, dispatch])

	useEffect(() => {
		connectProvider();
	}, [connectProvider]);

	return <div className='container-fluid row bg-dark text-white p-5'>
		<div className='h1'>
			Rair Diamond Manager
		</div>
		<div className='h5'>
			{signer && `Connected with ${signer?.address}`}
		</div>
		<hr />
		<select className='form-control mb-3' value={selectedDiamond} onChange={e => setSelectedDiamond(e.target.value)}>
			<option disabled value='null'> Select a smart contract </option>
			{Object.keys(diamondContracts).map((contract, index) => {
				return <option key={index} value={contract}>
					{contract}
				</option>
			})}
		</select>
		<hr />
		{selectedDiamond !== 'null' && 
			<DiamondFacetsGroup
				{...diamondContracts[selectedDiamond]}
			/>
		}
	</div>
}

export default App;
