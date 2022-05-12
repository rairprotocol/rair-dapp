//@ts-nocheck
import { useSelector } from 'react-redux';
import { NavLink } from 'react-router-dom';

const NavigatorFactory = ({children}) => {
	const { factoryInstance } = useSelector(store => store.contractStore);
	const { primaryColor } = useSelector(store => store.colorStore);
	return <div className='row px-0 mx-0'>
		<div className='col-xl-3 col-lg-1 col-md-1 d-none d-md-inline-block' />
		<div className={`col bg-${primaryColor} rounded-lg py-5`} style={{color: `var(--charcoal${primaryColor === 'rhyno' ? '' : '-40'})`}}>
			<h5>Factory</h5>
			<span>{factoryInstance?.address}</span>
			<div className='row'>
				<div className='col-6 p-2'>
					<NavLink activeClassName={`btn-stimorol`} to='/creator/deploy' className={`btn btn-${primaryColor} w-100 rounded-rair`}>
						Deploy
					</NavLink>
				</div>
				<div className='col-6 p-2'>
					<NavLink activeClassName={`btn-stimorol`} to='/creator/contracts' className={`btn btn-${primaryColor} w-100 rounded-rair`}>
						My Contracts
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

export default NavigatorFactory;