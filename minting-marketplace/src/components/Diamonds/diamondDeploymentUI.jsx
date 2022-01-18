import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { diamondFactoryAbi } from '../../contracts';
import { metamaskCall } from '../../utils/metamaskUtils.js';
import InputField from '../common/InputField.jsx';

const DiamondDeploymentInterface = () => {
	const { contractCreator, diamondFactoryInstance } = useSelector(store => store.contractStore);
	const { blockchain, address } = useParams();
	const [contractInstance, setContractInstance] = useState();
	const [name, setName] = useState();
	const [productCount, setProductCount] = useState(0);
	const [productsData, setProductsData] = useState([]);

	const [newProductName, setNewProductName] = useState('');
	const [newProductLength, setNewProductLength] = useState(0);

	const fetchData = useCallback(async () => {
		let instance = contractCreator(address, diamondFactoryAbi);
		setContractInstance(instance);
		setName(await instance.name());
		let productNumber = await instance.getProductCount();
		setProductCount(productNumber);
		let productData = [];
		for (let i = 0; i < productNumber; i++) {
			let data = await instance.getProductInfo(i);
			productData.push({
				startingToken: data.startingToken.toString(),
				endingToken: data.endingToken.toString(),
				name: data.name,
				mintableTokens: data.mintableTokens.toString()
			});
		}
		setProductsData(productData);
	}, [address]);

	useEffect(() => {
		fetchData();
	}, [fetchData])

	//function createRange(uint productId, uint rangeStart, uint rangeEnd, uint price, uint tokensAllowed, uint lockedTokens, string calldata name) external onlyRole(CREATOR) {

	return <>
		Contract Address: {address}
		<hr />
		Deployment Name: {name}
		<hr />
		{productCount && productCount.toString()} products
		<hr />
		{productsData.map((item, index) => {
			return <div className='col-12' key={index}>
				Name: {item.name}<br />
				Starting Token: {item.startingToken}<br />
				Ending Token: {item.endingToken}<br />
				Mintable Tokens Left: {item.mintableTokens}<br />
			</div>
		})}
		<hr />
		Create Product:
		<div className='w-100 row p-0 m-0'>
			<div className='col-6'>
				<InputField
					label='Product Name'
					customClass='form-control'
					getter={newProductName}
					setter={setNewProductName}
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Product Length'
					customClass='form-control'
					getter={newProductLength}
					setter={setNewProductLength}
				/>
			</div>
			<button disabled={newProductName === '' || newProductLength === 0} onClick={async () => {
				if (await metamaskCall(contractInstance.createProduct(newProductName, newProductLength))) {
					setNewProductLength(0);
					setNewProductName('')
				}
			}} className='btn btn-stimorol mt-3'>
				Create Product
			</button>
		</div>
		<hr />
		{/*
		<div className='w-100 row p-0 m-0'>
			<div className='col-6'>
				<InputField
					label='Product ID'
					customClass='form-control'
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Range Start'
					customClass='form-control'
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Range End'
					customClass='form-control'
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Price'
					customClass='form-control'
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Tokens Allowed to be Minted'
					customClass='form-control'
				/>
			</div>
			<div className='col-6'>
				<InputField
					label='Tokens Locked'
					customClass='form-control'
				/>
			</div>
			<div className='col-12'>
				<InputField
					label='Range name'
					customClass='form-control'
				/>
			</div>
			<button disabled={newProductName === '' || newProductLength === 0} onClick={async () => {
				if (await metamaskCall(contractInstance.createProduct(newProductName, newProductLength))) {
					setNewProductLength(0);
					setNewProductName('')
				}
			}} className='btn btn-stimorol mt-3'>
				Create Product
			</button>
		</div>
		<hr />
		{contractInstance && Object.keys(contractInstance.functions).map(item => {
			return <div> {item} </div>;
		})}
		*/}
	</>
}

export default DiamondDeploymentInterface;