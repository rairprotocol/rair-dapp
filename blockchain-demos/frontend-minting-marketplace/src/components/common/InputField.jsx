import React, {useState} from 'react';

const InputField = ({getter, setter, name, label, type, placeholder}) => {
    const [id, setID] = useState(name)
    useState(() => {
      if (!name)
      {
        setID(Math.round(Math.random() * 10000));
      }
    }, [])
    return <>
      {label && <label
        htmlFor={id}
        className='col-12 d-inline-block col-md-4 my-2'>
          {label}:
        </label>}
      <input
        id={id}
        value={getter}
        placeholder={placeholder}
        type={type ? type : 'text'}
        onChange={(e) => setter(e.target.value)}
        className='col-12 d-inline-block col-md-8 py-2'/>
    </>
  } 

  export default InputField;