import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import chainData from '../../utils/blockchainData.js'
import InputField from '../common/InputField.jsx';
import { rFetch } from '../../utils/rFetch.js';
import Swal from 'sweetalert2';
import { useParams, useHistory } from 'react-router-dom';
import {erc721Abi} from '../../contracts';

import FixedBottomNavigation from './FixedBottomNavigation.jsx';
import NavigatorContract from './NavigatorContract.jsx';

const ContractDetails = () => {

	const [collectionName, setCollectionName] = useState('');
	const [collectionLength, setCollectionLength] = useState(0);

	const [creatingCollection, setCreatingCollection] = useState(false);

	const { primaryColor, secondaryColor } = useSelector(store => store.colorStore);
	const { programmaticProvider, contractCreator } = useSelector(store => store.contractStore);
	const { address } = useParams();

	const [data, setData] = useState();

	const history = useHistory();

	const getContractData = useCallback(async () => {
		if (!address) {
			return;
		}
		let dataRequest = await rFetch(`/api/contracts/${address}`);
		if (dataRequest.success) {
			setData(dataRequest.contract);
		}
	}, [address])

	useEffect(() => {
		getContractData();
	}, [getContractData])

	let onMyChain = window.ethereum ?
		chainData[data?.blockchain]?.chainId === window.ethereum.chainId
		:
		chainData[data?.blockchain]?.chainId === programmaticProvider?.provider?._network?.chainId;

	return <div className='row px-0 mx-0'>
		{data ? <NavigatorContract contractName={data.title} contractAddress={data.contractAddress} >
			<div className='col-8 p-2'>
				<InputField
					getter={collectionName}
					setter={setCollectionName}
					placeholder='Name your collection'
					label="New Collection name"
					customClass='rounded-rair form-control'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					labelClass='text-start w-100'
					/>
			</div>
			<div className='col-4 p-2'>
				<InputField
					getter={collectionLength}
					setter={setCollectionLength}
					placeholder='Length'
					label="Length"
					type='number'
					min={0}
					customClass='rounded-rair form-control'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					labelClass='text-start w-100'
					/>
			</div>
			<div className='col-12 p-3 mt-5 rounded-rair' style={{border: '1.3px dashed var(--charcoal-80)'}}>
				Contract Information: <br />
				<ul className='col-12 mt-3 px-4 text-start'>
					<li className='row'>
						<span className='col-12 py-1 text-start'>
							Total Supply: <b>0</b>
						</span>
						<span className='col-12 py-1 text-start'>
							Collections Created: <b>{data?.products?.length ? data?.products?.length : 0}</b>
						</span>
						<span className='col-12 py-1 text-start'>
							Current Balance: <b>0</b>
						</span>
					</li>
				</ul>
			</div>
		</NavigatorContract> : 'Fetching data...'}
		<FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
			forwardFunction={collectionLength > 0 && collectionName !== '' ? async () => {
				if (!onMyChain) {
					if (window.ethereum) {
						await window.ethereum.request({
							method: 'wallet_switchEthereumChain',
							params: [{ chainId: chainData[data.blockchain].chainId }],
						});
					} else {
						// Code for suresh goes here
					}
				} else {
					try {
						setCreatingCollection(true);
						let instance = await contractCreator(data.contractAddress, erc721Abi);
						await (await instance.createProduct(collectionName, collectionLength)).wait();
					} catch (err) {
						console.error(err)
						Swal.fire('Error', err?.message ? err.message : err.toString(), 'error');
					}
					setCreatingCollection(false);
				}
			} : undefined}
			forwardLabel={(data && !onMyChain) ? `Switch to ${chainData[data?.blockchain].name}` : undefined}
			forwardDisabled={creatingCollection}
		/>
	</div>
}

export default ContractDetails;