import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField.jsx';
import {useSelector} from 'react-redux';
import {utils} from 'ethers'
import {erc721Abi} from '../../contracts';

const rSwal = withReactContent(Swal);

const RangeManager = ({ disabled, index, array, deleter, sync, hardLimit, locker, productIndex }) => {

	const [endingRange, setEndingRange] = useState(disabled ? array[index].endingToken : (index === 0) ? 0 : (Number(array[index - 1].endingToken) + 1));
	const [rangeName, setRangeName] = useState(array[index].name);
	const [rangePrice, setRangePrice] = useState(array[index].price);
	const syncOutside = useCallback(sync, [sync]);
	const rangeInit = ((index === 0) ? 0 : (Number(array[index - 1].endingToken) + 1));
	const [locked, setLocked] = useState(0);
	

	useEffect(() => {
		let aux = array[index].endingToken !== endingRange;
		array[index].endingToken = endingRange;
		if (aux) {
			syncOutside();
		}
	}, [endingRange, array, index, syncOutside])

	useEffect(() => {
		let aux = array[index].name !== rangeName;
		array[index].name = rangeName;
		if (aux) {
			syncOutside();
		}
	}, [rangeName, array, index, syncOutside])

	useEffect(() => {
		let aux = array[index].price !== rangePrice;
		array[index].price = rangePrice;
		if (aux) {
			syncOutside();
		}
	}, [rangePrice, array, index, syncOutside])

	return <tr>
		<th>
			{!disabled ? <button
				onClick={e => deleter(index)}
				className='btn btn-danger h-50'>
				<i className='fas fa-trash' />
			</button> : ''}
		</th>
		<th>
			#{index + 1}
		</th>
		<th>
			<input className='form-control' disabled={disabled} value={rangeName} onChange={e => setRangeName(e.target.value)} />
		</th>
		<th>
			<input className='form-control' type='number' value={(index === 0) ? 0 : (Number(array[index - 1].endingToken + 1))} disabled />
		</th>
		<th>
			<input
				style={((index === 0 ? 0 : array[index - 1].endingToken) > endingRange) || endingRange > hardLimit ? {
					backgroundColor: 'red',
					color: 'white'
				} : {}}
				disabled={disabled}
				className='form-control'
				type='number'
				min={(index === 0) ? 0 : (Number(array[index - 1].endingToken) + 1)}
				max={hardLimit}
				value={endingRange}
				onChange={e => setEndingRange(Number(e.target.value))} />
		</th>
		<th>
			<input disabled={disabled} type='number' className='form-control' value={rangePrice} onChange={e => setRangePrice(e.target.value)} />
		</th>
		<th>
			<input className='form-control' type='number' value={locked} onChange={e => setLocked(e.target.value)} />
		</th>
		<th>
			<button
				disabled={locked <= 0}
				onClick={e => locker(productIndex, rangeInit, endingRange, locked)}
				className='btn btn-success h-50'>
				<i className='fas fa-lock' />
			</button>
		</th>
	</tr>
}

const ModalContent = ({instance, blockchain}) => {

	const [productName, setProductName] = useState('');
	const [productLength, setProductLength] = useState(0);

	return <>
		<InputField 
			label='Product Name'
			customClass='form-control'
			labelClass='w-100 text-center'
			getter={productName}
			setter={setProductName}
		/>
		<InputField 
			label='Number of copies'
			customClass='form-control'
			labelClass='w-100 text-center'
			getter={productLength}
			setter={setProductLength}
		/>
		<br /> 
		<button disabled={blockchains[blockchain] !== window.ethereum.chainId} onClick={async e => {
			await instance.createProduct(productName, productLength);
			rSwal.close();
		}} className='btn my-3 btn-success'>
			Create Product!
		</button>
	</>
}

const blockchains = {
	'BNB': '0x61',
	'ETH': '0x5',
	'tMATIC': '0x13881'
}

const CreateProduct = ({address, blockchain}) => {
	const {factoryInstance, erc777Instance, contractCreator} = useSelector(store => store.contractStore);

	let onMyChain = blockchains[blockchain] === window.ethereum.chainId;

	return <button
		disabled={address === undefined || contractCreator === undefined}
		className={`btn btn-${onMyChain ? 'success' : 'primary'} py-0`}
		onClick={async e => {
			if (!onMyChain) {
				if (window.ethereum) {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: blockchains[blockchain] }],
					});
				} else {
					// Code for suresh goes here
				}
			} else {
				rSwal.fire({
					html: <ModalContent blockchain={blockchain} instance={await contractCreator(address, erc721Abi)}/>,
					showConfirmButton: false
				})
			}
		}}>
			{onMyChain ?
				<>Add Offer <i className='fas fa-plus'/></> :
				<>Switch to <b>{blockchain}</b></>
			}
	</button>
};

export default CreateProduct;