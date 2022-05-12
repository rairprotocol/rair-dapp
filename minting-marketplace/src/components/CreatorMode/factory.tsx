//@ts-nocheck
import {useState, useEffect, useCallback} from 'react';
import { utils } from 'ethers';
import { useSelector } from 'react-redux';
import { metamaskCall } from '../../utils/metamaskUtils'
import Swal from 'sweetalert2';

const FactoryManager = ({ setDeployedTokens }) => {
	const [erc721Name, setERC721Name] = useState('');
	const [clientTokens, setClientTokens] = useState();
	const [tokensOwned, setTokensOwned] = useState();
	const [tokensRequired, setTokensRequired] = useState();
	const [tokenSymbol, setTokenSymbol] = useState();
	const [tokenDecimals, setTokenDecimals] = useState();
	const [refetchingFlag, setRefetchingFlag] = useState(false);
	
	const {erc777Instance, factoryInstance, currentUserAddress} = useSelector(state => state.contractStore);

	const refreshData = useCallback(async () => {
		setRefetchingFlag(true);
		let tokenCount = await factoryInstance.getContractCountOf(currentUserAddress);
		let tokens = [];
		for (let i = 0; i < tokenCount; i++) {
			tokens.push(await factoryInstance.ownerToContracts(currentUserAddress, i));
		}
		setClientTokens(await erc777Instance.balanceOf(currentUserAddress));
		setTokensOwned(tokenCount);
		setDeployedTokens(tokens);
		setTokensRequired(await factoryInstance.deploymentCostForERC777(erc777Instance.address));
		setRefetchingFlag(false);
		setTokenSymbol(await erc777Instance.symbol());
		setTokenDecimals(await erc777Instance.decimals());
	}, [currentUserAddress, factoryInstance, erc777Instance, setDeployedTokens])

	useEffect(() => {
		if (currentUserAddress) {
			refreshData();
		}
	}, [factoryInstance, refreshData, currentUserAddress])
	return <div className='col py-4 border border-white rounded' style={{position: 'relative'}}>
		<h5>Factory</h5>
		<small>({factoryInstance.address})</small><br />
		<button
			style={{position: 'absolute', left: 0, top: 0, color: 'inherit'}}
			onClick={refreshData}
			disabled={refetchingFlag}
			className='btn'>
			{refetchingFlag ? '...' : <i className='fas fa-redo' />}
		</button>
		<br />
		{(tokensOwned && tokensRequired && tokenDecimals) ? <>You currently own {tokensOwned.length} ERC721 contracts<br/>
			<h5>Deploy a new contract</h5>
			New contract's name:
			<input className='form-control w-75 mx-auto' value={erc721Name} onChange={e => setERC721Name(e.target.value)} />
			<br/>
			<button disabled={erc721Name === '' || clientTokens.lt(tokensRequired)} onClick={async () => {
				Swal.fire({
					title: 'Deploying contract',
					html: 'Please wait',
					icon: 'info',
					showConfirmButton: false
				});
				if (await metamaskCall(
					erc777Instance.send(factoryInstance.address, tokensRequired, utils.toUtf8Bytes(erc721Name))
				)) {
					Swal.fire({
						title: 'Success',
						html: 'Contract Deployed',
						icon: 'success'
					})	
				}
			}} className='btn btn-royal-ice'>
				Buy an ERC721 contract for { utils.formatEther(tokensRequired) } {tokenSymbol} tokens!
			</button>
			{tokensRequired.eq(0) && <>
				<br />
				<button onClick={async () => {
					Swal.fire({
						title: 'Adding new token to the Master Factory',
						html: 'Please wait',
						icon: 'info',
						showConfirmButton: false
					});
					if (await metamaskCall(
						factoryInstance.add777Token(erc777Instance.address, '10000000000000000000')
					)) {
						Swal.fire({
							title: 'Success',
							html: 'Token added',
							icon: 'success'
						})	
					}
				}} className='btn btn-royal-ice'>
					Accept new token into the Master Factory
				</button>
			</>}
			{clientTokens.lt(tokensRequired) && <> <br />Insufficient {tokenSymbol} Tokens! </>}
		</> : 'Fetching info...'}
	</div>
}

export default FactoryManager;