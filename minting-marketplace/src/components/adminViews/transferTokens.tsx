
import { useState, useEffect, useCallback } from 'react';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import { rFetch } from '../../utils/rFetch';
import { useSelector } from 'react-redux';
import blockchainData from '../../utils/blockchainData';
import { web3Switch } from '../../utils/switchBlockchain';
import { erc721Abi, diamondFactoryAbi } from '../../contracts';
import { metamaskCall } from '../../utils/metamaskUtils';
import Swal from 'sweetalert2';
import { RootState } from '../../ducks';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import { BlockchainInfoType, ContractDataType, ContractsResponseType } from './adminView.types';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import { ethers } from 'ethers';
import { TTokenData } from '../../axios.responseTypes';

const TransferTokens = () => {
	const { currentChain, currentUserAddress, contractCreator } = useSelector<RootState, ContractsInitialType>(store => store.contractStore);

	const [traderRole, setTraderRole] = useState<boolean | undefined>();
	const [manualAddress, setManualAddress] = useState<boolean>(false);
	const [manualDiamond, setManualDiamond] = useState<boolean>(false);

	const [contractData, setContractData] = useState<ContractDataType | undefined>();

	const [userContracts, setUserContracts] = useState<OptionsType[]>([]);
	const [selectedContract, setSelectedContract] = useState<string>('null');

	const [contractProducts, setContractProducts] = useState<OptionsType[]>([]);
	const [selectedProduct, setSelectedProducts] = useState<string>('null');

	const [ownedTokens, setOwnedTokens] = useState<TTokenData[]>([]);
	const [tokenId, setTokenId] = useState<number>(0);
	const [targetAddress, setTargetAddress] = useState<string>('');

	const [contractBlockchain, setContractBlockchain] = useState<BlockchainInfoType | undefined>();
	const [contractInstance, setContractInstance] = useState<ethers.Contract | undefined>();

	const getUserContracts = useCallback(async () => {
		let response: ContractsResponseType = await rFetch('/api/contracts');
		if (response.success) {
			setUserContracts(response.contracts.map(item => {
				return {
					label: `${item.title} (${item.diamond ? 'Diamond' : 'Classic'})`,
					value: `/network/${item.blockchain}/${item.contractAddress}`
				}
			}));
		}
	}, [setUserContracts]);

	useEffect(() => {
		getUserContracts()
	}, [getUserContracts]);

	const connectAddressManual = async () => {
		if(currentChain === undefined) return;
		if (selectedContract === "") return;
		let instance;
		try {
			instance = contractCreator?.(selectedContract, manualDiamond ? diamondFactoryAbi : erc721Abi);
		} catch (err) {
			console.error("Can't connect to address");
		}
		let name = await metamaskCall(
			instance.name(),
			"Unable to connect to the contract, please verify the address, blockchain and type of the contract"
		);

		if (name !== false) {
			setContractData({
				title: name,
				contractAddress: instance.address
			});
			setContractBlockchain(blockchainData[currentChain]);
			//0xbadd57ebb7778de50515be69c0d126e8f562a6a4
			setContractInstance(instance);
		} else {
			return;
		}

		// let tokensOwnedAsyncCall = (async () => {
		// 	let ownedTokensArray = [];
		// 	let numberOfOwnedTokens = (await metamaskCall(instance.balanceOf(currentUserAddress)));
		// 	for (let i = 0; i < numberOfOwnedTokens; i++) {
		// 		ownedTokensArray.push({
		// 			uniqueIndexInContract: (await metamaskCall(instance.tokenOfOwnerByIndex(currentUserAddress, i))).toString()
		// 		});
		// 	}
		// 	setOwnedTokens(ownedTokensArray);
		// })();
	}

	const getContractData = useCallback(async () => {
		setContractInstance(undefined);
		setSelectedProducts('null');
		setContractProducts([]);
		setContractBlockchain(undefined);
		setTraderRole(undefined);
		setOwnedTokens([]);
		setContractData(undefined);
		if (manualAddress) {
			return;
		}
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
			let [,,selectedBlockchain,contractAddress] = selectedContract.split('/');
			setContractBlockchain(blockchainData[selectedBlockchain]);
			if (selectedBlockchain === currentChain) {
				let instance = contractCreator?.(contractAddress, response1.contract.diamond ? diamondFactoryAbi : erc721Abi);
				setContractInstance(instance);
			}
		}
	}, [selectedContract, currentChain, contractCreator, manualAddress]);

	useEffect(() => {
		getContractData()
	}, [getContractData]);

	const getProductNFTs = useCallback(async () => {
		if (manualAddress) {
			return;
		}
		if (selectedProduct !== 'null') {
			let response4 = await rFetch(`/api/nft/${selectedContract}/${Number(selectedProduct)}`);
			if (response4.success) {
				setOwnedTokens(response4.result.tokens);
			}
		}
	}, [manualAddress, selectedProduct, selectedContract])

	useEffect( () => {
		getProductNFTs()
	}, [getProductNFTs]);

	const hasTraderRole = useCallback(async () => {
		if (contractInstance) {
			const response = await metamaskCall(
				contractInstance.hasRole(
					await contractInstance.TRADER(),
					currentUserAddress
				)
			)
			setTraderRole(response);
		}
	}, [contractInstance, currentUserAddress]);

	useEffect( () => {
		hasTraderRole()
	}, [hasTraderRole]);

	return <div className='col-12 row'>
		<button onClick={() => {
			setManualAddress(false)
			setSelectedContract("null");
			setContractData(undefined);
		}} className='btn col-6 btn-royal-ice'>
			Database
		</button>
		<button onClick={() => {
			setManualAddress(true)
			setSelectedContract("");
			setContractData(undefined);
		}} className='btn col-6 btn-stimorol'>
			Blockchain
		</button>
		<div className='col-12 row'>
		{manualAddress === false ? <>
			<InputSelect
				getter={selectedContract}
				setter={setSelectedContract}
				options={userContracts}
				customClass='form-control'
				label='Contract'
				placeholder='Select your contract'
			/>
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
		</> : <>
			<div className='col-12 col-md-10'>
				<InputField 
					getter={selectedContract}
					setter={setSelectedContract}
					label='Contract address'
					customClass='form-control'
					labelClass='col-12'
				/>
			</div>
			<div className='col-12 col-md-2 pt-4'>
				<button onClick={() => setManualDiamond(!manualDiamond)} className={`btn btn-${manualDiamond ? 'royal-ice' : 'stimorol'}`}>
					{manualDiamond ? 'Diamond' : 'Classic'} Contract
				</button>
			</div>
			<div className='col-12'>
				<button disabled={selectedContract === "" || (contractData && contractData.contractAddress === selectedContract)} onClick={connectAddressManual} className='btn btn-success'>
					Connect to address!
				</button>
			</div>
		</>}
		</div>
		<br/>
		<hr/>
		{(selectedProduct !== 'null' || (contractData && manualAddress)) && <>
			<div className='col-12 row'>
				{contractData && <div className='col-12'>
					Connected to: {contractData.title} ({contractData.contractAddress})
				</div>}
				<div className='col-12'>
				Your owned tokens:<br />
				{
					ownedTokens.map((item, index) => {
						return <button
							className={`btn btn-primary mx-2`}
							onClick={() => {
								setTokenId(+item.uniqueIndexInContract)
							}} key={index}>
							#{item.uniqueIndexInContract}
						</button>
					})
				}
				</div>
				<div className='col-12 col-md-6'>
					<InputField 
						getter={tokenId}
						setter={setTokenId}
						label='Token #'
						customClass='form-control'
						labelClass='col-12'
						type='number'
					/>
				</div>
				<div className='col-12 col-md-6'>
					<InputField 
						getter={targetAddress}
						setter={setTargetAddress}
						label='Send to'
						customClass='form-control'
						labelClass='col-12'
					/>
				</div>
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
					1.- {currentChain === contractBlockchain.chainId ? 'Connected to' : 'Switch to'} {contractBlockchain.name}
				</button>}
			</div>
			<div className='col-12 col-md-6'>
				{contractInstance &&
					<button
						disabled={currentChain !== contractBlockchain?.chainId || traderRole !== false}
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
					2.- {traderRole === undefined ?
							'Querying roles...'
							:
							traderRole === true ?
								'Already have Trader role'
								:
								'Grant yourself the Trader role'
							}
				</button>}
			</div>
			<hr/>
			<div className='col-12 col-md-12'>
				{contractInstance &&
					<button
						disabled={currentChain !== contractBlockchain?.chainId || !traderRole || targetAddress === ''}
						className='btn btn-royal-ice'
						onClick={async () => {
							Swal.fire({
								title: 'Please wait',
								html: `Transferring token to ${targetAddress}`,
								icon: 'info',
								showConfirmButton: false
							});
							
							if (await metamaskCall(contractInstance['safeTransferFrom(address,address,uint256)'](
								currentUserAddress,
								targetAddress,
								tokenId
							))) {
								Swal.fire({
									title: 'Success',
									html: 'Token sent',
									icon: 'success'
								});
							}
						}}>
						Transfer #{tokenId} to {targetAddress}
					</button>
				}
			</div>
		</>}
	</div>

}

export default TransferTokens;