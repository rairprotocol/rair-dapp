import InputField from '../../common/InputField.jsx';
import { useSelector } from 'react-redux';

const PropertyRow = ({name, value, deleter, rerender, array, index}) => {

	const {primaryColor, textColor} = useSelector(store => store.colorStore);

	const updatePropertyName = (value) => {
		array[index].name = value;
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
					getter={name}
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