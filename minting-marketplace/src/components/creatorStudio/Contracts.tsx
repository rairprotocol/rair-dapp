//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import chainData from '../../utils/blockchainData'
import { rFetch } from '../../utils/rFetch';
import { NavLink } from 'react-router-dom';
import NavigatorFactory from './NavigatorFactory';

// React Redux types
import setDocumentTitle from '../../utils/setTitle';
import { getTokenError } from '../../ducks/auth/actions';

const Contracts = () => {
	const dispatch = useDispatch();

	const [contractArray, setContractArray] = useState();
	const { programmaticProvider } = useSelector(store => store.contractStore);
	const { primaryColor } = useSelector(store => store.colorStore);

	const fetchContracts = useCallback(async () => {
		let response = await rFetch('/api/contracts', undefined, { provider: programmaticProvider });
		if (response.success) {
			setContractArray(
				response.contracts.map(item => ({
					address: item.contractAddress,
					name: item.title,
					blockchain: item.blockchain,
					diamond: item.diamond
				}))
			);
		}
		if (response.error && response.message) {
			dispatch(getTokenError(response.error))
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
					{item?.blockchain &&
						<abbr title={chainData[item.blockchain].name}>
							<img
								alt={chainData[item.blockchain].name}
								src={chainData[item.blockchain].image}
								style={{maxHeight: '1.5rem', maxWidth: '1.5rem'}}
								className='me-2'
							/>
						</abbr>
					}
					{item.diamond === true &&
						<abbr title={'Diamond Contract'}>
							<i className='fas fa-gem me-2' />
						</abbr>
					}
					{item?.blockchain && chainData[item.blockchain].testnet &&
						<abbr title={'Testnet Contract'}>
							<i className='fas fa-vial me-2' />
						</abbr>
					}
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
	<hr />
	</NavigatorFactory>
}

export default Contracts;