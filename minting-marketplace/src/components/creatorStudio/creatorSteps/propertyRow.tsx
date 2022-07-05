import React from 'react';
import InputField from '../../common/InputField';
import { useSelector } from 'react-redux';
import { RootState } from '../../../ducks';
import { ColorStoreType } from '../../../ducks/colors/colorStore.types';
import { IPropertyRow } from '../creatorStudio.types';

const PropertyRow: React.FC<IPropertyRow> = ({
  trait_type,
  value,
  deleter,
  rerender,
  array,
  index
}) => {
  const { primaryColor, textColor } = useSelector<RootState, ColorStoreType>(
    (store) => store.colorStore
  );

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
            customClass={`form-control rounded-rair bg-${primaryColor}`}
            getter={trait_type}
            setter={updatePropertyName}
            customCSS={{ color: textColor ? textColor : '' }}
          />
        </div>
      </th>
      <th>
        <div className="border-stimorol rounded-rair w-100">
          <InputField
            customClass={`form-control rounded-rair bg-${primaryColor}`}
            getter={value}
            setter={updatePropertyValue}
            customCSS={{ color: textColor ? textColor : '' }}
          />
        </div>
      </th>
      <th>
        <button onClick={deleter} className="btn btn-danger rounded-rair">
          <i className="fas fa-trash" />
        </button>
      </th>
    </tr>
  );
};

export default PropertyRow;
