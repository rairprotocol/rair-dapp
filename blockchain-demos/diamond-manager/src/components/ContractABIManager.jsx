import { useState, useEffect } from 'react';
import * as ethers from 'ethers';

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const ContractABIManager = ({
	connectMainDiamondFactory,
	FacetData,
	mainDiamond,
	setMainDiamond,
	signer,
	provider,
	usedSelectors,
	setUsedSelectors,
	setQueriedFacets,
	queriedFacets,
	queryingFacets
}) => {
	const {address, abi, facetName} = FacetData;
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

	return <details className='w-100 mb-5'>
		<summary>
			<h3 style={{display: 'inline-block'}}>{facetName}</h3>
			<br />
			(<b>{address}</b>) - {functions && functions.length} functions
		</summary>
		{functions && functions.length > 0 && <>
			<hr/>
			Functions:
			<ul className='w-100'>
				{functions.map((method, index) => {
					return <li key={index} className={`w-100 row px-0 mx-0 ${method.selected ? undefined : 'text-secondary'}`}>
						<label className='col-11 px-0 mx-0 row' htmlFor={method.hashed+address}>
							<b className='col-9'>
								{method.name}
							</b> <small
								className={`col-3 float-end badge btn-${method.signatureInDiamond ? (method.functionVersionInDiamond ? 'primary' : 'success') : 'danger'}`}>
								<abbr title={method.signatureInDiamond ? (method.functionVersionInDiamond ? 'This version is connected to the diamond ' : 'This function exists within the diamond') : 'Not in diamond!'}>
									{method.hashed}
								</abbr>
							</small>
						</label>
						<input
							id={method.hashed+address}
							type='checkbox'
							checked={method.selected}
							onChange={() => updateSelected(index)}
							className='col-1 form-check-input' />
					</li>
				})}
			</ul>
			{mainDiamond && <div className='row'>
				<button
					disabled={queryingFacets || queriedFacets === undefined || functions === undefined}
					onClick={() => callItemCuts(FacetCutAction_ADD)}
					className='btn btn-primary col-12 col-md-4'>
						Add Selected Facets
				</button>
				<button
					disabled={queryingFacets || queriedFacets === undefined || functions === undefined}
					onClick={() => callItemCuts(FacetCutAction_REPLACE)}
					className='btn btn-warning col-12 col-md-4'>
						Replace Selected Facets
				</button>
				<button
					disabled={queryingFacets || queriedFacets === undefined || functions === undefined || selectorsInDiamond === undefined}
					onClick={() => callItemCuts(FacetCutAction_REMOVE)}
					className='btn btn-danger col-12 col-md-4'>
						Remove Selected Facets
				</button>
			</div>}
		</>}
		<br/>
		{connectMainDiamondFactory &&
			<button
				disabled={queryingFacets}
				onClick={() => connectMainDiamondFactory(address, abi)}
				className='btn btn-primary'>
				{queryingFacets ? 'Fetching Loupe information' : 'Connect Diamond' }
			</button>}
	</details>
}

export default ContractABIManager;