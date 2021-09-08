import React, {useState} from 'react'

const InputField = ({
	getter,
	setter,
	customCSS = {color: 'black'},
	customClass,
	labelCSS = {color: 'black'},
	labelClass,
	placeholder,
	type,
	label,
	required,
	disabled,
	requiredColor,
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
			onChange={e => setter(e.target.value)}
			value={getter}
			disabled={disabled}
			style={{...customCSS, ':required': {color: requiredColor}}}
			className={customClass}
			required={required ? required : false}
			placeholder={placeholder + (required ? '*' : '')} />
	</>
}

export default InputField