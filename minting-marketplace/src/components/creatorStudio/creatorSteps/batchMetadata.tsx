//@ts-nocheck
import { useState, useEffect, useCallback } from 'react'
import { useSelector } from 'react-redux'
import imageIcon from '../../../images/imageIcon.svg';
// import documentIcon from '../../../images/documentIcon.svg';
import { NavLink, useParams } from 'react-router-dom'
import { rFetch } from '../../../utils/rFetch';
import FixedBottomNavigation from '../FixedBottomNavigation';
import WorkflowContext from '../../../contexts/CreatorWorkflowContext';
import csvParser from '../../../utils/csvParser';
import Dropzone from 'react-dropzone'
import Swal from 'sweetalert2';
import blockchainData from '../../../utils/blockchainData';
import BlockchainURIManager from '../common/blockchainURIManager'
import axios from 'axios';

const BatchMetadataParser = ({ contractData, setStepNumber, steps, stepNumber, gotoNextStep, goBack, simpleMode}) => {
	const { address, collectionIndex } = useParams();

	const [csvFile, setCSVFile] = useState();
	const [metadata, setMetadata] = useState();
	const [headers, setHeaders] = useState();
	const [metadataExists, setMetadataExists] = useState(false);

	const onImageDrop = useCallback(acceptedFiles => {
		csvParser(acceptedFiles[0], console.log)
	}, [])
	const onCSVDrop = useCallback(acceptedFiles => {
		setCSVFile(acceptedFiles[0]);
		csvParser(acceptedFiles[0], setMetadata)
	}, [])

	useEffect(() => {
		if (!metadata) {
			return;
		}
		setHeaders(Object.keys(metadata[0]).filter(item => !['Name', 'NFTID', 'Description', 'Image'].includes(item)))
	}, [metadata, setHeaders]);

	const fetchData = useCallback(async () => {
		let { success, result } = await rFetch(`/api/nft/network/${contractData.blockchain}/${address}/${collectionIndex}/`);
		if (success && result.totalCount > 0) {
			setMetadataExists(result.tokens.filter(item => item.metadata.name !== 'none').length > 0);
		}
	}, [address, collectionIndex, contractData.blockchain])

	useEffect(fetchData, [fetchData])

	const { primaryColor, textColor } = useSelector(store => store.colorStore);

	useEffect(() => {
		setStepNumber(stepNumber);
	}, [setStepNumber, stepNumber])

	const sendMetadata = async (updateMeta) => {
		let formData = new FormData();
		formData.append('product', collectionIndex);
		formData.append('contract', contractData._id);
		formData.append('updateMeta', updateMeta);
		formData.append('csv', csvFile, 'metadata.csv');
		let response = await rFetch('/api/nft', {
			method: 'POST',
			body: formData,
			redirect: 'follow'
		});
		if (response?.success) {
			Swal.fire('Success', `${updateMeta ? 'Updated' : 'Generated'} ${response.result.length} metadata entries!`, 'success');
		} else {
			Swal.fire('Error', response?.message, 'error');
		}
	}

	const downloadTemplateCSV = () => {
		axios.get('/api/nft/csv/sample', { responseType: "blob" })
			.then(response => response.data)
			.then((blob) => {
				// Create blob link to download
				const url = window.URL.createObjectURL(
					new Blob([blob]),
				);
				const link = document.createElement('a');
				link.href = url;
				link.setAttribute(
					'download',
					`template.csv`,
				);

				// Append to html link element page
				document.body.appendChild(link);

				// Start download
				link.click();

				// Clean up and remove the link
				link.parentNode.removeChild(link);
			});
	}

	let missing = <div style={{ width: '2rem', height: '2rem', paddingTop: '0.2rem', border: 'solid 1px #F63419', borderRadius: '50%' }}>
		<i className='fas fa-exclamation text-danger' />
	</div>

	return <>
		<small className='w-100 text-center'>
			Please, download our prebuilt CSV template for metadata uploading.
		</small>
		<div className='col-4 text-start mb-3' />
		<button className={`btn btn-stimorol rounded-rair col-4 my-5`} onClick={downloadTemplateCSV}>
			Download CSV Template
		</button>
		<div className='col-4 text-start mb-3' />
		<div className='rounded-rair col-6 mb-3'>
			<Dropzone onDrop={onImageDrop}>
				{({ getRootProps, getInputProps, isDragActive }) => (
					<section>
						<div {...getRootProps()} style={{ border: 'dashed 1px var(--charcoal-80)', position: 'relative' }} className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'>
							<input {...getInputProps()} />
							<div style={{ position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem' }}>
								1
							</div>
							<img alt='' style={{ filter: primaryColor === 'rhyno' ? 'brightness(40%)' : undefined }} src={imageIcon} className='my-5' />
							<br />
							{
								isDragActive ?
									<>Drop the images here ...</> :
									<>Drag and drop or click to upload images</>
							}
						</div>
					</section>
				)}
			</Dropzone>
		</div>
		<div className='rounded-rair col-6 mb-3'>
			<Dropzone onDrop={onCSVDrop}>
				{({ getRootProps, getInputProps, isDragActive }) => (
					<section>
						<div {...getRootProps()} style={{ border: 'dashed 1px var(--charcoal-80)', position: 'relative' }} className='w-100 h-100 rounded-rair col-6 text-center mb-3 p-3'>
							<input {...getInputProps()} />
							<div style={{ position: 'absolute', top: '1rem', left: '1rem', border: `solid 1px ${textColor}`, borderRadius: '50%', width: '1.5rem', height: '1.5rem' }}>
								2
							</div>
							<img alt='' style={{ filter: primaryColor === 'rhyno' ? 'brightness(40%)' : undefined }} src={imageIcon} className='my-5' />
							<br />
							{
								isDragActive ?
									<>Drop the CSV file here ...</> :
									<>Drag and drop or click to upload the CSV file</>
							}
						</div>
					</section>
				)}
			</Dropzone>
		</div>
		{metadata && headers && <div style={{ border: 'solid 1px var(--charcoal-80)', overflow: 'scroll', width: '80vw', maxHeight: '50vh' }} className='rounded-rair px-0'>
			<table className={`rair-table table-${primaryColor}`}>
				<thead>
					<tr>
						<th className='py-3'>
							NFT #
						</th>
						<th>
							Title
						</th>
						<th>
							Description
						</th>
						<th>
							Image URL
						</th>
						{headers.map((item, index) => {
							return <th key={index}>
								{item}
							</th>
						})}
					</tr>
				</thead>
				<tbody>
					{metadata.map((item, index) => {
						return <tr key={index}>
							<th>
								{item.NFTID ? item.NFTID : missing}
							</th>
							<th style={{ color: `var(--${primaryColor === 'rhyno' ? 'royal-purple' : 'bubblegum'})` }}>
								{item.Name ? item.Name : missing}
							</th>
							<th>
								{item.Description ? item.Description : missing}
							</th>
							<th style={{ color: 'var(--bubblegum)' }}>
								{item['Image'] ? item['Image'] : missing}
							</th>
							{headers.map((header, index) => {
								return <th key={index}>
									{item[header] ? item[header] : missing}
								</th>
							})}
						</tr>
					})}
				</tbody>
				<tfoot />
			</table>
		</div>}
		{!simpleMode && <>
			{!contractData.instance ? <>
				Connect to {blockchainData[contractData.blockchain].name} for more options
			</> : <>
				<BlockchainURIManager
					{...{
						contractData,
						address,
						collectionIndex
					}}
				/>
			</>}
		</>}
		<FixedBottomNavigation
			backwardFunction={goBack}
			forwardFunctions={[{
				label: metadata ? metadataExists ? 'Update' : 'Send' : 'Continue',
				action: metadata ? () => sendMetadata(metadataExists) : gotoNextStep
			}]}
		/>
	</>
}

const ContextWrapper = (props) => {
	return <WorkflowContext.Consumer>
		{(value) => {
			return <BatchMetadataParser {...value} {...props} />
		}}
	</WorkflowContext.Consumer>
}

export default ContextWrapper;