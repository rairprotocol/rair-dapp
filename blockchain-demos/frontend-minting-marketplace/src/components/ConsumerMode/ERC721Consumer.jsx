import {useState, useEffect} from 'react'
import Swal from 'sweetalert2';

const Range = ({start, end, name, allowed, price, tokenInstance, minterInstance, productIndex, offerIndex, rangeIndex}) => {
	const [next, setNext] = useState();
	const [specificIndex, setSpecificIndex] = useState(0);

	const refreshData = async () => {
		console.log(productIndex, start, end)
		setNext((await tokenInstance.getNextSequentialIndex(productIndex, start, end)).toString());
	}

	useEffect(() => {
		if (tokenInstance) {
			tokenInstance.on('Transfer(address,address,uint256)', async (from, to, tokenId) => {
				refreshData();
			})
		}
		refreshData();
	}, []);
	
	return <div style={{position: 'relative'}} className='w-100 my-2'>
		<b>{name}</b>: {allowed} tokens at {price} each!
		<br />
		<div style={{position: 'absolute', left: 0}}>
			{start}...
		</div>
		<div style={{position: 'absolute', right: 0}}>
			...{end}
		</div>
		<button onClick={async e => {
			await minterInstance.buyToken(offerIndex, rangeIndex, next, {value: price});
		}} className='btn btn-success py-0'>
			Buy token #{next} for {price} Wei!
		</button>
		<progress className='w-100' value={(end - start + 1) - allowed} max={end} />
		{allowed} tokens left!
		{Number(allowed) !== 0 && <>
			<small>
				<details>
					<summary>
						Mint a specific token!
					</summary>
					<input type='number' value={specificIndex} onChange={e => setSpecificIndex(e.target.value)} />
					<br />
					<button disabled={next > specificIndex} onClick={async e => {
						try {
							await minterInstance.buyToken(offerIndex, rangeIndex, specificIndex, {value: price});
						} catch (err) {
							Swal.fire('Error', err.data.message, 'error');
						}
					}} className='btn py-0 btn-warning'>
						Buy token #{specificIndex} for {price} Wei!
					</button>
				</details>
			</small>
		</>}
		<br />
		<hr className='w-100'/>
	</div>
}

const ERC721Manager = ({offerInfo, account, minter, index}) => {
	
	const [balance, setBalance] = useState();
	const [collectionName, setCollectionName] = useState();
	const [contractName, setContractName] = useState();
	const [nextMintableToken, setNextMintableToken] = useState();
	const [rangeInfo, setRangeInfo] = useState([]);

	const refreshData = async () => {
		let balances = [];
		let tokensOwned = (await offerInfo.instance.balanceOf(account)).toString();
		setCollectionName((await offerInfo.instance.getCollection(offerInfo.productIndex)).collectionName);
		//setNextMintableToken((await offerInfo.instance.getNextSequentialIndex(offerInfo.productIndex)).toString());
		setContractName(await offerInfo.instance.name());

		let ranges = [];
		for await (let rangeIndex of [...Array.apply(null, {length: offerInfo.ranges}).keys()]) {
			let data = await minter.getOfferRangeInfo(index, rangeIndex);
			ranges.push({
				name: data.name,
				price: data.price.toString(),
				start: data.tokenStart.toString(),
				end: data.tokenEnd.toString(),
				allowed: data.tokensAllowed.toString()
			})
		}
		setRangeInfo(ranges);
		if (tokensOwned > 0) {
			for await (let index of [...Array.apply(null, {length: tokensOwned}).keys()]) {
				let token = (await offerInfo.instance.tokenOfOwnerByIndex(account, index)).toString();
				if ((await offerInfo.instance.tokenToCollection(token)).toString() === offerInfo.productIndex) {
					balances.push({
						token,
						internalIndex: (await offerInfo.instance.tokenToCollectionIndex(token)).toString()
					});
				}
			}
		}
		setBalance(balances);
	}

	useEffect(() => {
		refreshData();
	}, [offerInfo, account]);
	
	return <details style={{position: 'relative'}} className='col-12 col-md-4 bg-dark py-4 text-white border border-white rounded'>
		<summary>
			<div style={{position: 'absolute', top: 0, right: '2vh'}}>
				#{index + 1}<br />
			</div>
			<h5 className='d-inline-block'>
				{collectionName}
			</h5>
			<div style={{position: 'absolute', top: 0, left: '5vh'}}>
				@{contractName}
			</div>
		</summary>
		<button onClick={refreshData} style={{position: 'absolute', left: 0, top: 0}} className='btn py-0 btn-dark'>
			<i className='fas fa-redo' />
		</button>
		<small>Contract Address: <b>{offerInfo.contractAddress}</b></small><br />
		<small>Product Index: {offerInfo.productIndex}</small><br />
		<br />
		{rangeInfo.map((item, rangeIndex) => {
			return <Range
				{...item}
				key={rangeIndex}
				tokenInstance={offerInfo.instance}
				minterInstance={minter}
				productIndex={offerInfo.productIndex}
				rangeIndex={rangeIndex}
				offerIndex={index}
			/>
		})}
		<hr className='w-75 mx-auto' />
		{balance && <>
			You own {balance.length} tokens from this collection<br/>
			{balance.map((item, index) => {
				return <abbr title={`${offerInfo.contractAddress}:${item.token}`}>
					<h5>{item.internalIndex}</h5>
				</abbr>
			})}
		</>}
		<br />
		<hr className='w-50 mx-auto' />
	</details>
}

export default ERC721Manager;