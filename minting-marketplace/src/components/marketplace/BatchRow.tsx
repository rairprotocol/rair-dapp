import React, { useState, useEffect, ChangeEvent } from 'react';
import { TBatchRowPropsType } from './marketplace.types';

const BatchRow: React.FC<TBatchRowPropsType> = ({ index, deleter, array }) => {
  const [address, setAddress] = useState<string>();
  const [token, setToken] = useState<number>();

  useEffect(() => {
    setAddress(array[index]['Public Address']);
    setToken(array[index]['NFTID']);
  }, [index, array]);

  const addressChange = (e: ChangeEvent<HTMLInputElement>) => {
    setAddress(e.target.value);
    array[index]['Public Address'] = e.target.value;
  };

  const tokenChange = (e: ChangeEvent<HTMLInputElement>) => {
    setToken(+e.target.value);
    array[index]['NFTID'] = +e.target.value;
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
        <i className="fas fa-trash" />
      </button>
    </div>
  );
};

export default BatchRow;
