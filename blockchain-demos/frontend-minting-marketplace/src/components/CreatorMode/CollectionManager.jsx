import {useState, useEffect} from 'react'
import Swal from 'sweetalert2';

const LockManager = ({index, array, deleter, disabled, locker, collectionIndex}) => {

	const [start, setStart] = useState(array[index].startingToken);
	const [end, setEnd] = useState(array[index].endingToken);
	const [locked, setLocked] = useState(array[index].countToUnlock);

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
			<input className='form-control' disabled={disabled} value={start} onChange={e => setStart(e.target.value)} />
		</th>
		<th>
			<input className='form-control' disabled={disabled} value={end} onChange={e => setEnd(e.target.value)} />
		</th>
		<th>
			<input className='form-control' disabled={disabled} value={locked} onChange={e => setLocked(e.target.value)} />
		</th>
		<th>
			{!disabled ? <button
				onClick={e => locker(collectionIndex, start, end, locked)}
				className='btn btn-success h-50'>
				<i className='fas fa-lock' />
			</button> : ''}
		</th>
	</tr>
}

const RangeManager = ({index, array, deleter, sync, hardLimit, disabled, locker}) => {

	const [endingRange, setEndingRange] = useState(disabled ? array[index].endingToken : (index === 0) ? 0 : (Number(array[index - 1].endingToken) + 1));
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
			<input className='form-control' value={(index === 0) ? 0 : (Number(array[index - 1].endingToken + 1))} disabled/>
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
				min={(index === 0) ? 0 : (Number(array[index - 1].endingToken) + 1)}
				max={hardLimit}
				value={endingRange}
				onChange={e => setEndingRange(Number(e.target.value))} />
		</th>
		<th>
			<input disabled={disabled}  className='form-control' value={rangePrice} onChange={e => setRangePrice(e.target.value)} />
		</th>
	</tr>
}

const CollectionManager = ({collectionIndex, collectionInfo, minter, tokenInstance, tokenAddress}) => {

	const [tokensOnSale, setTokensOnSale] = useState(0);
	const [priceInWei, setPriceInWei] = useState(0);
	const [ranges, setRanges] = useState([]);
	const [locks, setLocks] = useState([]);
	const [forceSync, setForceSync] = useState(false);

	const deleter = index => {
		let aux = [...ranges];
		aux.splice(index, 1);
		setRanges(aux);
	}

	const lockDeleter = index => {
		let aux = [...locks];
		aux.splice(index, 1);
		setLocks(aux);
	}

	const locker = async (collectionIndex, startingToken, endingToken, lockedTokens) => {
		try {
			await tokenInstance.createRangeLock(collectionIndex, startingToken, endingToken, lockedTokens);
		} catch (err) {
			Swal.fire('Error', err?.data?.message, 'error');
		}
	}

	const refresher = async () => {
		try {
			// Marketplace Ranges
			let offerIndex = (await minter.contractToOfferRange(tokenInstance.address, collectionIndex)).toString();
			let offerData = await minter.getOfferInfo(offerIndex);
			let existingRanges = [];
			for await (let rangeIndex of [...Array.apply(null, {length: offerData.availableRanges.toString()}).keys()]) {
				let rangeInfo = await minter.getOfferRangeInfo(offerIndex, rangeIndex);
				if (Number(rangeInfo.collectionIndex.toString()) === collectionIndex) {
					existingRanges.push({
						endingToken: Number(rangeInfo.tokenEnd.toString()),
						name: rangeInfo.name,
						price: rangeInfo.price.toString(),
						disabled: true,
					})
				}
			}
			setRanges(existingRanges);
			// Lock Ranges
			let existingLocks = [];
			for await (let lockIndex of collectionInfo.locks) {
				let lockInfo = await tokenInstance.getLockedRange(lockIndex);
				if (Number(lockInfo.collectionIndex.toString()) == collectionIndex) {
					existingLocks.push({
						startingToken: lockInfo.startingToken.toString(),
						endingToken: lockInfo.endingToken.toString(),
						countToUnlock: lockInfo.countToUnlock.toString(),
						disabled: true
					})
				}
			}
			setLocks(existingLocks);
		} catch (err) {
			console.error(err);
		}
	}

	const notDisabled = (item) => {
		return !item.disabled;
	}

	useEffect(() => {
		if (tokenInstance && minter) {
			refresher()
		} 
	}, [collectionInfo])

	return <details className='w-100 border border-secondary rounded'>
		<summary>
			Product #{collectionIndex+1}: {collectionInfo.name}
		</summary>
		<div className='row mx-0 px-0'>
			<div className='col-12'>
				<h5> Collection Info </h5>
				First token: {collectionInfo.startingToken}<br/> 
				Last Token: {collectionInfo.endingToken}<br/> 
				Mintable Tokens Left: {collectionInfo.mintableTokensLeft}<br/>
			</div>
			<hr className='w-100' />
			<div className='col-6' style={{position: 'relative'}}>
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
							<th> #  </th>
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
								Price for each
							</th>
						</tr>
					</thead>
					<tbody>
						{ranges.map((item, index, array) => {
							return <RangeManager
										key={index}
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
						if (ranges.length > 0 && ranges[0].disabled) {
							await minter.appendOfferRangeBatch(
								await minter.contractToOfferRange(tokenInstance.address, collectionIndex),
								ranges.filter(notDisabled).map((item, index, array) => {
									if (index === 0) {
										let i = 0;
										for (; i < ranges.length; i++) {
											if (!ranges[i].disabled) {
												return ranges[i - 1].endingToken + 1;
											}
										}
									} else {
										return (Number(array[index - 1].endingToken) + 1)
									}
								}),
								ranges.filter(notDisabled).map((item) => item.endingToken),
								ranges.filter(notDisabled).map((item) => item.price),
								ranges.filter(notDisabled).map((item) => item.name)
							)
						} else {
							await minter.addOffer(
								tokenAddress,
								collectionIndex,
								ranges.map((item, index, array) => index === 0 ? 0 : (Number(array[index - 1].endingToken) + 1)),
								ranges.map((item) => item.endingToken),
								ranges.map((item) => item.price),
								ranges.map((item) => item.name),
								'0xe98028a02832A87409f21fcf4e3a361b5D2391E7');
						}
					} catch (err) {
						console.log(err);
						Swal.fire('Error', err?.data?.message, 'error');
					}
				}} disabled={!ranges.length} className='btn btn-warning'>
					{ranges.length > 0 && ranges[0].disabled ? `Append ${ranges.filter(item => !item.disabled).length} ranges to the marketplace` : `Create offer with ${ranges.length} ranges on the marketplace`}
				</button>
			</div>
			<div className='col-6' style={{position: 'relative'}}>
				<button
					style={{position: 'absolute', right: 0, top: 0}}
					onClick={e => {
						let aux = [...locks];
						aux.push({
							startingToken: 0,
							endingToken: 0,
							countToUnlock: 0,
							disabled: false
						});
						setLocks(aux);
					}}
					className='btn btn-success'>
					<i className='fas fa-plus' />
				</button>
				<h5> Locks </h5>
				<table className='w-100'>
					<thead>
						<tr>
							<th />
							<th> # </th>
							<th>
								Starts
							</th>
							<th>
								Ends
							</th>
							<th>
								Locked Tokens
							</th>
						</tr>
					</thead>
					<tbody>
						{locks.map((item, index, array) => {
							return <LockManager
										locker={locker}
										collectionIndex={collectionIndex}
										disabled={item.disabled}
										index={index}
										array={array}
										deleter={lockDeleter}
										sync={() => {setForceSync(!forceSync)}}
										hardLimit={collectionInfo.endingToken}
									/>
						})}
					</tbody>
				</table>
			</div>
		</div>
	</details>
}

export default CollectionManager;