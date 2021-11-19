import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import imageIcon from '../../images/imageIcon.svg';
import documentIcon from '../../images/documentIcon.svg';
import {NavLink, useParams, useHistory} from 'react-router-dom'
import {rFetch} from '../../utils/rFetch.js';
import FixedBottomNavigation from './FixedBottomNavigation.jsx';

const BatchMetadataParser = () => {
	const [contractData,setContractData] = useState();
	const {address, collectionIndex} = useParams();

	const steps = [
		{label: 1, active: true},
		{label: 2, active: true},
		{label: 3, active: true},
		{label: 4, active: false},
	]

	const fetchData = useCallback(async () => {
		if (!address) {
			return;
		}
		let response2 = await rFetch(`/api/contracts/${address}`);
		let response3 = await rFetch(`/api/contracts/${address}/products`);
		if (response3.success) {
			response2.contract.products = response3.products
		}
		let response4 = await rFetch(`/api/contracts/${address}/products/offers`);
		// Special case where a product exists but it has no offers
		if (response4.success) {
			response4.products.forEach(item => {
				response2.contract.products.forEach(existingItem => {
					if (item._id.toString() === existingItem._id.toString()) {
						existingItem.offers = item.offers;
					}
				})
			})
		}
		response2.contract.product = (response2.contract.products.filter(i => i.collectionIndexInContract === Number(collectionIndex)))[0];
		delete response2.contract.products;
		setContractData(response2.contract);
	}, [address, collectionIndex])

	const history = useHistory();

	useEffect(() => {
		fetchData();
	}, [fetchData])

	const { contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);

	const { primaryColor, textColor } = useSelector(store => store.colorStore);

	return <>
		<div className='col-12 my-5'>
			<h4>{contractData?.title}</h4>
			<small>{contractData?.product?.name}</small>
			<div className='w-75 mx-auto px-0' style={{position: 'relative'}}>
				<div style={{border: `solid 1px var(--charcoal-60)`, width: '76%', right: '12%', top: '50%', position: 'absolute', zIndex: 0}} />
				<div className='row px-0 mx-0' style={{width: '100%', position: 'absolute', zIndex: 1}} >
					{steps.map((item, index, array) => {
						return <div key={index} className='col'>
							<div style={{
								background: `var(--${item.active ? 'stimorol' : primaryColor})`,
								borderRadius: '50%',
								height: '1.7rem',
								width: '1.7rem',
								margin: 'auto',
								border: 'solid 1px var(--charcoal-60)'
							}}>
								{item.label}
							</div>
						</div>
					})}
				</div>
				<div style={{height: '1.5rem'}} />
			</div>
		</div>
		<div className='col-6 text-end'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/batch`}  className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Batch
			</NavLink>
		</div>
		<div className='col-6 text-start mb-3'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/single`} className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Single
			</NavLink>
		</div>
		<small className='w-100 text-center'>
			Please, download our prebuilt CSV template for metadata uploading.
		</small>
		<div className='col-4 text-start mb-3' />
		<button className={`btn btn-stimorol rounded-rair col-4 my-5`}>
			Download CSV Template
		</button>
		<div className='col-4 text-start mb-3' />
		<div className='rounded-rair col-6 mb-3'>
			<div style={{border: 'dashed 1px var(--charcoal-80)', position: 'relative'}} className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'>
				<div style={{position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem'}}>
					1
				</div>
				<img src={imageIcon} className='my-5'/>
				<br />
				Drag and drop or click to upload images
			</div>
		</div>
		<div className='rounded-rair col-6 mb-3'>
			<div style={{border: 'dashed 1px var(--charcoal-80)', position: 'relative'}} className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'>
				<div style={{position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem'}}>
					2
				</div>
				<img src={documentIcon} className='my-5'/>
				<br />
				Drag and drop or click to upload CSV
			</div>
		</div>
		<div style={{border: 'solid 1px white', overflowX: 'scroll', width: '80vw'}} className='rounded-rair'>
			<table >
				<thead>
					<th className='py-3'>
						URL
					</th>
					<th>
						Title
					</th>
					<th>
						Description
					</th>
					<th>
						Image
					</th>
					{[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) => {
						return <th key={index}>
							Attribute {index}
						</th>
					})}
				</thead>
				<tbody>

				</tbody>
				<tfoot />
			</table>
		</div>
		<FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
		/>
	</>
}

export default BatchMetadataParser;