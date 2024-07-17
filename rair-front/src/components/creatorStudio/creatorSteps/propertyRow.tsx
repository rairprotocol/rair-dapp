import React from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import InputField from '../../common/InputField';
import { IPropertyRow } from '../creatorStudio.types';

const PropertyRow: React.FC<IPropertyRow> = ({
  trait_type,
  value,
  deleter,
  rerender,
  array,
  index
}) => {
  const updatePropertyName = (value: string) => {
    array[index].trait_type = value;
    rerender();
  };

  const updatePropertyValue = (value: string) => {
    array[index].value = value;
    rerender();
  };

  return (
    <tr>
      <th>
        <div className="border-stimorol rounded-rair w-100">
          <InputField
            customClass={`form-control rounded-rair`}
            getter={trait_type}
            setter={updatePropertyName}
          />
        </div>
      </th>
      <th>
        <div className="border-stimorol rounded-rair w-100">
          <InputField
            customClass={`form-control rounded-rair`}
            getter={value}
            setter={updatePropertyValue}
          />
        </div>
      </th>
      <th>
        <button onClick={deleter} className="btn btn-danger rounded-rair">
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </th>
    </tr>
  );
};

export default PropertyRow;
