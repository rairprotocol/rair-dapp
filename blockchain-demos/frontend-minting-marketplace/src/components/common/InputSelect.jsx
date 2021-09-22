import {useState} from 'react'

const InputSelect = ({
		getter,
		setter,
		customCSS = {color: 'black'},
		customClass,
		optionCSS = {color: 'black'},
		optionClass,
		options,
		placeholder,
		placeholderValue = 'null',
		label,
		labelCSS = {color: 'inherit'},
		labelClass,
		required,
		disabled,
		requiredColor
	}) => {

	const [id,] = useState(Math.round(Math.random() * 1000))
	return <>
	{label && <label htmlFor={id} style={{...labelCSS, color: (required ? `${requiredColor}!important` : labelCSS.color)}} className={labelClass}>
			 {label + (required ? '*' : '')}
		</label>}
	<select
		disabled={disabled}
		id={id}
		onChange={e => setter(e.target.value)}
    defaultValue={placeholderValue}
		style={{...customCSS, width: '100%', color: (required ? requiredColor : customCSS.color)}}
		className={customClass}>
		{placeholder && <option value={placeholderValue} className={optionClass} style={{...optionCSS}} disabled >
			{placeholder + (required ? '*' : '')}
		</option>}
		{options && options.map(({label, value}, index) => {
				return <option 
							key={id+'-'+index}
							value={value}
							style={{...optionCSS}}
							className={optionClass}
							>
						{label}
					</option>
			})
		}
	</select>
	</>
}

export default InputSelect