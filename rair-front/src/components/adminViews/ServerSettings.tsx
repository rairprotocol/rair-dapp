import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { AlchemyChainMap } from '@alchemy/aa-core';
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { isAddress } from 'ethers/lib/utils';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useServerSettings from '../../hooks/useServerSettings';
import useSwal from '../../hooks/useSwal';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

type Category = {
  name: string;
  _id?: string;
  files?: number;
};

const ServerSettings = ({ fullContractData }) => {
  const {
    superAdmins,
    setSuperAdmins,
    footerLinks,
    setFooterLinks,
    customValues,
    setCustomValues,
    getServerSettings,
    customPrimaryColor,
    customTextColor,
    customPrimaryButtonColor,
    customSecondaryButtonColor,
    setCustomPrimaryColor,
    customSecondaryColor,
    setCustomSecondaryColor,
    setCustomTextColor,
    setCustomPrimaryButtonColor,
    blockchainSettings,
    refreshBlockchainData,
    featuredContract,
    setFeaturedProduct,
    setBlockchainSettings,
    settings,
    setFeaturedContract,
    getBlockchainData,
    featuredProduct,
    nodeAddress,
    setNodeAddress,
    setCustomSecondaryButtonColor,
    customFadeButtonColor,
    setCustomFadeButtonColor,
    legal,
    setLegal,
    signupMessage,
    setSignupMessage
  } = useServerSettings();
  const [productOptions, setProductOptions] = useState<OptionsType[]>();
  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const [customLightModeLogo, setCustomLightModeLogo] = useState({ name: '' });
  const [customDarkModeLogo, setCustomDarkModeLogo] = useState({ name: '' });
  const [customLightModeMobileLogo, setCustomLightModeMobileLogo] = useState({
    name: ''
  });
  const [favicon, setFavicon] = useState({
    name: ''
  });
  const [customDarkModeMobileLogo, setCustomDarkModeMobileLogo] = useState({
    name: ''
  });

  const { primaryButtonColor, textColor, secondaryButtonColor } = useSelector<
    RootState,
    ColorStoreType
  >((store) => store.colorStore);

  const reactSwal = useSwal();

  useEffect(() => {
    refreshBlockchainData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const modifySuperAdminAddress = (index) => (value) => {
    const aux = [...superAdmins];
    aux[index] = value;
    setSuperAdmins(aux);
  };

  const deleteSuperAdminAddress = (index) => {
    const aux = [...superAdmins];
    aux.splice(index, 1);
    setSuperAdmins(aux);
  };

  const modifyFooterLinks = (index, field) => (value) => {
    const aux = [...footerLinks];
    aux[index][field] = value;
    setFooterLinks(aux);
  };

  const deleteFooterLinks = (index) => {
    const aux = [...footerLinks];
    aux.splice(index, 1);
    setFooterLinks(aux);
  };

  const modifyCustomValues = (index, field) => (value) => {
    const aux = [...customValues];
    aux[index][field] = value;
    setCustomValues(aux);
  };

  const deleteCustomValues = (index) => {
    const aux = [...customValues];
    aux.splice(index, 1);
    setCustomValues(aux);
  };

  const getCategories = useCallback(async () => {
    const { success, result } = await rFetch('/api/categories');
    if (success) {
      setCategoryList(result);
    }
  }, []);

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  const setServerSetting = useCallback(
    async (setting) => {
      const { success } = await rFetch(`/api/settings/`, {
        method: 'POST',
        body: JSON.stringify(setting),
        headers: {
          'Content-Type': 'application/json'
        }
      });
      if (success) {
        getServerSettings();
        reactSwal.fire('Success', 'Setting updated', 'success');
      }
    },
    [reactSwal, getServerSettings]
  );

  const setBlockchainSetting = useCallback(
    async (chain: BlockchainType | undefined, method = 'PUT') => {
      if (!chain) {
        return;
      }
      const settings = blockchainSettings.find(
        (chainData) => chainData.hash === chain
      );

      if (!settings) {
        return;
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { _id, isNew, ...cleanChainData } = settings;
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
        reactSwal.fire('Success', 'Blockchain settings updated', 'success');
        refreshBlockchainData();
      }
    },
    [reactSwal, blockchainSettings, refreshBlockchainData]
  );

  const loadImage = useCallback(
    (setterTarget) => (file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (file.type !== 'video/mp4') {
          setterTarget(file);
        } else {
          reactSwal.fire(
            'Info',
            `You cannot upload video as a logo`,
            'warning'
          );
        }
      };
      if (file) {
        reader.readAsDataURL(file);
      }
    },
    [reactSwal]
  );

  const setAppLogos = useCallback(
    async (target: string, image: any) => {
      const formData = new FormData();
      if (image) {
        formData.append('logoImage', image);
      }
      formData.append('target', target);
      const { success } = await rFetch(`/api/settings/appLogo`, {
        method: 'POST',
        body: formData
      });
      if (success) {
        reactSwal.fire(
          'Success',
          `App Logo ${image ? 'Set' : 'Removed'}`,
          'success'
        );
        getServerSettings();
      }
    },
    [reactSwal, getServerSettings]
  );

  useEffect(() => {
    getServerSettings();
  }, [getServerSettings]);

  const deleteCategory = useCallback(
    (index) => {
      const aux = [...categoryList];
      aux.splice(index, 1);
      setCategoryList(aux);
    },
    [categoryList]
  );

  const updateCategory = useCallback(
    (index) => (value) => {
      const aux = [...categoryList];
      aux[index] = {
        ...aux[index],
        name: value
      };
      setCategoryList(aux);
    },
    [categoryList]
  );

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
  }, [setFeaturedProduct, featuredContract, fullContractData]);

  const updateBlockchainSetting = useCallback(
    (
      chain: BlockchainType | undefined,
      setting: string,
      value: string | number | boolean
    ) => {
      if (!chain) {
        return;
      }
      const aux = blockchainSettings.map((chainData) => {
        if (chainData.hash === chain) {
          chainData[setting] = value;
        }
        return chainData;
      });
      setBlockchainSettings(aux);
    },
    [blockchainSettings, setBlockchainSettings]
  );

  return (
    <div className="row text-start w-100 p-5 mx-5">
      <h5>Server Settings</h5>
      {[
        {
          title: 'Only return minted tokens on collection page',
          value: 'onlyMintedTokensResult'
        },
        {
          title: 'Allow demo page uploads',
          value: 'demoUploadsEnabled'
        },
        {
          title: 'Use Vault for super admin verification',
          value: 'superAdminsOnVault'
        },
        {
          title: 'Use gasless resales',
          value: 'databaseResales'
        }
      ].map((item, index) => {
        return (
          <div key={index} className="col-12 px-5 text-start my-3">
            <h5>{item.title}</h5>
            <button
              disabled={!!settings?.[item.value]}
              className="btn rair-button"
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              onClick={() => setServerSetting({ [item.value]: 'true' })}>
              Yes
            </button>
            <button
              disabled={!settings?.[item.value]}
              className="btn rair-button"
              style={{
                background: primaryButtonColor,
                color: textColor
              }}
              onClick={() => setServerSetting({ [item.value]: 'false' })}>
              No
            </button>
          </div>
        );
      })}
      <div className="col-12 px-5 my-2">
        <h3>Featured banner</h3>
        <div className="row">
          <div className="col-12 col-md-6">
            <InputSelect
              label="Contract"
              customClass="rounded-rair form-control"
              placeholder="Select a contract"
              getter={featuredContract}
              setter={setFeaturedContract}
              options={Object.keys(fullContractData).map((contract) => {
                return {
                  label: `${
                    fullContractData[contract].title
                  } (${getBlockchainData[fullContractData[contract].blockchain]
                    ?.symbol})`,
                  value: contract
                };
              })}
            />
          </div>
          <div className="col-12 col-md-6">
            <InputSelect
              label="Product"
              customClass="rounded-rair form-control"
              placeholder="Select a product"
              getter={featuredProduct}
              setter={setFeaturedProduct}
              options={productOptions}
            />
          </div>
        </div>
        <button
          disabled={featuredProduct === 'null' || featuredContract === 'null'}
          className="btn rair-button"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={() => {
            if (featuredProduct !== 'null' && featuredContract !== 'null') {
              setServerSetting({
                featuredCollection: featuredProduct
              });
            }
          }}>
          Set Featured Banner Info
        </button>
      </div>
      <div className="col-12 px-5 my-2">
        <h3>Node address</h3>
        <InputField
          customClass="rounded-rair form-control"
          getter={nodeAddress}
          setter={setNodeAddress}
          placeholder="Node address"
        />
        <button
          className="btn rair-button"
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          onClick={() => setServerSetting({ nodeAddress: nodeAddress })}>
          Set
        </button>
      </div>
      <div className="col-12 px-5 col-md-6 my-2">
        <h3>Blockchain settings:</h3>
        {blockchainSettings?.map((chain, index) => {
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
                          updateBlockchainSetting(
                            chain.hash,
                            booleanSetting.setting,
                            true
                          )
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
                          updateBlockchainSetting(
                            chain.hash,
                            booleanSetting.setting,
                            false
                          )
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
                    updateBlockchainSetting(
                      chain,
                      'alchemySupport',
                      !!alchemyData
                    );
                    if (alchemyData) {
                      updateBlockchainSetting(
                        chain,
                        'testnet',
                        !!alchemyData?.testnet
                      );
                      updateBlockchainSetting(
                        chain,
                        'blockExplorerGateway',
                        alchemyData.blockExplorers?.default?.url || ''
                      );
                      updateBlockchainSetting(
                        chain,
                        'rpcEndpoint',
                        alchemyData.rpcUrls.default.http.at(0) || ''
                      );
                      updateBlockchainSetting(
                        chain,
                        'numericalId',
                        alchemyData.id
                      );
                      updateBlockchainSetting(chain, 'name', alchemyData.name);
                      updateBlockchainSetting(
                        chain,
                        'symbol',
                        alchemyData.nativeCurrency.symbol
                      );
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
                  label: 'Block Explorere URL',
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
                        updateBlockchainSetting(
                          chain.hash,
                          inputSetting.setting,
                          value
                        )
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
                  setBlockchainSetting(
                    chain.hash,
                    chain.isNew ? 'POST' : 'PUT'
                  );
                }}>
                {chain.isNew ? 'Add Blockchain' : 'Update Settings'}
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
            const aux = [...blockchainSettings];
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
              symbol: ''
            });
            setBlockchainSettings(aux);
          }}>
          Add Blockchain
        </button>
      </div>
      <div className="col-12 text-end col-md-6 px-5 my-2">
        <h3>Super admins:</h3>
        {settings.superAdminsOnVault ? 'Currently using Vault' : ''}
        {superAdmins &&
          superAdmins.map((user, index) => {
            return (
              <div key={index} className="row">
                <InputField
                  disabled={!!settings.superAdminsOnVault}
                  customClass="rounded-rair text-center col-12 col-md-10"
                  getter={user}
                  setter={modifySuperAdminAddress(index)}
                  type="text"
                />
                <button
                  className="btn col-12 col-md-2 btn-danger"
                  disabled={!!settings.superAdminsOnVault}
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
          disabled={!!settings.superAdminsOnVault}
          onClick={() => {
            const result = superAdmins.reduce((result, user) => {
              return result && isAddress(user);
            }, true);
            if (result) {
              setServerSetting({
                superAdmins: superAdmins.map((userAddress) =>
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
          disabled={!!settings.superAdminsOnVault}
          onClick={() => {
            modifySuperAdminAddress(superAdmins.length)('');
          }}>
          {' '}
          Add{' '}
        </button>
      </div>
      <div className="row">
        <div className="col-12 col-md-6 px-5 my-2">
          <h3>Custom Dark Mode Colors</h3>
          {[
            {
              getter: customPrimaryColor,
              setter: setCustomPrimaryColor,
              label: 'Primary Color'
            },
            {
              getter: customSecondaryColor,
              setter: setCustomSecondaryColor,
              label: 'Secondary Color'
            },
            {
              getter: customTextColor,
              setter: setCustomTextColor,
              label: 'Text Color'
            },
            {
              getter: customPrimaryButtonColor,
              setter: setCustomPrimaryButtonColor,
              label: 'Primary Button Color'
            },
            {
              getter: customSecondaryButtonColor,
              setter: setCustomSecondaryButtonColor,
              label: 'Secondary Button Color'
            },
            {
              getter: customFadeButtonColor,
              setter: setCustomFadeButtonColor,
              label: 'Fade Button Color'
            }
          ].map((item, index) => {
            return (
              <div key={index} className="row">
                <div className="col-12 col-md-6">
                  <InputField
                    customClass="form-control p-0"
                    label={item.label}
                    getter={item.getter}
                    setter={item.setter}
                    type="color"
                  />
                </div>
                <div className="col-12 col-md-6">
                  <InputField
                    customClass="form-control p-0"
                    label="Hex (#FFFFFF)"
                    getter={item.getter}
                    setter={item.setter}
                  />
                </div>
              </div>
            );
          })}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: '10px'
            }}>
            <button
              className="btn btn-success"
              onClick={async () => {
                await setServerSetting({
                  darkModePrimary: customPrimaryColor,
                  darkModeSecondary: customSecondaryColor,
                  darkModeText: customTextColor,
                  buttonPrimaryColor: customPrimaryButtonColor,
                  buttonFadeColor: customFadeButtonColor,
                  buttonSecondaryColor: customSecondaryButtonColor
                });
              }}>
              Set colors
            </button>
            <button
              className="btn btn-warning"
              onClick={async () => {
                await setServerSetting({
                  darkModePrimary: '#222021',
                  darkModeSecondary: '#4e4d4d',
                  darkModeText: '#FFF',
                  buttonPrimaryColor: '#725bdb', // Royal Purple
                  buttonFadeColor: '#e882d5', // Bubblegum
                  buttonSecondaryColor: '#1486c5' // Arctic Blue
                });
              }}>
              Reset colors
            </button>
          </div>
        </div>
        <div className="col-12 col-md-6 px-5 my-2">
          <h3>Custom Logos</h3>
          {[
            {
              label: 'Dark Mode Desktop Logo',
              getter: customDarkModeLogo,
              setter: setCustomDarkModeLogo,
              target: 'darkModeBannerLogo'
            },
            {
              label: 'Dark Mode Mobile logo',
              getter: customDarkModeMobileLogo,
              setter: setCustomDarkModeMobileLogo,
              target: 'darkModeMobileLogo'
            },
            {
              label: 'Light Mode Desktop Logo',
              getter: customLightModeLogo,
              setter: setCustomLightModeLogo,
              target: 'lightModeBannerLogo'
            },
            {
              label: 'Light Mode Mobile Logo',
              getter: customLightModeMobileLogo,
              setter: setCustomLightModeMobileLogo,
              target: 'lightModeMobileLogo'
            },
            {
              label: 'Favicon',
              getter: favicon,
              setter: setFavicon,
              target: 'favicon'
            }
          ].map((item, index) => {
            return (
              <div className="row" key={index}>
                <div className="col-12 col-md-10">
                  <InputField
                    customClass="form-control p-0"
                    label={item.label}
                    setter={loadImage(item.setter)}
                    setterField={['files', 0]}
                    type="file"
                  />
                </div>
                <button
                  disabled={!item.getter}
                  onClick={() => {
                    setAppLogos(item.target, item.getter);
                    getServerSettings();
                  }}
                  className="col-12 col-md-1 btn rair-button"
                  style={{
                    background: primaryButtonColor,
                    color: textColor
                  }}>
                  <FontAwesomeIcon icon={faArrowUp} />
                </button>
                <button
                  onClick={() => {
                    setAppLogos(item.target, undefined);
                    getServerSettings();
                  }}
                  className="col-12 col-md-1 btn btn-danger">
                  <FontAwesomeIcon icon={faTrash} />
                </button>
              </div>
            );
          })}
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Categories</h3>
          {categoryList.map((categoryData, index) => {
            return (
              <div key={index} className="row">
                <div className="col-12 col-md-10">
                  <InputField
                    customClass="rounded-rair form-control"
                    getter={categoryData.name}
                    setter={updateCategory(index)}
                    type="text"
                  />
                </div>
                <button
                  disabled={!!categoryData.files}
                  onClick={() => deleteCategory(index)}
                  className="col-12 col-md-2 btn btn-danger">
                  {categoryData.files ? (
                    <>
                      {categoryData.files}{' '}
                      <small>files using this category</small>
                    </>
                  ) : (
                    <FontAwesomeIcon icon={faTrash} />
                  )}
                </button>
              </div>
            );
          })}
          <button
            className="float-start btn"
            style={{
              color: textColor,
              background: primaryButtonColor
            }}
            onClick={async () => {
              const result = await rFetch('/api/categories', {
                method: 'POST',
                body: JSON.stringify({
                  list: categoryList.map((item) => ({
                    _id: item._id,
                    name: item.name
                  }))
                }),
                headers: {
                  'Content-Type': 'application/json'
                }
              });
              if (result.success) {
                reactSwal.fire('Success', 'Categories updated', 'success');
                getCategories();
              }
            }}>
            Set
          </button>
          <button
            className="btn btn-success float-end"
            onClick={() => {
              const aux = categoryList ? [...categoryList] : [];
              aux.push({
                name: ''
              });
              setCategoryList(aux);
            }}>
            Add
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Footer items</h3>
          {footerLinks &&
            footerLinks.map((footerLink, index) => {
              return (
                <div key={index} className="row">
                  <div className="col-12 col-md-5">
                    <InputField
                      label="Text"
                      customClass="rounded-rair text-center p-1 w-100"
                      getter={footerLink.label}
                      setter={modifyFooterLinks(index, 'label')}
                      type="text"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <InputField
                      label="URL"
                      customClass="rounded-rair text-center p-1 w-100"
                      getter={footerLink.url}
                      setter={modifyFooterLinks(index, 'url')}
                      type="text"
                    />
                  </div>
                  <button
                    className="btn mt-4 col-12 col-md-1 btn-danger"
                    onClick={() => {
                      deleteFooterLinks(index);
                    }}>
                    Delete
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
            onClick={() => {
              setServerSetting({ footerLinks: footerLinks });
            }}>
            Set Footer Links
          </button>
          <button
            className="btn btn-success float-end"
            onClick={() => {
              const aux = footerLinks ? [...footerLinks] : [];
              aux.push({
                label: '',
                url: ''
              });
              setFooterLinks(aux);
            }}>
            Add
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Legal info</h3>
          <InputField
            customClass="rounded-rair form-control"
            getter={legal}
            setter={setLegal}
            placeholder="Legal information"
          />
          <button
            className="btn rair-button"
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            onClick={() => setServerSetting({ legal: legal })}>
            Set
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Server values</h3>
          {customValues &&
            customValues.map((customValue, index) => {
              return (
                <div key={index} className="row">
                  <div className="col-12 col-md-5">
                    <InputField
                      label="Name"
                      customClass="rounded-rair text-center p-1 w-100"
                      getter={customValue.name}
                      setter={modifyCustomValues(index, 'name')}
                      type="text"
                    />
                  </div>
                  <div className="col-12 col-md-6">
                    <InputField
                      label="Value"
                      customClass="rounded-rair text-center p-1 w-100"
                      getter={customValue.value}
                      setter={modifyCustomValues(index, 'value')}
                      type="text"
                    />
                  </div>
                  <button
                    className="btn mt-4 col-12 col-md-1 btn-danger"
                    onClick={() => {
                      deleteCustomValues(index);
                    }}>
                    Delete
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
            onClick={() => {
              setServerSetting({ customValues: customValues });
            }}>
            Set Custom Values
          </button>
          <button
            className="btn btn-success float-end"
            onClick={() => {
              const aux = customValues ? [...customValues] : [];
              aux.push({
                name: '',
                value: ''
              });
              setCustomValues(aux);
            }}>
            Add
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Default Signup Message</h3>
          <InputField
            customClass="rounded-rair form-control"
            getter={signupMessage}
            setter={setSignupMessage}
            placeholder="Message sent through notifications"
          />
          <button
            className="btn rair-button"
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            onClick={() => setServerSetting({ signupMessage: signupMessage })}>
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;
