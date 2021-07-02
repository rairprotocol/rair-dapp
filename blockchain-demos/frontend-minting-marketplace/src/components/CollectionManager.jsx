import {useState} from 'react'

const CollectionManager = ({index, collectionInfo, minter, tokenInstance, tokenAddress}) => {

	const [tokensOnSale, setTokensOnSale] = useState(0);
	const [priceInWei, setPriceInWei] = useState(0);

	return <details >
		<summary>
			<h3 className='d-inline-block'>
				Collection #{index+1}: {collectionInfo.name}
			</h3>
		</summary>
		First token: {collectionInfo.startingToken}<br/> 
		Last Token: {collectionInfo.endingToken}<br/> 
		Mintable Tokens Left: {collectionInfo.mintableTokensLeft}<br/> 
		<hr className='mx-auto w-50' />
		<button onClick={async e => {
			tokenInstance.grantRole(await tokenInstance.MINTER(), minter.address);
		}} className='btn btn-warning'>
			Approve the Marketplace as a Minter!
		</button>
		<br />
		# of tokens to sell: <input className='w-50' value={tokensOnSale} onChange={e => setTokensOnSale(e.target.value)} /><br/>
		Price of each token: <input className='w-50' value={priceInWei} onChange={e => setPriceInWei(e.target.value)} /><br/>
		<button onClick={async e => {
			minter.addCollection(tokenAddress, tokensOnSale, index, priceInWei, '0xe98028a02832A87409f21fcf4e3a361b5D2391E7');
		}} disabled={!tokensOnSale || !priceInWei} className='btn btn-warning'>
			Put {tokensOnSale} NFTs up for sale on the Marketplace at {priceInWei} Wei!
		</button>
		<hr className='mx-auto w-75' />
	</details>
}

export default CollectionManager;