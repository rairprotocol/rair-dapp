import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import imageIcon from '../../../images/imageIcon.svg';
import documentIcon from '../../../images/documentIcon.svg';
import {NavLink, useParams, useHistory} from 'react-router-dom'
import {rFetch} from '../../../utils/rFetch.js';
import FixedBottomNavigation from '../FixedBottomNavigation.jsx';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext.js';
import {useDropzone} from 'react-dropzone'

const BatchMetadataParser = ({contractData, setStepNumber}) => {
	const {address, collectionIndex} = useParams();

	const onImageDrop = useCallback(acceptedFiles => {
		console.log(acceptedFiles);
	}, [])
	const onCSVDrop = useCallback(acceptedFiles => {
		console.log(acceptedFiles);
	}, [])
	const imageDropzone = useDropzone({onImageDrop})
	const csvDropzone = useDropzone({onCSVDrop})
	//getRootProps
	//getInputProps
	//isDragActive

	const history = useHistory();

	const { contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);

	const { primaryColor, textColor } = useSelector(store => store.colorStore);
	
	useEffect(() => {
		setStepNumber(4);
	}, [setStepNumber])

	return <>
		<div className='col-6 text-end'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/batch`}  className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Batch
			</NavLink>
		</div>
		<div className='col-6 text-start mb-3'>
			<NavLink activeClassName={`btn-stimorol`} to={`/creator/contract/${address}/collection/${collectionIndex}/metadata/single`} className={`btn btn-${primaryColor} rounded-rair col-8`}>
				Single
			</NavLink>
		</div>
		<small className='w-100 text-center'>
			Please, download our prebuilt CSV template for metadata uploading.
		</small>
		<div className='col-4 text-start mb-3' />
		<button className={`btn btn-stimorol rounded-rair col-4 my-5`}>
			Download CSV Template
		</button>
		<div className='col-4 text-start mb-3' />
		<div className='rounded-rair col-6 mb-3'>
			<div style={{border: 'dashed 1px var(--charcoal-80)', position: 'relative'}}
					className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'
					{...imageDropzone.getRootProps()}>
				<input {...imageDropzone.getInputProps()} />
				<div style={{position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem'}}>
					1
				</div>
				<img src={imageIcon} className='my-5'/>
				<br />
				{
					imageDropzone.isDragActive ?
					<p>Drop the images here ...</p> :
					<p>Drag and drop or click to upload images</p>
				}
			</div>
		</div>
		<div className='rounded-rair col-6 mb-3'>
			<div style={{border: 'dashed 1px var(--charcoal-80)', position: 'relative'}}
				className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'
				{...csvDropzone.getRootProps()}>
				<input {...csvDropzone.getInputProps()} />
				<div style={{position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem'}}>
					2
				</div>
				<img src={documentIcon} className='my-5'/>
				<br />
				{
					csvDropzone.isDragActive ?
					<p>Drop the CSV file here ...</p> :
					<p>Drag and drop or click to upload CSV</p>
				}
			</div>
		</div>
		<div style={{border: 'solid 1px white', overflowX: 'scroll', width: '80vw'}} className='rounded-rair'>
			<table >
				<thead>
					<th className='py-3'>
						URL
					</th>
					<th>
						Title
					</th>
					<th>
						Description
					</th>
					<th>
						Image
					</th>
					{[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1].map((item, index) => {
						return <th key={index}>
							Attribute {index}
						</th>
					})}
				</thead>
				<tbody>

				</tbody>
				<tfoot />
			</table>
		</div>
		<FixedBottomNavigation
			backwardFunction={() => {
				history.goBack()
			}}
		/>
	</>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer> 
		{(value) => {
			return <BatchMetadataParser {...value} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;