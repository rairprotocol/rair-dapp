import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import chainData from '../../utils/blockchainData.js'
import { rFetch } from '../../utils/rFetch.js';
import { NavLink } from 'react-router-dom';
import NavigatorFactory from './NavigatorFactory.jsx';

// React Redux types
import * as authTypes from './../../ducks/auth/types'
import setDocumentTitle from '../../utils/setTitle';

const Contracts = () => {
	const dispatch = useDispatch();

	const [contractArray, setContractArray] = useState();
	const { programmaticProvider } = useSelector(store => store.contractStore);
	const { primaryColor } = useSelector(store => store.colorStore);

	const fetchContracts = useCallback(async () => {
		let response = await rFetch('/api/contracts', undefined, { provider: programmaticProvider });

		if (response.success) {
			setContractArray(response.contracts.map(item => ({address: item.contractAddress, name: item.title, blockchain: item.blockchain})));
		}

		if (response.error && response.message) {
			dispatch({ type: authTypes.GET_TOKEN_ERROR, error: response.error })
		}
	}, [programmaticProvider, dispatch])

	useEffect(() => {
		fetchContracts()
	}, [fetchContracts])

	useEffect(() => {
		setDocumentTitle(`Contracts`);
	}, []);


	return <NavigatorFactory>
		{contractArray ? (contractArray.length ? contractArray.map((item, index) => {
				return <NavLink to={`/creator/contract/${item.blockchain}/${item.address}/createCollection`} key={index} style={{position: 'relative', backgroundColor: `var(--${primaryColor}-80)` }} className={`col-12 btn btn-${primaryColor} text-start rounded-rair my-1`}>
					{item?.chainId && <img alt={chainData[item.chainId].name} src={chainData[item.chainId].image} style={{maxHeight: '1.5rem', maxWidth: '1.5rem'}} />}
					{item.name}
					<i className='fas fa-arrow-right' style={{position: 'absolute', right: '10px', top: '10px', color: 'var(--bubblegum)'}}/>
				</NavLink>
			})
			:
			<div style={{border: '1.3px dashed var(--charcoal-80)'}} className='rounded-rair p-5'>
				<h5 className='mt-5'>
					It seems, you have not deployed any contracts yet
				</h5>
				<NavLink to='/creator/deploy' className='btn btn-stimorol mb-5 mt-3' >
					Deploy
				</NavLink>
			</div>
			)
		:
		'Fetching data...'
	}
	</NavigatorFactory>
}

export default Contracts;