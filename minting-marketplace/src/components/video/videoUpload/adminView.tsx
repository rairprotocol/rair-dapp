import { useCallback, useEffect, useState } from 'react';
import axios from 'axios';
import { v1 } from 'uuid';

import InputSelect from '../../common/InputSelect';

const AdminView = ({
  primaryColor,
  contractOptions,
  reusableStyle,
  getFullContractData
}) => {
  const [selectedContracts, setSelectedContracts] = useState(['null']);
  const options = contractOptions && contractOptions;

  const [disabledOptions, setDisabledOptions] = useState<any>();
  const [hiddenContracts, setHiddenContracts] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);

  const showHiddenContracts = useCallback((listContract) => {
    setHiddenContracts(
      listContract.filter(
        (contract) => contract.blockSync && contract.blockView
      )
    );
  }, []);

  const offOrOnContract = useCallback(
    async (contract: string, option: string) => {
      setLoading(true);
      switch (option) {
        case 'off':
          await axios.patch(
            `/api/v2/contracts/${contract}`,
            {
              blockSync: true,
              blockView: true
            },
            {
              headers: {
                Accept: 'application/json'
              }
            }
          );
          getFullContractData();
          setLoading(false);
          break;
        case 'on':
          await axios.patch(
            `/api/v2/contracts/${contract}`,
            {
              blockSync: false,
              blockView: false
            },
            {
              headers: {
                Accept: 'application/json'
              }
            }
          );
          getFullContractData();
          setLoading(false);
          break;
      }
    },
    [getFullContractData]
  );

  const createEmptyInput = () => {
    setSelectedContracts([...selectedContracts, 'null']);
  };

  const removeInput = (id) => {
    const array = selectedContracts.filter((item, index) => index !== id);
    setSelectedContracts(array);
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
    showHiddenContracts(contractOptions);
  }, [contractOptions, showHiddenContracts]);

  useEffect(() => {
    setDisabledOptions(options);
  }, [options]);

  return (
    <div className="hidden-block-wrapper">
      <div className="hidden-contracts-table">
        <table>
          <thead>
            <tr>
              <th className="hidden-table-col-one">Hidden</th>
              <th className="hidden-table-col-two">Shown</th>
            </tr>
          </thead>
          {hiddenContracts &&
            hiddenContracts.map((o) => (
              <tr key={v1()}>
                <td className={`hidden-table-title ${primaryColor}`}>
                  {o.label}
                </td>
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
      </div>
      <div>
        {selectedContracts.map((item: string, index: number) => {
          return (
            <div className="hidden-input-wrapper" key={v1()}>
              <InputSelect
                customClass="form-control input-select-custom-style"
                customCSS={reusableStyle}
                // labelCSS={{ backgroundColor: `var(--${primaryColor})` }}
                label="Select contract that needs to be hidden"
                getter={item}
                setter={(e) => selectContract(e, index)}
                placeholder="Select contract that needs to be hidden"
                options={options}
              />
              <div className="hidden-options-wrapper">
                <button
                  className="hidden-options-button"
                  onClick={() => offOrOnContract(item, 'off')}
                  disabled={loading === true ? true : false}>
                  Hide
                </button>
                <button
                  className="hidden-table-button"
                  onClick={() => offOrOnContract(item, 'on')}
                  disabled={loading === true ? true : false}>
                  Show
                </button>
                <button
                  className="btn btn-danger rounded-rair"
                  onClick={() => removeInput(index)}>
                  <i className="fas fa-trash"></i>
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
