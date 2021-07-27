import {useState, useEffect} from 'react'

import * as ethers from 'ethers'

import * as MinterMarketplace from '../contracts/Minter_Marketplace.json';
import * as ERC721Token from '../contracts/RAIR_ERC721.json';

import ERC721Consumer from './ConsumerMode/ERC721Consumer.jsx';

const minterAbi = MinterMarketplace.default.abi;
const erc721Abi = ERC721Token.default.abi;

const ConsumerMode = ({account, addresses}) => {

	const [minterInstance, setMinterInstance] = useState();
	const [offerCount, setOfferCount] = useState();
	const [salesCount, setSalesCount] = useState();
	const [collectionsData, setCollectionsData] = useState();

	const fetchData = async () => {
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let aux = (await minterInstance.getOfferCount()).toString();
 		setSalesCount((await minterInstance.openSales()).toString());
		setOfferCount(aux);

		let offerData = [];
		for await (let index of [...Array.apply(null, {length: aux}).keys()]) {
			let data = await minterInstance.getOfferInfo(index);
			offerData.push({
				contractAddress: data.contractAddress,
				productIndex: data.productIndex.toString(),
				nodeAddress: data.nodeAddress,
				ranges: data.availableRanges.toString(),
				instance: new ethers.Contract(data.contractAddress, erc721Abi, signer)
			})
		}
		setCollectionsData(offerData);
	}

	useEffect(() => {
		// Ethers Connection
		let provider = new ethers.providers.Web3Provider(window.ethereum);
		let signer = provider.getSigner(0);

		let ethersMinterInstance = new ethers.Contract(addresses.minterMarketplace, minterAbi, signer);
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
		
		{
			// Initializer, do not use!
			false && <button
				onClick={async e => await minterInstance.initialize('0xEC30759D0A3F3CE0A730920DC29d74e441f492C3', 9000, 1000)}
				style={{position: 'absolute', left: 0}}
				className='btn btn-success'>
				<i className='fas fa-arrow-up' />
			</button>
		}
		{collectionsData && <div className='row mx-0 px-0'>
			<div className='col-12'>
				<h5>Minter Marketplace</h5>
				<small>
					{offerCount} Offers found<br/>
					with {salesCount} price ranges!
				</small>
			</div>
			<br/>
			{collectionsData.map((item, index) => {
				return <ERC721Consumer
					key={index}
					index={index}
					offerInfo={item}
					account={account}
					minter={minterInstance} />
			})}
		</div>}
	</>
}

export default ConsumerMode;