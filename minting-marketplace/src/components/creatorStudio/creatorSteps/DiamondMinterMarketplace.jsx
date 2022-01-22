import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import InputField from '../../common/InputField.jsx';
import { useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import { metamaskCall } from '../../../utils/metamaskUtils'; 
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { utils } from 'ethers';

const RangeConfig = ({
	array,
	index,
	nodeFee,
	minterDecimals,
	treasuryFee,
	currentUserAddress,
	treasuryAddress,
	simpleMode
}) => {
	let item = array[index];

	const [rerender, setRerender] = useState(false);
	
	const [customPayments, setCustomPayments] = useState([{
		message: 'Node address',
		recipient: process.env.REACT_APP_NODE_ADDRESS,
		percentage: nodeFee,
		editable: false
	},{
		message: 'Treasury address',
		recipient: treasuryAddress,
		percentage: treasuryFee,
		editable: false
	},{
		message: 'Creator address (You)',
		recipient: currentUserAddress,
		percentage: 90 * Math.pow(10, minterDecimals),
		editable: true
	}]);

	const removePayment = (index) => {
		let aux = [...customPayments];
		aux.splice(index, 1);
		setCustomPayments(aux);
	}

	const addPayment = () => {
		let aux = [...customPayments];
		aux.push({
			recipient: '',
			percentage: 0,
			editable: true
		});
		setCustomPayments(aux);
	}

	useEffect(() => {
		array[index].customSplits = customPayments;
	}, [customPayments, rerender, array, index]);

	let total = customPayments.reduce((prev, current) => {return Number(prev) + Number(current.percentage)}, 0);

	return <div className='rounded-rair row col-12 col-md-6'>
		<div className='col-10 rounded-rair text-start'>
			<h3>{item.offerName}</h3>
			<h5 style={{display: 'inline'}}>
				{item.tokensAllowed}
			</h5> tokens available for <h5 style={{display: 'inline'}}>
				{utils.formatEther(item.price)} {chainData[window.ethereum.chainId].symbol}
			</h5>
		</div>
		<div className='col-2 rounded-rair'>
			<button onClick={() => {
				array[index].selected = !array[index].selected;
				setRerender(!rerender);
			}} className={`btn btn-${array[index].selected ? 'royal-ice' : 'danger'} rounded-rair`}>
				<i className={`fas fa-${array[index].selected ? 'check' : 'times'}`} />
			</button>
			{!simpleMode && <button disabled={!array[index].selected} onClick={() => {
				array[index].visible = !array[index].visible;
				setRerender(!rerender);
			}} className={`btn btn-${array[index].visible ? 'royal-ice' : 'danger'} rounded-rair`}>
				<abbr title={array[index].visible ? 'Public offer' : 'Hidden offer'}>
					<i className={`fas fa-${array[index].visible ? 'eye' : 'eye-slash'}`} />
				</abbr>
			</button>}
		</div>
		{!simpleMode && item.selected && <details className='text-start col-12' style={{position: 'relative'}}>
			<summary className='mb-1'>
				<small>Royalty splits</small>
			</summary>
			{customPayments?.length !== 0 &&
				<table className='col-12 text-start'>
					<thead>
						<tr>
							<th>
								Recipient Address
							</th>
							<th>
								Percentage
							</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{customPayments.map((item, index, array) => {
							return <CustomPayRateRow
										key={index}
										index={index}
										array={customPayments}
										deleter={removePayment}
										renderer={e => setRerender(!rerender)}
										minterDecimals={minterDecimals}
										{...item}
									/>
						})}
					</tbody>
				</table>}
			<div className='row w-100'>
				<div className='col-12 col-md-10 py-2 text-center'>
					Total: {(total) / Math.pow(10, minterDecimals)}%
				</div>
				<button disabled={total >= 100 * Math.pow(10, minterDecimals)} onClick={addPayment} className='col-12 col-md-2 rounded-rair btn btn-stimorol'>
					<i className='fas fa-plus'/> Add
				</button>
			</div>
			{item.onMarketplace && <div className='col-12 rounded-rair text-end'>
				<button className='btn btn-royal-ice rounded-rair'>
					Update with custom splits!
				</button>
			</div>}
		</details>}
		<hr />
	</div>
}

const CustomPayRateRow = ({index, array, recipient, deleter, percentage, renderer, editable, message, minterDecimals}) => {
	const [recipientAddress, setRecipientAddress] = useState(recipient);
	const [percentageReceived, setPercentageReceived] = useState(percentage);

	const { secondaryColor, primaryColor } = useSelector(store => store.colorStore);
	
	useEffect(() => {
		setRecipientAddress(recipient);
	}, [recipient]);

	useEffect(() => {
		setPercentageReceived(percentage);
	}, [percentage]);

	const updatePercentage = (value) => {
		setPercentageReceived(value);
		array[index].percentage = Number(value);
		renderer()
	}

	const updateRecipient = (value) => {
		setRecipientAddress(value);
		array[index].recipient = value;
		renderer()
	}

	return <tr>
		<th className='px-2'>
			<div className='w-100 border-stimorol rounded-rair'>
				<InputField
					disabled={!editable}
					labelClass='w-100 text-start'
					customClass='form-control rounded-rair'
					getter={recipientAddress}
					setter={updateRecipient}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
			<small>{message}</small>
		</th>
		<th className='px-2'>
			<div className='w-100 border-stimorol rounded-rair'>
				<InputField
					disabled={!editable}
					labelClass='w-100 text-start'
					customClass='form-control rounded-rair'
					min='0'
					max={100 * Math.pow(10, minterDecimals)}
					type='number'
					getter={percentageReceived}
					setter={updatePercentage}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
			<small>{percentageReceived / (10 ** minterDecimals)}%</small>
		</th>
		<th style={{width: '5vw'}}>
			{editable && <button onClick={e => deleter(index)} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>}
		</th>
	</tr>
};

const CustomizeFees = ({contractData, setStepNumber, steps, simpleMode}) => {
	const stepNumber = 3;

	const { textColor, primaryColor } = useSelector(store => store.colorStore);
	const { currentUserAddress, diamondMarketplaceInstance } = useSelector(store => store.contractStore);

	const history = useHistory();

	const [offerData, setOfferData] = useState([]);
	const [rerender, setRerender] = useState(false);
	const [nodeFee, setNodeFee] = useState(0);
	const [treasuryFee, setTreasuryFee] = useState(0);
	const [treasuryAddress, setTreasuryAddress] = useState(undefined);
	const [minterDecimals, setMinterDecimals] = useState(0);
	const [sendingData, setSendingData] = useState(false);
	const [hasMinterRole, setHasMinterRole] = useState();

	const getOfferData = useCallback(async () => {
		if (!contractData.product.offers) {
			return;
		}
		setOfferData(contractData.product.offers.map(item => {
			return {
				selected: true,
				tokensToSell: 0,
				customSplits: [],
				visible: true,
				...item
			}
		}))
	}, [contractData])

	useEffect(() => {
		getOfferData()
	}, [getOfferData])


	const getContractData = useCallback(async () => {
		if (!diamondMarketplaceInstance) {
			return;
		}
		console.log(diamondMarketplaceInstance.functions);
		let nodeFeeData = await diamondMarketplaceInstance.getNodeFee()
		setNodeFee(Number(nodeFeeData.nodeFee.toString()));
		setMinterDecimals(nodeFeeData.decimals);
		let treasuryFeeData = await diamondMarketplaceInstance.getTreasuryFee();
		setTreasuryFee(Number(treasuryFeeData.treasuryFee.toString()));
		setTreasuryAddress(await diamondMarketplaceInstance.getTreasuryAddress());
		setHasMinterRole(
			await contractData.instance.hasRole(
				await contractData.instance.MINTER(),
				diamondMarketplaceInstance.address
			)
		)
	}, [diamondMarketplaceInstance])

	useEffect(() => {
		getContractData()
	}, [getContractData])

	// let onMyChain = window.ethereum ?
	// 	chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
	// 	:
	// 	chainData[contractData?.blockchain]?.chainId === programmaticProvider.provider._network.chainId;
	
	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber])

	const setCustomFees = async e => {
		setSendingData(true);
		Swal.fire({
			title: 'Setting custom fees',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		let filteredOffers = offerData.filter(item => item.selected);
		if (await metamaskCall(
			diamondMarketplaceInstance.addMintingOfferBatch(
			//console.log(
				contractData.contractAddress,
				filteredOffers.map(item => item.rangeIndex),
				filteredOffers.map(item => item.customSplits.filter(split => split.editable)),
				filteredOffers.map(item => item.visible),
				process.env.REACT_APP_NODE_ADDRESS
			)
		)) {
			Swal.fire({
				title: 'Success',
				html: 'Offer(s) added to the marketplace',
				icon: 'success',
				showConfirmButton: false
			});
		}
		setSendingData(false)
	}
	
	const nextStep = () => {
		history.push(steps[stepNumber].populatedPath);
	}

	const giveMinterRole = async () => {
		setSendingData(true);
		Swal.fire({
			title: 'Granting minter role',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		if (await metamaskCall(contractData.instance.grantRole(
			await contractData.instance.MINTER(),
			diamondMarketplaceInstance.address
		))) {
			Swal.fire({
				title: 'Success',
				html: 'Custom fees set',
				icon: 'success',
				showConfirmButton: false
			});
			getContractData();
		}
		setSendingData(false);
	}

	return <div className='row px-0 mx-0'>
		{treasuryAddress !== undefined && offerData && offerData.map((item, index, array) => {
			return <RangeConfig key={index} {
				...{
					array,
					index,
					nodeFee,
					minterDecimals,
					treasuryFee,
					currentUserAddress,
					treasuryAddress,
					simpleMode
				}} />
		})}
		{chainData && treasuryAddress && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					label: hasMinterRole ? 'Put selected ranges up for sale!' : 'Approve the marketplace as a Minter!',
					action: hasMinterRole ? setCustomFees : giveMinterRole,
					disabled: sendingData || hasMinterRole === undefined,
				},{
					label: 'Continue',
					action: nextStep,
					disabled: sendingData,
				}]}
			/>}
	</div>
};

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <CustomizeFees {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;