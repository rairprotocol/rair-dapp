import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import colors from '../../../utils/offerLockColors.js'
import InputField from '../../common/InputField.jsx'
import { utils } from 'ethers';

const DiamondOfferRow = ({
	index,
	deleter,
	name,
	starts,
	ends,
	price,
	fixed,
	array,
	rerender,
	maxCopies,
	blockchainSymbol,
	allowedTokens,
	lockedTokens,
	simpleMode
}) => {
	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(name);
	const [startingToken, setStartingToken] = useState(starts);
	const [endingToken, setEndingToken] = useState(ends);
	const [individualPrice, setIndividualPrice] = useState(price);
	const [allowedTokenCount, setAllowedTokenCount] = useState(allowedTokens);
	const [lockedTokenCount, setLockedTokenCount] = useState(lockedTokens);

	const randColor = colors[index];

	const updater = (name, setter, value) => {
		array[index][name] = value;
		setter(value);
		rerender();
	};

	const updateEndingToken = useCallback( (value) => {
		array[index].ends = Number(value);
		setEndingToken(Number(value));
		if (array[Number(index) + 1] !== undefined) {
			array[Number(index) + 1].starts = Number(value) + 1;
		}
		rerender();
	},[array, index, rerender])
	
	const updateStartingToken = useCallback((value) => {
		array[index].starts = Number(value);
		setStartingToken(value);
		if (Number(endingToken) < Number(value)) {
			updateEndingToken(Number(value));
		}
		rerender();
	}, [array, endingToken, index, rerender, updateEndingToken])

	useEffect(() => {
		if (starts === startingToken) {
			return;
		}
		updateStartingToken(starts);
	}, [starts, updateStartingToken, startingToken])

	useEffect(() => {
		if (ends === endingToken) {
			return;
		}
		updateEndingToken(ends);
	}, [ends, updateEndingToken, endingToken])

	useEffect(() => {
		setIndividualPrice(price);
	}, [price])

	useEffect(() => {
		setItemName(name);
	}, [name])

	const disabledClass = fixed ? '' : 'border-stimorol rounded-rair'

	return <div className='col-12 row'>
		<button disabled className='col-12 col-md-1 btn btn-charcoal rounded-rair'>
			<i style={{color: `${randColor}`}} className='fas fa-key h1' />
		</button>
		<div className='col-12 col-md-11 row'>
			<div className={`col-12 col-md-11 px-2`}>
				Range name:
				<div className={`${disabledClass} w-100 mb-2`}>
					<InputField
						getter={itemName}
						disabled={fixed}
						setter={value => updater('name', setItemName, value)}
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
			</div>
			<div className={`col-12 col-md-1 pt-4`}>
				{!fixed && <button onClick={deleter} className='btn w-100 btn-danger rounded-rair'>
					<i className='fas fa-trash' />
				</button>}
			</div>
			<div className={`col-12 col-md-4`}>
				Starting token:
				<div className={`${disabledClass} w-100`}>
					<InputField
						disabled={true}
						getter={startingToken}
						setter={updateStartingToken}
						type='number'
						min='0'
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
			</div>
			<div className={`col-12 col-md-4`}>
				Ending token:
				{!fixed && <button onClick={() => updateEndingToken(maxCopies)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
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
			</div>
			<div className={`col-12 col-md-4`}>
				Range price:
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
				<small>{utils.formatEther(individualPrice === '' ? 0 : individualPrice).toString()} {blockchainSymbol}</small>
			</div>
			{!simpleMode && <div className={`col-12 col-md-6`}>
				Tokens allowed to mint:
				{!fixed && <button onClick={() => updater('allowedTokens', setAllowedTokenCount, endingToken - startingToken + 1)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
				<div className={`${disabledClass} w-100`}>
					<InputField
						getter={allowedTokenCount}
						setter={value => updater('allowedTokens', setAllowedTokenCount, value)}
						type='number'
						disabled={fixed}
						min='0'
						max={endingToken - startingToken + 1}
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
			</div>}
			{!simpleMode && <div className={`col-12 col-md-6`}>
				Minted tokens needed before trades are unlocked:
				{!fixed && <button onClick={() => updater('lockedTokens', setLockedTokenCount, endingToken - startingToken + 1)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
				<div className={`${disabledClass} w-100`}>
					<InputField
						getter={lockedTokenCount}
						setter={value => updater('lockedTokens', setLockedTokenCount, value)}
						type='number'
						disabled={fixed}
						min='0'
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
			</div>}
		</div>
		<hr className='my-4' />
	</div>
};

export default DiamondOfferRow;