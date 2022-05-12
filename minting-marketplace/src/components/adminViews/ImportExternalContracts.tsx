//@ts-nocheck
import { useState } from 'react';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import { rFetch } from '../../utils/rFetch';
import { utils } from "ethers";
import blockchainData from '../../utils/blockchainData';

const ImportExternalContract = () => {
	const [selectedContract, setSelectedContract] = useState('');
	const [resultData, setResultData] = useState();
	const [selectedBlockchain, setSelectedBlockchain] = useState('null');
	const [sendingData, setSendingData] = useState(false);

	const blockchainOptions = Object.keys(blockchainData).map(blockchainId => {
		return {
			label: blockchainData[blockchainId].name,
			value: blockchainId
		}
	})

	const callImport = async () => {
		setSendingData(true);
		let {success, result} = await rFetch(`/api/contracts/import/network/${selectedBlockchain}/${selectedContract}/`);
		setSendingData(false);
		if (success) {
			setResultData(result);
		}
	}

	return <div className='col-12 row'>
		<h3>
			Import External Data
		</h3>
		<div className='col-12 col-md-4'>
			<InputSelect
				getter={selectedBlockchain}
				setter={setSelectedBlockchain}
				options={blockchainOptions}
				customClass='form-control'
				label='Blockchain'
				placeholder='Select a blockchain'
			/>
		</div>
		<div className='col-12 col-md-8'>
			<InputField 
				getter={selectedContract}
				setter={setSelectedContract}
				label='Contract address'
				customClass='form-control'
				labelClass='col-12'
			/>
		</div>
		<button onClick={callImport} disabled={sendingData || selectedBlockchain === 'null' || !utils.isAddress(selectedContract)} className='btn btn-stimorol col-12'>
			{sendingData ? 'Please wait...' : 'Import Contract!'}
		</button>
		{
			resultData && <div className='mt-5 col-12 text-center'>
				Imported <br/>
				<h3 className='d-inline'>
					{resultData.contract.title}
				</h3> <br/>
				with <br/>
				<h3 className='d-inline'>
					{resultData.numberOfTokensAdded}
				</h3> <br/>
				NFTs
			</div>
		}
	</div>
}

export default ImportExternalContract;