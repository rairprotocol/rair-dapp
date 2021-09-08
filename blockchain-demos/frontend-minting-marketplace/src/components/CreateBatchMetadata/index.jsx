import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import InputSelect from '../common/InputSelect.jsx';
import styled from 'styled-components';
import { erc721Abi } from '../../contracts';
import * as ethers from 'ethers';

const CreateBatchMetadata = () => {
	const [data, setData] = useState({
		csv: null
	})
	const [contractOptions, setContractOptions] = useState([]);
	const [contractAddress, setContractAddress] = useState('null');
	const [productOptions, setProductOptions] = useState([]);
	const [productId, setProductId] = useState('null');

	const {factoryInstance, currentUserAddress, programmaticProvider} = useSelector(state => state.contractStore);

	const onChangeValue = e => {
		setData({
			...data,
			[e.target.name]: e.target.value
		})
	}

	const onSubmit = e => {
		e.preventDefault()
		if (data.product_id === '') {
			alert('You must add the product id')
		} else if (data.contact_address === '') {
			alert('You must add the contact address')
		} if (!data.csv) {
			alert('You must add the contact csv')
		} else {
			let formData = new FormData();
			formData.set('productId', productId);
			formData.set('contractAddress', contractAddress);
			formData.set('csv', data.csv);
			console.log('Sending info:', formData);
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
			finalContractList.push({
				value: address,
				label: address
			});
		}
		setContractOptions(finalContractList);
	}, [factoryInstance, currentUserAddress])

	const fetchProductData = useCallback(async () => {
		if (contractAddress === 'null') {
			return;
		}
		let signer = programmaticProvider;
		if (window.ethereum) {
			let provider = new ethers.providers.Web3Provider(window.ethereum);
			signer = provider.getSigner(0);
		}
		let instance = new ethers.Contract(contractAddress, erc721Abi, signer);
		let productCount = Number((await instance.getProductCount()).toString());
		let finalProductList = [];
		for await (let productNumber of [...Array(Number(productCount.toString())).keys()]) {
			let productInfo = await instance.getProduct(productNumber);
			finalProductList.push({
				value: productNumber,
				label: `${productNumber} - ${productInfo.productName}`
			})
		}
		setProductOptions(finalProductList);
	}, [contractAddress])

	useEffect(() => {
		fetchFactoryData();
	}, [fetchFactoryData]);

	useEffect(() => {
		fetchProductData();
	}, [fetchProductData]);

	return (
		<Form onSubmit={onSubmit}>
			<h1>Create Batch Metadata</h1>
			<InputSelect
				label='Contract Address'
				labelClass='w-100'
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
				required
				labelCSS={{textAlign: 'left'}}
				options={productOptions}
				placeholder='Please Select'
				getter={productId}
				setter={setProductId}
				customClass='form-control'
			/>
			<ContentInput>
				<Label>CSV</Label>
				<Input
					type="file"
					value={data.csv}
					name="csv"
					onChange={onChangeValue}
				/>
			</ContentInput>

			<ContentInput>
				<button
					className='btn btn-primary'
					type="submit"
					disabled={contractAddress === 'null' || productId === 'null' || data.csv === null}>
					Submit Data
				</button>

			</ContentInput>
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

const Label = styled.label`
	float: left;
`;

const Input = styled.input`
	width: 100%;
	outline: none;
`;

export default CreateBatchMetadata
