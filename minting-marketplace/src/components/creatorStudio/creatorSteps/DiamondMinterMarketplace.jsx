import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
// import withReactContent from 'sweetalert2-react-content';
import InputField from '../../common/InputField.jsx';
import { useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { utils } from 'ethers';
// import {web3Switch} from '../../../utils/switchBlockchain.js';

// const rSwal = withReactContent(Swal);

const RangeConfig = ({item}) => {
	const [tokensToSell, setTokensToSell] = useState(0);
	const [onBatch, setOnBatch] = useState(true);
	const [customPayments, setCustomPayments] = useState([{
		receiver: process.env.REACT_APP_NODE_ADDRESS,
		percentage: 9,
		editable: false
	}]);
	const [rerender, setRerender] = useState(false);

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

	return <div className='rounded-rair row col-12'>
		<div className='col-5 rounded-rair text-start'>
			<b>{item.offerName}</b>
			<br />
			{item.tokensAllowed} tokens available for {utils.formatEther(item.price)} {chainData[window.ethereum.chainId].symbol}
		</div>
		<div className='col-6 text-start'>
			Tokens to sell
			<div className='border-stimorol w-100 rounded-rair'>
				<InputField
					getter={tokensToSell}
					setter={setTokensToSell}
					type='number'
					customClass='form-control rounded-rair my-0'
				/>
			</div>
		</div>
		<div className='col-1 rounded-rair'>
			<button onClick={() => setOnBatch(!onBatch)} className={`btn btn-${onBatch ? 'royal-ice' : 'danger'} rounded-rair`}>
				<i className={`fas fa-${onBatch ? 'check' : 'times'}`} />
			</button>
		</div>
		<details className='text-start col-12' style={{position: 'relative'}}>
			<summary className='mb-4'>
				<small>Royalty Splits</small>
			</summary>
			<button onClick={addPayment} style={{position: 'absolute', top: 0, right: 0}} className='rounded-rair btn btn-stimorol'>
				<i className='fas fa-plus'/> Add
			</button>
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
							return <CustomPayRateRow key={index} index={index} array={customPayments} deleter={removePayment} renderer={e => setRerender(!rerender)} {...item}/>
						})}
					</tbody>
				</table>}
			<div className='col-12 rounded-rair text-end'>
				<button className='btn btn-royal-ice rounded-rair'>
					Update with custom splits!
				</button>
			</div>
		</details>
		<hr />
	</div>
}

const CustomPayRateRow = ({index, array, receiver, deleter, percentage, renderer, editable}) => {
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
					disabled={!editable}
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
					disabled={!editable}
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
			{editable && <button onClick={e => deleter(index)} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>}
		</th>
	</tr>
};

const CustomizeFees = ({contractData,/*switchBlockchain*/ correctMinterInstance, /*minterRole*/ setStepNumber, steps}) => {
	const stepNumber = 3;

	const { textColor, primaryColor } = useSelector(store => store.colorStore);
	// const { minterInstance, programmaticProvider, contractCreator  } = useSelector(store => store.contractStore);

	const history = useHistory();

	const [customPayments, setCustomPayments] = useState([]);
	const [rerender, setRerender] = useState(false);
	const [nodeFee, setNodeFee] = useState(0);
	const [treasuryFee, setTreasuryFee] = useState(0);
	const [minterDecimals, setMinterDecimals] = useState(0);
	const [/*settingCustomSplits,*/ setSettingCustomSplits] = useState(false);

	const getContractData = useCallback(async () => {
		if (!correctMinterInstance) {
			return;
		}
		setNodeFee(await correctMinterInstance.nodeFee());
		setTreasuryFee(await correctMinterInstance.treasuryFee());
		setMinterDecimals(await correctMinterInstance.feeDecimals());
	}, [correctMinterInstance])

	useEffect(() => {
		console.log(contractData);
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
	}, [setStepNumber])

	const setCustomFees = async e => {
		setSettingCustomSplits(true);
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
			nextStep();
		} catch(e) {
			console.error(e);
			Swal.fire('Error', '', 'error');
		}
		setSettingCustomSplits(false)
	}
	
	const nextStep = () => {
		history.push(steps[stepNumber].populatedPath);
	}

	let total = customPayments.reduce((prev, current) => {return prev + current.percentage}, 0);
	return <div className='row px-0 mx-0'>
		{contractData?.product?.offers?.map(item => {
			return <RangeConfig {...{item}} />
		})}
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
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					label: customPayments.length ? 'Set custom fees' : 'Skip',
					action: customPayments.length ? setCustomFees : nextStep,
					disabled: customPayments.length ? total !== 90 : false,
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