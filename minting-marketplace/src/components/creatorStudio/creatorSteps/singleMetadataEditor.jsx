//@ts-nocheck
import { useState, useEffect, useCallback } from 'react';
import InputField from '../../common/InputField';
import BinanceDiamond from '../../../images/binance-diamond.svg';
import PropertyRow from './propertyRow';
import { useSelector } from 'react-redux';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import FixedBottomNavigation from '../FixedBottomNavigation';
import { web3Switch } from '../../../utils/switchBlockchain';
import chainData from '../../../utils/blockchainData'
import { rFetch } from '../../../utils/rFetch';
import { metamaskCall } from '../../../utils/metamaskUtils';
import Swal from 'sweetalert2';

const SingleMetadataEditor = ({contractData, setStepNumber, steps, stepNumber, gotoNextStep, simpleMode}) => {
	const [nftMapping, setNFTMapping] = useState([]);
	const [nftCount, setNFTCount] = useState(0);

	const [nftID, setNFTID] = useState(0);
	const [nftTitle, setNFTTitle] = useState('');
	const [nftImage, setNFTImage] = useState(BinanceDiamond);
	const [nftDescription, setNFTDescription] = useState('');
	const [forceRerender, setForceRerender] = useState(false);
	const [propertiesArray, setPropertiesArray] = useState([]);
	const [onMyChain, setOnMyChain] = useState();
	const { programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();
	const history = useHistory();

	const [metadataURI, setMetadataURI] = useState('');

	const getNFTData = useCallback(async () => {
		let {success, result} = await rFetch(`/api/nft/network/${contractData.blockchain}/${address.toLowerCase()}/${collectionIndex}`);
		if (success) {
			let mapping = {};
			result.tokens.forEach(token => {
				mapping[token.uniqueIndexInContract] = token;
			})
			setNFTMapping(mapping);
			setNFTCount(result.totalCount);
		}
	}, [address, collectionIndex, contractData.blockchain]);

	const addRow = () => {
		let aux = [...propertiesArray];
		aux.push({
			trait_type: '',
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
	}, [setStepNumber, stepNumber]);

	useEffect(() => {
		getNFTData();
	}, [getNFTData]);

	useEffect(() => {
		let tokenData = nftMapping[nftID];
		if (tokenData) {
			setNFTImage(tokenData?.metadata?.image);
			setNFTTitle(tokenData?.metadata?.name);
			setNFTDescription(tokenData?.metadata?.description);
			setPropertiesArray(tokenData?.metadata?.attributes);
		} else {
			setNFTImage(BinanceDiamond)
			setNFTTitle("")
			setNFTDescription("")
			setPropertiesArray("")
		}
	}, [nftID, nftMapping])

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
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${contractData.blockchain}/${address}/collection/${collectionIndex}/metadata/batch`}  className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Batch
			</NavLink>
		</div>
		<div className='col-12 col-md-6 text-start mb-3 pe-5'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${contractData.blockchain}/${address}/collection/${collectionIndex}/metadata/single`} className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Single
			</NavLink>
		</div>
		<div className='col-12 col-md-6 text-start px-5'>
			<h5>{nftCount} NFTs available!</h5>
			NFT #
			<br />
			<div className='border-stimorol col-12 col-md-3 rounded-rair mb-3'>
				<InputField
					getter={nftID}
					setter={setNFTID}
					customClass={`bg-${primaryColor} rounded-rair w-100 form-control`}
					customCSS={{color: textColor}}
					type='number'
					min='0'
					max={contractData.product.copies - 1}
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
					<img alt=''
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
						artist: nftID,
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
			},
			{
				action: gotoNextStep,
				label: 'Continue'
			}]}
		/>}
		{!simpleMode && contractData.instance && <>
			<div className='col-12'>
				<button onClick={async () => {
					let URI = await metamaskCall(contractData.instance.tokenURI(contractData.product.firstTokenIndex + Number(nftID)))
					if (URI) {
						let data = (await (await fetch(URI)).json());
						setNFTImage(data.image);
						setNFTTitle(data.name);
						setNFTDescription(data.description);
						setPropertiesArray(data.attributes);
						setMetadataURI(URI);
					}
				}} className='btn btn-primary'>
					Read URI Data from the Blockchain
				</button>
			</div>
			<hr />
			<div className='col-12 col-md-9 px-0'>
				<InputField
					customClass='form-control'
					getter={metadataURI}
					setter={setMetadataURI}
					label='Metadata URI'
				/>
			</div>
			<div className='col-12 col-md-3 pt-4'>
				<button onClick={async () => {
					Swal.fire({
						title: 'Sending metadata URI...',
						html: 'Please wait...',
						icon: 'info',
						showConfirmButton: false
					});
					if (await metamaskCall(
						contractData.instance.setUniqueURI(
							Number(contractData.product.firstTokenIndex) + Number(nftID),
							metadataURI
						)
					)) {
						Swal.fire({
							title: 'Success!',
							html: 'Metadata URI has been set for that specific token',
							icon: 'success',
							showConfirmButton: true
						});
					}
				}} className='btn btn-stimorol'>
					{metadataURI === '' ? 'Uns' : 'S'}et Metadata for token #{nftID}
				</button>
			</div>
		</>}
	</div>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <SingleMetadataEditor {...value} {...props}/>
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;