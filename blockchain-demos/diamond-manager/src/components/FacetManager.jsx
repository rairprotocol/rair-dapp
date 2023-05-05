import { useEffect, useState, useCallback } from 'react';
import { Contract, ZeroAddress, toUtf8Bytes, ContractFactory } from 'ethers';
import { useSelector } from 'react-redux';

const FacetCutAction_ADD = 0;
const FacetCutAction_REPLACE = 1;
const FacetCutAction_REMOVE = 2;

const FacetManager = ({
    facet,
    mainInstance,
    blockchainFacets,
    connectMainDiamondFactory,
    deploymentMode
}) => {

    const [facetFunctions, setFacetFunctions] = useState([]);
    const { signer, chainId } = useSelector(store => store.web3);

	useEffect(() => {
        setFacetFunctions([]);
        if (!facet) {
            return;
        }
        let facetInstance = new Contract(facet.address, facet.abi, signer);
        setFacetFunctions(
            facet.abi
                .filter(foo => foo.type === 'function')
                .map(foo => {
                    let functionData;
                    try {
                        functionData = facetInstance.interface.getFunction(foo.name);
                    } catch (err) {
                        functionData = facetInstance.interface.getFunction(`${foo.name}(${foo.inputs.map(input => input.internalType).join(',')})`);
                    }
                    return {
                        name: foo.name,
                        selector: functionData.selector,
                        selected: false,
                        exists: Object.keys(blockchainFacets).includes(functionData.selector),
                        existsHere: blockchainFacets[functionData.selector] === facet.address
                    }
                })
        )
        let auxFacetFunctions = [];
        facetInstance.interface.forEachFunction((foo) => {
            auxFacetFunctions.push(foo);
        });
	}, [facet, signer, blockchainFacets]);

    const diamondCut = useCallback(async (FacetCutAction) => {
		const cutItem = {
			facetAddress: FacetCutAction === FacetCutAction_REMOVE ? ZeroAddress : facet.address,
			action: FacetCutAction,
			functionSelectors: facetFunctions.filter(facet => facet.selected === true).map(facet => facet.selector)
		}
		await (await mainInstance.diamondCut(
			[cutItem], ZeroAddress, toUtf8Bytes('')
		)).wait(2);
        connectMainDiamondFactory();
	}, [mainInstance, facetFunctions, facet, connectMainDiamondFactory])

    const selectFacet = (facetName) => {
        const aux = [...facetFunctions];
        setFacetFunctions(aux.map(item => {
            if (item.name === facetName) {
                item.selected = !item.selected;
            }
            return item;
        }));
    }

    const deploymentProcess = async () => {
        let Factory = await new ContractFactory(facet.abi, facet.bytecode, signer);
        let deploymentReceipt = await Factory.deploy();
        console.log(deploymentReceipt);
        await (await deploymentReceipt).waitForDeployment();
        console.log(deploymentReceipt.receipt);
    }

    return <div className='col-12'>
        <div className='row col-12'>
            <div className='col-6 py-2' >
                <b>{facet?.facetName}</b>{!(deploymentMode && facet?.blockchainDeployed !== chainId) && <>- <small>{facet?.address}</small></>}
            </div>
            {deploymentMode && facet?.blockchainDeployed !== chainId ? 
                <button
                    className='btn-light btn col-6'
                    onClick={deploymentProcess}
                >
                    Deploy on {chainId}
                </button>
            :
                <>
                    <button
                        disabled={facetFunctions.length === 0}
                        onClick={() => diamondCut(FacetCutAction_ADD)}
                        className='col-2 btn btn-success'>
                        Add
                    </button>
                    <button
                        disabled={facetFunctions.length === 0}
                        onClick={() => diamondCut(FacetCutAction_REPLACE)}
                        className='col-2 btn btn-warning'>
                        Replace
                    </button>
                    <button
                        disabled={facetFunctions.length === 0}
                        onClick={() => diamondCut(FacetCutAction_REMOVE)}
                        className='col-2 btn btn-danger'>
                        Remove
                    </button>
                </> 
            }
        </div>
        <br />
        {facetFunctions
            .map((facet, index) => {
                return <button
                    key={index}
                    disabled={!mainInstance}
                    onClick={() => selectFacet(facet.name)}
                    className={`col-12 btn bg-gradient btn-${facet.selected ? 'success' : 'dark'} border-${facet.exists ? (facet.existsHere ? 'primary' : 'success') : 'danger'}`}>
                    <small className='float-start'>
                        ( {facet.exists && 'Exists'}{facet.existsHere && ' Here'}{!facet.exists && 'Not loaded'} )
                    </small> {facet.name} <b className='float-end'>
                        ({facet.selector})
                    </b>
                </button>
            }
        )}
        <hr />
    </div>
}

export default FacetManager;