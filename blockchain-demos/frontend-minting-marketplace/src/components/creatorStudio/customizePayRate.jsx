import {useState, useEffect, useCallback} from 'react';
import InputField from '../common/InputField.jsx';

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
		array[index].receiver = Number(value);
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

const CustomizePayRate = () => {
	const [customPayments, setCustomPayments] = useState([]);
	const [rerender, setRerender] = useState(false);

	const addPayment = () => {
		let aux = [...customPayments];
		aux.push({
			receiver: '',
			percentage: 0
		});
		setCustomPayments(aux);
	} 

	const removePayment = (index) => {
		let aux = [...customPayments];
		console.log(aux, index)
		aux.splice(index, 1);
		console.log(aux)
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
		<div className='col-12'>Node Fee: 9%, Treasury Fee: 1%</div>
		<div className='col-12'>
			Total: {total + 9 + 1}
		</div>
		<button disabled={total !== 90} onClick={e => console.log(customPayments.map(i => i.receiver), customPayments.map(i => i.percentage * 1000))} className='btn btn-royal-ice'>
			Set data
		</button>
	</div>
}

export default CustomizePayRate;