import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx'
import FixedBottomNavigation from './FixedBottomNavigation.jsx';
import { useParams, useHistory } from 'react-router-dom';
import {rFetch} from '../../utils/rFetch.js';
import {erc721Abi} from '../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../utils/blockchainData.js'
import {web3Switch} from '../../utils/switchBlockchain.js';

const colors = [
	'#E4476D',
	'gold',
	'silver',
	'#b08d57',
	'#000000',
	'#393939',
	'#636363',
	'#9a9a9a',
	'#bdbdbd',
	'#eoeoeo',
	'#f3f3f3',
	'#ffffff'
];

const OfferRow = ({index, locker, name, starts, ends, price, fixed, array, rerender, maxCopies, lockedNumber}) => {

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(name);
	const [startingToken, setStartingToken] = useState(starts);
	const [endingToken, setEndingToken] = useState(ends);
	const [individualPrice, setIndividualPrice] = useState(price);
	const [lockedTokens, setLockedTokens] = useState(lockedNumber);

	const randColor = colors[index];

	const updateLockedNumber = useCallback((value) => {
		array[index].lockedNumber = Number(value);
		setLockedTokens(Number(value));
		rerender();
	}, [array, index, rerender, setLockedTokens])

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
			<div className='border-stimorol rounded-rair'>
				<InputField
					disabled={true}
					getter={individualPrice}
					type='number'
					min='0'
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
	const [hasMinterRole, setHasMinterRole] = useState(false);
	const [instance, setInstance] = useState();
	const [onMyChain, setOnMyChain] = useState();

	const { minterInstance, contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
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
		/*{
	      "inputs": [
	        {
	          "internalType": "uint256",
	          "name": "productIndex",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_startingToken",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_endingToken",
	          "type": "uint256"
	        },
	        {
	          "internalType": "uint256",
	          "name": "_lockedTokens",
	          "type": "uint256"
	        }
	      ],
	      "name": "createRangeLock",
	      "outputs": [],
	      "stateMutability": "nonpayable",
	      "type": "function"
	    },*/
	    Swal.fire('Locking','Locking range', 'info');
	    try {
	    	await instance.createRangeLock(data.productIndex, data.starts, data.ends, data.lockedNumber); 
	    } catch (err) {
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
	    }
	    Swal.fire('Success!','The range has been locked', 'success');
	}

	const history = useHistory();

	useEffect(() => {
		if (onMyChain) {
			let createdInstance = contractCreator(address, erc721Abi)
			setInstance(createdInstance);
		}
	}, [erc721Abi, address, onMyChain, contractCreator])

	const fetchMintingStatus = useCallback(async () => {
		if (!instance || !onMyChain) {
			return;
		}
		try {
			setHasMinterRole(await instance.hasRole(await instance.MINTER(), minterInstance.address));
		} catch (err) {
			console.error(err);
			setHasMinterRole(false);
		}
	}, [minterInstance, instance, contractData, onMyChain])

	useEffect(() => {
		fetchMintingStatus()
	}, [fetchMintingStatus])

	const steps = [
		{label: 1, active: true},
		{label: 2, active: true},
		{label: 3, active: false},
		{label: 4, active: false},
	 ]

	const giveMinterRole = async () => {
		Swal.fire({title: 'Granting Role...', html: 'Please wait', icon: 'info', showConfirmButton: false});
		try {
			await (await instance.grantRole(await instance.MINTER(), minterInstance.address)).wait();
		} catch (err) {
			console.error(err);
			Swal.fire('Error','An error has ocurred','error');
			return;
		}
		Swal.fire('Success!','You can create offers now!','success');
		fetchMintingStatus()
	}

	const createOffers = async () => {
		Swal.fire('Creating offers...','Please wait','info');
		try {
			await (await minterInstance.addOffer(
				instance.address,
				collectionIndex,
				offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
				offerList.map((item) => item.ends),
				offerList.map((item) => item.price),
				offerList.map((item) => item.name),
				process.env.REACT_APP_NODE_ADDRESS)
			).wait();
		} catch (err) {
			console.error(err)
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
		}
		Swal.fire('Success!','The offers have been created!','success');
	}

	const appendOffers = async () => {
		Swal.fire('Appending offers...','Please wait','info');
		try {
			await (await minterInstance.appendOfferRangeBatch(
				contractData.product.offers[0].offerPool,
				offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
				offerList.map((item) => item.ends),
				offerList.map((item) => item.price),
				offerList.map((item) => item.name))
			).wait();
		} catch (err) {
			console.error(err)
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
		}
		Swal.fire('Success!','The offers have been appended!','success');
	}

	const switchBlockchain = async (chainId) => {
		web3Switch(chainId)
	}

	useEffect(() => {
		setOnMyChain(
			window.ethereum ?
				chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
				:
				chainData[contractData?.blockchain]?.chainId === programmaticProvider?.provider?._network?.chainId
			)
	}, [contractData, programmaticProvider, currentChain])

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
			<div className='py-3 my-5' />
			{chainData && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunction={!onMyChain ?
					() => switchBlockchain(chainData[contractData?.blockchain]?.chainId)
					:
					(hasMinterRole ? 
						(offerList[0]?.fixed ?
							appendOffers
							:
							createOffers)
						:
						giveMinterRole)}
				forwardLabel={!onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : (hasMinterRole ? (offerList[0]?.fixed ? 'Append to Offer' : 'Create Offer') : 'Approve Minter Marketplace')}
				forwardDisabled={hasMinterRole ? offerList.length === 0 || offerList.filter(item => item.fixed !== true).length === 0  : false}
			/>}
		</> : 'Fetching data...'}
	</div>
}

export default ListLock;