//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { rFetch } from '../../utils/rFetch';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { diamondFactoryAbi } from '../../contracts';

import FixedBottomNavigation from './FixedBottomNavigation';
import NavigatorContract from './NavigatorContract';

const ListCollections = () => {
	const { primaryColor } = useSelector(store => store.colorStore);
	const { contractCreator } = useSelector(store => store.contractStore);
	const { address, blockchain } = useParams();

	const [data, setData] = useState();

	const history = useHistory();

	const getContractData = useCallback(async () => {
		if (!address) {
			return;
		}
		let response2 = await rFetch(`/api/contracts/network/${blockchain}/${address}`);
		let response3 = await rFetch(`/api/contracts/network/${blockchain}/${address}/products`);
		if (response3.success) {
			response2.contract.products = response3.products
		}
		let response4 = await rFetch(`/api/contracts/network/${blockchain}/${address}/products/offers`);
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
		if (response2.contract) {
			setData(response2.contract);
		} else {
			// Try diamonds
			let instance = contractCreator(address, diamondFactoryAbi);
			let productCount = Number((await instance.getProductCount()).toString());
			let productData = [];
			for (let i = 0; i < productCount; i++) {
				productData.push({
					collectionIndexInContract: i,
					name: (await instance.getProductInfo(i)).name,
					diamond: true
				});
			}
			setData({
				title: await instance.name(),
				contractAddress: address,
				blockchain: window.ethereum.chainId,
				products: productData
			});
		}
	}, [address, blockchain, contractCreator])

	useEffect(() => {
		getContractData();
	}, [getContractData])

	return <div className='row px-0 mx-0'>
		{data ? <NavigatorContract contractName={data.title} contractAddress={data.contractAddress} contractBlockchain={blockchain} >
			{data.products.map((item, index) => {
				return <NavLink to={`/creator/contract/${blockchain}/${data.contractAddress}/collection/${item.collectionIndexInContract}/offers`} key={index} style={{position: 'relative', backgroundColor: `var(--${primaryColor}-80)` }} className={`col-12 btn btn-${primaryColor} text-start rounded-rair my-1`}>
					{item.diamond && <i className='fas fa-gem' />} {item.name}
					<i className='fas fa-arrow-right' style={{position: 'absolute', right: '10px', top: '10px', color: 'var(--bubblegum)'}}/>
				</NavLink>
			})}
		</NavigatorContract> : 'Fetching data...'}
		<FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
		/>
	</div>
}

export default ListCollections;