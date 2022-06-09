//@ts-nocheck
import {useState, useEffect, useCallback} from 'react';
import InputField from '../common/InputField';
import { Link, useParams } from "react-router-dom";
import {rFetch} from '../../utils/rFetch';
import setDocumentTitle from '../../utils/setTitle';
import {useSelector} from 'react-redux';
import { erc721Abi } from '../../contracts'
import chainData from '../../utils/blockchainData';
import swal from 'sweetalert2';

import MetadataSender from './metadataSender';
import axios from 'axios';
import { TCheckMetadataOnBlockchain, TNftItemResponse } from '../../axios.responseTypes';

/*
	"metadata": {
        "artist": "none",
        "external_url": "none",
        "name": "CoinAgenda Monaco 2021 #0",
        "description": "unique1",
        "image": "speaker.png",
        "attributes": {
          "attribute1": "Speaker",
          "attribute2": "fffffff",
          "attribute3": "john doe"
        }
      },
*/

/// OpenSea Standard
/*
	"tokenId": 9,
	"name": "BASTARD GAN PUNK V2 #9",
	"description": "BOOMER, BASTARD KICK, IT'S BASTARD KICK,\nSHIT, BASTARD PULL, IT'S BASTARD KICK\nARE YOU HAPPY NOW?\n",
	"image": "https://ipfs.io/ipfs/QmTeST1bcYjm22fubpqLAfZFV1CV9jTECgcp2J87Pr21Gu",
	"external_url": "https://www.bastardganpunks.club/v2/9",
	"attributes": [{
			"trait_type": "HYPE TYPE",
			"value": "CALM AF (STILL)"
		}, {
			"trait_type": "BASTARDNESS",
			"value": "L4M3R BASTARD"
		}, {
			"trait_type": "SONG WORD COUNT",
			"value": 16
		}, {
			"trait_type": "TYPE",
			"value": "APE"
		}, {
			"trait_type": "BACKGROUND",
			"value": "SOLID AF"
		}, {
			"trait_type": "FACING DIRECTION",
			"value": "RIGHT"
		}, {
			"trait_type": "BAD HABIT(S)",
			"value": "EDIBLES???"
		}]
*/

const AttributeRow = ({array, index, deleter, refetch}) => {
	const [name, setName] = useState(array[index].trait_type);
	const [value, setValue] = useState(array[index].value);

	const updateName = (value) => {
		setName(value)
		if (array[index].trait_type !== value) {
			array[index].trait_type = value;
			refetch();
		}
	}

	const updateValue = (value) => {
		setValue(value)
		if (array[index].value !== value) {
			array[index].value = value;
			refetch();
		}
	}

	useEffect(() => {
		setName(array[index].trait_type);
		setValue(array[index].value);
	}, [index, array]);

	return <div className='row px-0 mx-0 col-12'>
		<div className='col-5 mx-0 px-0'>
			<InputField
				placeholder='Name'
				getter={name}
				setter={updateName}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
			/>
		</div>
		<div className='col-6 mx-0 px-0'>
			<InputField
				placeholder='Value'
				getter={value}
				setter={updateValue}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
			/>
		</div>
		<button onClick={e => deleter(index)} className='btn btn-danger px-0 mx-0 col-1'>
			<i className='fas fa-trash'/>
		</button>
	</div>
}

const MetadataEditor = (props) => {
	const [contractName, setContractName] = useState('');
	const [contractNetwork, setContractNetwork] = useState('');
	const [productName, setProductName] = useState('');
	const [title, setTitle] = useState('');
	//const [symbol, setSymbol] = useState('#');
	//From the brilliant mind of @Ed Wood comes.. How many plans are
	//	too many plans? Find out with edition # (URI) 
	const [description, setDescription] = useState('');
	
	const [tokenNumber, setTokenNumber] = useState(0);

	const [internalFirstToken, setInternalFirstToken] = useState(0);
	const [endingToken, setEndingToken] = useState(0);
	
	const [attributes, setAttributes] = useState([]);
	const [refreshData, setRefreshData] = useState(true);
	const [image, setImage] = useState('');
	
	const [offerArray, setOfferArray] = useState([]);
	const [currentOffer, setCurrentOffer] = useState('');

	const [existingMetadataArray, setExistingMetadataArray] = useState([]);
	const [existingURIArray, setExistingURIArray] = useState([]);
	
	const [sendingProductMetadata, setSendingProductMetadata] = useState(false);
	const [sendingContractMetadata, setSendingContractMetadata] = useState(false);
	const [sendingOpenSeaMetadata, setSendingOpenSeaMetadata] = useState(false);
	const [productURI, setProductURI] = useState('');
	const [contractURI, setContractURI] = useState('');
	const [openSeaContractURI, setOpenSeaContractURI] = useState('');
	
	const params = useParams();
	
	const {contractCreator} = useSelector(state => state.contractStore);

	const fetchContractData = useCallback(async () => {
		
		let contractData = await rFetch(`/api/contracts/network/${params.blockchain}/${params.contract}`)
		if (contractData.success) {
			setContractName(contractData.contract.title);
			setContractNetwork(contractData.contract.blockchain);
		}
		
		let productsData = await rFetch(`/api/contracts/network/${params.blockchain}/${params.contract}/products/offers`)
		if (productsData.success) {
			let [aux] = productsData.products.filter(item => item.collectionIndexInContract === Number(params.product));
			if (aux) {
				setProductName(aux.name);
				setEndingToken(aux.copies - 1);
				setInternalFirstToken(Number(aux.firstTokenIndex));
				setOfferArray(aux.offers.map(item => ({
					tokenStart: item.range[0],
					tokenEnd: item.range[1],
					name: item.offerName
				})))
			}
		}

		let nftResponse = await axios.get<TNftItemResponse>(`/api/nft/network/${params.blockchain}/${params.contract.toLowerCase()}/${params.product}`);
		const { success, result } = nftResponse.data;
		let sortedMetadataArray = [];
		let sortedURIArray = [];
		if (success && result?.totalCount) {
			for await (let token of result?.tokens) {
				sortedMetadataArray[token.token] = token.metadata;
				sortedURIArray[token.token] = token.metadataURI;
			}
		}
		setExistingMetadataArray(sortedMetadataArray);
		setExistingURIArray(sortedURIArray);

		setTokenNumber(0);
	}, [params])

	const addAttribute = () => {
		let aux = [...attributes];
		aux.push({trait_type: '', value: ''});
		setAttributes(aux);
	}

	const deleter = (index) => {
		let aux = [...attributes];
		aux.splice(index, 1);
		setAttributes(aux);
	}

	useEffect(() => {
		let aux = offerArray.filter(i => Number(i.tokenStart) <= Number(tokenNumber) && Number(i.tokenEnd) >= Number(tokenNumber));
		setCurrentOffer(aux[0]?.name)
	}, [tokenNumber, offerArray])

	useEffect(() => {
		fetchContractData()
	}, [fetchContractData])

	useEffect(() => {
		if (existingMetadataArray.length) {
			let metadata = existingMetadataArray[tokenNumber];
			if (!metadata) {
				setTitle('');
				setDescription('');
				setAttributes([]);
				setImage('');
				return;
			}
			setTitle(metadata.name ? metadata.name : '');
			setDescription(metadata.description ? metadata.description : '');
			setImage(metadata.image ? metadata.image : '');
			setAttributes(Object.keys(metadata.attributes).map((item, index) => {
				let itm = metadata.attributes[item];
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
				return itm;
			}))
		}
	}, [tokenNumber, existingMetadataArray])
	
	useEffect(() => {
		setDocumentTitle(`Metadata Editor for ${contractName !== '' ? contractName : params.contract}`);
	}, [params, contractName])

	return <div className='row w-100 px-0 mx-0'>
		<h5>
			{productName} from <b>{contractName}</b>
		</h5>
		{contractNetwork && <small>
			({params.contract}) on {chainData[contractNetwork]?.name}
		</small>}
		<div className='col-6'>
			<InputField
				label='Title'
				getter={title}
				setter={setTitle}
				customClass='form-control'
				labelClass='w-100 text-left'
				labelCSS={{textAlign: 'left'}}
			/>
			<InputField
				label='Description'
				getter={description}
				setter={setDescription}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
			/>
			<InputField
				label='Image'
				getter={image}
				setter={setImage}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
			/>
			<InputField
				label='Offer'
				getter={currentOffer}
				customClass='form-control'
				labelClass='w-100'
				disabled
				labelCSS={{textAlign: 'left'}}
			/>
			<hr/>
			<div className='row mx-0 px-0 w-100'>
				<div className='col-11 py-2'>
					Attributes
				</div>
				<div className='col-1'>
					<button onClick={addAttribute} className='btn btn-success'>
						<i className='fas fa-plus' />
					</button>
				</div>
			</div>
			<div className='col-12'>
				<hr/>
				<div className='col-12 row px-0 mx-0'>
					{attributes.map((item, index) => {
						return <AttributeRow refetch={() => setRefreshData(!refreshData)} deleter={deleter} array={attributes} index={index} key={index} />
					})}
				</div>
				<hr/>
			</div>
		</div>
		<div className='col-6'>
			Preview
			<hr />
			<div className='col-12 row mx-0 px-0'>
				<div className='col-6'>
					{image && <img src={image} alt='preview' style={{/*filter: `hue-rotate(${(180 / (endingToken)) * tokenNumber}deg)`*/}} className='w-100 h-auto' />}
				</div>
				<div className='col-6'>
					<h2>
						{title} {/*symbol tokenNumber*/}
					</h2>
					{description}
					<hr />
				</div>
			</div>
				<div className='col-12 row px-0 mx-0'>
						{attributes.map((item, index) => {
							return <div key={index} className='col-4 my-2 p-1' >
								<div style={{border: 'solid red 1px', backgroundColor: '#F22A', borderRadius: '20px'}}>
									{item.trait_type}: {item.value}
								</div>
							</div>
						})}
					</div>
				{false && <><button onClick={e => setTokenNumber(tokenNumber - 1)} className='btn btn-white'>
					<i className='fas fa-arrow-left' />
				</button>
				<button onClick={e => setTokenNumber(tokenNumber + 1)} className='btn btn-white'>
					<i className='fas fa-arrow-right' />
				</button></>}
				<InputField
					label='Go To NFT #'
					type='number'
					min={0}
					max={endingToken}
					getter={tokenNumber}
					setter={setTokenNumber}
					customClass='form-control'
					labelClass='w-100'
					labelCSS={{textAlign: 'left'}}
				/>
				<hr />
				<Link className='btn btn-stimorol' to={`/token/${params.blockchain}/${params.contract}/${Number(internalFirstToken) + Number(tokenNumber)}`}>
					View token!
				</Link>
				<hr />
				<button disabled className='col-12 btn btn-primary'>
					Update Metadata
				</button>

		</div>
		<hr />
		{existingMetadataArray && 
			<div className='p-5 col-12'>
				<button onClick={async e => {
					if (window.ethereum.chainId !== contractNetwork) {
						swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
						return;
					}
					let instance = contractCreator(params.contract, erc721Abi);
					swal.fire('Fetching Metadata URL...');
					let metadataLink = await instance.tokenURI(tokenNumber);
					if (metadataLink === '') {
						swal.fire('No metadata URL found!')
						return;
					} else {
						console.log('Found URI:', metadataLink);
					}
					swal.fire('Fetching Metadata from URL...');
					let metadataData = await axios.get<TCheckMetadataOnBlockchain>(metadataLink).then(res => res.data);
					let workaroundToDisplayMetadata = [...existingMetadataArray];
					workaroundToDisplayMetadata[tokenNumber] = metadataData;
					swal.close();
					setExistingMetadataArray(workaroundToDisplayMetadata);
				}} className='col-12 btn btn-primary'>
					Check metadata on the blockchain!
				</button>

				<MetadataSender {...{contractNetwork, existingMetadataArray, params, tokenNumber, internalFirstToken, endingToken, existingURIArray}} />

				<details className='col-12 py-3'>
					<summary>
						<h5> Product-Wide metadata </h5>
						<small> tokenURI will return this if an unique URI doesn't exist </small>
					</summary>
					<InputField
						label='Product Metadata URI'
						getter={productURI}
						setter={setProductURI}
						customClass='form-control'
						labelClass='w-100'
						labelCSS={{textAlign: 'left'}}
					/>
					<small> The token ID (using the product numbering) will be appended at the end of the URI </small>
					<br />
						<small> Preview: <a href={`${productURI}${tokenNumber}`}>{productURI}<b>{tokenNumber}</b></a> </small>
						<br />
						<button disabled={sendingProductMetadata} className='btn btn-royal-ice' onClick={async e => {
							if (window.ethereum.chainId !== contractNetwork) {
								swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
								return;
							}
							setSendingProductMetadata(true);
							let instance = contractCreator(params.contract, erc721Abi);
							try {
									await instance.setProductURI(params.product, productURI);
							} catch (err) {
								swal.fire('Error', err?.data?.message);
								console.log(err);
								setSendingProductMetadata(false);
								return;
							}
							setSendingProductMetadata(false);
							swal.fire('Product Metadata Set!');
						}} >
							{productURI ? 'Update' : 'Delete'} product Metadata URI
						</button> 
				</details>
				
				<details className='col-12 py-3'>
					<summary>
						<h5> Contract-Wide metadata </h5>
						<small> tokenURI will return this as a last resort </small>
					</summary>
					<InputField
						label='Product Metadata URI'
						getter={contractURI}
						setter={setContractURI}
						customClass='form-control'
						labelClass='w-100'
						labelCSS={{textAlign: 'left'}}
					/>
					<small> The token ID (using the internal numbering) will be appended at the end of the URI (Remember the slash at the end!) </small>
					<br />
						<small> Preview: <a href={`${contractURI}${internalFirstToken + tokenNumber}`}>{contractURI}<b>{Number(internalFirstToken) + Number(tokenNumber)}</b></a> </small>
						<br />
						<button disabled={sendingContractMetadata} className='btn btn-royal-ice' onClick={async e => {
							if (window.ethereum.chainId !== contractNetwork) {
								swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
								return;
							}
							setSendingContractMetadata(true);
							let instance = contractCreator(params.contract, erc721Abi);
							try {
								await instance.setBaseURI(contractURI);
							} catch (err) {
								swal.fire('Error', err?.data?.message);
								console.log(err);
								setSendingContractMetadata(false);
								return;
							}
							setSendingContractMetadata(false);
							swal.fire('Contract-wide Metadata Set!');
						}} >
							{contractURI ? 'Update' : 'Delete'} contract Metadata URI
						</button> 
				</details>
				<hr />
				<details className='col-12 py-3'>
					<summary>
						<h5> Contract metadata </h5>
						<small> Information that OpenSea displays </small>
					</summary>
					<InputField
						label='Contract Metadata URL'
						getter={openSeaContractURI}
						setter={setOpenSeaContractURI}
						customClass='form-control'
						labelClass='w-100'
						labelCSS={{textAlign: 'left'}}
					/>
					<small> This information is pulled by OpenSea </small>
					<br />
						<br />
						<button disabled={sendingOpenSeaMetadata} className='btn btn-royal-ice' onClick={async e => {
							if (window.ethereum.chainId !== contractNetwork) {
								swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
								return;
							}
							setSendingOpenSeaMetadata(true);
							let instance = contractCreator(params.contract, erc721Abi);
							try {
								await instance.setContractURI(openSeaContractURI);
							} catch (err) {
								swal.fire('Error', err?.data?.message);
								console.log(err);
								setSendingOpenSeaMetadata(false);
								return;
							}
							setSendingOpenSeaMetadata(false);
							swal.fire('Contract Metadata Set!');
						}} >
							{openSeaContractURI ? 'Update' : 'Delete'} Contract Metadata URL
						</button> 
				</details>

			</div>
		}
	</div>
}

export default MetadataEditor;