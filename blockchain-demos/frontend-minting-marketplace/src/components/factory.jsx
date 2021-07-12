import {useState, useEffect, useCallback} from 'react'
import * as ethers from 'ethers'

const FactoryManager = ({instance, account, erc777Instance, setDeployedTokens}) => {

	const [erc721Name, setERC721Name] = useState('');
	const [tokensOwned, setTokensOwned] = useState();
	const [tokensRequired, setTokensRequired] = useState();

	const refreshData = async () => {
		let tokens = await instance.tokensByOwner(account)
		setTokensOwned(tokens);
		setDeployedTokens(tokens);
		setTokensRequired(await instance.erc777ToNFTPrice(erc777Instance.address));
	}

	useEffect(() => {
		refreshData();
	}, [])

	return <div className='col bg-dark py-4 text-white border border-white rounded' style={{position: 'relative'}}>
		<h5>Factory</h5>
		<small>({instance.address})</small><br />
		<button
			style={{position: 'absolute', left: 0, top: 0}}
			onClick={refreshData}
			className='btn btn-dark'>
			<i className='fas fa-redo' />
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