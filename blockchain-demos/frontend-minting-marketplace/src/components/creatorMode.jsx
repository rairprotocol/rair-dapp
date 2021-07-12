import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as Factory from '../contracts/RAIR_Token_Factory.json';
import * as ERC777 from '../contracts/RAIR777.json';

import ERC721Manager from './ERC721Manager.jsx';
import ERC777Manager from './erc777.jsx';
import FactoryManager from './factory.jsx';

const minterAbi = MinterMarketplace.default.abi;
const factoryAbi = Factory.default.abi;
const erc777Abi = ERC777.default.abi;

const minterMarketplaceAddress = '0xcB07dFad44C2b694474E1ea6FEc1729b4c6df31B';
const factoryAddress = '0x4d4b5a70E77ac749B180eC24e48d03aF9d08e531';
const erc777Address = '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1';

const CreatorMode = ({account}) => {

	const [erc777Instance, setERC777Instance] = useState();
	const [factoryInstance, setFactoryInstance] = useState();
	const [minterInstance, setMinterInstance] = useState();
	const [deployedTokens, setDeployedTokens] = useState();

	useEffect(() => {
		// Ethers Connection
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let erc777Instance = new ethers.Contract(erc777Address, erc777Abi, signer);
		setERC777Instance(erc777Instance);

		let ethersMinterInstance = new ethers.Contract(minterMarketplaceAddress, minterAbi, signer);
		setMinterInstance(ethersMinterInstance);

		let factoryInstanceEthers = new ethers.Contract(factoryAddress, factoryAbi, signer);
		setFactoryInstance(factoryInstanceEthers);
	}, [])

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