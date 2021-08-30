import { useState, useEffect, useCallback } from 'react';
//import { useDispatch, useSelector } from 'react-redux';
import { useParams, Link } from "react-router-dom";

import Swal from 'sweetalert2'
import * as ethers from 'ethers'

import * as ERC721Token from '../../contracts/RAIR_ERC721.json';
const erc721Abi = ERC721Token.default.abi;

const MyNFTs = props => {
	const params = useParams();

	const [creator, setCreator] = useState('');
	const [name, setName] = useState('');
	const [productData, setProductData] = useState('');
	const [tokenData, setTokenData] = useState([]);

	const getData = useCallback(async () => {
		try {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			let signer = provider.getSigner(0);
			let instance = new ethers.Contract(params.contract, erc721Abi, signer);
			if (await instance.symbol() !== 'RAIR') {
				Swal.fire('Error','Contract is not a RAIR contract','error');
			}
			setName(await instance.name());
			let pData = await instance.getCollection(params.product);
			console.log(pData);
			setProductData(pData);
			setCreator(await instance.getRoleMember(await instance.CREATOR(), 0));
			let finalTokenData = [];
			for (let i = Number(pData.startingToken).toString(); i < pData.endingToken - pData.mintableTokensLeft; i++) {
				let tokenIndex = (await instance.tokenByIndex(i)).toString();
				let metadata;
				try {
					metadata = await (await fetch(await instance.tokenURI(tokenIndex)))?.json()
				} catch (err) {
					console.log('Error fetching metadata for token #', tokenIndex);
				}
				finalTokenData.push({
					metadataURI: await instance.tokenURI(tokenIndex),
					tokenIndex,
					metadata
				});
			}
			finalTokenData = finalTokenData.sort((a, b) => {
				return Number(a.tokenIndex) < Number(b.tokenIndex) ? -1 : 1;
			});
			setTokenData(finalTokenData);
		} catch (err) {
			console.log(err);
			Swal.fire('Error', "error", 'error');
		}
	}, [params.contract, params.product])

	useEffect(() => {
		getData();
	}, [getData]);

	return <div className='col-12'>
		<br/>
		{
			productData && <div className='row px-0 mx-0 w-100'>
				<h3> {productData.collectionName} </h3>
				<div className='col-12 col-md-6'>
					<small>
						From contract: <b>{name}</b><br />
						Created by: <b>{creator}</b>
					</small> <br/>
					Range from {productData.startingToken.toString()} to {' '}
					{productData.endingToken.toString()} <br />
				</div>
				<div className='col-12 col-md-6'>
					{productData.mintableTokensLeft.toString()} tokens up for minting!<br />
					{productData.locks.length.toString()} locks in place!
				</div>
				<progress
					min={productData.startingToken.toString()}
					max={productData.endingToken.toString()}
					value={Number(productData.endingToken.toString()) - Number(productData.startingToken.toString()) - Number(productData.mintableTokensLeft.toString())}
					className='col-12'
					style={{height: '5vh'}}/>
			</div>
		}
		<div className='row w-100 mx-0 px-0'>
			{tokenData?.map(({metadata, tokenIndex, metadataURI}, index) => {
				return <Link
					key={index}
					className='col-3 p-1'
					to={`/token/${params.contract}/${tokenIndex}`}
					style={{height: '20vh', border: 'none', color: 'inherit', textDecoration: 'none'}}>
					<div className='w-100 h-100 bg-white' style={{borderRadius: '10px', position: 'relative'}}>
						{metadata?.image ? 
							<img alt='NFT' className='w-100 h-auto' src={metadata.image} />
						:
							<div className='w-100 h-100 bg-secondary' style={{
								position: 'relative',
								borderRadius: '10px',
							}}>
								<i
									className='fas fa-image h1'
									style={{position: 'absolute', top: '50%', left: '50%'}} />
							</div>
						}
						<div style={{position: 'absolute', top: '1rem', left: '1rem'}}>
							#{tokenIndex}
						</div>
					</div>
				</Link>
			})}
		</div>
	</div>
}

export default MyNFTs;