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
			productData.push()
		}
	}, [address]);

	useEffect(() => {
		fetchData();
	}, [fetchData])

	return <>
		Contract Address: {address}
		<hr />
		Deployment Name: {name}
		<hr />
		{productCount && productCount.toString()} products
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
		{contractInstance && Object.keys(contractInstance.functions).map(item => {
			return <div> {item} </div>;
		})}
	</>
}

export default DiamondDeploymentInterface;