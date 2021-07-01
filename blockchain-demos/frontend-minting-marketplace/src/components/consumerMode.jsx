import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as ERC721Token from '../contracts/RAIR_ERC721.json';

import ERC721Consumer from './ERC721Consumer.jsx';

const minterAbi = MinterMarketplace.default.abi;
const erc721Abi = ERC721Token.default.abi;

const minterMarketplaceAddress = '0xcB07dFad44C2b694474E1ea6FEc1729b4c6df31B';

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

	return <>
		<button onClick={fetchData} style={{position: 'absolute', right: 0}} className='btn btn-warning'>
			{collectionsData ? 'Refresh Marketplace Data!' : 'Get Marketplace Data!'}
		</button>
		{collectionsData && <>
			<h5>Marketplace</h5>
			Collections up for sale: {collectionsData.length}
			<br/>
			{collectionsData.map((item, index) => {
				return <ERC721Consumer key={index} index={index} tokenInfo={item} account={account} minter={minterInstance} />
			})}
		</>}
	</>
}

export default ConsumerMode;