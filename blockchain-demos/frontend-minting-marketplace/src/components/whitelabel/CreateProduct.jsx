import {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField.jsx';
import {useSelector} from 'react-redux';
import {utils} from 'ethers'
import {erc721Abi} from '../../contracts';

const rSwal = withReactContent(Swal);

const ModalContent = ({instance, blockchain}) => {

	const [productName, setProductName] = useState('');
	const [productLength, setProductLength] = useState(0);

	return <>
		<InputField 
			label='Product Name'
			customClass='form-control'
			labelClass='w-100 text-center'
			getter={productName}
			setter={setProductName}
		/>
		<InputField 
			label='Number of copies'
			customClass='form-control'
			labelClass='w-100 text-center'
			getter={productLength}
			setter={setProductLength}
		/>
		<br /> 
		<button disabled={blockchains[blockchain] !== window.ethereum.chainId} onClick={async e => {
			await instance.createProduct(productName, productLength);
			rSwal.close();
		}} className='btn my-3 btn-success'>
			Create Product!
		</button>
	</>
}

const blockchains = {
	'BNB': '0x61',
	'ETH': '0x5',
	'tMATIC': '0x13881'
}

const CreateProduct = ({address, blockchain}) => {
	const {factoryInstance, erc777Instance, contractCreator} = useSelector(store => store.contractStore);

	let onMyChain = blockchains[blockchain] === window.ethereum.chainId;

	return <button
		disabled={address === undefined || contractCreator === undefined}
		className={`btn btn-${onMyChain ? 'success' : 'primary'} py-0`}
		style={{position: 'absolute', right: '1px'}}
		onClick={async e => {
			if (!onMyChain) {
				if (window.ethereum) {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: blockchains[blockchain] }],
					});
				} else {
					// Code for suresh goes here
				}
			} else {
				rSwal.fire({
					html: <ModalContent blockchain={blockchain} instance={await contractCreator(address, erc721Abi)}/>,
					showConfirmButton: false
				})
			}
		}}>
			{onMyChain ?
				<>New Product <i className='fas fa-plus'/></> :
				<>Switch to <b>{blockchain}</b></>
			}
	</button>
};

export default CreateProduct;