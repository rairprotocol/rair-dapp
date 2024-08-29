import { useCallback, useEffect, useState } from 'react';

import BlockchainSettings from './blockchainSettings';
import BooleanSettings from './booleanSettings';
import CategorySettings from './categorySettings';
import ColorSettings from './colorSettings';
import ContractManager from './contractManager';
import CustomValues from './customValues';
import FeaturedBanner from './featuredBanner';
import FooterSettings from './footerSettings';
import SuperAdminSettings from './superAdmins';
import TextSettings from './TextSettings';

import { useAppDispatch } from '../../hooks/useReduxHooks';
import { loadSettings } from '../../redux/settingsSlice';
import { Contract } from '../../types/databaseTypes';
import { rFetch } from '../../utils/rFetch';

const ServerSettings = () => {
  const [contractList, setContractList] = useState<
    Array<
      Pick<
        Contract,
        | 'blockchain'
        | 'contractAddress'
        | 'diamond'
        | 'title'
        | '_id'
        | 'blockSync'
        | 'blockView'
      >
    >
  >([]);

  const dispatch = useAppDispatch();

  const getContractList = useCallback(async () => {
    const { success, contracts } = await rFetch('/api/contracts/factoryList');
    if (success) {
      setContractList(contracts);
    }
  }, []);

  useEffect(() => {
    getContractList();
  }, [getContractList]);

  useEffect(() => {
    dispatch(loadSettings());
  }, []);

  return (
    <div className="row mx-5 p-5 text-start">
      <h5>Server Settings</h5>
      <BooleanSettings />
      <FeaturedBanner {...{ contractList }} />
      <BlockchainSettings />
      <SuperAdminSettings />
      <ColorSettings />
      <CategorySettings />
      <FooterSettings />
      <CustomValues />
      <TextSettings />
      <hr className="my-5" />
      <ContractManager {...{ contractList, getContractList }} />
    </div>
  );
};

export default ServerSettings;
