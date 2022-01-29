import { useState, useEffect } from 'react';
import InputField from '../../common/InputField.jsx';
import { useSelector } from 'react-redux';

const DiamondCustomPaymentRow = ({index, array, recipient, deleter, percentage, renderer, editable, message, minterDecimals, disabled}) => {
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
					disabled={!editable || disabled}
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
					disabled={!editable || disabled}
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

export default DiamondCustomPaymentRow;