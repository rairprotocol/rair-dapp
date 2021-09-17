import {useState, useEffect} from 'react'
import { useSelector } from 'react-redux';

import * as ethers from 'ethers'
import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';

import ERC721Manager from './CreatorMode/ERC721Manager.jsx';
import ERC777Manager from './CreatorMode/erc777.jsx';
import FactoryManager from './CreatorMode/factory.jsx';

const minterAbi = MinterMarketplace.default.abi;

const CreatorMode = ({account, addresses, programmaticProvider}) => {

	const [minterInstance, setMinterInstance] = useState();
	const [deployedTokens, setDeployedTokens] = useState();

	const {erc777Instance, factoryInstance} = useSelector(state => state.contractStore);

	useEffect(() => {
		if (!addresses) {
			return;
		}

		let signer = programmaticProvider;
		if (window.ethereum) {
			// Ethers Connection
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}

		let ethersMinterInstance = new ethers.Contract(addresses.minterMarketplace, minterAbi, signer);
		setMinterInstance(ethersMinterInstance);

	}, [addresses, programmaticProvider])

	return <>
		<br/>
		<div className='w-100 text-center row mx-0 px-0'>
			{erc777Instance && factoryInstance ? <ERC777Manager
				instance={erc777Instance}
				account={account}
				factoryAddress={factoryInstance.address}
			/> : 'Connecting to ERC777...'}
			{factoryInstance && <FactoryManager
				instance={factoryInstance}
				erc777Instance={erc777Instance}
				account={account}
				setDeployedTokens={setDeployedTokens}
			/>}
			<div className='col-12 py-4 border border-white rounded'>
			{deployedTokens !== undefined && <>
				<h3> Your Deployed ERC721 Contracts </h3> 
				{deployedTokens.map((item, index) => {
					return <ERC721Manager programmaticProvider={programmaticProvider} key={index} tokenAddress={item} minter={minterInstance} account={account}/>
				})}
			</>}
			</div>
		</div>
	</>
}

export default CreatorMode;