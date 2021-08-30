import React , {useState} from 'react';

const InputSelect = ({label, setter, getter, disabled, required, placeholder, options}) => {
  const [id,] = useState(Math.random() * 10000)
  
  let i = 0;
  return (<>
          {label &&
            <label htmlFor={id} className='col-12 d-inline-block col-md-6 my-2'>
              {label}:
            </label>}
            <select
                id={id}
                className='col-12 d-inline-block col-md-6 py-1'
                onChange={e => setter(e.target.value)}
                value={getter}
                disabled={disabled}
                required={required}>
                  <option value='null' disabled> {placeholder ? placeholder : 'Please select'} </option>
                {options && 
                    options.map(option => {
                        return(<option key={i++} value={option.value.toString()}>{option.label}</option>)
                    })
                }
            </select>
      </>)
};

export default InputSelect;