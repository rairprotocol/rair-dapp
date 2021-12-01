import { useState, useEffect } from 'react';
import InputField from '../../common/InputField.jsx';
import BinanceDiamond from '../../../images/binance-diamond.svg';
import PropertyRow from './propertyRow.jsx';
import { useSelector } from 'react-redux';
import { useParams, useHistory } from 'react-router-dom';

const SingleMetadataEditor = ({contractData, setStepNumber, steps}) => {
	const stepNumber = 4;

	const [nftID, setNFTID] = useState('');
	const [nftTitle, setNFTTitle] = useState('');
	const [nftImage, setNFTImage] = useState(BinanceDiamond);
	const [nftDescription, setNFTDescription] = useState('');
	const [forceRerender, setForceRerender] = useState(false);
	const [propertiesArray, setPropertiesArray] = useState([]);

	const { minterInstance, contractCreator, programmaticProvider, currentChain } = useSelector(store => store.contractStore);
	const {primaryColor, textColor} = useSelector(store => store.colorStore);
	const {address, collectionIndex} = useParams();

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
		//setStepNumber(stepNumber);
	}, [setStepNumber])

	return <div className='row px-0 mx-o'>
		<div className='col-6 text-start'>
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
			<div className='col-12' style={{position: 'relative', overflowY: 'scroll', maxHeight: '30vh'}}>
				<button onClick={addRow} className='rounded-rair btn btn-stimorol' style={{position: 'absolute', top: 0, right: 0}}>
					<i className='fas fa-plus' />
				</button>
				<table className='w-100 mt-3'>
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
					<tfoot>
					</tfoot>
				</table>
			</div>
		</div>
		<div className='col-6'>
			<div style={{minHeight: '70vh', maxHeight: '100vh'}} className='w-100 border-stimorol rounded-rair'>
				<img
					className='w-100 rounded-rair'
					src={nftImage} />
			</div>
		</div>
		<div className='my-5 col-12'>
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
	</div>
}

export default SingleMetadataEditor;