import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { rFetch } from '../../utils/rFetch.js';
import { Link } from 'react-router-dom';

import BinanceDiamond from '../../images/binance-diamond.svg'
import MaticLogo from '../../images/polygon-matic.svg'
import EthereumLogo from '../../images/ethereum-logo.svg'

const chainData = {
	'BNB': {image: BinanceDiamond, name: 'Binance'},
	'tMATIC': {image: MaticLogo, name: 'Matic'},
	'ETH': {image: EthereumLogo, name: 'Ethereum'}
}

const MyNFTs = props => {

	const [tokens, setTokens] = useState([])

	const fetchData = useCallback(async () => {
		let response = await rFetch('/api/nft');
		if (response.success) {
			let tokenData = []
			for await (let token of response.result) {
				let contractData = await rFetch(`/api/contracts/${token.contract}`)
				tokenData.push({
					...token,
					...contractData.contract
				})
			}
			setTokens(tokenData);
		}
	}, [])

	const {primaryColor, textColor} = useSelector(state => state.colorStore)

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	return <div className='row px-0 mx-0'>
		{tokens.map((item, index) => {
			return <div
						key={index}
						className='p-2 my-2 col-4'>
						<div className='w-100 p-2' style={{
							border: `solid 1px ${textColor}`,
							borderRadius: '16px',
							backgroundImage: `url(${chainData[item?.blockchain]?.image})`,
							backgroundRepeat: 'no-repeat',
							backgroundSize: '5rem 5rem',
							backgroundPosition: 'top right',
							backgroundColor: `var(--${primaryColor}-transparent)`,
							backgroundBlendMode: 'overlay'
						}}>
						<small style={{fontSize: '0.7rem'}}>{item.contract}:{item.uniqueIndexInContract}</small>
						<br />
						{item.metadata ?
							<>
								<div className='w-100'>
									<img src={item.metadata.image} style={{width: '100%', height: 'auto', maxHeight: '25vh'}} />
								</div>
								<b>{item.metadata.name}</b><br />
								<small>{item.metadata.description}</small><br />
								<small>{item.metadata.attributes.length} attributes!</small>
							</>
							:
							<b> No metadata available </b>
						}
						<br/>
						<Link to={`/token/${item.contract}/${item.uniqueIndexInContract}`} className='btn btn-stimorol'>
							View Token
						</Link>
						</div>
					</div>
				})}
	</div>
}

export default MyNFTs;