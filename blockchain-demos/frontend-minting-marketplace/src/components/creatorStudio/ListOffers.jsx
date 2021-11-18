import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import InputField from '../common/InputField.jsx'
import FixedBottomNavigation from './FixedBottomNavigation.jsx';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import {rFetch} from '../../utils/rFetch.js';
import {erc721Abi} from '../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../utils/blockchainData.js'
import {web3Switch} from '../../utils/switchBlockchain.js';

const colors = [
	'#E4476D',
	//'#73B8E5',
	//'#CCA541',
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

const OfferRow = ({index, deleter, name, starts, ends, price, array, rerender, maxCopies}) => {

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(name);
	const [startingToken, setStartingToken] = useState(starts);
	const [endingToken, setEndingToken] = useState(ends);
	const [individualPrice, setIndividualPrice] = useState(price);

	//const [randColor, ] = useState(Math.abs(0xE4476D - (0x58ec5c * index)));
	const randColor = colors[index];

	const updater = (name, setter, value) => {
		array[index][name] = value;
		setter(value);
		rerender();
	};

	const updateStartingToken = (value) => {
		array[index].starts = Number(value);
		setStartingToken(value);
		if (Number(endingToken) < Number(value)) {
			updateEndingToken(Number(value));
		}
		rerender();
	}

	const updateEndingToken = (value) => {
		array[index].ends = Number(value);
		setEndingToken(Number(value));
		if (array[Number(index) + 1] !== undefined) {
			array[Number(index) + 1].starts = Number(value) + 1;
		}
		rerender();
	}

	useEffect(() => {
		updateStartingToken(starts);
	}, [starts])

	useEffect(() => {
		updateEndingToken(ends);
	}, [ends])

	useEffect(() => {
		setIndividualPrice(price);
	}, [price])

	useEffect(() => {
		setItemName(name);
	}, [name])

	return <tr>
		<th>
			<button disabled className='btn btn-charcoal rounded-rair'>
				<i style={{color: `${randColor}`}} className='fas fa-key' />
			</button>
		</th>
		<th className='p-1'>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					getter={itemName}
					setter={value => updater('name', setItemName, value)}
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={startingToken}
				setter={updateStartingToken}
				type='number'
				min='0'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					getter={endingToken}
					setter={updateEndingToken}
					customClass='form-control rounded-rair'
					type='number'
					min='0'
					max={maxCopies}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th className='p-1'>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					getter={individualPrice}
					setter={value => updater('price', setIndividualPrice, value)}
					type='number'
					min='0'
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th>
			<button onClick={deleter} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>
		</th>
	</tr>
};

const ListOffers = () => {
	const [contractData,setContractData] = useState();
	const [offerList, setOfferList] = useState([]);
	const [forceRerender, setForceRerender] = useState(false);
	const [hasMinterRole, setHasMinterRole] = useState(false);
	const [instance, setInstance] = useState();
	const [onMyChain, setOnMyChain] = useState();

	const { minterInstance, contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();

	console.log()

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

	useState(() => {
		fetchData();
	}, [fetchData])

	const addOffer = () => {
		let aux = [...offerList];
		let startingToken = offerList.length === 0 ? 0 : Number(offerList.at(-1).ends) + 1
		aux.push({
			name: '',
			starts: startingToken,
			ends: startingToken,
			price: 0,
		});
		setOfferList(aux);
	}

	const deleter = (index) => {
		let aux = [...offerList];
		if (aux.length > 1 && index !== aux.length - 1) {
			aux[1].starts = 0;
		}
		aux.splice(index, 1);
		setOfferList(aux);
	}
	const history = useHistory();

	useEffect(() => {
		if (onMyChain) {
			let createdInstance = contractCreator(address, erc721Abi)
			setInstance(createdInstance);
		}
	}, [erc721Abi, address, onMyChain])

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
		{label: 2, active: false},
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
		//await (minterInstance.addOffer(
		console.log(
			offerList,
			instance.address,
			collectionIndex,
			offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
			offerList.map((item) => item.ends),
			offerList.map((item) => item.price),
			offerList.map((item) => item.name),
			'0x3fD4268B03cce553f180E77dfC14fde00271F9B7')
		//).wait();
		Swal.fire('Success!','You can create offers now!','success');
	}

	const appendOffers = async () => {
		Swal.fire('Creating offers...','Please wait','info');
		//await (minterInstance.addOffer(
		console.log(
			instance.address,
			collectionIndex,
			offerList.map((item, index, array) => (index === 0) ? 0 : (Number(array[index - 1].ends) + 1)),
			offerList.map((item) => item.ends),
			offerList.map((item) => item.price),
			offerList.map((item) => item.name),
			'0x3fD4268B03cce553f180E77dfC14fde00271F9B7')
		//).wait();
		Swal.fire('Success!','You can create offers now!','success');
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
						return <div className='col'>
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
			<button className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Simple
			</button>
		</div>
		<div className='col-6 text-start mb-3'>
			<button className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Advanced
			</button>
		</div>
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
					<th />
				</tr>
			</thead>
			<tbody style={{maxHeight: '50vh', overflowY: 'scroll'}}>
				{offerList.map((item, index, array) => {
					return <OfferRow array={array} deleter={e => deleter(index)} key={index} index={index} {...item} rerender={e => setForceRerender(!forceRerender)} maxCopies={contractData?.product?.copies} />
				})}
			</tbody>
		</table>}
		<div className='col-12 mt-3 text-center'>
			<div className='border-stimorol rounded-rair'>
				<button onClick={addOffer} disabled={offerList.length >= 12} className={`btn btn-${primaryColor} rounded-rair px-4`}>
					Add new <i className='fas fa-plus' style={{border: `solid 1px ${textColor}`, borderRadius: '50%', padding: '5px'}} />
				</button>
			</div>
		</div>
		<div className='col-12 mt-3 p-5 text-center rounded-rair' style={{border: 'dashed 2px var(--charcoal-80)'}}>
			First Token: {contractData?.product?.firstTokenIndex}, Last Token: {contractData?.product?.firstTokenIndex + contractData?.product?.copies}, Mintable Tokens Left: {contractData?.product?.copies - contractData?.product?.soldCopies}
		</div>
		<div className='py-3 my-5' />
		{chainData && <FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
			forwardFunction={!onMyChain ? () => switchBlockchain(chainData[contractData?.blockchain]?.chainId) : (hasMinterRole ? (offerList[0]?.set ? () => createOffers : appendOffers) : giveMinterRole)}
			forwardLabel={!onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : (hasMinterRole ? (offerList[0]?.set ? 'Append to Offer' : 'Create Offer') : 'Approve Minter Marketplace')}
		/>}
	</div>
}

export default ListOffers;