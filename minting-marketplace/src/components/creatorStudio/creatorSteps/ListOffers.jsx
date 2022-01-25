import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { useParams, useHistory } from 'react-router-dom';
import { erc721Abi } from '../../../contracts'
import Swal from 'sweetalert2';
import chainData from '../../../utils/blockchainData.js'
import { web3Switch } from '../../../utils/switchBlockchain.js';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import OfferRow from './OfferRow.jsx'
import { validateInteger, metamaskCall } from '../../../utils/metamaskUtils';

const ListOffers = ({contractData, setStepNumber, steps, gotoNextStep}) => {
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
		fetchMintingStatus()
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
				minterInstance.addOffer(
					instance.address,
					collectionIndex,
					offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
					offerList.map((item) => item.ends),
					offerList.map((item) => item.price),
					offerList.map((item) => item.name),
					process.env.REACT_APP_NODE_ADDRESS
				)
			)) {
				Swal.fire({
					title: 'Success!',
					html: 'The offer has been created!',
					icon: 'success',
					showConfirmButton: true
				});
				gotoNextStep();
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
			if (await metamaskCall(
				minterInstance.appendOfferRangeBatch(
					contractData.product.offers[0].offerPool,
					offerList.map((item, index, array) => (index === 0) ? 0 : array[index - 1].starts),
					offerList.map((item) => item.ends),
					offerList.map((item) => item.price),
					offerList.map((item) => item.name)
				)
			)) {
				Swal.fire({
					title: 'Success!',
					html: 'The offers have been appended!',
					icon: 'success',
					showConfirmButton: true
				});
				gotoNextStep();
			}
		} catch (err) {
			console.error(err)
			Swal.fire('Error',err?.data?.message ? err?.data?.message : 'An error has occurred','error');
			return;
		}
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
						<th />
					</tr>
				</thead>
				<tbody style={{maxHeight: '50vh', overflowY: 'scroll'}}>
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
				</tbody>
			</table>}
			<div className='col-12 mt-3 text-center'>
				<div className='border-stimorol rounded-rair'>
					<button onClick={addOffer} disabled={offerList.length >= 12} className={`btn btn-${primaryColor} rounded-rair px-4`}>
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
					(hasMinterRole === true ? 
						(offerList[0]?.fixed ?
							(offerList.filter(item => item.fixed !== true).length === 0 ? 
								gotoNextStep
								:
								appendOffers)
							:
							createOffers)
						:
						giveMinterRole),
					label: !onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : (hasMinterRole ? (offerList[0]?.fixed ? (offerList.filter(item => item.fixed !== true).length === 0 ? 'Skip' : 'Append to Offer') : 'Create Offer') : 'Approve Minter Marketplace'),
					disabled: hasMinterRole ?
						(
							offerList.length === 0 ||
							offerList.at(-1).ends > Number(contractData.product.copies) - 1 ||
							offerList
								.reduce((previous, current) => {
								return previous || !validateInteger(current.price) || current.price <= 0 
							}, false) || 
							offerList
								.filter(item => item.fixed !== true)
								.reduce((previous, current) => {
									return previous || current.name === ''
								}, false)
						) : false
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