import { useState, useEffect, useCallback } from 'react';
import { useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import Swal from 'sweetalert2'
import VideoList from '../video/videoList';
import ERC721Consumer from '../ConsumerMode/ERC721Consumer.jsx';
import setDocumentTitle from '../../utils/setTitle';

import * as ethers from 'ethers'

import { rFetch } from '../../utils/rFetch.js';

import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
import { Col } from '../../styled-components/nft/Token.styles';
const erc721Abi = ERC721Token.default.abi;

const Token = (props) => {
	const params = useParams();
	const [metadata, setMetadata] = useState({ name: 'Loading...' });
	const [owner, setOwner] = useState('');
	const [name, setName] = useState('');
	const [specificItem, setSpecificItem] = useState([]);

	const { minterInstance, programmaticProvider } = useSelector(state => state.contractStore);

	const fetchData = useCallback(async () => {
		try {
			let data = await rFetch(`/api/contracts/${params.contract}/products/offers`);

			let signer = programmaticProvider;
			if (window.ethereum) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				signer = provider.getSigner(0);
			}

			let RAIR721Instance = new ethers.Contract(params.contract, erc721Abi, signer);
			let offerRangeIndex = (await minterInstance.contractToOfferRange(params.contract, await RAIR721Instance.tokenToProduct(params.identifier))).toString();
			let rawOfferData = await minterInstance.getOfferInfo(offerRangeIndex);

			let offerData = {
				contractAddress: rawOfferData.contractAddress,
				productIndex: rawOfferData.productIndex.toString(),
				nodeAddress: rawOfferData.nodeAddress,
				ranges: rawOfferData.availableRanges.toString(),
				instance: RAIR721Instance
			};

			setSpecificItem({data: offerData, index: Number(offerRangeIndex.toString())});
		} catch (err) {
			console.error(err);
		}
	}, [programmaticProvider, minterInstance, params.contract, params.identifier]);


	useEffect(() => {
		if (minterInstance) {
			fetchData();
		}
	}, [minterInstance, fetchData])

	const getData = useCallback(async () => {
		let aux = await (await fetch(`/api/nft/${params.contract.toLowerCase()}/token/${params.identifier}`)).json()
		if (aux?.result) {
			setMetadata(aux.result.metadata);
			return;
		}
		try {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner(0);
			let instance = new ethers.Contract(params.contract, erc721Abi, signer);
			setName(await instance.name());
			try {
				setOwner(await instance.ownerOf(params.identifier));
			} catch (err) {
				setOwner('No one!');
			}
			let meta = await (await fetch(await instance.tokenURI(params.identifier))).json();
			//console.log(meta);
			setMetadata(meta);
		} catch (err) {
			console.error(err);
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
		setDocumentTitle(`${name !== '' ? name : `${params.contract}:${params.identifier}`}`);
	}, [name, params])

	return <div className='col-12 row px-0 mx-0'>
		<div className='col-6'>
			{metadata?.image ?
				<img className='w-100 h-auto' alt='token' src={metadata.image} />
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
			<h1 className='w-100' style={{ textShadow: '5px 0 20px white, -5px 0 20px white', color: 'black' }}> {metadata ? metadata.name : 'No metadata available'} </h1>
			<small> Owned by: {owner} </small><br />
			<hr className='mb-5' />
			{metadata && <>
				<small> {metadata.description} </small><br />
				{metadata.attributes && <>
					<h5 className='w-100 mt-5'>
						Attributes
					</h5>
					<div className='col-12 row px-0 mx-0'>
						{Object.keys(metadata.attributes).map((item, index) => {
							let itm = metadata.attributes[item];
							//console.log(Object.keys(metadata.attributes[item]))
							if (itm.trait_type === undefined) {
								if (Object.keys(metadata.attributes[item]).length === 1) {
									itm = {
										trait_type: item,
										value: metadata.attributes[item]
									}
								} 
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
				{metadata.features && <>
					<h5 className='w-100 mt-5'>
						Features
					</h5>
					<div className='col-12 row px-0 mx-0'>
						{metadata.features.map((item, index) => {
							let itm = item.split(":");
							//console.log(Object.keys(metadata.attributes[item]))
							return <div key={index} className='col-4 my-2'>
								<div style={{
									backgroundColor: '#F77A',
									borderRadius: '10px',
									border: 'solid red 1px',
									height: '5vh'
								}}
									className='w-100 h-100 py-auto'>
									{itm[0]}: <b>{itm[1]}</b>
								</div>
							</div>
						})}
					</div>
				</>}
				{metadata.image && <div className='col-12'>
					<button disabled className='btn btn-primary' id='button_buy_token'>
						Buy
					</button>
				</div>}
			</>}
		</div>
		<Col
			width='100%'
			direction='row'
		>
			<Col width='50%' direction='column'>
				<h1>
					Associated Files
				</h1>
				<VideoList endpoint={`/api/nft/${params.contract}/:product/files/${params.identifier}`} />
			</Col>
			<Col width='50%' align='center'>
				{specificItem?.data && 
					<ERC721Consumer
						offerInfo={specificItem.data}
						index={specificItem.index}
						width='12'
					/>}
			</Col>
		</Col>

	</div>
}

export default Token;