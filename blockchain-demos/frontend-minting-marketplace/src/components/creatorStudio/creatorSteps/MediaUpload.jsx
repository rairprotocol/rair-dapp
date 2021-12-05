import { useEffect, useState, useCallback } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useHistory, NavLink } from 'react-router-dom';
import { web3Switch } from '../../../utils/switchBlockchain.js';
import { rFetch } from '../../../utils/rFetch.js';
import InputSelect from '../../common/InputSelect.jsx';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import chainData from '../../../utils/blockchainData.js'
import Dropzone from 'react-dropzone'
import videoIcon from '../../../images/videoIcon.svg';
import { utils } from 'ethers';

const MediaUpload = ({setStepNumber, contractData}) => {
	const stepNumber = 6;

	const [mediaList, setMediaList] = useState([]);
	const [offerList, setOfferList] = useState([]);

	const {primaryColor, secondaryColor, textColor} = useSelector(store => store.colorStore);

	useEffect(() => {
		setOfferList(contractData?.product?.offers ? contractData?.product?.offers.map(item => {
			return {
				label: `${item.offerName} (${item.range[1] - item.range[0] + 1} tokens for ${utils.formatEther(item.price).toString()} each)`,
				value: item.offerIndex
			}
		}) : [])
	}, [contractData]);

	const onMediaDrop = (media) => {
		let aux = [...mediaList];
		aux = aux.concat(media);
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

	const cornerStyle = {height: '15vh', borderRadius: '16px 0 0 16px'}

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
		{mediaList.map((item, index) => {
			return <div
				key={index}
				style={{backgroundColor: `var(--${primaryColor}-80)`, color: textColor}}
				className='p-0 rounded-rair my-3 col-12 row px-0 mx-0'>
				<div
					className='col-12 mx-0 px-0 py-0 col-md-2'
					style={cornerStyle}>
					{item.type.split('/')[0] === 'video' &&
						<video style={cornerStyle} className='h-100 w-100' src={URL.createObjectURL(item)} />
					}
					{item.type.split('/')[0] === 'image' &&
						<img style={cornerStyle} src={URL.createObjectURL(item)} className='h-100 w-100' />
					}
					{item.type.split('/')[0] === 'audio' &&
						<div className='pt-5 w-100 h-100'>
							Audio File <i style={cornerStyle} className='fas fa-music' />
						</div>
					}
				</div>
				<div className='col-12 text-start d-flex align-items-center col-md-6'>
					{item.name}
					<br />
					{item.type}
				</div>
				<div className='col-12 text-start d-flex align-items-center col-md-3'>
					<div className='border-stimorol rounded-rair col-12'>
						<InputSelect
							options={offerList}
							customClass='form-control rounded-rair'
							customCSS={{
								backgroundColor: `var(--${primaryColor}-80)`,
								color: textColor
							}}
							optionCSS={{
								color: textColor
							}}
						/>
					</div>
				</div>
				<div className='col-12 text-start d-flex align-items-center col-md-1'>
					<button onClick={() => deleter(index)} className='btn rounded-rair border-danger' style={{color: textColor}}>
						<i className='fas fa-trash' />
					</button>
				</div>
			</div>
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