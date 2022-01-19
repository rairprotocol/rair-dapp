import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { useParams, useHistory } from 'react-router-dom';
import { erc721Abi } from '../../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../../utils/blockchainData.js'
import { web3Switch } from '../../../utils/switchBlockchain.js';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import colors from '../../../utils/offerLockColors.js'
import InputField from '../../common/InputField.jsx'
import { utils } from 'ethers';
import { metamaskCall } from '../../../utils/metamaskUtils.js';

const OfferRow = ({index, deleter, name, starts, ends, price, fixed, array, rerender, maxCopies, blockchainSymbol, allowedTokens, lockedTokens}) => {
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
	}, [starts, updateStartingToken])

	useEffect(() => {
		if (ends === endingToken) {
			return;
		}
		updateEndingToken(ends);
	}, [ends, updateEndingToken])

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
		<div className={`col-12 col-md-10 px-2`}>
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
		<div className={`col-12 col-md-1`}>
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
		<div className={`col-12 col-md-6`}>
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
		</div>
		<div className={`col-12 col-md-6`}>
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
		</div>
		<hr className='my-4' />
	</div>
};

const ListOffers = ({contractData, setStepNumber, steps}) => {
	const stepNumber = 1;
	const [offerList, setOfferList] = useState([]);
	const [forceRerender, setForceRerender] = useState(false);
	const [hasMinterRole, setHasMinterRole] = useState(false);
	const [instance, setInstance] = useState();
	const [onMyChain, setOnMyChain] = useState();

	const { minterInstance, contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();

	useEffect(() => {
		setOfferList(contractData?.product?.offers ? contractData?.product?.offers.map(item => {
			return {
				name: item.offerName,
				starts: item.range[0],
				ends: item.range[1],
				price: item.price,
				allowedTokens: item.tokensAllowed,
				lockedTokens: item.lockedTokens,
				fixed: true
			}
		}) : [])
	}, [contractData])

	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber])

	const rerender = useCallback(() => {
		setForceRerender(() => !forceRerender);
	}, [setForceRerender, forceRerender])

	const addOffer = (data) => {
		let aux = [...offerList];
		let startingToken = offerList.length === 0 ? 0 : Number(offerList.at(-1).ends) + 1
		aux.push({
			name: '',
			starts: startingToken,
			ends: startingToken,
			price: 0,
			allowedTokens: 0,
			lockedTokens: 0,
		});
		setOfferList(aux);
	}

	const deleter = (index) => {
		let aux = [...offerList];
		if (aux.length > 1 && index !== aux.length - 1) {
			aux[1].starts = 0;
		}
		aux.splice(index, 1);
		setOfferList(aux);
	}
	const history = useHistory();

	useEffect(() => {
		if (onMyChain) {
			let createdInstance = contractCreator(address, erc721Abi)
			setInstance(createdInstance);
		}
	}, [address, onMyChain, contractCreator])

	const fetchMintingStatus = useCallback(async () => {
		if (!instance || !onMyChain) {
			return;
		}
		try {
			setHasMinterRole(await instance.hasRole(await instance.MINTER(), minterInstance.address));
		} catch (err) {
			console.error(err);
			setHasMinterRole(false);
		}
	}, [minterInstance, instance, onMyChain])

	useEffect(() => {
		fetchMintingStatus();
	}, [fetchMintingStatus])

	const giveMinterRole = async () => {
		Swal.fire({title: 'Granting Role...', html: 'Please wait', icon: 'info', showConfirmButton: false});
		try {
			await (await instance.grantRole(await instance.MINTER(), minterInstance.address)).wait();
		} catch (err) {
			console.error(err);
			Swal.fire('Error','An error has ocurred','error');
			return;
		}
		Swal.fire('Success!','You can create offers now!','success');
		fetchMintingStatus()
	}

	const createOffers = async () => {
		try {
			Swal.fire({
				title: 'Creating offer...',
				html: 'Please wait...',
				icon: 'info',
				showConfirmButton: false
			});
			if (await metamaskCall(
				contractData.diamond.createRangeBatch(
					collectionIndex,
					offerList.filter(item => item.fixed !== true).map(item => {
						return {
							rangeStart: item.starts,
							rangeEnd: item.ends,
							tokensAllowed: item.allowedTokens,
							lockedTokens: item.lockedTokens,
							price: item.price,
							name: item.name
						}
					})
				)
			)) {
				Swal.fire({
					title: 'Success!',
					html: 'The offer has been created!',
					icon: 'success',
					showConfirmButton: false
				});
				nextStep();
			}
		} catch (err) {
			console.error(err)
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
		}
	}

	const appendOffers = async () => {
		try {
			Swal.fire({
				title: 'Appending offers...',
				html: 'Please wait...',
				icon: 'info',
				showConfirmButton: false
			});
			await (await contractData.diamond.appendOfferRangeBatch(
				contractData.product.offers[0].offerPool,
				offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
				offerList.map((item) => item.ends),
				offerList.map((item) => item.price),
				offerList.map((item) => item.name))
			).wait();
			Swal.fire({
				title: 'Success!',
				html: 'The offers have been appended!',
				icon: 'success',
				showConfirmButton: false
			});
		} catch (err) {
			console.error(err)
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
		}
	}

	const nextStep = () => {
		history.push(steps[stepNumber].populatedPath);
	}

	const switchBlockchain = async (chainId) => {
		web3Switch(chainId)
	}

	useEffect(() => {
		setOnMyChain(
			window.ethereum ?
				chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
				:
				chainData[contractData?.blockchain]?.chainId === programmaticProvider?.provider?._network?.chainId
			)
	}, [contractData, programmaticProvider, currentChain])

	return <div className='row px-0 mx-0'>
		<div className='col-6 text-end'>
			<button className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Simple
			</button>
		</div>
		<div className='col-6 text-start mb-3'>
			<button className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Advanced
			</button>
		</div>
		{contractData ? <>
			{offerList?.length !== 0 && <div className='row w-100 text-start px-0 mx-0'>
					{offerList.map((item, index, array) => {
						return <OfferRow
							array={array}
							deleter={e => deleter(index)}
							key={index}
							index={index}
							{...item}
							blockchainSymbol={chainData[contractData?.blockchain]?.symbol}
							rerender={rerender}
							maxCopies={Number(contractData?.product?.copies) - 1} />
					})}
			</div>}
			<div className='col-12 mt-3 text-center'>
				<div className='border-stimorol rounded-rair'>
					<button onClick={addOffer} disabled={contractData === undefined || offerList.length >= 12 || offerList?.at(-1)?.ends >= (Number(contractData?.product?.copies) - 1)} className={`btn btn-${primaryColor} rounded-rair px-4`}>
						Add new <i className='fas fa-plus' style={{border: `solid 1px ${textColor}`, borderRadius: '50%', padding: '5px'}} />
					</button>
				</div>
			</div>
			<div className='col-12 mt-3 p-5 text-center rounded-rair' style={{border: 'dashed 2px var(--charcoal-80)'}}>
				First Token: {contractData?.product?.firstTokenIndex}, Last Token: {contractData?.product?.firstTokenIndex + contractData?.product?.copies - 1}, Mintable Tokens Left: {contractData?.product?.copies - contractData?.product?.soldCopies}
			</div>
			{chainData && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					action: !onMyChain ?
					() => switchBlockchain(chainData[contractData?.blockchain]?.chainId)
					:
					(offerList[0]?.fixed ?
						(offerList.filter(item => item.fixed !== true).length === 0 ? 
							nextStep
							:
							appendOffers)
						:
						createOffers),
					label: !onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : ((offerList[0]?.fixed ? (offerList.filter(item => item.fixed !== true).length === 0 ? 'Skip' : 'Append Ranges') : 'Create Ranges')),
					disabled: (offerList.length === 0 || offerList.at(-1).ends > Number(contractData.product.copies) - 1)
				}]}
			/>}
		</> : 'Fetching data...'}
	</div>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <ListOffers {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;