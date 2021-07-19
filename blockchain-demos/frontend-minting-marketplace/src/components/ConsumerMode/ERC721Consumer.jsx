import {useState, useEffect} from 'react'

const ERC721Manager = ({tokenInfo, account, minter, index}) => {
	
	const [balance, setBalance] = useState();
	const [collectionName, setCollectionName] = useState();
	const [contractName, setContractName] = useState();
	const [nextMintableToken, setNextMintableToken] = useState();
	const [specificIndex, setSpecificIndex] = useState(0);

	useEffect(() => {
		const aux = async () => {
			let balances = [];
			let tokensOwned = (await tokenInfo.instance.balanceOf(account)).toString();
			setCollectionName((await tokenInfo.instance.getCollection(tokenInfo.collectionIndex)).collectionName);
			setNextMintableToken((await tokenInfo.instance.getNextSequentialIndex(tokenInfo.collectionIndex)).toString());
			setContractName(await tokenInfo.instance.name());
			if (tokensOwned > 0) {
				for await (let index of [...Array.apply(null, {length: tokensOwned}).keys()]) {
					let token = (await tokenInfo.instance.tokenOfOwnerByIndex(account, index)).toString();
					if ((await tokenInfo.instance.tokenToCollection(token)).toString() === tokenInfo.collectionIndex) {
						balances.push(token);
					}
				}
			}
			setBalance(balances);
		};
		aux();
	}, [tokenInfo, account]);

	useEffect(() => {
		tokenInfo.instance.on('Transfer(address,address,uint256)', async (from, to, tokenId) => {
			setNextMintableToken((await tokenInfo.instance.getNextSequentialIndex(tokenInfo.collectionIndex)).toString());
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
			<h5 style={{color: Number(tokenInfo.tokensAllowed) === 0 ? 'red' : 'inherit'}}>
				({tokenInfo.tokensAllowed} Left!)
			</h5>
			{Number(tokenInfo.tokensAllowed) !== 0 && <small>
				{tokenInfo.price} Wei
			</small>}
		</summary>
		Contract Address: {tokenInfo.address}<br />
		<br />
		Collection Index: {tokenInfo.collectionIndex}<br />
		Tokens allowed to sell: {tokenInfo.tokensAllowed}<br />
		Each token is sold for {tokenInfo.price} Wei
		<hr className='w-75 mx-auto' />
		{balance && <>
			You own {balance.length} tokens from this collection<br/>
			{balance.map((item, index) => {
				return <p className='d-block'>
					{tokenInfo.address}:<b>{item}</b>
				</p>
			})}
		</>}
		<br />
		{Number(tokenInfo.tokensAllowed) !== 0 && <>
			<button onClick={async e => {
				await minter.buyToken(index, nextMintableToken, {value: tokenInfo.price});
			}} className='btn btn-success'>
				Buy token #{nextMintableToken} for {tokenInfo.price} Wei!
			</button>			
			<small>
				<details>
					<summary>
						Mint a specific token!
					</summary>
					<input type='number' value={specificIndex} onChange={e => setSpecificIndex(e.target.value)} />
					<br />
					<button disabled={nextMintableToken > specificIndex} onClick={async e => {
						await minter.buyToken(index, specificIndex, {value: tokenInfo.price});
					}} className='btn btn-warning'>
						Buy token #{specificIndex} for {tokenInfo.price} Wei!
					</button>
				</details>
			</small>
		</>}
		<hr className='w-50 mx-auto' />
	</details>
}

export default ERC721Manager;