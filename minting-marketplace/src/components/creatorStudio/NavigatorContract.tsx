//@ts-nocheck
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const NavigatorContract = ({children, contractAddress, contractName, contractBlockchain}) => {
	const { primaryColor, textColor } = useSelector(store => store.colorStore);
	return <div className='row px-0 mx-0'>
		<div className='col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block' />
		<div className={`col bg-${primaryColor} rounded-lg py-5`} style={{color: `var(--charcoal${primaryColor === 'rhyno' ? '' : '-40'})`}}>
			<h5 style={{color: textColor}}>
				<b>
					{contractName}
				</b>
			</h5>
			<small>{contractAddress}</small>
			<div className='row'>
				<div className='col-6 p-2'>
					<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${contractBlockchain}/${contractAddress}/createCollection`} className={`btn btn-${primaryColor} w-100 rounded-rair`}>
						Create New Collection
					</NavLink>
				</div>
				<div className='col-6 p-2'>
					<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${contractBlockchain}/${contractAddress}/listCollections`} className={`btn btn-${primaryColor} w-100 rounded-rair`}>
						Existing Collections
					</NavLink>
				</div>
			</div>
			<div className='row'>
				{children}
			</div>
		</div>
		<div className='col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block' />
	</div>
}

export default NavigatorContract;