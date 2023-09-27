import { useCallback, useEffect, useState } from 'react';

import useSwal from '../../hooks/useSwal';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

type Settings = {
  demoUploadsEnabled?: Boolean;
  onlyMintedTokensResult?: Boolean;
  nodeAddress?: String;
  featuredCollection?: any;
};

type BlockchainSetting = {
  hash: string;
  display: Boolean;
  sync: Boolean;
  name: String;
  _id: String;
};

const ServerSettings = ({ fullContractData }) => {
  const [settings, setSettings] = useState<Settings>({});
  const [productOptions, setProductOptions] = useState<OptionsType[]>();
  const [featuredContract, setFeaturedContract] = useState('null');
  const [featuredProduct, setFeaturedProduct] = useState('null');
  const [blockchainSettings, setBlockchainSettings] = useState<
    BlockchainSetting[]
  >([]);
  const [nodeAddress, setNodeAddress] = useState(
    process.env.REACT_APP_NODE_ADDRESS
  );
  const reactSwal = useSwal();

  const getServerSettings = useCallback(async () => {
    const { success, settings, blockchainSettings } = await rFetch(
      '/api/settings'
    );
    if (success) {
      setSettings(settings);
      if (settings.featuredCollection) {
        setNodeAddress(
          settings?.nodeAddress || process.env.REACT_APP_NODE_ADDRESS
        );
        setFeaturedContract(settings?.featuredCollection?.contract?._id);
        setFeaturedProduct(settings?.featuredCollection?._id);
      }
      setBlockchainSettings(blockchainSettings);
    }
  }, []);

  const setServerSetting = useCallback(
    async (setting, value) => {
      const { success } = await rFetch(`/api/settings/${setting}`, {
        method: 'POST',
        body: JSON.stringify({
          value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (success) {
        reactSwal.fire('Success', 'Setting set', 'success');
        getServerSettings();
      }
    },
    [reactSwal, getServerSettings]
  );

  const setBlockchainSetting = useCallback(
    async (chain: string, setting: string, value: string) => {
      const { success } = await rFetch(`/api/settings/${chain}`, {
        method: 'PUT',
        body: JSON.stringify({
          [setting]: value
        }),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (success) {
        reactSwal.fire('Success', 'Setting set', 'success');
        getServerSettings();
      }
    },
    [reactSwal, getServerSettings]
  );

  useEffect(() => {
    getServerSettings();
  }, [getServerSettings]);

  useEffect(() => {
    setFeaturedProduct('null');
    if (featuredContract === 'null') {
      return;
    }
    if (!fullContractData[featuredContract]?.products) {
      return;
    }
    const options = Object.keys(
      fullContractData[featuredContract].products
    ).map((productIndex) => {
      const data = fullContractData[featuredContract].products[productIndex];
      return { label: `${data.name} (${data.copies} NFTs)`, value: data._id };
    });

    setProductOptions(options);
  }, [featuredContract, fullContractData]);

  return (
    <div className="row w-100 p-5 mx-5">
      <h5>Server Settings</h5>
      <div className="col-12 col-md-6 my-2">
        Only return minted tokens on collection page:
        <br />
        <button
          disabled={!!settings?.onlyMintedTokensResult}
          className="btn btn-royal-ice"
          onClick={() => setServerSetting('onlyMintedTokensResult', 'true')}>
          Yes
        </button>
        <button
          disabled={!settings?.onlyMintedTokensResult}
          className="btn btn-stimorol"
          onClick={() => setServerSetting('onlyMintedTokensResult', 'false')}>
          No
        </button>
      </div>
      <div className="col-12 col-md-6 my-2">
        Allow demo page uploads:
        <br />
        <button
          disabled={!!settings?.demoUploadsEnabled}
          className="btn btn-royal-ice"
          onClick={() => setServerSetting('demoUploadsEnabled', 'true')}>
          Yes
        </button>
        <button
          disabled={!settings?.demoUploadsEnabled}
          className="btn btn-stimorol"
          onClick={() => setServerSetting('demoUploadsEnabled', 'false')}>
          No
        </button>
      </div>
      <div className="col-12 col-md-6 px-5 my-2">
        <InputSelect
          customClass="rounded-rair form-control"
          label="Featured banner"
          placeholder="Select a contract"
          getter={featuredContract}
          setter={setFeaturedContract}
          options={Object.keys(fullContractData).map((contract) => {
            return {
              label: `${fullContractData[contract].title} (${
                chainData[fullContractData[contract].blockchain]?.symbol
              })`,
              value: contract
            };
          })}
        />
        <InputSelect
          customClass="rounded-rair form-control"
          placeholder="Select a product"
          getter={featuredProduct}
          setter={setFeaturedProduct}
          options={productOptions}
        />
        <button
          className="btn btn-stimorol"
          onClick={() =>
            setServerSetting('featuredCollection', featuredProduct)
          }>
          Set Featured Contract
        </button>
      </div>
      <div className="col-12 col-md-6 px-5 my-2">
        <InputField
          customClass="rounded-rair form-control"
          label="Node Address"
          getter={nodeAddress}
          setter={setNodeAddress}
          placeholder="Node address"
        />
        <br />
        <button
          className="btn btn-royal-ice"
          onClick={() => setServerSetting('nodeAddress', nodeAddress)}>
          Set
        </button>
      </div>
      <div className="col-12 col-md-6 my-2">
        Blockchain settings:
        <br />
        {blockchainSettings.map((chain, index) => {
          return (
            <details className="row" key={index}>
              <summary className="h5">{chain.name}</summary>
              <div className="col-12">
                <span className="me-4">Sync contracts:</span>
                <button
                  disabled={!!chain?.sync}
                  className="btn btn-royal-ice"
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'sync', 'true')
                  }>
                  Yes
                </button>
                <button
                  disabled={!chain?.sync}
                  className="btn btn-stimorol"
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'sync', 'false')
                  }>
                  No
                </button>
              </div>
              <div className="col-12">
                <span className="me-4">Display contracts:</span>
                <button
                  disabled={!!chain?.display}
                  className="btn btn-royal-ice"
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'display', 'true')
                  }>
                  Yes
                </button>
                <button
                  disabled={!chain?.display}
                  className="btn btn-stimorol"
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'display', 'false')
                  }>
                  No
                </button>
              </div>
              <hr />
            </details>
          );
        })}
      </div>
    </div>
  );
};

export default ServerSettings;
