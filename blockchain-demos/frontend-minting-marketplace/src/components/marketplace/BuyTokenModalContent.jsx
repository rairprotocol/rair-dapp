import { useState } from 'react';
import InputField from '../common/InputField.jsx';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import BatchRow from './BatchRow.jsx';

const BuyTokenModalContent = ({blockchain, start, end, price, offerIndex, rangeIndex, offerName}) => {
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
			console.error(err);
			Swal.fire('Error', err?.data?.message, 'error');
		}
	}

	const readCSVData = (data) => {
		if (!data) {
			return;
		}
		const reader = new FileReader();
		reader.onload = function (e) {
			//Public Address
			const text = e.target.result.split('\r\n');
			let headers = text.splice(0, 1)[0].split(',');
			let addressIndex = headers.indexOf('Public Address') - headers.length;
			let nftIndex = headers.indexOf('NFTID');
			let aux = [...rows];
			text.forEach((textItem, textIndex) => {
				let split = textItem.split(',');
				split = split.map(item => {
					return item.replace(/[\n\t\r]/g,"");	
				});
				if (split.at(addressIndex) !== "") {
					aux.push({
						address: split.at(addressIndex),
						token: Number(split[nftIndex])
					})
				}
			})
			setRows(aux);
		};
		reader.readAsText(data);
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
					<div className='col-12' style={{maxHeight: '50vh', overflowY: 'scroll'}}>
						{rows.map((item, index) => {
							return <BatchRow key={index} index={index} deleter={() => deleteRow(index)} array={rows}/>
						})}
					</div>
					<div className='col-12'>
						<InputField
							customClass='py-0 form-control mb-2'
							labelClass='mt-2'
							id='csv_import'
							type='file'
							setter={readCSVData}
							setterField={['files', 0]}
							label='Or load addresses with CSV file'
						/>
					</div>
					<button onClick={e => batchMint(rows)} disabled={!rows.length} className='col btn btn-stimorol'>
						Batch Mint {rows.length} tokens!
					</button>
				</>
			}
		</div>
	</>
}

export default BuyTokenModalContent;