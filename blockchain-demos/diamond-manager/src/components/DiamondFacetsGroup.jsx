import { useState, useCallback } from 'react';
import { Contract } from 'ethers';
import { useSelector } from 'react-redux';
import { useEffect } from 'react';
import FacetManager from './FacetManager.jsx';

const standardFacetNames = [
	'DiamondCutFacet', // Standard Diamond Functions
	'DiamondLoupeFacet',
	'OwnershipFacet'
];

const DiamondFacetsGroup = ({ facetContracts, mainDiamondContract }) => {
	const [blockchainFacets, setBlockchainFacets] = useState([]);
	const [loadedFacets, setLoadedFacets] = useState([]);
	const [mainInstance, setMainInstance] = useState();

	const { signer, chainId } = useSelector(store => store.web3);

	const loadFacetData = useCallback(async (facetName) => {
		if (!chainId) {
			return undefined;
		}
		try {
			console.log(`Loading ${chainId}/${facetName}`);
			let facetData = await import(`../deployments/${chainId}/${facetName}.json`);
			facetData.facetName = facetName;
			return facetData;
		} catch (err) {
			console.error("Error importing facets for Diamond Factory", err);
		}
	}, [chainId]);
	
	const connectMainDiamondFactory = useCallback(async () => {
		// Reset all data
		setLoadedFacets([])
		setMainInstance()
		setBlockchainFacets([])

		// Wait for metamask to connect
		await window.ethereum.request({ method: 'eth_requestAccounts' });

		// Load standard diamond data
		const facetData = [];
		for await (const standardFacet of standardFacetNames) {
			facetData.push(await loadFacetData(standardFacet))
		}
		for await (const contract of facetContracts) {
			facetData.push(await loadFacetData(contract))
		}
		let combinedAbi = facetData.reduce((prev, current) => {
			return prev.concat(current.abi);
		}, [])
		const mainDiamondData = await loadFacetData(mainDiamondContract);
		setLoadedFacets(facetData);

		const mainDiamondInstance = new Contract(mainDiamondData.address, combinedAbi, signer);
		setMainInstance(mainDiamondInstance);
		const contractsConnected = await mainDiamondInstance.facets();
		const blockchainFacets = contractsConnected.reduce((prev, contract) => {
			const aux = {...prev};
			contract.functionSelectors.forEach(selector => {
				aux[selector] = contract.facetAddress;
			})
			return aux;
		}, {})
		setBlockchainFacets(blockchainFacets);
	}, [loadFacetData, mainDiamondContract, signer, facetContracts]);

	useEffect(() => {
		connectMainDiamondFactory();
	}, [connectMainDiamondFactory])

	const combineAbi = useCallback(() => {
		const combinedFacets = {
			address: mainInstance.target,
			abi: loadedFacets.reduce((result, current) => {
				const loadedFunctions = result.map(foo => {
					return foo.name;
				});
				const filteredAbi = current.abi.filter(foo => {
					return !loadedFunctions.includes(foo.name)
				});
				console.log(loadedFunctions, filteredAbi);
				return [...result, ...filteredAbi]
			}, [])
		}
		const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(combinedFacets));
		const downloadAnchorNode = document.createElement('a');
		downloadAnchorNode.setAttribute("href",     dataStr);
		downloadAnchorNode.setAttribute("download", "export.json");
		document.body.appendChild(downloadAnchorNode);
		downloadAnchorNode.click();
		downloadAnchorNode.remove();
	}, [mainInstance, loadedFacets]);

	return <>
		<br />
		<div className='col-12 row px-0 mx-0'>
			<div className='col-12'>
				{loadedFacets.map((facet, index) => {
					return <FacetManager key={index} {
						...{facet, mainInstance, blockchainFacets, connectMainDiamondFactory}
					} />
				})}
			</div>
		</div>
		<button onClick={combineAbi} className='btn btn-primary'>
			Combine ABI
		</button>
	</>
}
/*
	return <div className='col-12 col-md-6'>
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
*/
export default DiamondFacetsGroup;