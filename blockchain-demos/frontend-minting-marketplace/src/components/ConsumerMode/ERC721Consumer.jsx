import {useState, useEffect} from 'react'

const ERC721Manager = ({offerInfo, account, minter, index}) => {
	
	const [balance, setBalance] = useState();
	const [collectionName, setCollectionName] = useState();
	const [contractName, setContractName] = useState();
	const [nextMintableToken, setNextMintableToken] = useState();
	const [specificIndex, setSpecificIndex] = useState(0);
	const [rangeInfo, setRangeInfo] = useState([]);

	useEffect(() => {
		const aux = async () => {
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
						balances.push(token);
					}
				}
			}
			setBalance(balances);
		};
		aux();
	}, [offerInfo, account]);

	useEffect(() => {
		offerInfo.instance.on('Transfer(address,address,uint256)', async (from, to, tokenId) => {
			setNextMintableToken((await offerInfo.instance.getNextSequentialIndex(offerInfo.productIndex)).toString());
		})
	}, [])
	
	return <details style={{position: 'relative'}} className='col-12 col-md-4 bg-dark py-4 text-white border border-white rounded'>
		<summary>
			<div style={{position: 'absolute', top: 0, right: '2vh'}}>
				#{index + 1}<br />
			</div>
			<h5 className='d-inline-block'>
				{collectionName}
			</h5>
			<div style={{position: 'absolute', top: 0, left: '2vh'}}>
				@{contractName}
			</div>
		</summary>
		<small>Contract Address: <b>{offerInfo.contractAddress}</b></small><br />
		<small>Product Index: {offerInfo.productIndex}</small><br />
		<br />
		{rangeInfo.map((item, rangeIndex) => {
			return <div style={{position: 'relative'}} className='w-100 my-2'>
				<b>{item.name}</b>: {item.allowed} tokens at {item.price} each!
				<br />
				<div style={{position: 'absolute', left: 0}}>
					{item.start}...
				</div>
				<div style={{position: 'absolute', right: 0}}>
					...{item.end}
				</div>
				<button onClick={async e => {
					await minter.buyToken(index, rangeIndex, nextMintableToken, {value: offerInfo.price});
				}} className='btn btn-success py-0'>
					Buy token #{nextMintableToken} for {offerInfo.price} Wei!
				</button>
				<br />
				<progress className='w-100' value={item.start + (item.end - item.allowed)} max={item.end} />
				{item.allowed} tokens left!
				<hr className='w-100'/>
			</div>
		})}
		<hr className='w-75 mx-auto' />
		{balance && <>
			You own {balance.length} tokens from this collection<br/>
			{balance.map((item, index) => {
				return <p className='d-block'>
					{offerInfo.contractAddress}:<b>{item}</b>
				</p>
			})}
		</>}
		<br />
		{Number(offerInfo.tokensAllowed) !== 0 && <>
			<small>
				<details>
					<summary>
						Mint a specific token!
					</summary>
					<input type='number' value={specificIndex} onChange={e => setSpecificIndex(e.target.value)} />
					<br />
					<button disabled={nextMintableToken > specificIndex} onClick={async e => {
						console.log(minter.functions);
						//await minter.buyToken(index, specificIndex, {value: offerInfo.price});
					}} className='btn btn-warning'>
						Buy token #{specificIndex} for {offerInfo.price} Wei!
					</button>
				</details>
			</small>
		</>}
		<hr className='w-50 mx-auto' />
	</details>
}

export default ERC721Manager;