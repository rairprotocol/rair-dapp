import {useState, useEffect, useCallback} from 'react'
import * as ethers from 'ethers'

const FactoryManager = ({instance, account, erc777Instance, setDeployedTokens}) => {

	const [erc721Name, setERC721Name] = useState('');
	const [tokensOwned, setTokensOwned] = useState();
	const [tokensRequired, setTokensRequired] = useState();
	const [refetchingFlag, setRefetchingFlag] = useState(false);

	const refreshData = useCallback(async () => {
		setRefetchingFlag(true);
		let tokenCount = await instance.getContractCount(account);
		let tokens = [];
		for (let i = 0; i < tokenCount; i++) {
			tokens.push(await instance.ownerToContracts(account, i));
		}
		setTokensOwned(tokenCount);
		setDeployedTokens(tokens);
		setTokensRequired(await instance.deploymentCostForERC777(erc777Instance.address));
		setRefetchingFlag(false);
	}, [account, instance, erc777Instance.address, setDeployedTokens])

	useEffect(() => {
		refreshData();
	}, [instance, refreshData])

	return <div className='col py-4 border border-white rounded' style={{position: 'relative'}}>
		<h5>Factory</h5>
		<small>({instance.address})</small><br />
		
		{
			// Initializer, do not use
			false && <button
				style={{position: 'absolute', right: 0, top: 0}}
				onClick={e => instance.initialize(10, erc777Instance.address)}
				className='btn btn-success'>
				<i className='fas fa-arrow-up' />
			</button>
		}
		
		<button
			style={{position: 'absolute', left: 0, top: 0}}
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
				erc777Instance.send(instance.address, tokensRequired, ethers.utils.toUtf8Bytes(erc721Name))
			}} className='btn btn-success'>
				Buy an ERC721 contract for {tokensRequired.toString()} tokens!
			</button>
		</> : 'Fetching info...'}
	</div>
}

export default FactoryManager;