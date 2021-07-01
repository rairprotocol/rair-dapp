import {useState, useEffect} from 'react'

const ERC721Manager = ({tokenInfo, account, minter, index}) => {
	
	const [balance, setBalance] = useState();

	useEffect(() => {
		const aux = async () => {
			let balances = [];
			let tokensOwned = (await tokenInfo.instance.balanceOf(account)).toString();
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
	}, [tokenInfo, account])
	
	return <details className='text-center'>
		<summary>
			<h3 className='d-inline-block'>
				Sale #{index + 1}
			</h3>
		</summary>
		Contract Address: {tokenInfo.address}<br />
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
		<button onClick={async e => {
			await minter.buyToken(index, {value: tokenInfo.price});
		}} className='btn btn-success'>
			Mint a new token!
		</button>
		<hr className='w-50 mx-auto' />
	</details>
}

export default ERC721Manager;