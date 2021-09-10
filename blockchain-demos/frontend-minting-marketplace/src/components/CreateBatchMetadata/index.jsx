import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
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

	const [contractInstance, setContractInstance] = useState();

	const {factoryInstance, currentUserAddress, programmaticProvider} = useSelector(state => state.contractStore);

	const params = useParams();

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
	}, [factoryInstance, currentUserAddress, programmaticProvider])

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
		console.log(finalProductList);
		if (finalProductList.filter(i => i.value === Number(params.product)).length) {
			setProductId(params.product);
		}
	}, [contractInstance])

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
