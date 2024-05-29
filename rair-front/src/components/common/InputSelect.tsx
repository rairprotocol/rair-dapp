import React, { useState } from 'react';

import { getRandomValues } from '../../utils/getRandomValues';

import { InputSelectProps } from './commonTypes/InputSelectTypes.types';

/***
	InputSelect
		Creates a Select input for React Apps
	Props: 
		- Required
			- getter: Put the getter of the useState here
			- setter: Put the setter function of useState here
			- options: The select's options, use {value: ?, label: String} format!
		- Optional Styling
			- label: The label tag won't be rendered if there isn't a label
			- customCSS and customClass: Give styling to the input
			- labelCSS and labelClass: Give styling to the Select's label
			- optionCSS: Style the options (if needed)
			- requiredColor: Text color in case the input is required (default null)
		- Optional Input data
			- required
			- disabled
			- placeholder: The label of the default (disabled) option
			- placeholderValue: The value of the default (disabled) option
			!--- By default the placeholderValue is 'null' ---!
			!--- 'null' as a string, not the actual JS null --!
**/

const InputSelect: React.FC<InputSelectProps> = ({
  getter,
  setter,
  options,
  customCSS = { color: 'black' },
  customClass,
  optionCSS = { color: 'red' },
  optionClass,
  placeholder,
  placeholderValue = 'null',
  label,
  labelCSS = { color: 'inherit' },
  labelClass,
  required,
  disabled,
  requiredColor
}) => {
  const [id] = useState(getRandomValues());
  return (
    <>
      {label && (
        <label
          htmlFor={String(id)}
          style={{
            ...labelCSS,
            color: required ? `${requiredColor}!important` : labelCSS.color
          }}
          className={labelClass}>
          {label + (required ? '*' : '')}
        </label>
      )}
      <select
        disabled={disabled}
        id={String(id)}
        onChange={(e) => setter(e.target.value)}
        value={getter}
        style={{
          ...customCSS,
          width: '100%',
          color: required ? requiredColor : customCSS.color
        }}
        className={customClass}>
        {placeholder && (
          <option
            value={placeholderValue}
            className={optionClass}
            style={{ ...optionCSS }}
            disabled>
            {placeholder + (required ? '*' : '')}
          </option>
        )}
        {options &&
          options.map(({ label, value, disabled }, index) => {
            return (
              <option
                disabled={disabled === undefined ? false : disabled}
                key={id + '-' + index}
                value={value}
                style={{ ...optionCSS }}
                className={optionClass}>
                {label}
              </option>
            );
          })}
      </select>
    </>
  );
};

export default InputSelect;
