// React functionality
import logo from './logo.svg';
import {useState} from 'react';
import './App.css';

// Ethers.js
import * as ethers from 'ethers'

// Sweetalert2 for the popup messages
import Swal from 'sweetalert2';

// Import the data from the contract artifacts
import * as Factory from './contracts/RAIR_Token_Factory.json';
import * as ERC777Token from './contracts/RAIR777.json';
import * as ERC721Token from './contracts/RAIR_ERC721.json';

// Web3
import Web3 from 'web3'
// Connects to Metamask's provider (window.ethereum)
const web3 = new Web3(window.ethereum);
// Enable revert messages
web3.eth.handleRevert = true

// Define the ABIs for each contract
const factoryAbi = Factory.default.abi;
const erc777Abi = ERC777Token.default.abi;
const erc721Abi = ERC721Token.default.abi;

function App() {
	const [tokensSent, setTokensSent] = useState(0)
	const [erc721address, setERC721address] = useState('')
	const [account, setAccount] = useState()
	const [blockchainResponse, setBlockchainResponse] = useState('')

	// Connections to the Test ERC777
	const [erc777Ethers, setERC777Ethers] = useState()
	const [erc777Web3, setERC777Web3] = useState()
	
	// Connections to the Factory Contract
	const [factoryEthers, setFactoryEthers] = useState()
	const [factoryWeb3, setFactoryWeb3] = useState()


	// The ERC777 and Factory contract addresses are fixed,
	//		the ERC721 contracts are not, so every call we do to ERC721s has to
	//		connect again

	const getERC721InstanceEthers = async (address) => {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);
		let contractInstance = await new ethers.Contract(address, erc721Abi, signer);
		console.log(contractInstance);
		return contractInstance;
	}
	const getERC721InstanceWeb3 = async (address) => {
		return new web3.eth.Contract(erc721Abi, address)
	}

	return (
		<div style={{backgroundColor: '#111', color: 'white', textAlign: 'center', minHeight: '100vh'}} className="App">
			<img src={logo} className="App-logo" alt="logo" /><br/>
			{window.ethereum && account === undefined && <button onClick={async e => {
				// Requesting Metamask for the current account, if Metamask isn't enabled this will ask for permission
				let [metamaskAccount] = await window.ethereum.request({ method: 'eth_requestAccounts' });

				// Here I make sure the Binance Testnet is the current network
				// This validation only happens once
				if (window.ethereum.networkVersion === 97 || window.ethereum.chainId === 0x61) {
					Swal.fire('Please use Binance Smartchain Testnet!');
					return;
				}

				setAccount(metamaskAccount);

				// Web3 Connection
				let erc777InstanceWeb3 = new web3.eth.Contract(erc777Abi, '0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1')
				setERC777Web3(erc777InstanceWeb3);

				let factoryInstanceWeb3 = new web3.eth.Contract(factoryAbi, '0x5c31677c7E73F97020213690F736A8a2Ff922EBC')
				setFactoryWeb3(factoryInstanceWeb3);

				// On Web3 you can get all of the functions in a contract calling the instance's methods property
				//console.log(factoryInstanceWeb3.methods)
				//console.log(erc777InstanceWeb3.methods)

				// Ethers Connection
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				let signer = provider.getSigner(0);
				let erc777Instance = new ethers.Contract('0x51eA5316F2A9062e1cAB3c498cCA2924A7AB03b1', erc777Abi, signer);
				setERC777Ethers(erc777Instance);

				let factoryInstanceEthers = new ethers.Contract('0x5c31677c7E73F97020213690F736A8a2Ff922EBC', factoryAbi, signer);
				setFactoryEthers(factoryInstanceEthers);

				// On Ethers you can get all of the functions in a contract calling the instance's functions property
				//console.log(factoryInstanceWeb3.functions)
				//console.log(erc777InstanceWeb3.functions)
			}}> Connect with Metamask! </button>}
			{account && erc777Ethers && factoryEthers && <>
				Connected with Address: {account}<br/>
				<br/>
				<table className='h5' style={{fontSize: 'smaller', width: '100%'}}>
					<thead>
						<tr>
							<th>
								Ethers.js
							</th>
							<th>
								Transaction
							</th>
							<th>
								Web3.js
							</th>
						</tr>
					</thead>
					<tbody>
						{/*
							This Array of JSONs has:
								- ethersCall: The method that Ethers needs to call (simpler)
								- web3Call: The method that Web3 has to call (A little more complex, especially if it costs)
								- contractCallDescription: Describes what the function does (Might have an input if needed)
								- costs: true or false (mostly undefined)
						*/}
						{[{
							contractCallDescription: `ERC777 Test Token (${erc777Ethers.address})`,
							disableCostMsg: true
						},{
							ethersCall: erc777Ethers.decimals,
							web3Call: erc777Web3.methods.decimals,
							contractCallDescription: 'Get the ERC777 decimals'
						},{
							ethersCall: erc777Ethers.granularity,
							web3Call: erc777Web3.methods.granularity,
							contractCallDescription: 'Get the ERC777 granularity',
						},{
							ethersCall: erc777Ethers.name,
							web3Call: erc777Web3.methods.name,
							contractCallDescription: 'Get the ERC777 name'
						},{
							ethersCall: erc777Ethers.symbol,
							web3Call: erc777Web3.methods.symbol,
							contractCallDescription: 'Get the ERC777 symbol'
						},{
							ethersCall: i => erc777Ethers.balanceOf(account),
							web3Call: i => erc777Web3.methods.balanceOf(account),
							contractCallDescription: 'Get the ERC777 balance of user',
						},{
							contractCallDescription: `Factory Contract (${factoryEthers.address})`,
							disableCostMsg: true
						},{
							ethersCall: async i => factoryEthers.hasRole(await factoryEthers.OWNER(), account),
							web3Call: async i => await factoryWeb3.methods.hasRole(await factoryWeb3.methods.OWNER().call(), account),
							contractCallDescription: 'Ask if account is owner of the Factory',
						},{
							ethersCall: async i => factoryEthers.hasRole(await factoryEthers.ERC777(), account),
							web3Call: async i => factoryWeb3.methods.hasRole(await factoryWeb3.methods.ERC777().call(), account),
							contractCallDescription: 'Ask if account is an approved ERC777 for the Factory',
						},{
							ethersCall: async i => factoryEthers.hasRole(await factoryEthers.ERC777(), await erc777Ethers.address),
							web3Call: async i => factoryWeb3.methods.hasRole(await factoryWeb3.methods.ERC777().call(), erc777Web3._address),
							contractCallDescription: 'Ask if the test token is an approved ERC777 for the Factory',
						},{
							ethersCall: async i => factoryEthers.erc777ToNFTPrice(erc777Ethers.address),
							web3Call: async i => factoryWeb3.methods.erc777ToNFTPrice(erc777Web3._address),
							contractCallDescription: 'Get the NFT price for the Test ERC777 token',
						},{
							ethersCall: async i => factoryEthers.tokensByOwner(account),
							web3Call: async i => factoryWeb3.methods.tokensByOwner(account),
							contractCallDescription: 'Get the tokens owned by the user',
						},{
							contractCallDescription: 'Transactions',
							disableCostMsg: true
						},{
							ethersCall: async i => tokensSent > 0 && erc777Ethers.send(factoryEthers.address, tokensSent, ethers.utils.toUtf8Bytes('')),
							web3Call: async i => tokensSent > 0 && erc777Web3.methods.send(factoryWeb3._address, tokensSent, web3.utils.asciiToHex('')),
							contractCallDescription: <>
								<input
									type='number'
									onChange={(e => setTokensSent(e.target.value))}
									value={tokensSent} />
								<br/>
								Send {tokensSent} to the factory contract
							</>,
							costs: true
						},{
							contractCallDescription: <>
								<input
									onChange={(e => setERC721address(e.target.value))}
									value={erc721address} />
								<br/>
								ERC721 calls to {erc721address} Token
							</>,
							disableCostMsg: true
						},{
							ethersCall: async i => {
								return (await getERC721InstanceEthers(erc721address)).name()
							},
							web3Call: async i => {
								return (await getERC721InstanceWeb3(erc721address)).methods.name();
							},
							contractCallDescription: 'Get the token name'
						},{
							ethersCall: async i => {
								return (await getERC721InstanceEthers(erc721address)).symbol()
							},
							web3Call: async i => {
								return (await getERC721InstanceWeb3(erc721address)).methods.symbol();
							},
							contractCallDescription: 'Get the token symbol'
						},{
							ethersCall: async i => {
								return (await getERC721InstanceEthers(erc721address)).balanceOf(account)
							},
							web3Call: async i => {
								return (await getERC721InstanceWeb3(erc721address)).methods.balanceOf(account);
							},
							contractCallDescription: 'Get the balance of the current user'
						},{
							ethersCall: async i => {
								return (await getERC721InstanceEthers(erc721address)).totalSupply()
							},
							web3Call: async i => {
								return (await getERC721InstanceWeb3(erc721address)).methods.totalSupply();
							},
							contractCallDescription: 'Get the total supply of the token'
						},{
							ethersCall: async i => {
								return (await getERC721InstanceEthers(erc721address)).supplyLimit()
							},
							web3Call: async i => {
								return (await getERC721InstanceWeb3(erc721address)).methods.supplyLimit();
							},
							contractCallDescription: 'Get the supply limit of the token'
						},{
							ethersCall: async i => {
								let instance = await getERC721InstanceEthers(erc721address)
								return instance.hasRole(await instance.CREATOR(), account);
							},
							web3Call: async i => {
								let instance = await getERC721InstanceWeb3(erc721address)
								return instance.methods.hasRole(await instance.methods.CREATOR().call(), account);
							},
							contractCallDescription: 'Is the user the creator of the token?'
						}].map(({ethersCall, postProcess, web3Call, contractCallDescription, costs, disableCostMsg}, index) => {
							return <tr key={index} style={{marginTop: '1rem'}}>
								<th style={{border: 'solid white 1px'}}>
									{ethersCall && <button onClick={async e => {
										setBlockchainResponse('Fetching with Ethers...');
										// If the contract reverts with an error, the catch will show the message
										let response = (await ethersCall().catch(err => {
											Swal.fire('Error from Ethers Call!', err.data.message)
										}));
										// If the contract did respond, it'll show a stringified version
										if (response) {
											Swal.fire('Response with Ethers:',response.toString())
										}
										setBlockchainResponse('');
									}}>
										Call with Ethers!
									</button>}
								</th>
								<th style={{border: 'solid white 1px'}}>
									{contractCallDescription}<br />
									{!disableCostMsg && <>
										{costs ? <b style={{color: 'red'}}>
													Costs gas!
												</b>
												:
												<b style={{color: 'green'}}>
													Free
												</b>
											}
									</>}
								</th>
								<th style={{border: 'solid white 1px'}}>
									{web3Call && <button onClick={async e => {
										setBlockchainResponse('Fetching with Web3...');
										let methodCall = await web3Call();
										if (methodCall) {
											let response;
											// TODO: Figure out how to catch errors on Web3!
											if (!costs) {
												// If the function is free, use call!
												response = (await methodCall.call({from: account}));
											} else {
												// If the function costs money, use send!
												response = (await methodCall.send({from: account}));
											}
											Swal.fire('Response with Web3:',response.toString())
											setBlockchainResponse('');
										}
									}}>
										Call with Web3
									</button>}
								</th>
							</tr>
						})}
					</tbody>
				</table>
			{blockchainResponse}
			</>}
		</div>
	);
}

export default App;