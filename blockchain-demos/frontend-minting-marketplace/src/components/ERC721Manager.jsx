import {useState, useEffect} from 'react'

import CollectionManager from './CollectionManager.jsx';

const ERC721Manager = ({tokenInfo, minter, account}) => {
	
	const [collectionName, setCollectionName] = useState('');
	const [collectionLength, setCollectionLength] = useState(0);
	const [collectionResaleLimit, setCollectionResaleLimit] = useState(0);
	const [existingCollectionsData, setExistingCollectionsData] = useState();

	useEffect(() => {
		const aux = async () => {
			let collectionsData = [];
			for await (let index of [...Array.apply(null, {length: tokenInfo.collectionCount}).keys()]) {
				console.log("Doing", index, "of", tokenInfo.collectionCount);
				let colData = (await tokenInfo.instance.getCollection(index));
				collectionsData.push({
					name: colData.collectionName,
					startingToken: colData.startingToken.toString(),
					endingToken: colData.endingToken.toString(),
					mintableTokensLeft: colData.mintableTokensLeft.toString()
				});
			}
			setExistingCollectionsData(collectionsData);
		};
		aux();
	}, [tokenInfo])
	
	return tokenInfo && <details className='text-center'>
		<summary>
			<h3 className='d-inline-block'>
				Address: {tokenInfo.address}
			</h3>
		</summary>
		Name: <b>{tokenInfo.name}</b><br />
		Symbol: {tokenInfo.symbol}<br /><br />
		Total Supply: {tokenInfo.totalSupply}<br />
		Collections Created: {tokenInfo.collectionCount}<br />
		Current Balance: {tokenInfo.balanceOf}<br />
		<hr className='mx-auto w-75' />
		{existingCollectionsData && <>
			<h5> Collections </h5>
			{existingCollectionsData.map((item, index) => {
				return <CollectionManager
							key={index}
							index={index}
							collectionInfo={item}
							tokenInstance={tokenInfo.instance}
							tokenAddress={tokenInfo.address}
							minter={minter} />
			})}
		</>}
		<hr className='mx-auto w-75' />
		Collection Name: <input className='w-50' value={collectionName} onChange={e => setCollectionName(e.target.value)} />
		<br/>
		Collection's length: <input className='w-50' type='number' value={collectionLength} onChange={e => setCollectionLength(e.target.value)} />
		<br />
		Resale starts at: <input className='w-50' type='number' value={collectionResaleLimit} onChange={e => setCollectionResaleLimit(e.target.value)} />
		<br />
		<button disabled={collectionName === '' || collectionLength === 0 || collectionResaleLimit === 0} onClick={() => {
			tokenInfo.instance.createCollection(collectionName, collectionLength, collectionResaleLimit);
		}} className='btn btn-success'>
			Create {collectionLength} tokens under collection {collectionName}
		</button>
		<hr className='w-100' />
	</details>
}

export default ERC721Manager;