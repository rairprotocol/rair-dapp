import BinanceDiamond from '../images/binance-diamond.svg';
import MaticLogo from '../images/polygon-matic.svg';
import EthereumLogo from '../images/ethereum-logo.svg';

const chainData = {
	'0x61': {
		image: BinanceDiamond,
		name: 'Binance Testnet',
		chainId: '0x61',
		symbol: 'BNB',
		addChainData: {
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
	},
	'0x13881': {
		image: MaticLogo,
		name: 'Matic(Polygon) Testnet',
		chainId: '0x13881',
		symbol: 'tMATIC',
		addChainData: {
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
	},
	'0x5': {
		image: EthereumLogo,
		name: 'Ethereum Goerli',
		chainId: '0x5',
		symbol: 'ETH',
		addChainData: {
			chainId: '0x5',
			chainName: 'Goerli (Ethereum)'
		}
	},
	'0x1': {
		image: EthereumLogo,
		name: 'Ethereum Mainnet',
		chainId: '0x1',
		symbol: 'ETH',
		addChainData: {
			chainId: '0x1',
			chainName: 'Mainnet (Ethereum)'
		}
	},
	'0x89': {
		image: MaticLogo,
		name: 'Matic(Polygon) Mainnet',
		chainId: '0x89',
		symbol: 'MATIC',
		addChainData: {
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
	}
}

export default chainData;