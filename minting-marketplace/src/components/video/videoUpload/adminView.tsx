import React, { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { v1 } from 'uuid';

import InputSelect from '../../common/InputSelect';

const AdminView = ({
  primaryColor,
  contractOptions,
  reusableStyle,
  getFullContractData
}) => {
  const [userToken, setUserToken] = useState<string | null>();
  const [selectedContracts, setSelectedContracts] = useState(['null']);
  const options = contractOptions && contractOptions;

  const [disabledOptions, setDisabledOptions] = useState<any>();
  const [hiddenContracts, setHiddenContracts] = useState<any>();

  const showHiddenContracts = useCallback((listContract) => {
    setHiddenContracts(
      listContract.filter(
        (contract) => contract.blockSync && contract.blockView
      )
    );
  }, []);

  const getUserToken = useCallback(() => {
    setUserToken(localStorage.getItem('token'));
  }, []);

  const offOrOnContract = useCallback(
    async (contract: string, option: string) => {
      switch (option) {
        case 'off':
          if (userToken) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await axios.patch(
              `/api/v2/contracts/${contract}`,
              {
                blockSync: true,
                blockView: true
              },
              {
                headers: {
                  Accept: 'application/json',
                  'x-rair-token': userToken
                }
              }
            );
            getFullContractData();
          }

          break;
        case 'on':
          if (userToken) {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const res = await axios.patch(
              `/api/v2/contracts/${contract}`,
              {
                blockSync: false,
                blockView: false
              },
              {
                headers: {
                  Accept: 'application/json',
                  'x-rair-token': userToken
                }
              }
            );
            getFullContractData();
          }

          break;
      }
    },
    [getFullContractData, userToken]
  );

  const createEmptyInput = () => {
    setSelectedContracts([...selectedContracts, 'null']);
  };

  const selectContract = (value, index) => {
    const tempArr = [...selectedContracts];
    tempArr[index] = value;
    setSelectedContracts([...tempArr]);
    setDisabledOptions(
      disabledOptions &&
        disabledOptions.filter(
          (option) => option !== 'null' && option.value !== value
        )
    );
  };

  useEffect(() => {
    getUserToken();
  }, [getUserToken]);

  useEffect(() => {
    showHiddenContracts(contractOptions);
  }, [contractOptions, showHiddenContracts]);

  useEffect(() => {
    setDisabledOptions(options);
  }, [options]);

  return (
    <div className="hidden-block-wrapper">
      <table>
        <tr>
          <th className="hidden-table-col-one">Hidden</th>
          <th className="hidden-table-col-two">Show</th>
        </tr>
        {hiddenContracts &&
          hiddenContracts.map((o) => (
            <tr key={v1()}>
              <td className="hidden-table-title">{o.label}</td>
              <td>
                <button
                  className="hidden-table-button"
                  onClick={() => {
                    offOrOnContract(o.value, 'on');
                    getFullContractData();
                  }}>
                  Show
                </button>
              </td>
            </tr>
          ))}
      </table>
      <div>
        {selectedContracts.map((item: string, index: number) => {
          return (
            <div className="hidden-input-wrapper" key={v1()}>
              <InputSelect
                customClass="form-control input-select-custom-style"
                customCSS={reusableStyle}
                labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
                label="Select contract that need to be hidden"
                getter={item}
                setter={(e) => selectContract(e, index)}
                placeholder="Select contract that need to be hidden"
                options={options}
              />
              <div className="hidden-options-wrapper">
                <button
                  className="hidden-options-button"
                  onClick={() => offOrOnContract(item, 'off')}>
                  Hide
                </button>
                <button
                  className="hidden-table-button"
                  onClick={() => offOrOnContract(item, 'on')}>
                  Show
                </button>
              </div>
            </div>
          );
        })}
        <button className="add_contact" onClick={createEmptyInput}>
          Add new input
        </button>
      </div>
    </div>
  );
};

export default AdminView;
