import { useState, useEffect, useCallback } from 'react';
import InputField from '../common/InputField.jsx';
import InputSelect from '../common/InputSelect.jsx';
import { rFetch } from '../../utils/rFetch.js';
import { useSelector } from 'react-redux';
import blockchainData from '../../utils/blockchainData';
import { web3Switch } from '../../utils/switchBlockchain';
import { erc721Abi, diamondFactoryAbi } from '../../contracts';
import { metamaskCall } from '../../utils/metamaskUtils';
import Swal from 'sweetalert2';
import {utils} from 'ethers';

const TransferTokens = () => {
	const { currentChain, currentUserAddress, contractCreator } = useSelector(store => store.contractStore);

	const [isCreator, setIsCreator] = useState(false);
	const [isDiamond, setIsDiamond] = useState(false);
	const [traderRole, setTraderRole] = useState(false);

	const [contractData, setContractData] = useState();

	const [userContracts, setUserContracts] = useState([]);
	const [selectedContract, setSelectedContract] = useState('null');

	const [contractProducts, setContractProducts] = useState([]);
	const [selectedProduct, setSelectedProducts] = useState('null');

	const [ownedTokens, setOwnedTokens] = useState([]);
	const [tokenId, setTokenId] = useState(0);
	const [targetAddress, setTargetAddress] = useState('');

	const [contractBlockchain, setContractBlockchain] = useState();
	const [contractInstance, setContractInstance] = useState();

	const getUserContracts = useCallback(async () => {
		let response = await rFetch('/api/contracts');
		if (response.success) {
			setUserContracts(response.contracts.map(item => {
				return {
					label: `${item.title} (${item.diamond ? 'Diamond' : 'Classic'})`,
					value: `/network/${item.blockchain}/${item.contractAddress}`
				}
			}));
		}
	}, [setUserContracts]);

	useEffect(getUserContracts, [getUserContracts]);

	const getContractData = useCallback(async () => {
		setSelectedProducts('null');
		setContractProducts([]);
		setTraderRole(false);
		setContractInstance();

		if (selectedContract !== 'null') {
			let response1 = await rFetch(`/api/contracts/${selectedContract}`);
			if (response1.success) {
				setContractData(response1.contract);
			}
			let response2 = await rFetch(`/api/contracts/${selectedContract}/products/offers`);
			if (response2.success) {
				setContractProducts(response2.products.map(item => {
					return {
						label: `${item.name}`,
						value: item.collectionIndexInContract
					}
				}));
			}
			let selectedBlockchain = selectedContract.split('/')[2];
			setContractBlockchain(blockchainData[selectedBlockchain]);
		}
	}, [selectedContract]);

	useEffect(getContractData, [getContractData]);

	const getProductNFTs = useCallback(async () => {
		if (selectedProduct !== 'null') {
			let response4 = await rFetch(`/api/nft/${selectedContract}/${Number(selectedProduct)}`);
			if (response4.success) {
				setOwnedTokens(response4.result.tokens);
			}
		}
	}, [selectedProduct])

	useEffect(getProductNFTs, [getProductNFTs]);

	useEffect(() => {
		if (contractBlockchain && currentChain === contractBlockchain.chainId) {
			let contractAddress = selectedContract.split('/')[3];
			let instance = contractCreator(contractAddress, contractData.diamond ? diamondFactoryAbi : erc721Abi);
			setContractInstance(instance);
		}
	}, [currentChain, contractBlockchain, selectedContract]);

	const hasTraderRole = useCallback(async () => {
		if (contractInstance !== undefined) {
			const response = await metamaskCall(
				contractInstance.hasRole(
					await contractInstance.TRADER(),
					currentUserAddress
				)
			)
			setTraderRole(response);
		}
	}, [contractInstance]);

	useEffect(hasTraderRole, [hasTraderRole]);

	return <div className='col-12 row'>
		<div className='col-12'>
			<InputSelect
				getter={selectedContract}
				setter={setSelectedContract}
				options={userContracts}
				customClass='form-control'
				label='Contract'
				placeholder='Select your contract'
			/>
			<br/>
			{selectedContract !== null && contractProducts.length > 0 &&
				<InputSelect
					getter={selectedProduct}
					setter={setSelectedProducts}
					options={contractProducts}
					customClass='form-control'
					label='Product'
					placeholder='Select your product'
				/>
			}
		</div>
		<br/>
		<hr/>
		{selectedProduct !== 'null' && <>
			<div className='col-12'>
				<br/>
				Your owned tokens:<br />
				{
					ownedTokens.map((item, index) => {
						return <button
							className={`btn btn-primary mx-2`}
							onClick={() => {
								setTokenId(item.uniqueIndexInContract)
							}} key={index}>
							#{item.uniqueIndexInContract}
						</button>
					})
				}
				<br/>
				<InputField 
					getter={tokenId}
					setter={setTokenId}
					label='Token #'
					customClass='form-control'
					labelClass='col-12'
					type='number'
				/>
				<br/>
				<InputField 
					getter={targetAddress}
					setter={setTargetAddress}
					label='Send to'
					customClass='form-control'
					labelClass='col-12'
				/>
			</div>
			<br/>
			<br/>
			<hr/>
			<div className='col-12 col-md-6'>
				{contractBlockchain &&
					<button
						disabled={currentChain === contractBlockchain.chainId}
						className='btn btn-royal-ice'
						onClick={() => web3Switch(contractBlockchain.chainId)}>
					1.- Switch to {contractBlockchain.name}
				</button>}
			</div>
			<div className='col-12 col-md-6'>
				{contractInstance &&
					<button
						disabled={currentChain !== contractBlockchain.chainId || traderRole}
						className='btn btn-royal-ice'
						onClick={async () => {
							Swal.fire({
								title: 'Please wait',
								html: 'Granting TRADER role',
								icon: 'info',
								showConfirmButton: false
							});
							if (await metamaskCall(contractInstance.grantRole(await contractInstance.TRADER(), currentUserAddress))) {
								Swal.fire({
									title: 'Success',
									html: 'Role granted',
									icon: 'success'
								});
							}
						}}>
					2.- Approve your address
				</button>}
			</div>
			<hr/>
			<div className='col-12 col-md-12'>
				<button
					disabled={currentChain !== contractBlockchain.chainId || !traderRole || targetAddress === ''}
					className='btn btn-royal-ice'
					onClick={async () => {
						Swal.fire({
							title: 'Please wait',
							html: `Transferring token to ${targetAddress}`,
							icon: 'info',
							showConfirmButton: false
						});
						
						if (await metamaskCall(contractInstance['safeTransferFrom(address,address,uint256)'](
							utils.getAddress(currentUserAddress),
							utils.getAddress(targetAddress),
							tokenId
						))) {
							Swal.fire({
								title: 'Please wait',
								html: 'Token sent',
								icon: 'info'
							});
						}
					}}>
					Transfer #{tokenId} to {targetAddress}
				</button>
			</div>
		</>}
	</div>

}

export default TransferTokens;