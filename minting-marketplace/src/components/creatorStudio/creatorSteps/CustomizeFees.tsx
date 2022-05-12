//@ts-nocheck
import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import InputField from '../../common/InputField';
import { useSelector } from 'react-redux';
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import FixedBottomNavigation from '../FixedBottomNavigation';
// import {web3Switch} from '../../../utils/switchBlockchain';

// const rSwal = withReactContent(Swal);

const CustomPayRateRow = ({index, array, receiver, deleter, percentage, renderer}) => {
	const [receiverAddress, setReceiverAddress] = useState(receiver);
	const [percentageReceived, setPercentageReceived] = useState(percentage);

	const { secondaryColor, primaryColor } = useSelector(store => store.colorStore);
	
	useEffect(() => {
		setReceiverAddress(receiver);
	}, [receiver]);

	useEffect(() => {
		setPercentageReceived(percentage);
	}, [percentage]);

	const updatePercentage = (value) => {
		setPercentageReceived(value);
		array[index].percentage = Number(value);
		renderer()
	}

	const updateReceiver = (value) => {
		setReceiverAddress(value);
		array[index].receiver = value;
		renderer()
	}

	return <tr>
		<th className='px-2'>
			<div className='w-100 border-stimorol rounded-rair'>
				<InputField
					labelClass='w-100 text-start'
					customClass='form-control rounded-rair'
					getter={receiverAddress}
					setter={updateReceiver}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th className='px-2'>
			<div className='w-100 border-stimorol rounded-rair'>
				<InputField
					labelClass='w-100 text-start'
					customClass='form-control rounded-rair'
					min='0'
					max='100'
					type='number'
					getter={percentageReceived}
					setter={updatePercentage}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th>
			<button onClick={e => deleter(index)} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>
		</th>
	</tr>
};

const CustomizeFees = ({contractData, correctMinterInstance, setStepNumber, steps, stepNumber, gotoNextStep, goBack}) => {
	const { textColor, primaryColor } = useSelector(store => store.colorStore);

	const [customPayments, setCustomPayments] = useState([]);
	const [rerender, setRerender] = useState(false);
	const [nodeFee, setNodeFee] = useState(0);
	const [treasuryFee, setTreasuryFee] = useState(0);
	const [minterDecimals, setMinterDecimals] = useState(0);
	const [sendingData, setSendingData] = useState(false);

	const getContractData = useCallback(async () => {
		if (!correctMinterInstance) {
			return;
		}
		setNodeFee(await correctMinterInstance.nodeFee());
		setTreasuryFee(await correctMinterInstance.treasuryFee());
		setMinterDecimals(await correctMinterInstance.feeDecimals());
	}, [correctMinterInstance])

	useEffect(() => {
		getContractData()
	}, [getContractData])

	const removePayment = (index) => {
		let aux = [...customPayments];
		aux.splice(index, 1);
		setCustomPayments(aux);
	}

	const addPayment = () => {
		let aux = [...customPayments];
		aux.push({
			receiver: '',
			percentage: 0
		});
		setCustomPayments(aux);
	}
	// let onMyChain = window.ethereum ?
	// 	chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
	// 	:
	// 	chainData[contractData?.blockchain]?.chainId === programmaticProvider.provider._network.chainId;
	
	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber, stepNumber])

	const setCustomFees = async e => {
		setSendingData(true);
		try {
			Swal.fire({
				title: 'Setting custom fees',
				html: 'Please wait...',
				icon: 'info',
				showConfirmButton: false
			});
			await (await correctMinterInstance.setCustomPayment(
				contractData.product?.offers[0]?.offerPool,
				customPayments.map(i => i.receiver),
				customPayments.map(i => i.percentage * Math.pow(10, minterDecimals))
			)).wait();
			Swal.fire({
				title: 'Success',
				html: 'Custom fees set',
				icon: 'success',
				showConfirmButton: false
			});
			gotoNextStep();
		} catch(e) {
			console.error(e);
			Swal.fire('Error', '', 'error');
		}
		setSendingData(false)
	}
	
	let total = customPayments.reduce((prev, current) => {return prev + current.percentage}, 0);
	return <div className='row px-0 mx-0'>
		{contractData && customPayments?.length !== 0 &&
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
				<tbody style={{maxHeight: '50vh', overflowY: 'scroll'}}>
					{customPayments.map((item, index, array) => {
						return <CustomPayRateRow key={index} index={index} array={customPayments} deleter={removePayment} renderer={e => setRerender(!rerender)} {...item}/>
					})}
				</tbody>
			</table>}
		<div className='col-12'>Node Fee: {nodeFee / Math.pow(10, minterDecimals)}%, Treasury Fee: {treasuryFee / Math.pow(10, minterDecimals)}%</div>
		<div className='col-12'>
			Total: {(total) + (nodeFee / Math.pow(10, minterDecimals)) + (treasuryFee / Math.pow(10, minterDecimals))}%
		</div>
		<div className='col-12 mt-3 text-center'>
			<div className='border-stimorol rounded-rair'>
				<button onClick={addPayment} className={`btn btn-${primaryColor} rounded-rair px-4`}>
					Add new <i className='fas fa-plus' style={{border: `solid 1px ${textColor}`, borderRadius: '50%', padding: '5px'}} />
				</button>
			</div>
		</div>
		{chainData && <FixedBottomNavigation
				backwardFunction={goBack}
				forwardFunctions={[{
					label: customPayments.length ? 'Set custom fees' : 'Continue',
					action: customPayments.length ? setCustomFees : gotoNextStep,
					disabled: sendingData || (customPayments.length ? total !== 90 : false),
				}]}
			/>}
	</div>
};

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <CustomizeFees {...value} {...props}/>
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;