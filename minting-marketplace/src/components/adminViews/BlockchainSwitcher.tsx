
import {useState} from 'react';
import { useDispatch, useSelector } from 'react-redux';
import * as ethers from 'ethers'
import Swal from 'sweetalert2';
import InputField from '../common/InputField';
import { BlockchainInfo, ChainDataType, MetamaskError } from './adminView.types';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { setChainId, setProgrammaticProvider } from '../../ducks/contracts';

const binanceTestnetData: ChainDataType = {
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

const binanceMainnetData: ChainDataType = {
	chainId: '0x38',
	chainName: 'Binance Mainnet',
	nativeCurrency:
	{
		name: 'BNB',
		symbol: 'BNB',
		decimals: 18
	},
	rpcUrls: ['https://bsc-dataseed.binance.org/'],
	blockExplorerUrls: ['https://bscscan.com']
}

const klaytnBaobabData: ChainDataType = {
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

const polygonMumbaiData: ChainDataType = {
	chainId: '0x13881',
	chainName: 'Matic Testnet Mumbai',
	nativeCurrency:
	{
		name: 'Matic token',
		symbol: 'tMATIC',
		decimals: 18
	},
	rpcUrls: ['https://rpc-mumbai.maticvigil.com/'],
	blockExplorerUrls: ['https://matic.network/']
}

const maticMainnetData: ChainDataType = {
	chainId: '0x89', // 0x89
	chainName: 'Matic(Polygon) Mainnet',
	nativeCurrency:
	{
		name: 'Matic Token',
		symbol: 'MATIC',
		decimals: 18
	},
	rpcUrls: ['https://polygon-rpc.com/'],
	blockExplorerUrls: ['https://polygonscan.com']
}

const blockchains: BlockchainInfo[] = [
	{chainData: binanceTestnetData, bootstrapColor: 'warning'},
	{chainData: binanceMainnetData, bootstrapColor: 'warning'},
	{chainData: klaytnBaobabData, bootstrapColor: 'light'},
	{chainData: {chainId: '0x1', chainName: 'Ethereum Mainnet'}, bootstrapColor: 'primary'},
	{chainData: {chainId: '0x5', chainName: 'Goerli (Ethereum)'}, bootstrapColor: 'secondary'},
	{chainData: polygonMumbaiData, bootstrapColor: 'danger'},
	{chainData: maticMainnetData, bootstrapColor: 'stimorol'}
]

const BlockChainSwitcher = () => {
	
	const [UNSAFE_PrivateKey, setUNSAFE_PrivateKey] = useState('');

	const {currentChain} = useSelector<RootState, ContractsInitialType>(state => state.contractStore);
	const dispatch = useDispatch();

	const connectProgrammatically = async ({rpcUrls, chainId, chainName, nativeCurrency}: ChainDataType) => {
		try {
			let networkData = {
				chainId: Number(chainId), symbol: nativeCurrency?.symbol, name: chainName, timeout: 1000000
			}
			let provider = new ethers.providers.JsonRpcProvider(rpcUrls?.[0], networkData);
			let currentWallet = await new ethers.Wallet(UNSAFE_PrivateKey, provider);
			await dispatch(setProgrammaticProvider(currentWallet));
			dispatch(setChainId(chainId));
		} catch (err) {
			const error = err as Error;
			console.error(error);
			Swal.fire('Error', error.message, 'error');
		}
	}

	const switchEthereumChain = async (chainData: ChainDataType) => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: chainData.chainId }],
			});
		} catch (switchError) {
			const metamaskError = switchError as MetamaskError;
			// This error code indicates that the chain has not been added to MetaMask.
			if (metamaskError.code === 4902) {
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
	
	return <>
		{!window.ethereum && <div className='row w-100 px-0 mx-0'>
			<div className='col-12 px-5'>
				<InputField
					customClass='form-control'
					type='password'
					placeholder='For testing purposes ONLY'
					getter={UNSAFE_PrivateKey}
					setter={setUNSAFE_PrivateKey}
				/>
			</div>
			<div className='col-12'>
				<div className='col-12'>
					{blockchains.map((item, index) => {
						if (!item.chainData.rpcUrls) {
							return <div className='d-none' key={index}></div>
						}
						return <button
							key={index}
							id={`connect_${item.chainData.nativeCurrency?.symbol}`}
							className={`btn btn-${item.bootstrapColor}`}
							disabled={currentChain === item.chainData.chainId?.toLowerCase() || UNSAFE_PrivateKey.length !== 64}
							onClick={async e => {
								await connectProgrammatically(item.chainData);
							}}>
							{item.chainData.chainName}
						</button>
					})}
				</div>
			</div>
			<hr className='w-100' />
		</div>}
		{window.ethereum && blockchains.map((item, index) => {
			return <button
				key={index}
				className={`btn btn-${item.bootstrapColor} mt-5`}
				disabled={currentChain === item.chainData.chainId?.toLowerCase()}
				onClick={async e => {
					await switchEthereumChain(item.chainData);
					dispatch(setChainId(undefined));
				}}>
				{item.chainData.chainName}
			</button>
		})}
	</>
}

export default BlockChainSwitcher;