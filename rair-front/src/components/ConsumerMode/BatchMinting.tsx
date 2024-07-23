import React, { ChangeEvent, useEffect, useState } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { BigNumber, utils } from 'ethers';

import {
  IBatchMinting,
  IBatchRow,
  TBatchMintingItem
} from './consumerMode.types';

import blockchainData from '../../utils/blockchainData';

const BatchRow: React.FC<IBatchRow> = ({ index, deleter, array }) => {
  const [address, setAddress] = useState<string>();
  const [token, setToken] = useState<number>();

  useEffect(() => {
    setAddress(array[index].address);
    setToken(array[index].token);
  }, [index, array]);

  const addressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    array[index].address = e.target.value;
  };

  const tokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(+e.target.value);
    array[index].token = +e.target.value;
  };

  return (
    <div className="col-12 row px-0 mx-0">
      <div className="col-1 px-0">
        <div className="form-control" style={{ border: 'none' }}>
          #{index}
        </div>
      </div>
      <div className="col-7 px-0">
        <input
          value={address}
          onChange={addressChange}
          className="form-control"
        />
      </div>
      <div className="col-3 px-0">
        <input
          type="number"
          value={token}
          onChange={tokenChange}
          className="form-control"
        />
      </div>
      <button onClick={deleter} className="col-1 btn btn-danger">
        <FontAwesomeIcon icon={faTrash} />
      </button>
    </div>
  );
};

const BatchMinting: React.FC<IBatchMinting> = ({
  name,
  start,
  end,
  price,
  batchMint
}) => {
  const [rows, setRows] = useState<TBatchMintingItem[]>([]);

  const addRow = () => {
    if (rows.length > Number(end) - Number(start)) {
      return;
    }
    const aux = [...rows];
    aux.push({
      address: '',
      token: aux.length ? Number(aux[aux.length - 1].token) + 1 : Number(start)
    });
    setRows(aux);
  };

  const deleteRow = (index: number) => {
    const aux = [...rows];
    aux.splice(index, 1);
    setRows(aux);
  };

  return (
    <div className="row px-0 mx-0 col-12">
      <button disabled className="btn col-12">
        Offer: <b>{name}</b>
      </button>
      <button
        disabled={rows.length > Number(end) - Number(start)}
        onClick={addRow}
        className="col-2 btn btn-success">
        Add <FontAwesomeIcon icon={faPlus} />
      </button>
      <button onClick={addRow} disabled className="col btn btn-white">
        Total:{' '}
        {utils
          .formatEther(
            BigNumber.from(price === '' ? 0 : price).mul(rows.length)
          )
          .toString()}{' '}
        {window.ethereum.chainId &&
          blockchainData[window.ethereum.chainId]?.symbol}
        !
      </button>
      <div
        className="col-12"
        style={{ maxHeight: '60vh', overflowY: 'scroll' }}>
        {rows.map((item: TBatchMintingItem, index: number) => {
          return (
            <BatchRow
              key={index}
              index={index}
              deleter={() => deleteRow(index)}
              array={rows}
            />
          );
        })}
      </div>
      <button
        onClick={() => batchMint(rows)}
        disabled={!rows.length}
        className="col btn btn-primary">
        Batch Mint {rows.length} tokens!
      </button>
    </div>
  );
};

export default BatchMinting;
