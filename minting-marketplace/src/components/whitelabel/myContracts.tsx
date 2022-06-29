//@ts-nocheck
import React, { useState, useEffect, useCallback } from 'react';

// React Redux types

import DeployContracts from './DeployContracts';
import setDocumentTitle from '../../utils/setTitle';

import Contract from './Contract';
import { rFetch } from '../../utils/rFetch';

import { useDispatch, useSelector } from 'react-redux';
import { getTokenError } from '../../ducks/auth/actions';

const Factory = () => {
  const dispatch = useDispatch();

  const [contractArray, setContractArray] = useState([]);
  const { programmaticProvider } = useSelector((store) => store.contractStore);

  const fetchContracts = useCallback(async () => {
    const response = await rFetch('/api/contracts', undefined, {
      provider: programmaticProvider
    });

    if (response.success) {
      setContractArray(response.contracts);
    }

    if (response.error && response.message) {
      dispatch(getTokenError(response.error));
    }
  }, [programmaticProvider, dispatch]);

  useEffect(() => {
    fetchContracts();
  }, [fetchContracts]);

  useEffect(() => {
    setDocumentTitle('My Contracts');
  }, []);

  return (
    <div
      style={{ position: 'relative' }}
      className="w-100 text-start row mx-0 px-0">
      <h1>Your deployed contracts</h1>
      <DeployContracts />
      {contractArray &&
        contractArray.map((item, index) => <Contract {...item} key={index} />)}
    </div>
  );
};

export default Factory;
