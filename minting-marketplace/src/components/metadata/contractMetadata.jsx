//@ts-nocheck
import { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import InputField from '../common/InputField';
//import setDocumentTitle from '../../utils/setTitle';
import {rFetch} from '../../utils/rFetch';
import {useSelector} from 'react-redux';
import { erc721Abi } from '../../contracts'
import chainData from '../../utils/blockchainData';
import swal from 'sweetalert2';

const AttributeRow = ({name, value, array, index}) => {
	const [attributeName, setAttributeName] = useState(name);
	const [attributeValue, setAttributeValue] = useState(value);

	useEffect(() => {
		setAttributeValue(value);
	}, [value])

	useEffect(() => {
		setAttributeName(name);
	}, [name])

	const valueSetter = (value) => {
		array[index].value = value;
		setAttributeValue(value);
	}

	const nameSetter = (value) => {
		array[index].name = value;
		setAttributeName(value);
	}

	return <tr>
		<th>
			<InputField
				disabled='true'
				placeholder='Attribute Name'
				getter={attributeName}
				setter={nameSetter}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
				/>
		</th>
		<th>
			<InputField
				placeholder='Attribute Value'
				getter={attributeValue}
				setter={valueSetter}
				customClass='form-control'
				labelClass='w-100'
				labelCSS={{textAlign: 'left'}}
				/>
		</th>
	</tr>
}

const ContractMetadata = () => {
	const [attributeArray, /*setAttributeArray*/] = useState([
		{name: "name", value: ""},
		{name: "description", value: ""},
		{name: "image", value: ""},
		{name: "external_link", value: ""},
		{name: "seller_fee_basis_points", value: ""},
		{name: "fee_recipient", value: ""}
	]);

	const params = useParams();

	const [contractNetwork, setContractNetwork] = useState()
	
	const [generatedMetadata, setGeneratedMetadata] = useState({});
	const [contractURI, setContractURI] = useState('');
	const [sendingContractURI, setSendingContractURI] = useState(false);

	const { contractCreator } = useSelector(state => state.contractStore);

	const fetchContractData = useCallback(async () => {
		let contractData = await rFetch(`/api/contracts/${params.contract}`)
		if (contractData.success) {
			setContractNetwork(contractData.contract.blockchain);
		}
	}, [params])

	useEffect(() => {
		fetchContractData();
	}, [fetchContractData])

	return <>
		<table>
			<thead>
				<tr>
					<th>
						Name
					</th>
					<th>
						Value
					</th>
				</tr>
			</thead>
			<tbody>
				{attributeArray.map((item, index, array) => {
					return <AttributeRow {...item} key={index} {...{index, array}} />	
				})}
			</tbody>
		</table>
		<button onClick={e => {
			let aux = {};
			attributeArray.forEach(item => {
				aux[item.name] = item.value;
			})
			setGeneratedMetadata(aux);
		}} className='btn btn-royal-ice'>
			Generate Contract Metadata
		</button>
		<hr />
		<textArea disabled={true} rows={5} style={{backgroundColor: 'transparent', color: 'inherit'}} className='text-center'>
			{JSON.stringify(generatedMetadata)}
		</textArea>
		<button onClick={e => {
			navigator.clipboard.writeText(JSON.stringify(generatedMetadata));
		}} className='btn btn-stimorol'>
			Copy to Clipboard
		</button>
		<hr className='my-5' />
		<InputField
			label='If you already have an IPFS link'
			placeholder='Contract URI'
			getter={contractURI}
			setter={setContractURI}
			customClass='form-control'
			labelClass='w-100'
			labelCSS={{textAlign: 'left'}}
			/>
		<button disabled={sendingContractURI} className='btn btn-royal-ice' onClick={async e => {
			if (window.ethereum.chainId !== contractNetwork) {
				swal.fire(`Switch to ${chainData[contractNetwork]?.name}!`);
				return;
			}
			setSendingContractURI(true);
			let instance = contractCreator(params.contract, erc721Abi);
			try {
				await instance.setContractURI(contractURI);
			} catch (err) {
				swal.fire('Error', err?.data?.message);
				console.log(err);
				setSendingContractURI(false);
				return;
			}
			setSendingContractURI(false);
			swal.fire('Product Metadata Set!');
		}} >
			{contractURI ? 'Update' : 'Delete'} Contract-Level URI
		</button>
	</>
};

export default ContractMetadata;