import { useCallback, useEffect, useState } from 'react';
import { AlchemyChainMap } from '@alchemy/aa-core';
import { Hex } from 'viem';

import { useAppDispatch, useAppSelector } from '../../hooks/useReduxHooks';
import useSwal from '../../hooks/useSwal';
import { loadSettings } from '../../redux/settingsSlice';
import { Blockchain } from '../../types/databaseTypes';
import { rFetch } from '../../utils/rFetch';
import InputField from '../common/InputField';

interface NewBlockchain extends Blockchain {
  isNew?: boolean;
}

const BlockchainSettings = () => {
  const dispatch = useAppDispatch();
  const [blockchainSettingsCopy, setBlockchainSettingCopy] = useState<
    Array<NewBlockchain>
  >([]);
  const { blockchainSettings } = useAppSelector((store) => store.settings);
  const { textColor, secondaryButtonColor, primaryButtonColor } =
    useAppSelector((store) => store.colors);
  const reactSwal = useSwal();

  useEffect(() => {
    setBlockchainSettingCopy([...blockchainSettings]);
  }, [blockchainSettings]);

  const setBlockchainSetting = useCallback(
    async (chain: Hex | undefined, method = 'PUT') => {
      if (!chain) {
        return;
      }
      const settings = blockchainSettingsCopy.find(
        (chainData) => chainData.hash === chain
      );

      if (!settings) {
        return;
      }

      const { _id, isNew, ...cleanChainData } = settings;

      if (_id && method === 'POST') {
        console.error(
          'error, trying to create a blockchain that already has an ID'
        );
        return;
      }
      if (isNew && method === 'PUT') {
        console.error('error, trying to update a blockchain that is new');
        return;
      }

      Object.keys(cleanChainData).forEach((field) => {
        if (cleanChainData[field] === '') {
          cleanChainData[field] = undefined;
        }
      });
      const { success } = await rFetch(`/api/settings/${chain}`, {
        method,
        body: JSON.stringify(cleanChainData),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (success) {
        dispatch(loadSettings());
        reactSwal.fire('Success', 'Blockchain settings updated', 'success');
      }
    },
    [blockchainSettingsCopy, dispatch, reactSwal]
  );

  const updateBlockchainSetting = useCallback(
    (chain: Hex | undefined, values: Partial<NewBlockchain>) => {
      if (!chain) {
        return;
      }
      const aux = blockchainSettingsCopy.map((chainData) => {
        if (chainData.hash === chain) {
          return { ...chainData, ...values };
        }
        return chainData;
      });
      setBlockchainSettingCopy(aux);
    },
    [blockchainSettingsCopy]
  );

  return (
    <div className="col-12 px-5 col-md-6 my-2">
      <h3>Blockchain settings:</h3>
      {blockchainSettingsCopy?.map((chain, index) => {
        return (
          <details className="row" key={index}>
            <summary className="h5">
              {chain.testnet ? (
                <span>
                  <i className="fas fa-vial" />
                </span>
              ) : (
                ''
              )}{' '}
              {chain.name} ({chain.hash})
            </summary>
            {[
              {
                label: 'Sync contracts',
                setting: 'sync'
              },
              {
                label: 'Display contracts',
                setting: 'display'
              },
              {
                label: 'Test network',
                setting: 'testnet'
              },
              {
                label: 'Supported by Alchemy SDK',
                setting: 'alchemySupport'
              }
            ].map((booleanSetting, boolSettingIndex) => {
              return (
                <div key={boolSettingIndex} className="row w-100">
                  <div className="col-12 col-md-6 text-start">
                    <span className="me-4">{booleanSetting.label}</span>
                  </div>
                  <div className="col-12 col-md-6 text-end">
                    <button
                      disabled={!!chain?.[booleanSetting.setting]}
                      className="btn rair-button"
                      style={{
                        background: secondaryButtonColor,
                        color: textColor
                      }}
                      onClick={() =>
                        updateBlockchainSetting(chain.hash, {
                          [booleanSetting.setting]: true
                        })
                      }>
                      Yes
                    </button>
                    <button
                      disabled={!chain?.[booleanSetting.setting]}
                      className="btn rair-button"
                      style={{
                        background: primaryButtonColor,
                        color: textColor
                      }}
                      onClick={() =>
                        updateBlockchainSetting(chain.hash, {
                          [booleanSetting.setting]: false
                        })
                      }>
                      No
                    </button>
                  </div>
                </div>
              );
            })}
            {[
              {
                label: 'Chain Id (Hexadecimal)',
                type: 'text',
                setting: 'hash',
                effect: (chain) => {
                  const alchemyData = AlchemyChainMap.get(Number(chain));
                  updateBlockchainSetting(chain, {
                    alchemySupport: !!alchemyData
                  });
                  if (alchemyData) {
                    updateBlockchainSetting(chain, {
                      testnet: !!alchemyData?.testnet,
                      blockExplorerGateway:
                        alchemyData.blockExplorers?.default?.url || '',
                      rpcEndpoint: alchemyData.rpcUrls.default.http.at(0) || '',
                      numericalId: alchemyData.id,
                      name: alchemyData.name,
                      symbol: alchemyData.nativeCurrency.symbol
                    });
                  }
                }
              },
              {
                label: 'Name',
                type: 'text',
                setting: 'name'
              },
              {
                label: 'Symbol',
                type: 'text',
                setting: 'symbol'
              },
              {
                label: 'Block Explorer URL',
                type: 'text',
                setting: 'blockExplorerGateway'
              },
              {
                label: 'RPC endpoint',
                type: 'text',
                setting: 'rpcEndpoint'
              },
              {
                label: 'Chain ID (Decimal)',
                type: 'number',
                setting: 'numericalId'
              },
              {
                label: 'Main ERC20 address',
                type: 'text',
                setting: 'mainTokenAddress'
              },
              {
                label: 'Classic Factory Address',
                type: 'text',
                setting: 'classicFactoryAddress'
              },
              {
                label: 'Diamond Factory Address',
                type: 'text',
                setting: 'diamondFactoryAddress'
              },
              {
                label: 'Marketplace Address',
                type: 'text',
                setting: 'diamondMarketplaceAddress'
              },
              {
                label: 'License exchange address',
                type: 'text',
                setting: 'licenseExchangeAddress'
              }
            ].map((inputSetting, inputSettingIndex) => {
              return (
                <div key={inputSettingIndex} className="col-12">
                  <InputField
                    label={inputSetting.label}
                    customClass="rounded-rair form-control text-center col-12"
                    onBlur={() => {
                      if (inputSetting.effect) {
                        inputSetting.effect(chain[inputSetting.setting]);
                      }
                    }}
                    getter={chain[inputSetting.setting]}
                    setter={(value) =>
                      updateBlockchainSetting(chain.hash, {
                        [inputSetting.setting]: value
                      })
                    }
                    type={inputSetting.type}
                  />
                </div>
              );
            })}
            <button
              className="btn rair-button"
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              onClick={() => {
                setBlockchainSetting(chain.hash, chain.isNew ? 'POST' : 'PUT');
              }}>
              {chain.isNew ? 'Save Blockchain Data' : 'Update Settings'}
            </button>
            <button
              className="btn small btn-danger"
              onClick={() => {
                reactSwal
                  .fire({
                    title: 'Deleting Blockchain',
                    html: (
                      <>
                        This action will remove the blockchain and all{' '}
                        associated contracts and tokens from the database
                        <br />
                        <b>Are you sure?</b>
                      </>
                    ),
                    icon: 'warning',
                    showConfirmButton: true,
                    showDenyButton: true,
                    confirmButtonText: 'Delete',
                    denyButtonText: 'Cancel'
                  })
                  .then((userResponse) => {
                    if (userResponse.isConfirmed) {
                      setBlockchainSetting(chain.hash, 'DELETE');
                    }
                  });
              }}>
              Delete Blockchain
            </button>
            <hr />
          </details>
        );
      })}
      <button
        className="btn small btn-success"
        onClick={() => {
          const aux = [...blockchainSettingsCopy];
          aux.push({
            name: '',
            hash: '0x0',
            display: false,
            sync: false,
            testnet: false,
            isNew: true,
            classicFactoryAddress: '',
            diamondFactoryAddress: '',
            diamondMarketplaceAddress: '',
            licenseExchangeAddress: '',
            mainTokenAddress: '',
            rpcEndpoint: '',
            blockExplorerGateway: '',
            numericalId: 0,
            symbol: '',
            alchemySupport: false
          });
          setBlockchainSettingCopy(aux);
        }}>
        Add Blockchain
      </button>
    </div>
  );
};

export default BlockchainSettings;
