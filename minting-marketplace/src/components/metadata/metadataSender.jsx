//@ts-nocheck
import {useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import swal from 'sweetalert2';
import chainData from '../../utils/blockchainData';
import { erc721Abi } from '../../contracts'
import InputField from '../common/InputField';

const BatchDataItem = ({tokenId, metadataURI, deleter, index, array, endingToken}) => {

	const [tokenIndex, setTokenIndex] = useState(tokenId);
	const [metadataLink, setMetadataLink] = useState(metadataURI);

	useEffect(() => {
		setTokenIndex(tokenId);
	}, [tokenId])

	useEffect(() => {
		setMetadataLink(metadataURI);
	}, [metadataURI])

	const tokenIdSetter = (value) => {
		array[index].tokenId = value;
		setTokenIndex(value);
	}

	const metadataURISetter = (value) => {
		array[index].metadataURI = value;
		setMetadataLink(value);
	}

	return <tr>
		<th>
			<InputField
				placeholder='Token Index'
				getter={tokenIndex}
				setter={tokenIdSetter}
				type='number'
				min='0'
				max={endingToken}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
				/>
		</th>
		<th>
			<InputField
				placeholder='Full link'
				getter={metadataLink}
				setter={metadataURISetter}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
				/>
		</th>
		<th>
			<button onClick={_ => deleter(index)} className='btn btn-danger'>
				<i className='fas fa-trash' />
			</button>
		</th>
	</tr>
}

const MetadataSender = ({contractNetwork, existingURIArray, params, tokenNumber, setExistingMetadataArray, endingToken, internalFirstToken}) => {

	const [sendingMetadata, setSendingMetadata] = useState(false);
	const [metadataArray, setMetadataArray] = useState([]);

	const addRow = () => {
		if (metadataArray.length > endingToken) {
			return;
		}
		let aux = [...metadataArray];
		let index = metadataArray.length > 0 ? Number(metadataArray.at(-1).tokenId) + 1 : 0
		aux.push({
			tokenId: index,
			metadataURI: existingURIArray[index] !== undefined ? existingURIArray[index] : ''
		})
		setMetadataArray(aux);
	}

	const deleteRow = (index) => {
		let aux = [...metadataArray];
		aux.splice(index, 1);
		setMetadataArray(aux);
	}

	const {contractCreator} = useSelector(state => state.contractStore);

	return <details style={{position: 'relative'}} className='col-12 py-3'>
		<summary>
			<h5> Unique URI for tokens </h5>
			<small> tokenURI will return this as the first option </small>
		</summary>

		<table style={{color: 'inherit'}} className='table table-responsive w-100'>
			<thead>
				<tr>
					<th>
						Token ID
					</th>
					<th>
						Token URI
					</th>
					<th className='px-0'>
						<button disabled={metadataArray.length > endingToken} onClick={addRow} className='btn mx-0 btn-stimorol'>
							Add <i className='fas fa-plus' />
						</button>
					</th>
				</tr>
			</thead>
			<tbody>
				{metadataArray.map((item, index, array) => {
					return <BatchDataItem
								{...item}
								{...{endingToken, index, array}}
								key={index}
								deleter={deleteRow}
							/>
				})}
			</tbody>
		</table>


		<button onClick={async e => {
			if (window.ethereum.chainId !== contractNetwork) {
				swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
				return;
			}
			if (metadataArray.length <= 0) {
				return;
			}
			setSendingMetadata(true);
			let instance = contractCreator(params.contract, erc721Abi);
			try {
				if (metadataArray.length === 1) {
					let aux = metadataArray.at(0);
					await instance.setUniqueURI(aux.tokenId, aux.metadataURI);
				} else {
					await instance.setUniqueURIBatch(
					//console.log(
						metadataArray.map(item => Number(internalFirstToken) + Number(item.tokenId)),
						metadataArray.map(item => item.metadataURI)
					)
				}
			} catch (err) {
				swal.fire('Error', err?.data?.message);
				if (err?.data?.message) {
					console.error("Remember some versions of the contract don't have batch metadata update functionality!")
				}
				console.log(err);
				setSendingMetadata(false);
				return;
			}
			setSendingMetadata(false);
			swal.fire('Metadata Set!');
		}} disabled={sendingMetadata || metadataArray.length <= 0} className='col-12 btn btn-primary'>
			{sendingMetadata ? 'Sending Metadata...' : 'Send Metadata link to the contract!'}
		</button>
	</details>
}

export default MetadataSender;