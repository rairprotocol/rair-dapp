import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as Factory from '../contracts/RAIR_Token_Factory.json';
import * as ERC777 from '../contracts/RAIR777.json';
import * as ERC721Token from '../contracts/RAIR_ERC721.json';

import ERC721Manager from './ERC721Manager.jsx';

import Swal from 'sweetalert2';

const minterAbi = MinterMarketplace.default.abi;
const factoryAbi = Factory.default.abi;
const erc777Abi = ERC777.default.abi;
const erc721Abi = ERC721Token.default.abi;

const minterMarketplaceAddress = '0xcB07dFad44C2b694474E1ea6FEc1729b4c6df31B';
const factoryAddress = '0x4d4b5a70E77ac749B180eC24e48d03aF9d08e531';
const erc777Address = '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1';

const CreatorMode = ({account}) => {

	const [erc777Instance, setERC777Instance] = useState();
	const [targetAddress, setTargetAddress] = useState('');
	const [targetValue, setTargetValue] = useState(0);
	const [factoryInstance, setFactoryInstance] = useState();
	const [minterInstance, setMinterInstance] = useState();
	const [tokensOwned, setTokensOwned] = useState();
	const [tokensRequired, setTokensRequired] = useState();
	const [erc721Name, setERC721Name] = useState('');
	const [erc777Data, setERC777Data] = useState();

	const fetchData = async () => {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let tokensOwned = await factoryInstance.tokensByOwner(account)

		let fullTokenData = [];

		for await (let tokenAddress of tokensOwned) {
			let erc721Instance = new ethers.Contract(tokenAddress, erc721Abi, signer);
			fullTokenData.push({
				instance: erc721Instance,
				address: tokenAddress,
				name: await erc721Instance.name(),
				symbol: await erc721Instance.symbol(),
				totalSupply: (await erc721Instance.totalSupply()).toString(),
				collectionCount: (await erc721Instance.getCollectionCount()).toString(),
				balanceOf: (await erc721Instance.balanceOf(account)).toString()
			})
		}
		setTokensOwned(fullTokenData);
		setTokensRequired(await factoryInstance.erc777ToNFTPrice(erc777Address));
		setERC777Data({
			balance: (await erc777Instance.balanceOf(account)).toString(),
			name: await erc777Instance.name(),
			symbol: await erc777Instance.symbol(),
		});
	}

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
		<button onClick={fetchData} style={{position: 'absolute', right: 0}} className='btn btn-warning'>
			{erc777Data ? 'Refresh My Data!' : 'Get My Data!'}
		</button>
		<br/>
		{erc777Data && <>
			
			<hr className='w-100' />
			<h5>Factory</h5>
			You currently own {tokensOwned.length} ERC721 contracts<br/>
			{tokensOwned.map((item, index) => {
				return <ERC721Manager key={index} tokenInfo={item} minter={minterInstance} account={account}/>
			})}
			<hr className='w-100' />
			<h5>ERC777</h5>
			<button className='btn btn-success' onClick={e => {
				window.ethereum.request({
					method: 'metamask_watchAsset',
					params: {
						"type":"ERC20", // Initially only supports ERC20, but eventually more!
						"options":{
							"address": erc777Instance.address, // The address that the token is at.
							"symbol": erc777Data.symbol, // A ticker symbol or shorthand, up to 5 chars.
							"decimals": 18, // The number of decimals in the token
						},
					}})
				.then(boolean => Swal.fire(boolean ? 'ERC777 RAIR Token added' : 'Failed to Add ERC777 RAIR Token'))
			}}>
				Add {erc777Data.name} to Metamask!
			</button>
			<br/>
			Your balance on '{erc777Data.name}': {erc777Data.balance} {erc777Data.symbol} <br/>
			Your new contract's name:
			<input className='form-control w-75 mx-auto' value={erc721Name} onChange={e => setERC721Name(e.target.value)} />
			<br/>
			<button disabled={erc721Name === ''} onClick={() => {
				erc777Instance.send(factoryInstance.address, 10, ethers.utils.toUtf8Bytes(erc721Name))
			}} className='btn btn-success'>
				Buy an ERC721 contract for {tokensRequired.toString()} {erc777Data.symbol}!
			</button>
			<hr className='w-100' />
			Transfer Tokens<br/>
			Transfer to Address: <input className='form-control w-75 mx-auto' value={targetAddress} onChange={e => setTargetAddress(e.target.value)} />
			Amount to Transfer: <input className='form-control w-75 mx-auto' value={targetValue} type='number' onChange={e => setTargetValue(e.target.value)} />
			<br/>
			<button disabled={targetValue <= 0 || targetAddress === ''} onClick={() => {
				erc777Instance.send(targetAddress, targetValue, ethers.utils.toUtf8Bytes(''))
			}} className='btn btn-success'>
				Transfer {targetValue} TEST RAIRs to {targetAddress}!
			</button>
		</>}
	</>
}

export default CreatorMode;