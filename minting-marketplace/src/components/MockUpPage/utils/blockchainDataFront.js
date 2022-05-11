//@ts-nocheck
import BinanceDiamond from '../../../images/binance-diamond.svg';
import MaticLogo from '../../../images/polygon-matic.svg';
import EthereumLogo from '../../../images/ethereum-logo.svg';

const chainDataFront = {
	'BNB': {image: BinanceDiamond, name: 'BNB', chainId: '0x61'},
	'tMATIC': {image: MaticLogo, name: 'Matic', chainId: '0x13881'},
	'Goerli': {image: EthereumLogo, name: 'ETH', chainId: '0x5'},
	'MATIC': {image: MaticLogo, name: 'Matic', chainId: '0x89'},

	'0x61': {image: BinanceDiamond, name: 'BNB', chainId: '0x61'},
	'0x13881': {image: MaticLogo, name: 'Matic', chainId: '0x13881'},
	'0x5': {image: EthereumLogo, name: 'ETH', chainId: '0x5'},
	'0x89': {image: MaticLogo, name: 'Matic', chainId: '0x89'}
}

export default chainDataFront;