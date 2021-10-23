import BinanceDiamond from '../images/binance-diamond.svg';
import MaticLogo from '../images/polygon-matic.svg';
import EthereumLogo from '../images/ethereum-logo.svg';

const chainData = {
	'0x61': {image: BinanceDiamond, name: 'Binance Testnet', chainId: '0x61'},
	'0x13881': {image: MaticLogo, name: 'Matic(Polygon) Testnet', chainId: '0x13881'},
	'0x5': {image: EthereumLogo, name: 'Ethereum Goerli', chainId: '0x5'},
	'0x89': {image: MaticLogo, name: 'Matic(Polygon) Mainnet', chainId: '0x89'}
}

export default chainData;