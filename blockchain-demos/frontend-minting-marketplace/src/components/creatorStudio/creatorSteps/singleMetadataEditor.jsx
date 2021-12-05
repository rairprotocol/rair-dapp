import { useState, useEffect, useCallback } from 'react';
import InputField from '../../common/InputField.jsx';
import BinanceDiamond from '../../../images/binance-diamond.svg';
import PropertyRow from './propertyRow.jsx';
import { useSelector } from 'react-redux';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import { web3Switch } from '../../../utils/switchBlockchain.js';
import chainData from '../../../utils/blockchainData.js'
import { rFetch } from '../../../utils/rFetch.js';

const SingleMetadataEditor = ({contractData, setStepNumber, steps}) => {
	const stepNumber = 4;

	const [nftID, setNFTID] = useState('');
	const [nftTitle, setNFTTitle] = useState('');
	const [nftImage, setNFTImage] = useState(BinanceDiamond);
	const [nftDescription, setNFTDescription] = useState('');
	const [forceRerender, setForceRerender] = useState(false);
	const [propertiesArray, setPropertiesArray] = useState([]);
	const [onMyChain, setOnMyChain] = useState();

	const { minterInstance, contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();
	const history = useHistory();

	const getNFTData = useCallback(async () => {
		let aux = await rFetch(`/api/nft/${address.toLowerCase()}/${collectionIndex}`);
		console.log(aux);
	}, [address, collectionIndex]);

	const addRow = () => {
		let aux = [...propertiesArray];
		aux.push({
			name: '',
			value: ''
		});
		setPropertiesArray(aux);
	};

	const deleter = (index) => {
		let aux = [...propertiesArray]
		aux.splice(index, 1);
		setPropertiesArray(aux);
	};

	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber]);

	useEffect(() => {
		getNFTData();
	}, [getNFTData]);

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
		<div className='col-6 text-end ps-5'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/batch`}  className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Batch
			</NavLink>
		</div>
		<div className='col-6 text-start mb-3 pe-5'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/single`} className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Single
			</NavLink>
		</div>
		<div className='col-6 text-start px-5'>
			NFT #
			<br />
			<div className='border-stimorol rounded-rair mb-3'>
				<InputField
					getter={nftID}
					setter={setNFTID}
					customClass={`bg-${primaryColor} rounded-rair w-100 form-control`}
					customCSS={{color: textColor}}
					type='number'
					min='0'
				/>
			</div>
			<br />
			Image
			<br />
			<div className='border-stimorol rounded-rair mb-3 w-100'>
				<InputField
					getter={nftImage}
					setter={setNFTImage}
					customClass={`bg-${primaryColor} rounded-rair w-100 form-control`}
					customCSS={{color: textColor}}
				/>
			</div>
			<br />
			Title
			<br />
			<div className='border-stimorol rounded-rair mb-3 w-100'>
				<InputField
					getter={nftTitle}
					setter={setNFTTitle}
					customClass={`bg-${primaryColor} rounded-rair w-100 form-control`}
					customCSS={{color: textColor}}
				/>
			</div>
			<br />
			Description
			<br />
			<div className='border-stimorol rounded-rair mb-3 w-100'>
				<textarea
					value={nftDescription}
					onChange={(e) => setNFTDescription(e.target.value)}
					className={`bg-${primaryColor} rounded-rair w-100 form-control`}
					style={{color: textColor}}
					rows='3'
				/>
			</div>
			<br />
			Properties
			<div className='col-12 py-5' style={{position: 'relative', overflowY: 'scroll', maxHeight: '30vh'}}>
				<button onClick={addRow} className='rounded-rair btn btn-stimorol' style={{position: 'absolute', top: 0, right: 0}}>
					<i className='fas fa-plus' />
				</button>
				{propertiesArray && propertiesArray.length > 0 && <table className='w-100'>
					<thead>
						<tr>
							<th>
								Property Name
							</th>
							<th>
								Property Value
							</th>
							<th />
						</tr>
					</thead>
					<tbody>
						{propertiesArray.map((item, index) => {
							return <PropertyRow
								key={index}
								{...item}
								array={propertiesArray}
								index={index}
								deleter={() => deleter(index)}
								rerender={() => setForceRerender(!forceRerender)}
							/>
						})}
					</tbody>
					<tfoot />
				</table>}
			</div>
		</div>
		<div className='col-6 px-5'>
			<div style={{minHeight: '70vh', maxHeight: '100vh'}} className='w-100 border-stimorol py-auto rounded-rair'>
				<div className={`w-100 h-100 bg-${primaryColor} rounded-rair`}>
					<img
						className='w-100 rounded-rair my-auto'
						style={{verticalAlign: 'middle'}}
						src={nftImage} />
				</div>
			</div>
		</div>
		<div className='my-5 col-12 px-5'>
			<div className='w-100 rounded-rair border-stimorol'>
				<div className={`w-100 rounded-rair bg-${primaryColor} p-4`}>
					{JSON.stringify({
						title: nftTitle,
						image: nftImage,
						description: nftDescription,
						attributes: propertiesArray
					})}
				</div>
			</div>
		</div>
		{chainData && <FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
			forwardFunctions={[{
				action: !onMyChain ?
				() => switchBlockchain(chainData[contractData?.blockchain]?.chainId)
				:
				console.log,
				label: !onMyChain ? `Switch to ${chainData[contractData?.blockchain]?.name}` : 'Freeze to IPFS',
				disabled: true
			},
			{
				action: console.log,
				label: 'Update Metadata',
				disabled: true
			}]}
		/>}
	</div>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <SingleMetadataEditor {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;