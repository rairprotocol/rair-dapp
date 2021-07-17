import {useState, useEffect, useCallback} from 'react'
import * as ethers from 'ethers'

import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
import CollectionManager from './CollectionManager.jsx';

const erc721Abi = ERC721Token.default.abi;

const ERC721Manager = ({tokenAddress, minter, account}) => {

	const [erc721Instance, setERC721Instance] = useState();
	const [tokenInfo, setTokenInfo] = useState();
	
	const [collectionName, setCollectionName] = useState('');
	const [collectionLength, setCollectionLength] = useState(0);
	const [collectionResaleLimit, setCollectionResaleLimit] = useState(0);
	const [existingCollectionsData, setExistingCollectionsData] = useState();

	const refreshData = async () => {
		let tokInfo = {
			name: await erc721Instance.name(),
			symbol: await erc721Instance.symbol(),
			totalSupply: (await erc721Instance.totalSupply()).toString(),
			collectionCount: (await erc721Instance.getCollectionCount()).toString(),
			balance: (await erc721Instance.balanceOf(account)).toString(),
			address: erc721Instance.address
		} 
		setTokenInfo(tokInfo)
		let collectionsData = [];
		for await (let index of [...Array.apply(null, {length: tokInfo.collectionCount}).keys()]) {
			let colData = (await erc721Instance.getCollection(index));
			collectionsData.push({
				name: colData.collectionName,
				startingToken: colData.startingToken.toString(),
				endingToken: colData.endingToken.toString(),
				mintableTokensLeft: colData.mintableTokensLeft.toString()
			});
		}
		setExistingCollectionsData(collectionsData);
		console.log('fetched');
	};

	useEffect(() => {
		if (erc721Instance) {
			console.log('Fetching')
			refreshData();
		}
	}, [erc721Instance])

	useEffect(() => {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);
		let erc721 = new ethers.Contract(tokenAddress, erc721Abi, signer);
		setERC721Instance(erc721);
	}, [])
	
	return <details className='text-center border border-white rounded' style={{position: 'relative'}}>
		<summary className='py-1'>
			<b>
				ERC721 {tokenInfo && tokenInfo.name}<br />
			</b>
		</summary>
		Contract Address: <b>{tokenAddress}</b>
		<button
			style={{position: 'absolute', left: 0, top: 0}}
			onClick={refreshData}
			className='btn btn-dark'>
			<i className='fas fa-redo' />
		</button>
		<br />
		<br />
		{tokenInfo && erc721Instance ? <div className='row mx-0 px-0'>
			<div className='col-12 col-md-6 border border-secondary rounded'>
				<h5> ERC721 Info </h5>
				Name: <b>{tokenInfo.name}</b><br />
				Symbol: {tokenInfo.symbol}<br /><br />
				Total Supply: {tokenInfo.totalSupply}<br />
				Collections Created: {tokenInfo.collectionCount}<br />
				Current Balance: {tokenInfo.balance}<br />
			</div>
			<div className='col-12 col-md-6 border border-secondary rounded'>
				<h5> Create a new collection </h5>
				Collection Name: <input className='w-50' value={collectionName} onChange={e => setCollectionName(e.target.value)} />
				<br/>
				Collection's length: <input className='w-50' type='number' value={collectionLength} onChange={e => setCollectionLength(e.target.value)} />
				<br />
				Resale starts at: <input className='w-50' type='number' value={collectionResaleLimit} onChange={e => setCollectionResaleLimit(e.target.value)} />
				<br />
				<button disabled={collectionName === '' || collectionLength === 0 || collectionResaleLimit === 0} onClick={() => {
					erc721Instance.createCollection(collectionName, collectionLength, collectionResaleLimit);
				}} className='btn btn-success'>
					Create {collectionLength} tokens under collection {collectionName}
				</button>
			</div>
			<div className='col-12 col-md-6 border border-secondary rounded'>
				To sell your unminted collections<br />
				<button onClick={async e => {
					erc721Instance.grantRole(await erc721Instance.MINTER(), minter.address);
				}} className='btn btn-warning'>
					Approve the Marketplace as a Minter!
				</button>
				<br />
				(once)
			</div>
			<div className='col-12 col-md-6 border border-secondary rounded'>
				{existingCollectionsData && <>
					<h5> Existing Collections </h5>
					
					{existingCollectionsData.map((item, index) => {
						return <CollectionManager
									key={index}
									index={index}
									collectionInfo={item}
									tokenInstance={erc721Instance}
									tokenAddress={tokenInfo.address}
									minter={minter} />
					})}
				</>}
			</div>
		</div> : <>Fetching info...</>}
	</details>
}

export default ERC721Manager;