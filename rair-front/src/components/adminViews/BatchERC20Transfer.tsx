import { useCallback, useState } from 'react';
import Dropzone from 'react-dropzone';
import { useSelector } from 'react-redux';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { parseUnits } from 'ethers/lib/utils';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import { ContractsInitialType } from '../../ducks/contracts/contracts.types';
import useSwal from '../../hooks/useSwal';
import useWeb3Tx from '../../hooks/useWeb3Tx';
import csvParser from '../../utils/csvParser';
import InputField from '../common/InputField';

const structure = [
  {
    label: 'Name',
    defaultValue: '',
    disabled: false,
    type: 'text'
  },
  {
    label: 'Address',
    defaultValue: '',
    disabled: false,
    type: 'text'
  },
  {
    label: 'Amount',
    defaultValue: 0,
    disabled: false,
    type: 'number'
  },
  {
    label: 'Status',
    defaultValue: 'Ready',
    disabled: true,
    type: 'text'
  },
  {
    label: 'TxHash',
    defaultValue: '',
    disabled: true,
    type: 'text'
  }
];

type RowData = {
  [key: string]: string;
};

const BatchERC20Transfer = () => {
  const [data, setData] = useState<RowData[]>([]);
  const { textColor, primaryColor, primaryButtonColor, secondaryButtonColor } =
    useSelector<RootState, ColorStoreType>((store) => store.colorStore);
  const { erc777Instance } = useSelector<RootState, ContractsInitialType>(
    (store) => store.contractStore
  );
  const { web3TxHandler } = useWeb3Tx();
  const reactSwal = useSwal();
  const updateRowData = useCallback(
    (key: string, index: number, value: string) => {
      const aux = [...data];
      if (aux[index]) {
        aux[index][key] = value;
      }
      setData(aux);
    },
    [data]
  );

  const addRow = useCallback(() => {
    const aux = [...data];
    const newData = {};
    structure.forEach((data) => {
      newData[data.label] = data.defaultValue;
    });
    aux.push(newData);
    setData(aux);
  }, [data]);

  const onCSVDrop = useCallback((file: File[]) => {
    csvParser(file[0], (data) => {
      setData(
        data.map((item) => {
          const { Name, Address, Amount } = item;
          return { Name, Address, Amount, Status: 'Ready', TxHash: '' };
        })
      );
    });
  }, []);

  const transferProcess = useCallback(async () => {
    if (!erc777Instance) {
      reactSwal.fire('No ERC20 connected');
      return;
    }
    const aux = [...data];
    for await (const dataItem of aux) {
      if (dataItem.Status !== 'Ready' || !dataItem.Amount) {
        continue;
      }
      reactSwal.fire({
        icon: 'info',
        title: 'Preparing transaction',
        html: `Sending ${dataItem.Amount} tokens to ${dataItem.Name} (${dataItem.Address})`,
        showConfirmButton: false
      });
      const txHash = await web3TxHandler(erc777Instance, 'transfer', [
        dataItem.Address,
        parseUnits(dataItem.Amount, 18)
      ]);
      if (txHash) {
        dataItem.TxHash = txHash;
        dataItem.Status = 'Complete';
        await reactSwal.fire({
          icon: 'success',
          title: 'Transaction complete',
          html: `Transaction id: ${txHash}`
        });
      } else {
        await reactSwal.fire({
          icon: 'error',
          title: 'An error has ocurred',
          html: 'The process will stop'
        });
        break;
      }
    }
    setData(aux);
  }, [erc777Instance, data, web3TxHandler, reactSwal]);

  const deleteRow = useCallback(
    (index: number) => {
      const aux = [...data];
      aux.splice(index, 1);
      setData(aux);
    },
    [data]
  );

  return (
    <div className="w-100 row">
      <Dropzone onDrop={onCSVDrop}>
        {({ getRootProps, getInputProps, isDragActive }) => (
          <section>
            <div
              {...getRootProps()}
              style={{
                border: `dashed 1px color-mix(in srgb, ${primaryColor}, #888888)`,
                position: 'relative'
              }}
              className="w-100 h-100 rounded-rair col-6 text-center mb-3 p-3">
              <input {...getInputProps()} />
              <br />
              {isDragActive ? (
                <>Drop the CSV file here ...</>
              ) : (
                <>Drag and drop or click to upload the CSV file</>
              )}
            </div>
          </section>
        )}
      </Dropzone>
      <table className="table table-dark table-responsive">
        <thead>
          <tr>
            <th>
              <button
                onClick={addRow}
                className="rair-button btn"
                style={{
                  color: textColor,
                  background: secondaryButtonColor
                }}>
                <FontAwesomeIcon icon={faPlus} />
              </button>
            </th>
            {structure.map((data, index) => {
              return <th key={index}>{data.label}</th>;
            })}
          </tr>
        </thead>
        <tbody>
          {data.map((data, index) => {
            return (
              <tr key={index}>
                <td>
                  <button
                    onClick={() => deleteRow(index)}
                    className="btn btn-danger">
                    <FontAwesomeIcon icon={faTrash} />
                  </button>
                </td>
                {Object.keys(data).map((key, keyIndex) => {
                  return (
                    <th key={keyIndex}>
                      <InputField
                        disabled={structure[keyIndex]?.disabled}
                        customClass="form-control w-100"
                        type={structure[keyIndex].type}
                        getter={data[key]}
                        setter={(value) => updateRowData(key, index, value)}
                      />
                    </th>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="row w-100">
        <div className="col-12 col-md-9" />
        <button
          onClick={transferProcess}
          className="rair-button btn col-12 col-md-3"
          style={{
            color: textColor,
            background: primaryButtonColor
          }}>
          Start transfers
        </button>
      </div>
    </div>
  );
};

export default BatchERC20Transfer;
