import React, {useState} from 'react'

const InputField = ({
	getter,
	setter,
	setterField = ['value'],
	customCSS = {color: 'black'},
	customClass,
	labelCSS = {color: 'black'},
	labelClass,
	placeholder = '',
	type,
	label,
	required,
	disabled,
	requiredColor,
	min,
	max
}) => {
	const [id,] = useState(Number(new Date()) + '-' + Math.round(Math.random() * 1000000))
	
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
			onChange={e => setter(setterField.reduce((start, piece) => {return start[piece]}, e.target))}
			value={getter}
			disabled={disabled}
			style={{...customCSS, ':required': {color: requiredColor}}}
			className={customClass}
			required={required ? required : false}
			min={min}
			max={max}
			placeholder={placeholder + (required ? '*' : '')} />
	</>
}

export default InputField