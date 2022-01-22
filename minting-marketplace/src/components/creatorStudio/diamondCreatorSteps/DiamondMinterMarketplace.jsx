import {useState, useEffect, useCallback} from 'react';
import Swal from 'sweetalert2';
import { useSelector } from 'react-redux';
import {useHistory} from 'react-router-dom';
import { metamaskCall } from '../../../utils/metamaskUtils'; 
import chainData from '../../../utils/blockchainData';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import DiamondOfferConfig from './diamondOfferConfig.jsx';

const CustomizeFees = ({contractData, setStepNumber, steps, simpleMode, stepNumber, gotoNextStep}) => {
	const { currentUserAddress, diamondMarketplaceInstance } = useSelector(store => store.contractStore);
	const history = useHistory();

	const [offerData, setOfferData] = useState([]);
	const [nodeFee, setNodeFee] = useState(0);
	const [treasuryFee, setTreasuryFee] = useState(0);
	const [treasuryAddress, setTreasuryAddress] = useState(undefined);
	const [minterDecimals, setMinterDecimals] = useState(0);
	const [sendingData, setSendingData] = useState(false);
	const [hasMinterRole, setHasMinterRole] = useState();

	const getOfferData = useCallback(async () => {
		if (!contractData.product.offers) {
			return;
		}
		setOfferData(contractData.product.offers.map(item => {
			return {
				selected: true,
				tokensToSell: 0,
				customSplits: [],
				visible: true,
				...item
			}
		}))
	}, [contractData])

	useEffect(() => {
		getOfferData()
	}, [getOfferData])


	const getContractData = useCallback(async () => {
		if (!diamondMarketplaceInstance) {
			return;
		}
		console.log(diamondMarketplaceInstance.functions);
		let nodeFeeData = await diamondMarketplaceInstance.getNodeFee()
		setNodeFee(Number(nodeFeeData.nodeFee.toString()));
		setMinterDecimals(nodeFeeData.decimals);
		let treasuryFeeData = await diamondMarketplaceInstance.getTreasuryFee();
		setTreasuryFee(Number(treasuryFeeData.treasuryFee.toString()));
		setTreasuryAddress(await diamondMarketplaceInstance.getTreasuryAddress());
		setHasMinterRole(
			await contractData.instance.hasRole(
				await contractData.instance.MINTER(),
				diamondMarketplaceInstance.address
			)
		)
	}, [diamondMarketplaceInstance, contractData.instance])

	useEffect(() => {
		getContractData()
	}, [getContractData])

	// let onMyChain = window.ethereum ?
	// 	chainData[contractData?.blockchain]?.chainId === window.ethereum.chainId
	// 	:
	// 	chainData[contractData?.blockchain]?.chainId === programmaticProvider.provider._network.chainId;
	
	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber, stepNumber])

	const setCustomFees = async e => {
		setSendingData(true);
		Swal.fire({
			title: 'Setting custom fees',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		let filteredOffers = offerData.filter(item => item.selected);
		if (await metamaskCall(
			diamondMarketplaceInstance.addMintingOfferBatch(
			//console.log(
				contractData.contractAddress,
				filteredOffers.map(item => item.rangeIndex),
				filteredOffers.map(item => item.customSplits.filter(split => split.editable)),
				filteredOffers.map(item => item.visible),
				process.env.REACT_APP_NODE_ADDRESS
			)
		)) {
			Swal.fire({
				title: 'Success',
				html: 'Offer(s) added to the marketplace',
				icon: 'success',
				showConfirmButton: false
			});
		}
		setSendingData(false)
	}
	
	const giveMinterRole = async () => {
		setSendingData(true);
		Swal.fire({
			title: 'Granting minter role',
			html: 'Please wait...',
			icon: 'info',
			showConfirmButton: false
		});
		if (await metamaskCall(contractData.instance.grantRole(
			await contractData.instance.MINTER(),
			diamondMarketplaceInstance.address
		))) {
			Swal.fire({
				title: 'Success',
				html: 'Custom fees set',
				icon: 'success',
				showConfirmButton: false
			});
			getContractData();
		}
		setSendingData(false);
	}

	return <div className='row px-0 mx-0'>
		{treasuryAddress !== undefined && offerData && offerData.map((item, index, array) => {
			return <DiamondOfferConfig key={index} {
				...{
					array,
					index,
					nodeFee,
					minterDecimals,
					treasuryFee,
					currentUserAddress,
					treasuryAddress,
					simpleMode
				}} />
		})}
		{chainData && treasuryAddress && <FixedBottomNavigation
				backwardFunction={() => {
					history.goBack()
				}}
				forwardFunctions={[{
					label: hasMinterRole ? 'Put selected ranges up for sale!' : 'Approve the marketplace as a Minter!',
					action: hasMinterRole ? setCustomFees : giveMinterRole,
					disabled: sendingData || hasMinterRole === undefined,
				},{
					label: 'Continue',
					action: gotoNextStep,
					disabled: sendingData,
				}]}
			/>}
	</div>
};

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <CustomizeFees {...value} {...props} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;