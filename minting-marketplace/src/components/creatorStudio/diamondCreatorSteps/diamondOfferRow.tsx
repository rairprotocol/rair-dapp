//@ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import colors from '../../../utils/offerLockColors'
import InputField from '../../common/InputField'
import { utils } from 'ethers';
import { validateInteger, metamaskCall } from '../../../utils/metamaskUtils';
import Swal from 'sweetalert2';

const DiamondOfferRow = ({
	index,
	deleter,
	offerName,
	range,
	price,
	_id,
	array,
	rerender,
	maxCopies,
	blockchainSymbol,
	copies,
	lockedTokens,
	simpleMode,
	instance,
	offerIndex,
	diamondRangeIndex,
	...leftovers
}) => {
	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, setItemName] = useState(offerName);
	const [startingToken, setStartingToken] = useState(range?.at(0));
	const [endingToken, setEndingToken] = useState(range?.at(1));
	const [individualPrice, setIndividualPrice] = useState(price);
	const [allowedTokenCount, setAllowedTokenCount] = useState(copies);
	const [lockedTokenCount, setLockedTokenCount] = useState(lockedTokens || 0);
	const [valuesChanged, setValuesChanged] = useState(false);

	const randColor = colors[index];

	const updater = useCallback((fieldName, setter, value, doRerender = true) => {
		array[index][fieldName] = value;
		setter(value);
		if (doRerender) {
			if (_id && !valuesChanged) {
				setValuesChanged(true);
			}
			rerender();
		}
	}, [array, index, rerender, _id, valuesChanged]);

	const updateEndingToken = useCallback( (value) => {
		if (!array) {
			return;
		}
		array[index].range[1] = Number(value);
		setEndingToken(Number(value));
		if (array[Number(index) + 1] !== undefined) {
			array[Number(index) + 1].range[0] = Number(value) + 1;
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
		if (!_id && simpleMode && correctCount !== allowedTokenCount) {
			updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
			updater('lockedTokens', setLockedTokenCount, correctCount, false);
		}
		if (!_id && correctCount < allowedTokenCount) {
			updater('tokensAllowed', setAllowedTokenCount, correctCount, false);
		}
		if (!_id && correctCount < lockedTokenCount) {
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
		_id,
		valuesChanged
	])

	useEffect(() => {
		setIndividualPrice(price);
	}, [price])

	useEffect(() => {
		setItemName(offerName);
	}, [offerName])

	const disabledClass = (_id && !valuesChanged) ? '' : 'border-stimorol rounded-rair'

	const updateRange = async () => {
		if (instance === undefined) {
			Swal.fire("Error", "Couldn't connect to the contract, are you on the correct blockchain?", 'error');
			return;
		}
		Swal.fire({
			title: 'Updating range...',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		if (await metamaskCall(
			instance.updateRange(
				diamondRangeIndex,
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
				{_id ?
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
				<div className={`${!_id && disabledClass} w-100`}>
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
				{!_id && <button onClick={() => updateEndingToken(maxCopies)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
				<div className={`${!_id && disabledClass} w-100`}>
					<InputField
						getter={endingToken}
						setter={updateEndingToken}
						customClass='form-control rounded-rair'
						disabled={_id}
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
						min='100'
						customClass='form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
					/>
				</div>
				{validateInteger(individualPrice) && 
					<small>
						{utils.formatEther(individualPrice === '' ? 0 : individualPrice.toString()).toString()} {blockchainSymbol}
					</small>}
			</div>
			{!simpleMode && <div className={`col-12 col-md-6`}>
				Tokens allowed to mint:
				{!_id && <button onClick={() => updater('copies', setAllowedTokenCount, endingToken - startingToken + 1)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
					Max
				</button>}
				<div className={`${disabledClass} w-100`}>
					<InputField
						getter={allowedTokenCount}
						setter={value => updater('copies', setAllowedTokenCount, value)}
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
				{!_id && <button onClick={() => updater('lockedTokens', setLockedTokenCount, endingToken - startingToken + 1)} className={`btn btn-${primaryColor} py-0 float-end rounded-rair`}>
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