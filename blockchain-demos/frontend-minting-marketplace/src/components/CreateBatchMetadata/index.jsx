import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import InputSelect from '../common/InputSelect.jsx';
import InputField from '../common/InputField.jsx';
import styled from 'styled-components';
import { erc721Abi } from '../../contracts';
import * as ethers from 'ethers';
import Swal from 'sweetalert2';

const CreateBatchMetadata = () => {
	const [contractOptions, setContractOptions] = useState([]);
	const [contractAddress, setContractAddress] = useState('null');
	const [productOptions, setProductOptions] = useState([]);
	const [productId, setProductId] = useState('null');
	const [csvData, setCsvData] = useState('null');
	const [responseSuccessful, setResponseSuccessful] = useState(false);

	const [contractInstance, setContractInstance] = useState();

	const {factoryInstance, currentUserAddress, programmaticProvider} = useSelector(state => state.contractStore);

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

	const fetchFactoryData = useCallback(async () => {
		if (!factoryInstance || !currentUserAddress) {
			return;
		}
		let contractsCreated = await factoryInstance.getContractCountOf(currentUserAddress);
		let finalContractList = []
		for await (let contractNumber of [...Array(Number(contractsCreated.toString())).keys()]) {
			let address = await factoryInstance.ownerToContracts(currentUserAddress, contractNumber)
			let signer = programmaticProvider;
			if (window.ethereum) {
				let provider = new ethers.providers.Web3Provider(window.ethereum);
				signer = provider.getSigner(0);
			}
			let instance = new ethers.Contract(address, erc721Abi, signer);
			setContractInstance(instance);
			finalContractList.push({
				value: address,
				label: `${await instance.name()} (${address})`
			});
		}
		setContractOptions(finalContractList);
		if (finalContractList.filter(i => i.value === params.contract).length) {
			setContractAddress(params.contract);
		}
	}, [factoryInstance, currentUserAddress, programmaticProvider, params])

	const fetchProductData = useCallback(async () => {
		if (!contractInstance) {
			return;
		}
		let productCount = Number((await contractInstance.getProductCount()).toString());
		let finalProductList = [];
		for await (let productNumber of [...Array(Number(productCount.toString())).keys()]) {
			let productInfo = await contractInstance.getProduct(productNumber);
			finalProductList.push({
				value: productNumber,
				label: `${productInfo.productName} (${productNumber})`
			})
		}
		setProductOptions(finalProductList);
		if (finalProductList.filter(i => i.value === Number(params.product)).length) {
			setProductId(params.product);
		}
	}, [contractInstance, params])

	useEffect(() => {
		fetchFactoryData();
	}, [fetchFactoryData]);

	useEffect(() => {
		fetchProductData();
	}, [fetchProductData]);

	useEffect(() => {
		if (contractAddress === 'null') {
			return;
		}
		let signer = programmaticProvider;
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}
		let instance = new ethers.Contract(contractAddress, erc721Abi, signer);
		setContractInstance(instance);
	}, [contractAddress, programmaticProvider])

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
				<button type='button' className='btn btn-secondary' onClick={async e => {
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
