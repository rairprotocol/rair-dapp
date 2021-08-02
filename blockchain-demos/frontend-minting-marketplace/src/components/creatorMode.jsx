import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as Factory from '../contracts/RAIR_Token_Factory.json';
import * as ERC777 from '../contracts/RAIR777.json';

import ERC721Manager from './CreatorMode/ERC721Manager.jsx';
import ERC777Manager from './CreatorMode/erc777.jsx';
import FactoryManager from './CreatorMode/factory.jsx';

const minterAbi = MinterMarketplace.default.abi;
const factoryAbi = Factory.default.abi;
const erc777Abi = ERC777.default.abi;

const CreatorMode = ({account, addresses}) => {

	const [erc777Instance, setERC777Instance] = useState();
	const [factoryInstance, setFactoryInstance] = useState();
	const [minterInstance, setMinterInstance] = useState();
	const [deployedTokens, setDeployedTokens] = useState();

	useEffect(() => {
		if (!addresses) {
			return;
		}
		// Ethers Connection
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let erc777Instance = new ethers.Contract(addresses.erc777, erc777Abi, signer);
		setERC777Instance(erc777Instance);

		let ethersMinterInstance = new ethers.Contract(addresses.minterMarketplace, minterAbi, signer);
		console.log('Minter', ethersMinterInstance.functions)
		console.log('Minter Events', ethersMinterInstance.filters)
		setMinterInstance(ethersMinterInstance);

		let factoryInstanceEthers = new ethers.Contract(addresses.factory, factoryAbi, signer);
		setFactoryInstance(factoryInstanceEthers);
	}, [addresses])

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
			<div className='col-12 bg-dark py-4 text-white border border-white rounded'>
			{deployedTokens !== undefined && <>
				<h3> Your Deployed ERC721 Contracts </h3> 
				{deployedTokens.map((item, index) => {
					return <ERC721Manager key={index} tokenAddress={item} minter={minterInstance} account={account}/>
				})}
			</>}
			</div>
		</div>
	</>
}

export default CreatorMode;