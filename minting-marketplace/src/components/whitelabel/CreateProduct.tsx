//@ts-nocheck
import {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField';
import {useSelector} from 'react-redux';
import {erc721Abi} from '../../contracts';
import chainData from '../../utils/blockchainData';

const rSwal = withReactContent(Swal);

const ModalContent = ({instance, blockchain}) => {

	const [productName, setProductName] = useState('');
	const [productLength, setProductLength] = useState(0);

	return <>
		<InputField 
			label='Product Name'
			customClass='form-control'
			labelClass='w-100 pt-3 text-start'
			getter={productName}
			setter={setProductName}
		/>
		<InputField 
			label='Number of copies'
			customClass='form-control'
			labelClass='w-100 pt-3 text-start'
			type='number'
			getter={productLength}
			setter={setProductLength}
		/>
		<br /> 
		<button disabled={chainData[blockchain].chainId !== window.ethereum.chainId} onClick={async e => {
			await instance.createProduct(productName, productLength);
			rSwal.close();
		}} className='btn my-3 btn-stimorol'>
			Create Product!
		</button>
	</>
}

const CreateProduct = ({address, blockchain}) => {
	const {contractCreator, programmaticProvider} = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);

	let onMyChain = window.ethereum ? chainData[blockchain]?.chainId === window.ethereum.chainId : chainData[blockchain]?.chainId === programmaticProvider.provider._network.chainId;

	return <button
		disabled={address === undefined || contractCreator === undefined || !window.ethereum}
		className={`btn btn-${onMyChain ? 'stimorol' : 'royal-ice'} py-0 col-12`}
		onClick={async e => {
			if (!onMyChain) {
				if (window.ethereum) {
					await window.ethereum.request({
						method: 'wallet_switchEthereumChain',
						params: [{ chainId: chainData[blockchain].chainId }],
					});
				} else {
					// Code for suresh goes here
				}
			} else {
				rSwal.fire({
					html: <ModalContent blockchain={blockchain} instance={await contractCreator(address, erc721Abi)}/>,
					showConfirmButton: false,
					customClass: {
						popup: `bg-${primaryColor}`,
						htmlContainer: `text-${textColor}`,
					}
				})
			}
		}}>
			{onMyChain ?
				<>New Product <i className='fas fa-plus'/></> :
				<>Switch to <b>{chainData[blockchain]?.name}</b></>
			}
	</button>
};

export default CreateProduct;