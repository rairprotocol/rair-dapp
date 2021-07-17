import {useState} from 'react'

const CollectionManager = ({index, collectionInfo, minter, tokenInstance, tokenAddress}) => {

	const [tokensOnSale, setTokensOnSale] = useState(0);
	const [priceInWei, setPriceInWei] = useState(0);

	return <details className='w-100 border border-secondary rounded'>
		<summary>
			Collection #{index+1}: {collectionInfo.name}
		</summary>
		<div className='row mx-0 px-0'>
			<div className='col-12 col-md-6'>
				<h5> Collection Info </h5>
				First token: {collectionInfo.startingToken}<br/> 
				Last Token: {collectionInfo.endingToken}<br/> 
				Mintable Tokens Left: {collectionInfo.mintableTokensLeft}<br/> 
			</div>
			<div className='col-12 col-md-6'>
				<h5> On the Minter Marketplace </h5>
				Amount: <input className='w-50' value={tokensOnSale} onChange={e => setTokensOnSale(e.target.value)} /><br/>
				Price: <input className='w-50' value={priceInWei} onChange={e => setPriceInWei(e.target.value)} /><br/>
				<button onClick={async e => {
					await minter.addCollection(tokenAddress, tokensOnSale, index, priceInWei, '0xe98028a02832A87409f21fcf4e3a361b5D2391E7');
				}} disabled={!tokensOnSale || !priceInWei} className='btn btn-warning'>
					Put {tokensOnSale} NFTs up for sale on the Marketplace at {priceInWei} Wei (each)
				</button>
			</div>
		</div>
	</details>
}

export default CollectionManager;