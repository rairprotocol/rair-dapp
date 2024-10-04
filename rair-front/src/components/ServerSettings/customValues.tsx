import { useEffect, useState } from 'react';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import { CustomValue } from '../../types/databaseTypes';
import InputField from '../common/InputField';

const CustomValues = () => {
  const [customValuesCopy, setCustomValuesCopy] = useState<Array<CustomValue>>(
    []
  );
  const { customValues } = useAppSelector((store) => store.settings);

  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const { updateServerSetting } = useServerSettings();

  useEffect(() => {
    if (customValues) {
      // Redux is passing readonly references
      setCustomValuesCopy(JSON.parse(JSON.stringify(customValues)));
    }
  }, [customValues]);

  const modifyCustomValues = (index, field) => (value) => {
    const aux = [...customValuesCopy];
    aux[index][field] = value;
    setCustomValuesCopy(aux);
  };

  const deleteCustomValues = (index) => {
    const aux = [...customValuesCopy];
    aux.splice(index, 1);
    setCustomValuesCopy(aux);
  };

  return (
    <div className="col-12 px-5 my-2">
      <h3>Server values</h3>
      {customValuesCopy &&
        customValuesCopy.map((customValue, index) => {
          return (
            <div key={index} className="row">
              <div className="col-12 col-md-5">
                <InputField
                  label="Name"
                  customClass="rounded-rair form-control text-center p-1 w-100"
                  getter={customValue.name}
                  setter={modifyCustomValues(index, 'name')}
                  type="text"
                />
              </div>
              <div className="col-12 col-md-6">
                <InputField
                  label="Value"
                  customClass="rounded-rair form-control text-center p-1 w-100"
                  getter={customValue.value}
                  setter={modifyCustomValues(index, 'value')}
                  type="text"
                />
              </div>
              <button
                className="btn mt-4 col-12 col-md-1 btn-danger"
                onClick={() => {
                  deleteCustomValues(index);
                }}>
                Delete
              </button>
            </div>
          );
        })}
      <button
        className="btn rair-button float-start"
        style={{
          background: primaryButtonColor,
          color: textColor
        }}
        onClick={() => {
          updateServerSetting({ customValues: customValuesCopy });
        }}>
        Set Custom Values
      </button>
      <button
        className="btn btn-success float-end"
        onClick={() => {
          const aux = customValues ? [...customValuesCopy] : [];
          aux.push({
            name: '',
            value: ''
          });
          setCustomValuesCopy(aux);
        }}>
        Add
      </button>
    </div>
  );
};

export default CustomValues;
