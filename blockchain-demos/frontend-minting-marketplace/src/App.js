import {useState} from 'react';

import logo from './logo.svg';
import './App.css';

const minterMarketplaceAddress = '0xcB07dFad44C2b694474E1ea6FEc1729b4c6df31B';
const factoryAddress = '0x4d4b5a70E77ac749B180eC24e48d03aF9d08e531';

// Ethers.js
import * as ethers from 'ethers'

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

// Import the data from the contract artifacts
import * as Factory from './contracts/RAIR_Token_Factory.json';
import * as ERC777 from './contracts/RAIR777.json';
import * as MinterMarketplace from './contracts/Minter_Marketplace.json';
import * as ERC721Token from './contracts/RAIR_ERC721.json';

// Define the ABIs for each contract
const factoryAbi = Factory.default.abi;
const erc777Abi = ERC777.default.abi;
const minterAbi = MinterMarketplace.default.abi;
const erc721Abi = ERC721Token.default.abi;

function App() {

	const [account, setAccount] = useState();
	const [erc777Instance, setERC777Instance] = useState();
	const [factoryInstance, setFactoryInstance] = useState();
	const [minterInstance, setMinterInstance] = useState();

	return (
		<div className="App">
			<img src={logo} className="App-logo" alt="logo" />
			{window.ethereum && account === undefined && <button onClick={async e => {
				// Requesting Metamask for the current account, if Metamask isn't enabled this will ask for permission
				let [metamaskAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });

				// Here I make sure the Binance Testnet is the current network
				// This validation only happens once, so the user can switch and ruin everything!
				if (window.ethereum.networkVersion === 97 || window.ethereum.chainId === 0x61) {
					Swal.fire('Please use Binance Smartchain Testnet!');
					return;
				}

				setAccount(metamaskAccount);

				// Ethers Connection
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				let signer = provider.getSigner(0);
				let erc777Instance = new ethers.Contract('0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1', erc777Abi, signer);
				setERC777Instance(erc777Instance);

				let factoryInstanceEthers = new ethers.Contract(factoryAddress, factoryAbi, signer);
				setFactoryInstance(factoryInstanceEthers);

				// On Ethers you can get all of the functions in a contract calling the instance's functions property
				//console.log(factoryInstanceWeb3.functions)
				//console.log(erc777InstanceWeb3.functions)
			}}> Connect with Metamask! </button>}
		</div>
	);
}

export default App;
