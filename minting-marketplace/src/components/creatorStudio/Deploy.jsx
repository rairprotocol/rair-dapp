import { useState, useEffect, useCallback } from 'react';
import { useSelector } from 'react-redux';
import chainData from '../../utils/blockchainData.js'
import InputField from '../common/InputField.jsx';
import InputSelect from '../common/InputSelect.jsx';
import Swal from 'sweetalert2';
import { utils } from 'ethers';
import { metamaskCall } from '../../utils/metamaskUtils.js';

import NavigatorFactory from './NavigatorFactory.jsx';

const Factory = () => {
	const [contractName, setContractName] = useState('');
	const [chainId, setChainId] = useState('null');
	const [deploymentPrice, setDeploymentPrice] = useState(0);
	const [userBalance, setUserBalance] = useState(0);
	const [tokenSymbol, setTokenSymbol] = useState('');
	const [deploying, setDeploying] = useState(false);

	const { currentUserAddress, programmaticProvider, factoryInstance, erc777Instance } = useSelector(store => store.contractStore);
	const { primaryColor, secondaryColor } = useSelector(store => store.colorStore);
	const { adminRights } = useSelector(store => store.userStore);

	const getPrice = useCallback(async () => {
		if (window.ethereum) {
			setChainId(window.ethereum.chainId);
		} else if (programmaticProvider) {
			setChainId(programmaticProvider.provider._network.chainId);
		}
		if (factoryInstance && erc777Instance) {
			setDeploymentPrice(await factoryInstance.deploymentCostForERC777(erc777Instance.address));
			setUserBalance(await erc777Instance.balanceOf(currentUserAddress));
			setTokenSymbol(await erc777Instance.symbol());
		}
	}, [currentUserAddress, factoryInstance, erc777Instance, programmaticProvider]);

	useEffect(() => {
		getPrice()
	}, [getPrice])

	useEffect(() => {
		if (chainId !== 'null') {
			if (window.ethereum) {
				if (chainId === window.ethereum.chainId) {
					return;
				}
				window.ethereum.request({
					method: 'wallet_switchEthereumChain',
					params: [{ chainId: chainId }],
				});
			} else {
				Swal.fire('Blockchain Switch is disabled on Programmatic Connections!', 'Switch to the proper chain manually!');
			}
			setDeploymentPrice(0);
			setTokenSymbol('');
			setUserBalance(0);
		}
	}, [chainId])

	return <div className='row my-5 px-0 mx-0'>
		<NavigatorFactory>
			<div className='col-3 p-2'>
				<input type='radio' name='test' id='Simple' className={`stimorol-radio bg-${primaryColor}`} /> <label htmlFor='Simple' style={{fontSize: 'smaller'}}> Simple </label>
			</div>
			<div className='col-3 p-2'>
				<input type='radio' name='test' id='Simple' className={`stimorol-radio bg-${primaryColor}`} /> <label htmlFor='Advanced' style={{fontSize: 'smaller'}}> Advanced </label>
			</div>
			<div className='col-12 p-2'>
				<InputField
					getter={contractName}
					setter={setContractName}
					placeholder='Name your contract'
					label="New Contract's name"
					customClass='rounded-rair form-control'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					labelClass='text-start w-100'
					/>
			</div>
			<div className='col-12 p-2'>
				<InputSelect
					options={Object.keys(chainData).map((item, index, array) => {
						return {label: chainData[item].name, value: item}
					})}
					getter={chainId}
					setter={setChainId}
					placeholder='Please select'
					label="Contract's Blockchain"
					customClass='rounded-rair form-control'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					labelClass='text-start w-100'
					optionClass='text-white'
					/>
			</div>
			<div className='col-12 p-2'>
				<button
					disabled={contractName === '' || chainId === 'null' || adminRights === false || deploymentPrice === 0 || userBalance === 0 || deploying}
					className='btn btn-stimorol w-100 rounded-rair'
					onClick={async e => {
						setDeploying(true);
						Swal.fire({
							title: 'Deploying contract!',
							html: 'Please wait...',
							icon: 'info',
							showConfirmButton: false
						});
						let success = await metamaskCall(erc777Instance.send(
							factoryInstance.address,
							deploymentPrice,
							utils.toUtf8Bytes(contractName)
						));
						setDeploying(false);
						if (success) {
							Swal.fire({
								title: 'Success',
								html: 'Contract deployed',
								icon: 'success',
								showConfirmButton: false
							});
							setContractName('');
						}
					}}
					>
					Deploy using {utils.formatEther(deploymentPrice).toString()} {tokenSymbol} Tokens
				</button>
				Your balance: {utils.formatEther(userBalance).toString()} {tokenSymbol} Tokens
			</div>
			<div className='col-12 p-3 mt-5 rounded-rair' style={{border: '1.3px dashed var(--charcoal-80)'}}>
				Terms of contract deployment: <br />
				<ul className='col-12 mt-3 px-4 text-start' style={{listStyleType: 'disc'}}>
					<li className='row'>
						<div className='col-6 text-start'>
							Admin NFT owner
						</div>
						<span className='col-6 text-end'>
							{adminRights ? 'Done' : "Purchase"}
						</span>
					</li>
				</ul>
			</div>
		</NavigatorFactory>
	</div>
};

export default Factory;