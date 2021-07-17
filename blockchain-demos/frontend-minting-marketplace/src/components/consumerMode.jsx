import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as ERC721Token from '../contracts/RAIR_ERC721.json';

import ERC721Consumer from './ConsumerMode/ERC721Consumer.jsx';

const minterAbi = MinterMarketplace.default.abi;
const erc721Abi = ERC721Token.default.abi;

const minterMarketplaceAddress = '0x2f3234af29Cd5E8976D206099DA3998E6B8D3e7b';

const ConsumerMode = ({account}) => {

	const [minterInstance, setMinterInstance] = useState();
	const [collectionsData, setCollectionsData] = useState();

	const fetchData = async () => {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let collectionData = [];
		for await (let index of [...Array.apply(null, {length: (await minterInstance.getCollectionCount()).toString()}).keys()]) {
			let data = await minterInstance.getCollectionInfo(index);
			collectionData.push({
				instance: new ethers.Contract(data[0], erc721Abi, signer),
				address: data[0],
				collectionIndex: data[1].toString(),
				tokensAllowed: data[2].toString(),
				price: data[3].toString()
			})
		}
		setCollectionsData(collectionData);
	}

	useEffect(() => {
		// Ethers Connection
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let ethersMinterInstance = new ethers.Contract(minterMarketplaceAddress, minterAbi, signer);
		setMinterInstance(ethersMinterInstance);
	}, [])

	useEffect(() => {
		if (minterInstance) {
			fetchData();
		}
	}, [minterInstance])

	return <>
		<button onClick={fetchData} style={{position: 'absolute', right: 0}} className='btn btn-warning'>
			<i className='fas fa-redo' />
		</button>
		{collectionsData && <div className='row mx-0 px-0'>
			<div className='col-12'>
				<h5>Minter Marketplace</h5>
				<small>Collections up for sale: {collectionsData.length}</small>
			</div>
			<br/>
			{collectionsData.map((item, index) => {
				return <ERC721Consumer
					key={index}
					index={index}
					tokenInfo={item}
					account={account}
					minter={minterInstance} />
			})}
		</div>}
	</>
}

export default ConsumerMode;