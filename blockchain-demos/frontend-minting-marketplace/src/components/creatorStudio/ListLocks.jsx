import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx'
import FixedBottomNavigation from './FixedBottomNavigation.jsx';
import { useParams, useHistory } from 'react-router-dom';
import {rFetch} from '../../utils/rFetch.js';
import {erc721Abi} from '../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../utils/blockchainData.js'
import colors from '../../utils/offerLockColors.js'
import {web3Switch} from '../../utils/switchBlockchain.js';

const OfferRow = ({index, locker, name, starts, ends, price, fixed, array, rerender, maxCopies, lockedNumber}) => {

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, ] = useState(name);
	const [startingToken, ] = useState(starts);
	const [endingToken, ] = useState(ends);
	const [individualPrice, ] = useState(price);
	const [lockedTokens, setLockedTokens] = useState(lockedNumber);

	const randColor = colors[index];

	const updateLockedNumber = useCallback((value) => {
		array[index].lockedNumber = Number(value);
		setLockedTokens(Number(value));
		rerender();
	}, [array, index, rerender, setLockedTokens])

	useEffect(() => {
		setLockedTokens(lockedNumber);
	}, [lockedNumber])

	return <tr>
		<th>
			<button disabled className='btn btn-charcoal rounded-rair'>
				<i style={{color: `${randColor}`}} className='fas fa-key' />
			</button>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={itemName}
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={startingToken}
				type='number'
				min='0'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={endingToken}
				customClass='form-control rounded-rair'
				type='number'
				min='0'
				max={maxCopies}
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={individualPrice}
				type='number'
				min='0'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					getter={lockedTokens}
					setter={updateLockedNumber}
					type='number'
					min='0'
					max={endingToken - startingToken}
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th>
			<div className='border-stimorol rounded-rair'>
				<button onClick={locker} className={`btn btn-${primaryColor} rounded-rair`}>
					<i className='fas fa-lock' />
				</button>
			</div>
		</th>
	</tr>
};

const ListLock = () => {
	const [contractData,setContractData] = useState();
	const [offerList, setOfferList] = useState([]);
	const [forceRerender, setForceRerender] = useState(false);
	const [instance, setInstance] = useState();
	const [onMyChain, setOnMyChain] = useState();

	const { contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const { primaryColor } = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();

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
		setOfferList(response2?.contract?.product?.offers ? response2?.contract?.product?.offers.map(item => {
			return {
				productIndex: item.product,
				name: item.offerName,
				starts: item.range[0],
				ends: item.range[1],
				price: item.price,
				lockedNumber: 0
			}
		}) : [])
	}, [address, collectionIndex])

	useEffect(() => {
		fetchData();
	}, [fetchData])

	const locker = async (data) => {
	    Swal.fire(`Locking ${data.ends - data.starts} tokens from ${data.name}`,`${data.lockedNumber} tokens will have to be minted to unlock them again.`, 'info');
	    try {
	    	await instance.createRangeLock(
	    			data.productIndex,
	    			data.starts,
	    			data.ends,
	    			data.lockedNumber); 
	    } catch (err) {
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
	    }
	    Swal.fire('Success!','The range has been locked', 'success');
	}

	const history = useHistory();

	useEffect(() => {
		if (onMyChain) {
			let createdInstance = contractCreator(address, erc721Abi)
			setInstance(createdInstance);
		}
	}, [address, onMyChain, contractCreator])

	const steps = [
		{label: 1, active: true},
		{label: 2, active: true},
		{label: 3, active: false},
		{label: 4, active: false},
	 ]

	const next = () => {
		history.push(`/creator/contract/${address}/collection/${collectionIndex}/metadata/batch`)
		//history.push(`/metadata/${address}/${collectionIndex}`);
	}

	useEffect(() => {
		setOnMyChain(
			window.ethereum ?
				chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
				:
				chainData[contractData?.blockchain]?.chainId === programmaticProvider?.provider?._network?.chainId
			)
	}, [contractData, programmaticProvider, currentChain])

	const switchBlockchain = async (chainId) => {
		web3Switch(chainId)
	}

	return <div className='row px-0 mx-0'>
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
		{contractData ? <>
			{offerList?.length !== 0 && <table className='col-12 text-start'>
				<thead>
					<tr>
						<th className='px-1' style={{width: '5vw'}} />
						<th>
							Item name
						</th>
						<th style={{width: '10vw'}}>
							Starts
						</th>
						<th style={{width: '10vw'}}>
							Ends
						</th>
						<th style={{width: '10vw'}}>
							Price for each
						</th>
						<th style={{width: '10vw'}}>
							Tokens Locked
						</th>
						<th />
					</tr>
				</thead>
				<tbody style={{maxHeight: '50vh', overflowY: 'scroll'}}>
					{offerList.map((item, index, array) => {
						return <OfferRow
							array={array}
							locker={e => locker(item)}
							key={index}
							index={index}
							{...item}
							rerender={e => setForceRerender(!forceRerender)}
							maxCopies={Number(contractData?.product?.copies) - 1} />
					})}
				</tbody>
			</table>}
			{chainData && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					action: !onMyChain ?
						() => switchBlockchain(chainData[contractData?.blockchain]?.chainId)
						:
						next,
					label: !onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : `Proceed`,
					disabled: false
				}]}
			/>}
		</> : 'Fetching data...'}
	</div>
}

export default ListLock;