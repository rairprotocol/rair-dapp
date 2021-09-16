import {useState} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField.jsx';
import {useSelector} from 'react-redux';
import {utils} from 'ethers'
import {erc721Abi} from '../../contracts';

const rSwal = withReactContent(Swal);

const ModalContent = ({instance}) => {
	return <>
		Coming soon!
		<br />
		<button onClick={async e => {
			rSwal.close();
		}} className='btn my-3 btn-success'>
			Close!
		</button>
	</>
}

const CreateProduct = ({address}) => {
	const {factoryInstance, erc777Instance, contractCreator} = useSelector(store => store.contractStore);
	
	return <button
		disabled={address === undefined}
		className='btn btn-success py-0'
		style={{position: 'absolute', right: '1px'}}
		onClick={async e => {
			rSwal.fire({
				html: <ModalContent instance={await contractCreator(address, erc721Abi)}/>,
				showConfirmButton: false
			})
		}}>
		New Product <i className='fas fa-plus'/>
	</button>
};

export default CreateProduct;