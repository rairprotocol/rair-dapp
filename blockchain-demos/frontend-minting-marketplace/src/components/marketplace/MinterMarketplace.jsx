import {useState, useEffect, useCallback} from 'react';
import {rFetch} from '../../utils/rFetch.js';
import {useSelector, useStore, Provider} from 'react-redux';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import chainData from '../../utils/blockchainData';

import InputField from '../common/InputField.jsx';

const rSwal = withReactContent(Swal);

const BatchRow = ({index, deleter, array}) => {

	const [address, setAddress] = useState();
	const [token, setToken] = useState();

	useEffect(() => {
		setAddress(array[index].address);
		setToken(array[index].token);
	}, [index, array])

	const addressChange = (e) => {
		setAddress(e.target.value);
		array[index].address = e.target.value;
	}

	const tokenChange = (e) => {
		setToken(e.target.value);
		array[index].token = e.target.value;
	}



	return <div className='col-12 row px-0 mx-0'>
		<div className='col-1 px-0'>
			<div className='form-control' style={{border: 'none'}}>
				#{index}
			</div>
		</div>
		<div className='col-7 px-0'>
			<input value={address} onChange={addressChange} className='form-control'/>
		</div>
		<div className='col-3 px-0'>
			<input type='number' value={token} onChange={tokenChange} className='form-control'/>
		</div>
		<button onClick={deleter} className='col-1 btn btn-danger'>
			<i className='fas fa-trash' />
		</button>
	</div>
}

const ModalContent = ({blockchain, start, end, price, offerIndex, rangeIndex, offerName}) => {
	const [tokenIndex, setTokenIndex] = useState(start);
	const [rows, setRows] = useState([]);

	const [batchMode, setBatchMode] = useState(false);

	const {minterInstance} = useSelector(state => state.contractStore)
	
	const batchMint = async (data) => {
		let addresses = data.map(i => i.address);
		let tokens = data.map(i => i.token);
		try {
			await minterInstance.buyTokenBatch(offerIndex, rangeIndex, tokens, addresses, {value: price * tokens.length});
			Swal.close();
		} catch (err) {
			console.log(err);
			Swal.fire('Error', err?.data?.message, 'error');
		}
	}

	const addRow = () => {
		if (rows.length > end - start) {
			return;
		}
		let aux = [...rows];
		aux.push({
			address: '',
			token: aux.length ? Number(aux[aux.length - 1].token) + 1 : Number(start)
		})
		setRows(aux);
	}

	const deleteRow = (index) => {
		let aux = [...rows];
		aux.splice(index, 1);
		setRows(aux);
	}
	
	return <>
		<div className='row w-100 px-0 mx-0'>
			<button
				className={`btn col-${batchMode ? '2' : '9'} btn-royal-ice`}
				style={{
					border: 'none',
					borderTopRightRadius: '0px',
					borderBottomRightRadius: '0px'}}
				onClick={e => setBatchMode(false)}>
				Buy one Token
			</button>
			<button
				className={`btn col btn-stimorol`}
				style={{
					border: 'none',
					borderTopLeftRadius: '0px',
					borderBottomLeftRadius: '0px'}}
				onClick={e => setBatchMode(true)}>
				Buy multiple tokens
			</button>
		</div>
		<hr />
		<div className='row px-0 mx-0 col-12'>
			{!batchMode ? 
				<>
					<InputField
						label='Token Index'
						type='number'
						customClass='form-control'
						labelClass='w-100 text-start'
						getter={tokenIndex}
						setter={setTokenIndex}
						max={end}
						min={start}
					/>
					<div className='col-2' />
					<button onClick={async e => {
						try {
							await minterInstance.buyToken(offerIndex, rangeIndex, tokenIndex, {value: price})
							Swal.close();
						} catch (err) {
							console.error(err);
							Swal.fire('Error', err?.data?.message, 'error');
						}
					}} className='btn btn-stimorol col-8'>
						Buy token #{tokenIndex} for {price}
					</button>
					<div className='col-2' />
				</>
				:
				<>
					<button disabled className='btn col-12'>
						Offer: <b>{offerName}</b>
					</button>
					<button disabled={rows.length > end - start} onClick={addRow} className='col-2 btn btn-royal-ice'>
						Add <i className='fas fa-plus' />
					</button>
					<div className='col'>
						Total: {price * rows.length} wei
					</div>
					<div className='col-12' style={{maxHeight: '60vh', overflowY: 'scroll'}}>
						{rows.map((item, index) => {
							return <BatchRow key={index} index={index} deleter={() => deleteRow(index)} array={rows}/>
						})}
					</div>
					<button onClick={e => batchMint(rows)} disabled={!rows.length} className='col btn btn-stimorol'>
						Batch Mint {rows.length} tokens!
					</button>
				</>
			}
		</div>
	</>
}

const MinterMarketplace = () => {

	const [offerData, setOfferData] = useState([]);
	const {primaryColor, secondaryColor, textColor} = useSelector(state => state.colorStore)
	const store = useStore();

	const fetchData = useCallback(async () => {
		let aux = await rFetch('/api/contracts/full');
		if (aux.success) {
			let offerArray = [];
			aux.contracts.forEach(contract => {
				contract.products.offers.forEach(offer => {
					if (!offer.sold) {
						offerArray.push({
							blockchain: contract.blockchain,
							contractAddress: contract.contractAddress,
							productIndex: contract.products.collectionIndexInContract,
							productName: contract.products.name,
							totalCopies: contract.products.copies,
							...offer
						})
					}
				})
			});
			setOfferData(offerArray);
		}
	}, [])

	useEffect(() => {
		fetchData()
	}, [fetchData])

	return <div className='row px-0 mx-0 w-100'>
		{offerData.map((item, index) => {
			return <div key={index} className='col-4 p-2'>
				<div style={{
					border: `solid 1px ${textColor}`,
					borderRadius: '16px',
					backgroundImage: `url(${chainData[item?.blockchain]?.image})`,
					backgroundRepeat: 'no-repeat',
					backgroundSize: '5rem 5rem',
					backgroundPosition: 'top right',
					backgroundColor: `var(--${primaryColor}-transparent)`,
					backgroundBlendMode: 'overlay'
				}} className='w-100 p-3'>
					{item.productName}
					<br/>
					<small style={{fontSize: '0.7rem'}}>
						{item.contractAddress} 
					</small>
					<br/>
					<b>{item.offerName}</b>
					<br/>
					{item.range[1] - item.range[0] - item.soldCopies + 1} tokens up for sale <br/>
						for {item.price} {item.blockchain} wei <br/>
					<small>{/*item.totalCopies*/}</small>
					<br/>
					<button id={`button_${index}`} onClick={async e => {
						let onMyChain = chainData[item.blockchain]?.chainId === window.ethereum.chainId;
						if (!onMyChain) {
							if (window.ethereum) {
								await window.ethereum.request({
									method: 'wallet_switchEthereumChain',
									params: [{ chainId: chainData[item.blockchain]?.chainId }],
								});
							} else {
								// Code for suresh goes here
							}
						} else {
							rSwal.fire({
								html: <Provider store={store}>
									<ModalContent
										blockchain={item.blockchain}
										price={item.price}
										start={item.range[0]}
										end={item.range[1]}
										offerName={item.offerName}
										offerIndex={item.offerPool}
										rangeIndex={item.offerIndex}
									/>
								</Provider>,
								showConfirmButton: false,
								width: '70vw',
								customClass: {
									popup: `bg-${primaryColor}`,
									htmlContainer: `text-${secondaryColor}`,
								}
							})
						}
					}} className='btn btn-royal-ice py-0'>
						{chainData[item.blockchain]?.chainId === window.ethereum.chainId ?
							<>Buy</> :
							<>Switch to <b>{item.blockchain}</b></>
						}
					</button>
				</div>
			</div>
		})}
	</div>
}

export default MinterMarketplace;