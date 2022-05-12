//@ts-nocheck
import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';
import InputField from '../common/InputField';
import { useSelector } from 'react-redux';
import chainData from '../../utils/blockchainData';
const rSwal = withReactContent(Swal);

const CustomPayRateRow = ({index, array, receiver, deleter, percentage, renderer}) => {
	const [receiverAddress, setReceiverAddress] = useState(receiver);
	const [percentageReceived, setPercentageReceived] = useState(percentage);

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

	return <>
		<div className='col-8 my-2'>
			<InputField
				label={index === 0 ? 'Recipient Address' : undefined}
				labelClass='w-100 text-start'
				customClass='form-control rounded-rair'
				getter={receiverAddress}
				setter={updateReceiver}
			/>
		</div>
		<div className='col-3 my-2'>
			<InputField
				label={index === 0 ? 'Percentage' : undefined}
				labelClass='w-100 text-start'
				customClass='form-control rounded-rair'
				min='0'
				max='100'
				type='number'
				getter={percentageReceived}
				setter={updatePercentage}
			/>
		</div>
		<div className='col-1 my-2'>
			{index === 0 && <br/>}
			<button onClick={e => deleter(index)} className='btn btn-royal-ice rounded-rair'>
				<i className='fas fa-trash' />
			</button>
		</div>
	</>
};

const ModalContent = ({instance, catalogIndex}) => {

	const [customPayments, setCustomPayments] = useState([]);
	const [rerender, setRerender] = useState(false);
	const [nodeFee, setNodeFee] = useState(0);
	const [treasuryFee, setTreasuryFee] = useState(0);
	const [minterDecimals, setMinterDecimals] = useState(0);
	const [settingCustomSplits, setSettingCustomSplits] = useState(false);

	const getContractData = useCallback(async () => {
		setNodeFee(await instance.nodeFee());
		setTreasuryFee(await instance.treasuryFee());
		setMinterDecimals(await instance.feeDecimals());
	}, [instance])

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

	let total = customPayments.reduce((prev, current) => {return prev + current.percentage}, 0);
	return <div className='row px-0 mx-0'>
		<button onClick={addPayment} className='col-1 btn btn-stimorol'>
			<i className='fas fa-plus' />
		</button>

		<div className='col-12 row px-0 mx-0 my-3' style={{maxHeight: '60vh', overflowY: 'scroll'}}>
			{customPayments.map((item, index) => {
				return <CustomPayRateRow key={index} index={index} array={customPayments} deleter={removePayment} renderer={e => setRerender(!rerender)} {...item}/>
			})}
		</div>
		<div className='col-12'>Node Fee: {nodeFee / Math.pow(10, minterDecimals)}%, Treasury Fee: {treasuryFee / Math.pow(10, minterDecimals)}%</div>
		<div className='col-12'>
			Total: {(total) + (nodeFee / Math.pow(10, minterDecimals)) + (treasuryFee / Math.pow(10, minterDecimals))}%
		</div>
		<button
			disabled={total !== 90 || !treasuryFee || !nodeFee || !minterDecimals || !instance || settingCustomSplits}
			onClick={async e => {
				Swal.fire('Setting data', '', 'info');
				setSettingCustomSplits(true);
				try {
					await (await instance.setCustomPayment(
						catalogIndex,
						customPayments.map(i => i.receiver),
						customPayments.map(i => i.percentage * Math.pow(10, minterDecimals))
					)).wait();
				} catch(e) {
					console.error(e);
					Swal.fire('Error', '', 'error');
				}
				setSettingCustomSplits(false)
			}}
			className='btn btn-royal-ice'>
			Set data
		</button>
	</div>
};

const CustomizePayRate = ({address, blockchain, catalogIndex, customStyle}) => {
	const { textColor, primaryColor } = useSelector(store => store.colorStore);
	const { minterInstance, programmaticProvider, contractCreator } = useSelector(store => store.contractStore);

	let onMyChain = window.ethereum ? chainData[blockchain]?.chainId === window.ethereum.chainId : chainData[blockchain]?.chainId === programmaticProvider.provider._network.chainId;

	if (!onMyChain) {
		return <></>
	}

	return <button
		style={customStyle}
		disabled={address === undefined || contractCreator === undefined || !window.ethereum}
		className={`btn btn-royal-ice`}
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
					html: <ModalContent
						blockchain={blockchain}
						instance={minterInstance}
						catalogIndex={catalogIndex}
					/>,
					showConfirmButton: false,
					customClass: {
						popup: `bg-${primaryColor} w-100`,
						htmlContainer: `text-${textColor}`,
					}
				})
			}
		}}>
			{onMyChain ?
				<>
					Customize Fees
				</>
				:
				<>
					Switch to <b>{chainData[blockchain]?.chainId}</b>
				</>
			}
	</button>
}

export default CustomizePayRate;