import { useState, useEffect, useCallback } from 'react';
import { withSentryRouting } from "@sentry/react";
import { rFetch } from '../../utils/rFetch.js';
import { useSelector } from 'react-redux';
import { useParams, Router, Switch, Route } from 'react-router-dom';
import WorkflowContext from '../../contexts/CreatorWorkflowContext.js';

import ListOffers from './creatorSteps/ListOffers.jsx';
import ListLocks from './creatorSteps/ListLocks.jsx';
import CustomizeFees from './creatorSteps/CustomizeFees.jsx';
import BatchMetadata from './creatorSteps/batchMetadata.jsx';

const SentryRoute = withSentryRouting(Route);

const WorkflowSteps = ({sentryHistory}) => {
	const {address, collectionIndex} = useParams();
	const [steps, setSteps] = useState([
			{
				label: 1,
				active: true,
				path: '/creator/contract/:address/collection/:collectionIndex/offers',
				populatedPath: `/creator/contract/${address}/collection/${collectionIndex}/offers`,
				component: ListOffers
			},
			{
				label: 2,
				active: false,
				path: '/creator/contract/:address/collection/:collectionIndex/locks',
				populatedPath: `/creator/contract/${address}/collection/${collectionIndex}/locks`,
				component: ListLocks
			},
			{
				label: 3,
				active: false,
				path: '/creator/contract/:address/collection/:collectionIndex/customizeFees',
				populatedPath: `/creator/contract/${address}/collection/${collectionIndex}/customizeFees`,
				component: CustomizeFees
			},
			{
				label: 4,
				active: false,
				path: '/creator/contract/:address/collection/:collectionIndex/metadata/batch',
				populatedPath: `/creator/contract/${address}/collection/${collectionIndex}/metadata/batch`,
				component: BatchMetadata
			},
			{
				label: 5,
				active: false,
				path: '/creator/contract/:address/collection/:collectionIndex/metadata/single',
				populatedPath: `/creator/contract/${address}/collection/${collectionIndex}/metadata/single`,
				component: BatchMetadata
			},
		]);
	const [contractData, setContractData] = useState();
	const { primaryColor } = useSelector(store => store.colorStore);

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
	}, [address, collectionIndex]);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const initialValue = {
		contractData,
		steps,
		setStepNumber: useCallback(index => {
			let aux = [...steps];
			aux.forEach(item => item.active = item.label <= index);
			setSteps(aux);
		}, [])
	}

	return <WorkflowContext.Provider value={initialValue}>
		<WorkflowContext.Consumer>
			{({contractData, steps, setStepNumber}) => {
				return <div className='row px-0 mx-0'>
					<div className='col-12 my-5'>
						<h4>{contractData?.title}</h4>
						<small>{contractData?.product?.name}</small>
						<div className='w-75 mx-auto px-auto text-center'>
							{steps.map((item, index) => {
								return <div className='d-inline-block' style={{
									width: `${100 / steps.length * (index === 0 ? 0.1 : 1)}%`,
									height: '3px',
									position: 'relative',
									backgroundColor: `var(--${item.active ? 'bubblegum' : `charcoal-80`})`
								}}>
									<div style={{
										position: 'absolute',
										right: 0,
										top: '-10px',
										borderRadius: '50%',
										background: `var(--${item.active ? 'bubblegum' : primaryColor})`,
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
					</div>
				</div>
			}}
		</WorkflowContext.Consumer>
		<Router history={sentryHistory}>
			<Switch>
				{steps.map((item, index) => {
					return <SentryRoute key={index} path={item.path} component={item.component} />
				})}
			</Switch>
		</Router>
	</WorkflowContext.Provider>
}

export default WorkflowSteps;