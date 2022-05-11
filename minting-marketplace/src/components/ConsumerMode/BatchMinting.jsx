//@ts-nocheck
import {useState, useEffect} from 'react'
import { utils, BigNumber } from 'ethers';
import blockchainData from '../../utils/blockchainData';

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

const BatchMinting = ({name, start, end, price, batchMint}) => {

	const [rows, setRows] = useState([]);

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

	return <div className='row px-0 mx-0 col-12'>
		<button disabled className='btn col-12'>
			Offer: <b>{name}</b>
		</button>
		<button disabled={rows.length > end - start} onClick={addRow} className='col-2 btn btn-success'>
			Add <i className='fas fa-plus' />
		</button>
		<button onClick={addRow} disabled className='col btn btn-white'>
			Total: {utils.formatEther(BigNumber.from(price === '' ? 0 : price).mul(rows.length)).toString()} {blockchainData[window?.ethereum?.chainId]?.symbol}!
		</button>
		<div className='col-12' style={{maxHeight: '60vh', overflowY: 'scroll'}}>
			{rows.map((item, index) => {
				return <BatchRow key={index} index={index} deleter={() => deleteRow(index)} array={rows}/>
			})}
		</div>
		<button onClick={e => batchMint(rows)} disabled={!rows.length} className='col btn btn-primary'>
			Batch Mint {rows.length} tokens!
		</button>
	</div>
}

export default BatchMinting;