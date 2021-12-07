import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { web3Switch } from '../../../utils/switchBlockchain.js';
import { rFetch } from '../../../utils/rFetch.js';
import { utils } from 'ethers';
import InputSelect from '../../common/InputSelect.jsx';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import chainData from '../../../utils/blockchainData.js'
import Dropzone from 'react-dropzone'
import videoIcon from '../../../images/videoIcon.svg';
import MediaUploadRow from './MediaUploadRow.jsx';

const MediaUpload = ({setStepNumber, contractData}) => {
	const stepNumber = 6;

	const [mediaList, setMediaList] = useState([]);
	const [offerList, setOfferList] = useState([]);
	const [forceRerender, setForceRerender] = useState(false);

	const {primaryColor, secondaryColor, textColor} = useSelector(store => store.colorStore);

	useEffect(() => {
		console.log(contractData);
		setOfferList(contractData?.product?.offers ? contractData?.product?.offers.map(item => {
			return {
				label: `${item.offerName} (${item.range[1] - item.range[0] + 1} tokens for ${utils.formatEther(item.price).toString()} ${chainData[contractData.blockchain].symbol} each)`,
				value: item.offerIndex
			}
		}) : [])
	}, [contractData]);

	const onMediaDrop = (media) => {
		let aux = [...mediaList];
		aux = aux.concat(
			media.map(item => {
				return {
					offer: 'null',
					category: 'null',
					title: item.name,
					file: item,
					description: ''
				}
			})
		);
		setMediaList(aux);
	};

	const deleter = (index) => {
		let aux = [...mediaList];
		aux.splice(index, 1);
		setMediaList(aux);
	};

	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber]);

	return <div className='col-12 mb-5'>
		<div className='rounded-rair col-12 mb-3'>
			<Dropzone onDrop={onMediaDrop}>
				{({getRootProps, getInputProps, isDragActive}) => (
					<section>
						<div {...getRootProps()} style={{border: 'dashed 1px var(--charcoal-80)', position: 'relative'}} className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-5'>
							<input {...getInputProps()} />
							<img style={{filter: primaryColor === 'rhyno' ? 'brightness(40%)' : undefined}} src={videoIcon} className='mt-5 mb-3'/>
							<br />
							{
								isDragActive ?
								<>Drop the images here ...</> :
								<>Drag and drop or <span style={{color: 'var(--bubblegum)'}}>click</span> to upload unlockable content</>
							}
						</div>
					</section>
				)}
			</Dropzone>
		</div>
		{mediaList.map((item, index, array) => {
			return <MediaUploadRow
				key={index}
				item={item}
				index={index}
				array={array}
				deleter={() => deleter(index)}
				offerList={offerList}
				rerender={() => setForceRerender(!forceRerender)} />
		})}
	</div>
};

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <MediaUpload {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;