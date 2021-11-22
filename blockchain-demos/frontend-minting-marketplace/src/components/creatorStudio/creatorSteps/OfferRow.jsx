import { useState, useEffect } from 'react';
import {useSelector} from 'react-redux';
import colors from '../../../utils/offerLockColors.js'
import InputField from '../../common/InputField.jsx'

const OfferRow = ({index, deleter, name, starts, ends, price, fixed, array, rerender, maxCopies}) => {

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(name);
	const [startingToken, setStartingToken] = useState(starts);
	const [endingToken, setEndingToken] = useState(ends);
	const [individualPrice, setIndividualPrice] = useState(price);

	//const [randColor, ] = useState(Math.abs(0xE4476D - (0x58ec5c * index)));
	const randColor = colors[index];

	const updater = (name, setter, value) => {
		array[index][name] = value;
		setter(value);
		rerender();
	};

	const updateEndingToken = (value) => {
		array[index].ends = Number(value);
		setEndingToken(Number(value));
		if (array[Number(index) + 1] !== undefined) {
			array[Number(index) + 1].starts = Number(value) + 1;
		}
		rerender();
	}
	
	const updateStartingToken = (value) => {
		array[index].starts = Number(value);
		setStartingToken(value);
		if (Number(endingToken) < Number(value)) {
			updateEndingToken(Number(value));
		}
		rerender();
	}

	useEffect(() => {
		updateStartingToken(starts);
	}, [starts])

	useEffect(() => {
		updateEndingToken(ends);
	}, [ends])

	useEffect(() => {
		setIndividualPrice(price);
	}, [price])

	useEffect(() => {
		setItemName(name);
	}, [name])

	const disabledClass = fixed ? '' : 'border-stimorol rounded-rair'

	return <tr>
		<th>
			<button disabled className='btn btn-charcoal rounded-rair'>
				<i style={{color: `${randColor}`}} className='fas fa-key' />
			</button>
		</th>
		<th className='p-1'>
			<div className={`${disabledClass} w-100`}>
				<InputField
					getter={itemName}
					disabled={fixed}
					setter={value => updater('name', setItemName, value)}
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={startingToken}
				setter={updateStartingToken}
				type='number'
				min='0'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<div className={`${disabledClass} w-100`}>
				<InputField
					getter={endingToken}
					setter={updateEndingToken}
					customClass='form-control rounded-rair'
					disabled={fixed}
					type='number'
					min='0'
					max={maxCopies}
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th className='p-1'>
			<div className={`${disabledClass} w-100`}>
				<InputField
					getter={individualPrice}
					setter={value => updater('price', setIndividualPrice, value)}
					type='number'
					disabled={fixed}
					min='0'
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th>
			{!fixed && <button onClick={deleter} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>}
		</th>
	</tr>
};

export default OfferRow;