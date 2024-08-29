import { useEffect, useState } from 'react';
import { isAddress } from 'ethers';
import { Hex } from 'viem';

import { useAppSelector } from '../../hooks/useReduxHooks';
import useServerSettings from '../../hooks/useServerSettings';
import InputField from '../common/InputField';

const SuperAdminSettings = () => {
  const [superAdminsCopy, setSuperAdminsCopy] = useState<Array<Hex>>([]);

  const { superAdmins, superAdminsOnVault } = useAppSelector(
    (store) => store.settings
  );
  const { primaryButtonColor, textColor } = useAppSelector(
    (store) => store.colors
  );

  const { updateServerSetting } = useServerSettings();

  useEffect(() => {
    if (superAdmins) {
      setSuperAdminsCopy(JSON.parse(JSON.stringify(superAdmins)));
    }
  }, [superAdmins]);

  const modifySuperAdminAddress = (index) => (value) => {
    const aux = [...superAdminsCopy];
    aux[index] = value;
    setSuperAdminsCopy(aux);
  };

  const deleteSuperAdminAddress = (index) => {
    const aux = [...superAdminsCopy];
    aux.splice(index, 1);
    setSuperAdminsCopy(aux);
  };

  return (
    <div className="col-12 text-end col-md-6 px-5 my-2">
      <h3>Super admins:</h3>
      {superAdminsOnVault ? 'Currently using Vault' : ''}
      {superAdminsCopy &&
        superAdminsCopy.map((user, index) => {
          return (
            <div key={index} className="row">
              <InputField
                disabled={!!superAdminsOnVault}
                customClass="rounded-rair text-center col-12 col-md-10"
                getter={user}
                setter={modifySuperAdminAddress(index)}
                type="text"
              />
              <button
                className="btn col-12 col-md-2 btn-danger"
                disabled={!!superAdminsOnVault}
                onClick={() => {
                  deleteSuperAdminAddress(index);
                }}>
                {' '}
                Delete{' '}
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
        disabled={!!superAdminsOnVault}
        onClick={() => {
          const result = superAdminsCopy.reduce((result, user) => {
            return result && isAddress(user);
          }, true);
          if (result) {
            updateServerSetting({
              superAdmins: superAdminsCopy.map((userAddress) =>
                userAddress.toLowerCase()
              )
            });
          }
        }}>
        {' '}
        Set Super Admins{' '}
      </button>
      <button
        className="btn btn-success"
        disabled={!!superAdminsOnVault}
        onClick={() => {
          modifySuperAdminAddress(superAdminsCopy.length)('');
        }}>
        Add
      </button>
    </div>
  );
};

export default SuperAdminSettings;
