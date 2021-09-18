import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import InputSelect from '../common/InputSelect.jsx';
import InputField from '../common/InputField.jsx';
import styled from 'styled-components';
import Swal from 'sweetalert2';
import rFetch from '../../utils/rFetch.js';

const CreateBatchMetadata = () => {
	const [fullContractData, setFullContractData] = useState([]);

	const [contractOptions, setContractOptions] = useState([]);
	const [contractAddress, setContractAddress] = useState('null');
	const [productOptions, setProductOptions] = useState([]);
	const [productId, setProductId] = useState('null');
	const [csvData, setCsvData] = useState(null);
	const [responseSuccessful, setResponseSuccessful] = useState(false);

	const [contractInstance, ] = useState();

	const params = useParams();

	const onSubmit = async e => {
		e.preventDefault()
		if (productId === 'null') {
			Swal.fire('Error','You must add the product id','error')
		} else if (productId === 'null') {
			Swal.fire('Error','You must add the contact address','error')
		} if (!csvData) {
			Swal.fire('Error','You must add the contact csv','error')
		} else {
			let formData = new FormData();
			formData.append('product', productId);
			formData.append('contract', contractAddress.toLowerCase());
			formData.append('csv', csvData, 'metadata.csv');
			let response = await (await fetch('/api/nft', {
				method: 'POST',
				body: formData,
				redirect: 'follow',
				headers: {
					'x-rair-token': localStorage.token
				}
			})).json()
			setResponseSuccessful(response?.success);
			if (response?.success) {
				Swal.fire('Success',`Generated ${response.result.length} metadata entries!`,'success');
			}
		}
	}

	const fetchContractsData = useCallback(async () => {
		let finalContractData = [];
		let contractData = await rFetch(`/api/contracts/`)
		if (contractData.success) {
			for await (let contract of contractData.contracts) {
				let contractDetails = await rFetch(`/api/contracts/${contract.contractAddress}`);
				if (contractDetails.success) {
					let productsInfo = await rFetch(`/api/contracts/${contract.contractAddress}/products`);
					if (productsInfo.success && productsInfo.products.length) {
						contractDetails.contract.products = productsInfo.products;
						finalContractData.push(contractDetails.contract);
					}
				}
			}
		}
		setFullContractData(finalContractData);
		setContractOptions(finalContractData.map(item => ({
			label: `${item.title} on ${item.blockchain} (${item.contractAddress})`, value: item.contractAddress
		})));
		if (finalContractData.filter(i => i.contractAddress === params.contract).length) {
			setContractAddress(params.contract);
		}
	}, [params])

	useEffect(() => {
		fetchContractsData();
	}, [fetchContractsData]);

	useEffect(() => {
		if (contractAddress === 'null') {
			return;
		}
		let [aux] = fullContractData.filter(i => i.contractAddress === contractAddress);
		setProductOptions(aux.products.map(item => {
			return {
				value: item.collectionIndexInContract,
				label: `${item.name} (${item.collectionIndexInContract})`
			}
		}))
		if (params?.contract === contractAddress) {
			setProductId(params.product);
		} else {
			setProductId('null');
		}
	}, [contractAddress, fullContractData, params])

	return (
		<Form onSubmit={onSubmit}>
			<h1>Create Batch Metadata</h1>
			<InputSelect
				label='Contract Address'
				labelClass='w-100'
				disabled={responseSuccessful}
				required
				labelCSS={{textAlign: 'left'}}
				options={contractOptions}
				placeholder='Please Select'
				getter={contractAddress}
				setter={setContractAddress}
				customClass='form-control'
			/>
			<hr />
			<InputSelect
				label='Product'
				labelClass='w-100'
				disabled={responseSuccessful}
				required
				labelCSS={{textAlign: 'left'}}
				options={productOptions}
				placeholder='Please Select'
				getter={productId}
				setter={setProductId}
				customClass='form-control'
			/>
			<hr />
			<InputField
				label='CSV File'
				type='file'
				labelClass='w-100'
				required
				disabled={responseSuccessful}
				labelCSS={{textAlign: 'left'}}
				placeholder='Please Select'
				setter={setCsvData}
				setterField={['files',0]}
				customClass='form-control'
			/>
			<ContentInput>
				<button
					className='btn btn-primary'
					type="submit"
					disabled={contractAddress === 'null' || productId === 'null' || csvData === null || responseSuccessful}>
					Submit Data
				</button>
			</ContentInput>
			{responseSuccessful && <>
				<hr />
				<button disabled type='button' className='btn btn-secondary' onClick={async e => {
					await contractInstance.setProductURI(productId, `/api/nft/${contractAddress}/${productId}/token/`);
				}}>
					Set '/api/nft/{contractAddress}/{productId}/token/:token as the product's Metadata URI
				</button>
			</>}
		</Form>
	)
};

const Form = styled.form`
	width: 80%;
	margin: auto;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
`;

const ContentInput = styled.div`
	width: 100%;
	margin: auto;
	margin-top: 20px;
`;

/*
const Label = styled.label`
	float: left;
`;

const Input = styled.input`
	width: 100%;
	outline: none;
`;
*/

export default CreateBatchMetadata
