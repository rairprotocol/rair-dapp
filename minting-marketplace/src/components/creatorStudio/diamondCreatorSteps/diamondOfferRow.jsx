import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import colors from '../../../utils/offerLockColors.js'
import InputField from '../../common/InputField.jsx'
import { utils } from 'ethers';
import { validateInteger, metamaskCall } from '../../../utils/metamaskUtils.js';
import Swal from 'sweetalert2';

const DiamondOfferRow = ({
	index,
	deleter,
	offerName,
	range,
	price,
	fixed,
	array,
	rerender,
	maxCopies,
	blockchainSymbol,
	tokensAllowed,
	lockedTokens,
	simpleMode,
	instance,
	rangeIndex
}) => {
	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(offerName);
	const [startingToken, setStartingToken] = useState(range?.at(0));
	const [endingToken, setEndingToken] = useState(range?.at(1));
	const [individualPrice, setIndividualPrice] = useState(price);
	const [allowedTokenCount, setAllowedTokenCount] = useState(tokensAllowed);
	const [lockedTokenCount, setLockedTokenCount] = useState(lockedTokens);
	const [valuesChanged, setValuesChanged] = useState(false);

	const randColor = colors[index];

	const updater = useCallback((fieldName, setter, value, doRerender = true) => {
		array[index][fieldName] = value;
		setter(value);
		if (doRerender) {
			if (fixed && !valuesChanged) {
				console.log(fieldName);
				setValuesChanged(true);
			}
			rerender();
		}
	}, [array, index, rerender]);

	const updateEndingToken = useCallback( (value) => {
		if (!array) {
			return;
		}
		array[index].range[1] = Number(value);
		setEndingToken(Number(value));
		if (array[Number(index) + 1] !== undefined) {
			array[Number(index) + 1].range[1] = Number(value) + 1;
		}
		rerender();
	},[array, index, rerender])
	
	const updateStartingToken = useCallback((value) => {
		if (!array) {
			return;
		}
		array[index].range[0] = Number(value);
		setStartingToken(value);
		if (Number(endingToken) < Number(value)) {
			updateEndingToken(Number(value));
		}
		rerender();
	}, [array, endingToken, index, rerender, updateEndingToken])

	useEffect(() => {
		if (range?.at(0) === startingToken) {
			return;
		}
		updateStartingToken(range?.at(0));
	}, [range, updateStartingToken, startingToken])

	useEffect(() => {
		let correctCount = endingToken - startingToken + 1;
		if (!fixed && simpleMode && correctCount !== allowedTokenCount) {
			updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
			updater('lockedTokens', setLockedTokenCount, correctCount, false);
		}
		if (!fixed && correctCount < allowedTokenCount) {
			updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
		}
		if (!fixed && correctCount < lockedTokenCount) {
			updater('lockedTokens', setLockedTokenCount, correctCount, false);
		}
		if (range?.at(1) === endingToken) {
			return;
		}
		updateEndingToken(range?.at(1));
	}, [
		range,
		updateEndingToken,
		endingToken,
		updater,
		setAllowedTokenCount,
		setLockedTokenCount,
		startingToken,
		allowedTokenCount,
		lockedTokenCount,
		simpleMode,
		fixed,
		valuesChanged
	])

	useEffect(() => {
		setIndividualPrice(price);
	}, [price])

	useEffect(() => {
		setItemName(offerName);
	}, [offerName])

	const disabledClass = (fixed && !valuesChanged) ? '' : 'border-stimorol rounded-rair'

	const updateRange = async () => {
		Swal.fire({
			title: 'Updating range...',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		if (await metamaskCall(
			instance.updateRange(
				rangeIndex,
				itemName,
				individualPrice,
				allowedTokenCount,
				lockedTokenCount
			)
		)) {
			Swal.fire({
				title: 'Success!',
				html: 'The range has been updated!',
				icon: 'success',
				showConfirmButton: true
			});
		}
	}

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
						setter={value => updater('offerName', setItemName, value)}
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
			</div>
			<div className={`col-12 col-md-1 pt-4 px-0`}>
				{fixed ?
				<button
					onClick={updateRange}
					disabled={!valuesChanged}
					className={`btn w-100 btn-${valuesChanged ? 'stimorol' : 'success'} rounded-rair`}>
					{
						valuesChanged ? 'Update' : 'Saved' 
					}
				</button>
				:
				<button onClick={deleter} className='btn w-100 btn-danger rounded-rair'>
					<i className='fas fa-trash' />
				</button>}
			</div>
			<div className={`col-12 col-md-4`}>
				Starting token:
				<div className={`${!fixed && disabledClass} w-100`}>
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
				<div className={`${!fixed && disabledClass} w-100`}>
					<InputField
						getter={endingToken}
						setter={updateEndingToken}
						customClass='form-control rounded-rair'
						disabled={fixed}
						type='number'
						min={startingToken}
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
						min='0'
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
				{validateInteger(individualPrice) && 
					<small>
						{utils.formatEther(individualPrice === '' ? 0 : individualPrice).toString()} {blockchainSymbol}
					</small>}
			</div>
			{!simpleMode && <div className={`col-12 col-md-6`}>
				Tokens allowed to mint:
				{!fixed && <button onClick={() => updater('tokensAllowed', setAllowedTokenCount, endingToken - startingToken + 1)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
				<div className={`${disabledClass} w-100`}>
					<InputField
						getter={allowedTokenCount}
						setter={value => updater('tokensAllowed', setAllowedTokenCount, value)}
						type='number'
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
						min='0'
						max={endingToken - startingToken + 1}
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