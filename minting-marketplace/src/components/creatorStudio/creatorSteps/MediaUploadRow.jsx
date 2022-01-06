// import { useState, useEffect, useCallback} from 'react';
import InputField from '../../common/InputField.jsx';
import InputSelect from '../../common/InputSelect.jsx';
import { useSelector } from 'react-redux';

const MediaUploadRow = ({item, offerList, deleter, rerender, index, array}) => {

	const {primaryColor, /*secondaryColor,*/ textColor} = useSelector(store => store.colorStore);
	
	const cornerStyle = {height: '35vh', borderRadius: '16px 0 0 16px'}
	const selectCommonInfo = {
		customClass: 'form-control rounded-rair',
		customCSS: {
			backgroundColor: `var(--${primaryColor}-80)`,
			color: textColor
		},
		optionCSS: {
			color: textColor
		}
	};

	const updateMediaTitle = (value) => {
		array[index].title = value;
		rerender();
	}

	const updateMediaDescription = (value) => {
		array[index].description = value;
		rerender();
	}

	const updateMediaCategory = (value) => {
		array[index].category = value;
		rerender();
	}

	const updateMediaOffer = (value) => {
		array[index].offer = value;
		rerender();
	}

	return <div
		style={{backgroundColor: `var(--${primaryColor}-80)`, color: textColor}}
		className='p-0 rounded-rair d-flex align-items-center my-3 col-12 row mx-0'>
		<div className='col-12 text-end'>
			<button onClick={deleter} className='btn btn-danger rounded-rair text-center border-danger' style={{color: textColor}}>
				<i className='fas fa-trash' />
			</button>
		</div>
		<div
			className='col-12 m-0 p-0 col-md-5'
			style={{...cornerStyle, height: '100%', overflowY: 'hidden'}}>
			{item.file.type.split('/')[0] === 'video' &&
				<video style={cornerStyle} className='h-100 w-100' src={item.preview} />
			}
			{item.file.type.split('/')[0] === 'image' &&
				<img alt='' style={cornerStyle} src={item.preview} className='h-auto w-100' />
			}
			{item.file.type.split('/')[0] === 'audio' &&
				<>
					<div className='w-100 h-100'>
						<audio
							controls
							src={item.preview}>
							Your browser does not support the
							<code>audio</code> element.
						</audio>
					</div>
				</>
			}
		</div>
		<div className='col-12 row text-start d-flex align-items-center py-3 col-md-7'>
			<div className='my-1'>
				Title
				<div className='border-stimorol rounded-rair col-12 mb-0'>
					<InputField 
						getter={item.title}
						setter={updateMediaTitle}
						customClass='mb-0 form-control rounded-rair'
						customCSS={{backgroundColor: `var(--${primaryColor}-80)`, color: textColor}}
					/>
				</div>
			</div>
			<div className='my-1'>
				Category
				<div className='border-stimorol rounded-rair col-12'>
					<InputSelect
						options={['Music Video','Art','Abstract','Interview','Course','18+'].map(item => {return {label: item, value: item}})}
						placeholder='Select a category'
						getter={item.category}
						setter={updateMediaCategory}
						{...selectCommonInfo}
					/>
				</div>
				<small>
					{item.file.type}
				</small>
			</div>
			<div className='my-1'>
				Offer
				<div className='border-stimorol rounded-rair col-12'>
					<InputSelect
						options={offerList}
						getter={item.offer}
						setter={updateMediaOffer}
						placeholder='Select an offer'
						{...selectCommonInfo}
					/>
				</div>
			</div>
			<div className='my-1'>
				Description
				<div className='border-stimorol rounded-rair col-12'>
					<textarea
						style={selectCommonInfo.customCSS}
						value={item.description}
						onChange={e => updateMediaDescription(e.target.value)}
						className='rounded-rair form-control' />
				</div>
			</div>
		</div>
	</div>
}

export default MediaUploadRow;