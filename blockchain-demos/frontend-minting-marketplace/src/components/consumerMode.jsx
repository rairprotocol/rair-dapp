import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';

import * as ethers from 'ethers'
import {erc721Abi} from '../contracts';

import ERC721Consumer from './ConsumerMode/ERC721Consumer.jsx';

const ConsumerMode = ({ addresses }) => {

	const [offerCount, setOfferCount] = useState();
	const [salesCount, setSalesCount] = useState();
	const [collectionsData, setCollectionsData] = useState();
	const [refetchingFlag, setRefetchingFlag] = useState(false);

	const { minterInstance, programmaticProvider } = useSelector(state => state.contractStore);

	const fetchData = useCallback(async () => {
		setRefetchingFlag(true);
		let signer = programmaticProvider;
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}
		let aux = (await minterInstance.getOfferCount()).toString();
		setSalesCount((await minterInstance.openSales()).toString());
		setOfferCount(aux);

		let offerData = [];
		for await (let index of [...Array.apply(null, { length: aux }).keys()]) {
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
		setRefetchingFlag(false);
	}, [programmaticProvider, minterInstance])

	useEffect(() => {
		if (minterInstance) {
			fetchData();
		}
	}, [minterInstance, fetchData])

	return <div className='col-12' style={{ position: 'relative' }}>
		<button onClick={fetchData} disabled={refetchingFlag} style={{ position: 'absolute', right: 0, color: 'inherit' }} className='btn btn-warning'>
			{refetchingFlag ? '...' : <i className='fas fa-redo' />}
		</button>

		{
			// Initializer, do not use!
			false && <button
				onClick={async e => await minterInstance.initialize('0xEC30759D0A3F3CE0A730920DC29d74e441f492C3', 9000, 1000)}
				style={{ position: 'absolute', left: 0 }}
				className='btn btn-success'>
				<i className='fas fa-arrow-up' />
			</button>
		}
		{collectionsData && <div className='row mx-0 px-0'>
			<div className='col-12'>
				<h5>Minter Marketplace</h5>
				<small>
					{offerCount} Offers found<br />
					with {salesCount} price ranges!
				</small>
			</div>
			<br />
			{collectionsData.map((item, index) => {
				return (
					<ERC721Consumer
						key={index}
						index={index}
						offerInfo={item}
					/>
				)
			})}
		</div>}
	</div>
}

export default ConsumerMode;