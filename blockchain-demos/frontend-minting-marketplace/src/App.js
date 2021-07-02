import {useState} from 'react';

import logo from './RAIRlogo.png';
import './App.css';

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

// Import the data from the contract artifacts

import CreatorMode from './components/creatorMode.jsx';
import ConsumerMode from './components/consumerMode.jsx';

// Define the ABIs for each contract

function App() {

	const [account, setAccount] = useState();
	const [mode, setMode] = useState();

	return (
		<div style={{minHeight: '100vh'}} className="App bg-dark text-white">
			<img src={logo} className="App-logo" alt="logo" />
			<br/>
			{window.ethereum && account === undefined && <button className='btn btn-primary' onClick={async e => {
				const data = [{
					chainId: '0x61',
					chainName: 'Smart Chain - Testnet',
					nativeCurrency:
					{
						name: 'BNB',
						symbol: 'BNB',
						decimals: 18
					},
					rpcUrls: ['https://data-seed-prebsc-1-s1.binance.org:8545/'],
					blockExplorerUrls: ['https://testnet.bscscan.com'],
				}]
				await window.ethereum.request({method: 'wallet_addEthereumChain', params:data})

				// Requesting Metamask for the current account, if Metamask isn't enabled this will ask for permission
				let [metamaskAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });

				// Here I make sure the Binance Testnet is the current network
				// This validation only happens once, so the user can switch and ruin everything!
				if (window.ethereum.networkVersion === 97 || window.ethereum.chainId === 0x61) {
					Swal.fire('Please use Binance Smartchain Testnet!');
					return;
				}
				setAccount(metamaskAccount);
			}}> Connect with Metamask! </button>}
			{account && !mode && <>
				Welcome {account}!
				<br />
				<button onClick={e => {
					setMode(1);
				}} className='btn btn-success mx-5'>
					I'm a creator!
				</button>
				<button onClick={e => {
					setMode(2);
				}} className='btn btn-warning mx-5'>
					I'm an user!
				</button>
			</>}
			{account && mode && <button onClick={e => setMode()} style={{position: 'absolute', left: 0}} className='btn btn-danger'>
				Go Back
			</button>}
			{account && mode === 1 && <CreatorMode account={account} />}
			{account && mode === 2 && <ConsumerMode account={account} />}
		</div>
	);
}

export default App;
