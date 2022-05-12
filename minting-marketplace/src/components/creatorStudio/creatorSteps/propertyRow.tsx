//@ts-nocheck
// import {useState, useEffect, useCallback} from 'react';
import InputField from '../../common/InputField';
import { useSelector } from 'react-redux';

const PropertyRow = ({trait_type, value, deleter, rerender, array, index}) => {
	
	// const [propertyName, setPropertyName] = useState(trait_type);
	// const [propertyValue, setPropertyValue] = useState(value);

	const {primaryColor, textColor} = useSelector(store => store.colorStore);

	const updatePropertyName = (value) => {
		array[index].trait_type = value;
		rerender()
	}

	const updatePropertyValue = (value) => {
		array[index].value = value;
		rerender()
	}

	return <tr>
		<th>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					customClass={`form-control rounded-rair bg-${primaryColor}`}
					getter={trait_type}
					setter={updatePropertyName}
					customCSS={{color: textColor}}
				/>
			</div>
		</th>
		<th>
			<div className='border-stimorol rounded-rair w-100'>
				<InputField
					customClass={`form-control rounded-rair bg-${primaryColor}`}
					getter={value}
					setter={updatePropertyValue}
					customCSS={{color: textColor}}
				/>
			</div>
		</th>
		<th>
			<button onClick={deleter} className='btn btn-danger rounded-rair'>
				<i className='fas fa-trash' />
			</button>
		</th>
	</tr>
}

export default PropertyRow;