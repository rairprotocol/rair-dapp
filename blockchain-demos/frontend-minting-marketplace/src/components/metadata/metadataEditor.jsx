import {useState, useEffect, useCallback} from 'react';
import InputField from '../common/InputField.jsx';
import { Link, useParams } from "react-router-dom";
import { useSelector } from 'react-redux';
import { erc721Abi } from '../../contracts';
import * as ethers from 'ethers';

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
	const [title, setTitle] = useState('');
	//const [symbol, setSymbol] = useState('#');
	//From the brilliant mind of @Ed Wood comes.. How many plans are
	//	too many plans? Find out with edition # (URI) 
	const [description, setDescription] = useState('');
	
	const [tokenNumber, setTokenNumber] = useState(0);

	const [endingToken, setEndingToken] = useState(0);
	
	const [attributes, setAttributes] = useState([]);
	const [refreshData, setRefreshData] = useState(true);
	const [image, setImage] = useState();
	
	const [offerArray, setOfferArray] = useState([]);
	const [currentOffer, setCurrentOffer] = useState('');

	const [existingMetadataArray, setExistingMetadataArray] = useState([]);

	// Causes the component to rerender

	const params = useParams();
	const {minterInstance, programmaticProvider} = useSelector(state => state.contractStore);

	const fetchContractData = useCallback(async () => {
		if (!params || !minterInstance) {
			return;
		}
		let signer = programmaticProvider;
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}

		let aux = await (await fetch(`/api/nft/${params.contract.toLowerCase()}/${params.product}`)).json()
		let sortedMetadataArray = [];
		for await (let token of aux.result) {
			sortedMetadataArray[token.token] = token.metadata;
		}
		setExistingMetadataArray(sortedMetadataArray);
		
		let finalOfferArray = []
		let offerIndex = await minterInstance.contractToOfferRange(params.contract, params.product);
		let offerRanges = (await minterInstance.getOfferInfo(offerIndex)).availableRanges;
		for await (let offerInfo of [...Array(Number(offerRanges.toString())).keys()]) {
			let aux = await minterInstance.getOfferRangeInfo(offerIndex, offerInfo);
			finalOfferArray.push({
				tokenStart: aux.tokenStart.toString(),
				tokenEnd: aux.tokenEnd.toString(),
				name: aux.name
			});
		}
		setOfferArray(finalOfferArray);

		let instance = new ethers.Contract(params.contract, erc721Abi, signer);
		let productInfo = await instance.getProduct(params.product)
		setContractName(await instance.name());
		if (aux.result.length === 0) {
			setTitle(productInfo.productName);
		}
		let firstToken = Number(productInfo.startingToken.toString());
		let lastToken = Number(productInfo.endingToken.toString())

		setEndingToken(lastToken - firstToken);
		setTokenNumber(0);
	}, [params, programmaticProvider, minterInstance])

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

	const imageSetter = async (file) => {
		let reader = new FileReader();
		reader.onload = function () {
			setImage(reader.result);
		}
		await reader.readAsDataURL(file);
	}

	useEffect(() => {
		if (existingMetadataArray.length) {
			let metadata = existingMetadataArray[tokenNumber];
			if (!metadata) {
				setTitle('');
				setDescription('');
				setAttributes([]);
				return;
			}
			setTitle(metadata.name);
			setDescription(metadata.description);
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

	return <div className='row w-100 px-0 mx-0'>
		<h5>
			Contract: <b>{contractName} ({params.contract})</b>
		</h5>
		<div className='col-6'>
			<div className='col-3' />
			<button disabled className='btn btn-primary col-3'>
				Single
			</button>
			<Link to={`/batch-metadata/${params.contract}/${params.product}`} className='btn btn-secondary col-3'>
				Batch
			</Link>
			<div className='col-3' />
			<InputField
				label='Title'
				getter={title}
				setter={setTitle}
				customClass='form-control'
				labelClass='w-100 text-left'
				labelCSS={{textAlign: 'left'}}
			/>
			{/*false && <InputField
				label='Edition Symbol'
				getter={symbol}
				setter={setSymbol}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
			/>*/}
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
				type='file'
				setter={imageSetter}
				setterField={['files',0]}
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
					{image && <img src={image} alt='preview' style={{filter: `hue-rotate(${(180 / (endingToken)) * tokenNumber}deg)`}} className='w-100 h-auto' />}
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
				<button disabled className='col-12 btn btn-primary'>
					Update Metadata
				</button>
		</div>
	</div>
}

export default MetadataEditor;