import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import InputField from '../../common/InputField.jsx'
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { useParams, useHistory } from 'react-router-dom';
import {erc721Abi} from '../../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../../utils/blockchainData.js'
import colors from '../../../utils/offerLockColors.js'
import {web3Switch} from '../../../utils/switchBlockchain.js';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import {utils} from 'ethers';

const LockRow = ({index, locker, name, starts, ends, price, fixed, array, rerender, maxCopies, lockedNumber, blockchainSymbol}) => {

	const {primaryColor, secondaryColor} = useSelector(store => store.colorStore);

	const [itemName, ] = useState(name);
	const [startingToken, ] = useState(starts);
	const [endingToken, ] = useState(ends);
	const [individualPrice, ] = useState(price);
	const [lockedTokens, setLockedTokens] = useState(lockedNumber);

	const randColor = colors[index];

	const updateLockedNumber = useCallback((value) => {
		array[index].lockedNumber = Number(value);
		setLockedTokens(Number(value));
		rerender();
	}, [array, index, rerender, setLockedTokens])

	useEffect(() => {
		setLockedTokens(lockedNumber);
	}, [lockedNumber])

	return <tr>
		<th>
			<button disabled className='btn btn-charcoal rounded-rair'>
				<i style={{color: `${randColor}`}} className='fas fa-key' />
			</button>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={itemName}
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={startingToken}
				type='number'
				min='0'
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={endingToken}
				customClass='form-control rounded-rair'
				type='number'
				min='0'
				max={maxCopies}
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<InputField
				disabled={true}
				getter={`${utils.formatEther(price === '' ? 0 : price).toString()} ${blockchainSymbol}`}
				customClass='form-control rounded-rair'
				customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
			/>
		</th>
		<th className='p-1'>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					getter={lockedTokens}
					setter={updateLockedNumber}
					type='number'
					min='0'
					max={endingToken - startingToken}
					customClass='form-control rounded-rair'
					customCSS={{backgroundColor: `var(--${primaryColor})`, color: 'inherit', borderColor: `var(--${secondaryColor}-40)`}}
				/>
			</div>
		</th>
		<th>
			<div className='border-stimorol rounded-rair'>
				<button onClick={locker} className={`btn btn-${primaryColor} rounded-rair`}>
					<i className='fas fa-lock' />
				</button>
			</div>
		</th>
	</tr>
};

const ListLocks = ({contractData, setStepNumber, steps}) => {
	const stepNumber = 2;
	const [offerList, setOfferList] = useState([]);
	const [forceRerender, setForceRerender] = useState(false);
	const [instance, setInstance] = useState();
	const [onMyChain, setOnMyChain] = useState();

	const { contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {address, collectionIndex} = useParams();

	const locker = async (data) => {
	    Swal.fire(`Locking ${data.ends - data.starts} tokens from ${data.name}`,`${data.lockedNumber} tokens will have to be minted to unlock them again.`, 'info');
	    try {
	    	await instance.createRangeLock(
	    			data.productIndex,
	    			data.starts,
	    			data.ends,
	    			data.lockedNumber); 
	    } catch (err) {
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
	    }
	    Swal.fire('Success!','The range has been locked', 'success');
	}

	const history = useHistory();

	useEffect(() => {
		setOfferList(contractData?.product?.offers ? contractData?.product?.offers.map(item => {
			return {
				productIndex: item.product,
				name: item.offerName,
				starts: item.range[0],
				ends: item.range[1],
				price: item.price,
				lockedNumber: 0
			}
		}) : [])
	}, [contractData])

	useEffect(() => {
		setStepNumber(2)
	}, [setStepNumber]);

	useEffect(() => {
		if (onMyChain) {
			let createdInstance = contractCreator(address, erc721Abi)
			setInstance(createdInstance);
		}
	}, [address, onMyChain, contractCreator])

	const next = () => {
		history.push(steps[stepNumber].populatedPath);
	}

	useEffect(() => {
		setOnMyChain(
			window.ethereum ?
				chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
				:
				chainData[contractData?.blockchain]?.chainId === programmaticProvider?.provider?._network?.chainId
			)
	}, [contractData, programmaticProvider, currentChain])

	const switchBlockchain = async (chainId) => {
		web3Switch(chainId)
	}

	return <div className='row px-0 mx-0'>
		{contractData ? <>
			{offerList?.length !== 0 && <table className='col-12 text-start'>
				<thead>
					<tr>
						<th className='px-1' style={{width: '5vw'}} />
						<th>
							Item name
						</th>
						<th style={{width: '10vw'}}>
							Starts
						</th>
						<th style={{width: '10vw'}}>
							Ends
						</th>
						<th style={{width: '20vw'}}>
							Price for each
						</th>
						<th style={{width: '10vw'}}>
							Tokens Locked
						</th>
						<th />
					</tr>
				</thead>
				<tbody style={{maxHeight: '50vh', overflowY: 'scroll'}}>
					{offerList.map((item, index, array) => {
						return <LockRow
							array={array}
							locker={e => locker(item)}
							key={index}
							index={index}
							{...item}
							blockchainSymbol={chainData[contractData?.blockchain]?.symbol}
							rerender={e => setForceRerender(!forceRerender)}
							maxCopies={Number(contractData?.product?.copies) - 1} />
					})}
				</tbody>
			</table>}
			{chainData && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					action: !onMyChain ?
						() => switchBlockchain(chainData[contractData?.blockchain]?.chainId)
						:
						next,
					label: !onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : `Proceed`,
					disabled: false
				}]}
			/>}
		</> : 'Fetching data...'}
	</div>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <ListLocks {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;