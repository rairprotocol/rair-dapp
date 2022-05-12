//@ts-nocheck
import React, { /*useEffect,*/ useState } from 'react'
import { getRandomValues } from '../../utils/getRandomValues'

/***
	InputField
		Creates an input field for React Apps
	Props: 
		- Required
			- getter: Put the getter of the useState here
			- setter: Put the setter function of useState here
		- Optional Styling
			- label: The label tag won't be rendered if there isn't a label
			- customCSS and customClass: Give styling to the input
			- labelCSS and labelClass: Give styling to the Select's label
			- requiredColor: Text color in case the input is required (default null)
		- Optional Input data
			- type: By default it's text
			- required: Required inputs will have an * next to their label!
			- disabled
			- placeholder: The label of the default (disabled) option
			- min: For number inputs
			- max: For number inputs
		- Special:
			- setterField: An array of object labels where the value is (relative to the event.target)
				For example: An input field will be 'value' , as in, the data is in event.target.value
			!---	In the case of a File input, the route is event.target.files[0], ---!
			!---		so pass ['files',0] to that prop!							 ---!
**/

const InputField = ({
	getter,
	setter,
	setterField = ['value'],
	customCSS = { color: 'black' },
	customClass,
	labelCSS = { color: 'inherit' },
	labelClass,
	placeholder = '',
	type,
	label,
	required,
	disabled,
	requiredColor,
	min,
	max,
	maxLength
}) => {
	
	const [id,] = useState(getRandomValues)

	return <>
		{label &&
			<label
				htmlFor={id}
				style={{
					...labelCSS,
					color: (required ? `${requiredColor}!important` : labelCSS.color)
				}}
				className={labelClass}>
				{label + (required ? '*' : '')}
			</label>}
		<input
			type={type}
			id={id}
			onChange={e => setter(setterField.reduce((start, piece) => { return start[piece] }, e.target))}
			value={getter}
			disabled={disabled}
			style={{ ...customCSS, ':required': { color: requiredColor } }}
			className={customClass}
			required={required ? required : false}
			min={min}
			max={max}
			maxLength={maxLength}
			placeholder={placeholder + (required ? '*' : '')} />
	</>
}

export default InputField