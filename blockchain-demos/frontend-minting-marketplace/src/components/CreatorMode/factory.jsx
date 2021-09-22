import {useState, useEffect, useCallback} from 'react'
import * as ethers from 'ethers'
import { useSelector } from 'react-redux';


const FactoryManager = ({ setDeployedTokens }) => {

	const [erc721Name, setERC721Name] = useState('');
	const [tokensOwned, setTokensOwned] = useState();
	const [tokensRequired, setTokensRequired] = useState();
	const [refetchingFlag, setRefetchingFlag] = useState(false);
	
	const {erc777Instance, factoryInstance, currentUserAddress} = useSelector(state => state.contractStore);

	const refreshData = useCallback(async () => {
		setRefetchingFlag(true);
		let tokenCount = await factoryInstance.getContractCountOf(currentUserAddress);
		let tokens = [];
		for (let i = 0; i < tokenCount; i++) {
			tokens.push(await factoryInstance.ownerToContracts(currentUserAddress, i));
		}
		setTokensOwned(tokenCount);
		setDeployedTokens(tokens);
		setTokensRequired(await factoryInstance.deploymentCostForERC777(erc777Instance.address));
		setRefetchingFlag(false);
	}, [currentUserAddress, factoryInstance, erc777Instance.address, setDeployedTokens])

	useEffect(() => {
		if (currentUserAddress) {
			refreshData();
		}
	}, [factoryInstance, refreshData, currentUserAddress])

	return <div className='col py-4 border border-white rounded' style={{position: 'relative'}}>
		<h5>Factory</h5>
		<small>({factoryInstance.address})</small><br />
		
		{
			// Initializer, do not use
			false && <button
				style={{position: 'absolute', right: 0, top: 0}}
				onClick={e => factoryInstance.initialize(10, erc777Instance.address)}
				className='btn btn-success'>
				<i className='fas fa-arrow-up' />
			</button>
		}
		
		<button
			style={{position: 'absolute', left: 0, top: 0, color: 'inherit'}}
			onClick={refreshData}
			disabled={refetchingFlag}
			className='btn'>
			{refetchingFlag ? '...' : <i className='fas fa-redo' />}
		</button>
		<br />
		{(tokensOwned && tokensRequired) ? <>You currently own {tokensOwned.length} ERC721 contracts<br/>
			<h5>Deploy a new contract</h5>
			New contract's name:
			<input className='form-control w-75 mx-auto' value={erc721Name} onChange={e => setERC721Name(e.target.value)} />
			<br/>
			<button disabled={erc721Name === ''} onClick={() => {
				erc777Instance.send(factoryInstance.address, tokensRequired, ethers.utils.toUtf8Bytes(erc721Name))
			}} className='btn btn-success'>
				Buy an ERC721 contract for {tokensRequired.toString()} tokens!
			</button>
		</> : 'Fetching info...'}
	</div>
}

export default FactoryManager;