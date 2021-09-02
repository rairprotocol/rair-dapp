import { useState, useEffect, useCallback } from 'react';
import { useHistory, useParams } from "react-router-dom";
import Swal from 'sweetalert2'
import VideoList from '../video/videoList';
import ERC721Consumer from '../ConsumerMode/ERC721Consumer.jsx';

import * as ethers from 'ethers'

import * as MinterMarketplace from '../../contracts/Minter_Marketplace.json';
import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
const minterAbi = MinterMarketplace.default.abi;
const erc721Abi = ERC721Token.default.abi;



const MyNFTs = ({
	account,
	addresses,
	programmaticProvider,
}) => {
	const router = useHistory()
	const url = router.location.pathname.split('/')[2]
	const params = useParams();
	const [metadata, setMetadata] = useState({ name: 'Loading...' });
	const [owner, setOwner] = useState('');
	const [name, setName] = useState('');
	const [specificItem, setSpecificItem] = useState([]);

	const [minterInstance, setMinterInstance] = useState();
	const [offerCount, setOfferCount] = useState();
	const [salesCount, setSalesCount] = useState();
	const [collectionsData, setCollectionsData] = useState([]);
	const [refetchingFlag, setRefetchingFlag] = useState(false);

	useEffect(() => {
		let signer = programmaticProvider;
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}
		if (addresses) {
			let ethersMinterInstance = new ethers.Contract(addresses.minterMarketplace, minterAbi, signer);
			setMinterInstance(ethersMinterInstance);
		} else {
			Swal.fire('Error', 'Network change detected in metamask', 'error');
		}
	}, [addresses, programmaticProvider])

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
	}, [minterInstance])

	const getData = useCallback(async () => {
		try {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner(0);
			let instance = new ethers.Contract(params.contract, erc721Abi, signer);
			setName(await instance.name());
			setOwner(await instance.ownerOf(params.identifier));
			let meta = await (await fetch(await instance.tokenURI(params.identifier))).json();
			setMetadata(meta);
		} catch (err) {
			Swal.fire('Error', "We couldn't fetch the token's Metadata", 'error');
			setMetadata({
				name: 'No title found',
				description: 'No description found'
			})
		}
	}, [params.contract, params.identifier])

	useEffect(() => {
		getData();
	}, [getData]);

	useEffect(() => {
		const itemS = collectionsData.filter(item => item.contractAddress === url)
		setSpecificItem(itemS);
	}, [collectionsData])

	return <div className='col-12 row px-0 mx-0'>
		<div className='col-6'>
			{metadata?.image ?
				<img className='w-100 h-auto' src={metadata.image} />
				:
				<div className='w-100 bg-secondary' style={{
					position: 'relative',
					borderRadius: '10px',
					height: '80vh'
				}}>
					<i
						className='fas fa-image h1'
						style={{ position: 'absolute', top: '50%' }} />
				</div>
			}
		</div>
		<div className='col-6'>
			<hr />
			<small> {params.contract}:{params.identifier} ({name}) </small><br />
			<h1 className='w-100' style={{ textShadow: '5px 0 20px white, -5px 0 20px white', color: 'black' }}> {metadata.name} </h1>
			<small> Owned by: {owner} </small><br />
			<hr className='mb-5' />
			<small> {metadata.description} </small><br />
			{metadata.attributes && <>
				<h5 className='w-100 mt-5'>
					Attributes
				</h5>
				<div className='col-12 row px-0 mx-0'>
					{Object.keys(metadata.attributes).map((item, index) => {
						let itm = metadata.attributes[item];
						console.log(Object.keys(metadata.attributes[item]))
						if (Object.keys(metadata.attributes[item]).length === 1) {
							itm = {
								trait_type: item,
								value: metadata.attributes[item]
							}
						}
						return <div key={index} className='col-4 my-2'>
							<div style={{
								backgroundColor: '#77FA',
								borderRadius: '10px',
								border: 'solid blue 1px',
								height: '5vh'
							}}
								className='w-100 h-100 py-auto'>
								{itm.trait_type}: <b>{itm.value}</b>
							</div>
						</div>
					})}
				</div>
			</>}
			{metadata.image && <div className='col-12'>
				<button className='btn btn-primary' id='button_buy_token'>
					Buy
				</button>
			</div>}

		</div>
		<div>
			<h1>list videos</h1>
			<VideoList />
		</div>
		<div style={{
			width: '100%',
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			margin: 'auto',
			marginTop: '20px'
		}}>
			{specificItem.map((item, index) => (
				<ERC721Consumer
					key={index}
					index={index}
					offerInfo={item}
					account={account}
					minter={minterInstance}
					width='12'
				/>
			)
			)}
		</div>
	</div>
}

export default MyNFTs;