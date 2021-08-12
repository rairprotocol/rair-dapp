import {useState, useEffect} from 'react';

import logo from './RAIRLandscape.png';
import './App.css';
import * as ethers from 'ethers'

// Sweetalert2 for the popup messages
//import Swal from 'sweetalert2';

// Import the data from the contract artifacts

import CreatorMode from './components/creatorMode.jsx';
import ConsumerMode from './components/consumerMode.jsx';

const contractAddresses = {
	'0x61': { // Binance Testnet
		factory: '0x02638eD2D3362CDAe26c4DD33B28CbE3dc8719Aa',
		erc777: '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1',
		minterMarketplace: '0x343715F15702Fec9089B99623738a80662EC4FBE'
	},
	'0x5': { // Ethereum Goerli
		factory: '0x2b1FE33Cb7264dBa6331F54012f04133395fDe44',
		erc777: '0xc76c3ebEA0aC6aC78d9c0b324f72CA59da36B9df',
		minterMarketplace: '0xE9e953A29D0688d1348E17f7aCC801b33693B501'
	},
	'0x13881': { // Matic Mumbai
		factory: '0x5CaBa889219DE9d52841fd79741cfe4ce5A61a29',
		erc777: '0x0Ce668D271b8016a785Bf146e58739F432300B12',
		minterMarketplace: '0xD22179AbCFFC1b62a51a35Fbc726f0C79440547C'
	}
}

const binanceTestnetData = {
	chainId: '0x61',
	chainName: 'Binance Testnet',
	nativeCurrency:
	{
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
	blockExplorerUrls: ['https://testnet.bscscan.com']
}

const klaytnBaobabData = {
	chainId: '0x3e9',
	chainName: 'Klaytn Baobab',
	nativeCurrency:
	{
		name: 'KLAY',
		symbol: 'KLAY',
		decimals: 18
	},
	rpcUrls: ['https://api.baobab.klaytn.net:8651/'],
	blockExplorerUrls: ['https://baobab.scope.klaytn.com/']
}

const polygonMumbaiData = {
	chainId: '0x13881',
	chainName: 'Matic Testnet Mumbai',
	nativeCurrency:
	{
		name: 'Matic token',
		symbol: 'tMATIC',
		decimals: 18
	},
	rpcUrls: ['https://rpc-mumbai.matic.today'],
	blockExplorerUrls: ['https://matic.network/']
}

function App() {

	const [account, setAccount] = useState();
	const [mode, setMode] = useState();
	const [chainId, setChainId] = useState();
	const [addresses, setAddresses] = useState();
	const [programmaticProvider, setProgrammaticProvider] = useState();
	const [refreshFlag, setRefreshFlag] = useState(false);

	const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState();

	useEffect(() => {
		window.ethereum && window.ethereum.request({ method: 'eth_requestAccounts' })
			.then(accounts => {
				setAccount(accounts[0]);
			});
	}, [account])

	const connectProgrammatically = () => {
		let binanceTestnetProvider = new ethers.providers.JsonRpcProvider('https://data-seed-prebsc-1-s1.binance.org:8545/', {
				chainId: 97, symbol: 'BNB', name: 'Binance Testnet', timeout: 1000000
			});
		let currentWallet = new ethers.Wallet(UNSAFE_PrivateKey, binanceTestnetProvider);
		setChainId(currentWallet.provider._network.chainId);
		setAddresses(contractAddresses['0x61']);
		setAccount(currentWallet.address);
		setProgrammaticProvider(currentWallet);
	}

	const switchEthereumChain = async (chainData) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainData.chainId }],
			});
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask.
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [chainData],
					});
				} catch (addError) {
					console.error(addError);
				}
			} else {
				console.error(switchError);
			}
		}
	}

	useEffect(() => {
		if (window.ethereum) {
			window.ethereum.on('chainChanged', async (chainId) => {
				setRefreshFlag(refreshFlag => !refreshFlag);
			});
		}
	}, [])

	useEffect(() => {
		if (window.ethereum) {
			setChainId(window.ethereum.chainId?.toLowerCase());
			setAddresses(contractAddresses[window.ethereum.chainId?.toLowerCase()]);
		}
	}, [refreshFlag])

	return (
		<div style={{minHeight: '100vh'}} className="App bg-dark text-white">
			{!mode && <div>
				{window.ethereum && [
					{chainData: binanceTestnetData, bootstrapColor: 'warning'},
					{chainData: klaytnBaobabData, bootstrapColor: 'light'},
					{chainData: {chainId: '0x3', chainName: 'Ropsten (Ethereum)'}, bootstrapColor: 'primary'},
					{chainData: {chainId: '0x5', chainName: 'Goerli (Ethereum)'}, bootstrapColor: 'secondary'},
					{chainData: polygonMumbaiData, bootstrapColor: 'danger'}
				].map((item, index) => {
					return <button
						key={index}
						className={`btn btn-${item.bootstrapColor}`}
						disabled={chainId === item.chainData.chainId?.toLowerCase()}
						onClick={async e => {
							await switchEthereumChain(item.chainData);
							setAccount();
							setChainId();
						}}>
						{item.chainData.chainName}
					</button>
				})}
				{!window.ethereum && <div className='row py-5 w-100 px-0 mx-0'>
					<hr className='w-100' />
					<h5 className='col-12'> For tests only! </h5>
					<div className='col-1' />
					<input
						className='col-7'
						type='password'
						value={UNSAFE_PrivateKey}
						onChange={e => setUNSAFE_PrivateKey(e.target.value)}
					/>
					<button className='btn btn-danger col-3' onClick={connectProgrammatically}>
						Use my private key to connect!
					</button>
					<div className='col-1' />
					<hr className='w-100' />
				</div>}
			</div>}
			<img src={logo} style={{maxHeight: '5vh'}} className="App-logo my-5" alt="logo" />
			<br/>
			{account && !mode && <>
				Welcome {account}!
				<br />
				{chainId && addresses?.factory && <button onClick={e => {
					setMode(1);
				}} className='btn btn-success mx-5'>
					Factory
				</button>}
				{chainId && addresses?.minterMarketplace && <button onClick={e => {
					setMode(2);
				}} className='btn btn-warning mx-5'>
					Minter Marketplace
				</button>}
				{chainId && addresses?.resaleMarketplace && <button onClick={e => {
					setMode(3);
				}} className='btn btn-primary mx-5'>
					Resale Marketplace
				</button>}
			</>}
			{account && mode && <button onClick={e => setMode()} style={{position: 'absolute', left: 0, top: 0}} className='btn btn-danger'>
				<i className='fas fa-arrow-left' />
			</button>}
			{account && mode === 1 && <CreatorMode account={account} addresses={addresses} programmaticProvider={programmaticProvider}/>}
			{account && mode === 2 && <ConsumerMode account={account} addresses={addresses} programmaticProvider={programmaticProvider}/>}
		</div>
	);
}

export default App;
