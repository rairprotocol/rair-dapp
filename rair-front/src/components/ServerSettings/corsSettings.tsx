import { useCallback, useEffect, useState } from 'react';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import InputField from '../common/InputField';

const CorsSettings = () => {
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );
  const reactSwal = useSwal();
  const [corsListCopy, setCorsListCopy] = useState<Array<string>>([]);
  const { updateServerSetting } = useServerSettings();

  const setCorsList = useCallback(async () => {
    updateServerSetting({ allowedCORSOrigins: corsListCopy });
    reactSwal.fire('Success', 'Categories updated', 'success');
  }, [corsListCopy, reactSwal, updateServerSetting]);

  const { corsEnabled, allowedCORSOrigins } = useAppSelector(
    (store) => store.settings
  );

  useEffect(() => {
    setCorsListCopy(allowedCORSOrigins);
  }, [allowedCORSOrigins]);

  const deleteOrigin = useCallback(
    (index) => {
      const aux = [...corsListCopy];
      aux.splice(index, 1);
      setCorsListCopy(aux);
    },
    [corsListCopy]
  );

  const updateCategory = useCallback(
    (index) => (value) => {
      const aux = [...corsListCopy];
      aux[index] = value;
      setCorsListCopy(aux);
    },
    [corsListCopy]
  );

  return (
    <div className="col-12 px-5 my-2">
      <h3>CORS Origins</h3>
      <button
        onClick={() => updateServerSetting({ corsEnabled: !corsEnabled })}>
        {corsEnabled ? 'Enabled' : 'Disabled'}
      </button>
      {corsListCopy.map((origin, index) => {
        return (
          <div key={index} className="row">
            <div className="col-12 col-md-10">
              <InputField
                customClass="rounded-rair form-control"
                getter={origin}
                setter={updateCategory(index)}
                type="text"
              />
            </div>
            <button
              disabled={window.location.toString().includes(origin)}
              onClick={() => deleteOrigin(index)}
              className="col-12 col-md-2 btn btn-danger">
              <FontAwesomeIcon icon={faTrash} />
            </button>
          </div>
        );
      })}
      <button
        className="float-start btn"
        style={{
          color: textColor,
          background: primaryButtonColor
        }}
        onClick={setCorsList}>
        Set
      </button>
      <button
        className="btn btn-success float-end"
        onClick={() => {
          const aux = corsListCopy ? [...corsListCopy] : [];
          aux.push('');
          setCorsListCopy(aux);
        }}>
        Add
      </button>
    </div>
  );
};

export default CorsSettings;
