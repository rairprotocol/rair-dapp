import {useState, useEffect} from 'react'
import Swal from 'sweetalert2';

const RangeManager = ({index, array, deleter, sync, hardLimit, disabled}) => {

	const [endingRange, setEndingRange] = useState(index === 0 ? 0 : Number(array[index].endingToken) + 1);
	const [rangeName, setRangeName] = useState(array[index].name);
	const [rangePrice, setRangePrice] = useState(array[index].price);

	useEffect(() => {
		array[index].endingToken = endingRange;
		sync();
	}, [endingRange])

	useEffect(() => {
		array[index].name = rangeName;
		sync();
	}, [rangeName])

	useEffect(() => {
		array[index].price = rangePrice;
		sync();
	}, [rangePrice])

	return <tr>
		<th>
			{!disabled && <button
				onClick={e => deleter(index)}
				className='btn btn-danger h-50'>
				<i className='fas fa-trash' />
			</button>}
		</th>
		<th>
			#{index + 1}
		</th>
		<th>
			<input className='form-control' disabled={disabled} value={rangeName} onChange={e => setRangeName(e.target.value)} />
		</th>
		<th>
			<input className='form-control' disabled value={(index === 0) ? 0 : (Number(array[index - 1].endingToken + 1))} />
		</th>
		<th>
			<input
				style={{
					backgroundColor: (index === 0 ? 0 : array[index - 1].endingToken) >= endingRange ? 'red' : undefined,
					color: (index === 0 ? 0 : array[index - 1].endingToken) >= endingRange ? 'white' : undefined
				}}
				disabled={disabled} 
				className='form-control'
				type='number'
				min={index === 0 ? 0 : Number(array[index - 1].endingToken) + 1}
				max={hardLimit}
				value={endingRange}
				onChange={e => setEndingRange(Number(e.target.value))} />
		</th>
		<th>
			<input disabled={disabled}  className='form-control' value={rangePrice} onChange={e => setRangePrice(e.target.value)} />
		</th>
	</tr>
}

const CollectionManager = ({index, collectionInfo, minter, tokenInstance, tokenAddress}) => {

	const [tokensOnSale, setTokensOnSale] = useState(0);
	const [priceInWei, setPriceInWei] = useState(0);
	const [ranges, setRanges] = useState([]);
	const [forceSync, setForceSync] = useState([]);

	const deleter = index => {
		let aux = [...ranges];
		aux.splice(index, 1);
		setRanges(aux);
	}

	const refresher = async () => {
		try {
			let offerIndex = (await minter.contractToOffer(tokenInstance.address)).toString();
			let offerData = await minter.getOfferInfo(offerIndex);
			let existingRanges = [];
			for await (let rangeIndex of [...Array.apply(null, {length: offerData.availableRanges.toString()}).keys()]) {
				let rangeInfo = await minter.getOfferRangeInfo(offerIndex, rangeIndex);
				existingRanges.push({
					endingToken: Number(rangeInfo.tokenEnd.toString()),
					name: rangeInfo.name,
					price: rangeInfo.price.toString(),
					disabled: true
				})
			}
			setRanges(existingRanges);
		} catch (err) {

		}
	} 

	useEffect(() => {
		if (tokenInstance && minter) {
			refresher()
		} 
	}, [])

	return <details className='w-100 border border-secondary rounded'>
		<summary>
			Collection #{index+1}: {collectionInfo.name}
		</summary>
		<div className='row mx-0 px-0'>
			<div className='col-12'>
				<h5> Collection Info </h5>
				First token: {collectionInfo.startingToken}<br/> 
				Last Token: {collectionInfo.endingToken}<br/> 
				Mintable Tokens Left: {collectionInfo.mintableTokensLeft}<br/>
			</div>
			<hr className='w-100' />
			<div className='col-12' style={{position: 'relative'}}>
				<button
					style={{position: 'absolute', right: 0, top: 0}}
					onClick={e => {
						let aux = [...ranges];
						aux.push({
							endingToken: aux.length === 0 ? 0 : (Number(aux[aux.length - 1].endingToken) + 1),
							name: '',
							price: 0
						});
						setRanges(aux);
					}}
					className='btn btn-success'>
					<i className='fas fa-plus' />
				</button>
				<h5> On the Minter Marketplace </h5>
				<table className='w-100'>
					<thead>
						<tr>
							<th />
							<th> # </th>
							<th>
								Name
							</th>
							<th>
								Starts
							</th>
							<th>
								Ends
							</th>
							<th>
								Price
							</th>
						</tr>
					</thead>
					<tbody>
						{ranges.map((item, index, array) => {
							return <RangeManager
										disabled={item.disabled}
										index={index}
										array={array}
										deleter={deleter}
										sync={() => {setForceSync(!forceSync)}}
										hardLimit={collectionInfo.endingToken}
									/>
						})}
					</tbody>
				</table>
				<button onClick={async e => {
					try {
						await minter.addOffer(
							tokenAddress,
							index,
							ranges.map((item, index, array) => index === 0 ? 0 : (Number(array[index - 1].endingToken) + 1)),
							ranges.map((item) => item.endingToken),
							ranges.map((item) => item.price),
							ranges.map((item) => item.name),
							'0xe98028a02832A87409f21fcf4e3a361b5D2391E7');
					} catch (err) {
						Swal.fire('Error', err.data.message, 'error');
					}
				}} disabled={!ranges.length} className='btn btn-warning'>
					{ranges.length > 0 && ranges[0].disabled ? `Append ${ranges.filter(item => !item.disabled).length} ranges to the marketplace` : `Create offer with ${ranges.length} ranges on the marketplace`}
				</button>
			</div>
		</div>
	</details>
}

export default CollectionManager;