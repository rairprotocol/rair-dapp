import { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { isAddress } from 'ethers/lib/utils';

import useServerSettings from './useServerSettings';

import { RootState } from '../../ducks';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useSwal from '../../hooks/useSwal';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowUp, faTrash } from '@fortawesome/free-solid-svg-icons';

type Category = {
  name: string;
  _id?: string;
  files?: number;
};

const ServerSettings = ({ fullContractData }) => {
  const serverSettings = useServerSettings();
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

  const modifySuperAdminAddress = (index) => (value) => {
    const aux = [...serverSettings.superAdmins];
    aux[index] = value;
    serverSettings.setSuperAdmins(aux);
  };

  const deleteSuperAdminAddress = (index) => {
    const aux = [...serverSettings.superAdmins];
    aux.splice(index, 1);
    serverSettings.setSuperAdmins(aux);
  };

  const modifyFooterLinks = (index, field) => (value) => {
    const aux = [...serverSettings.footerLinks];
    aux[index][field] = value;
    serverSettings.setFooterLinks(aux);
  };

  const deleteFooterLinks = (index) => {
    const aux = [...serverSettings.footerLinks];
    aux.splice(index, 1);
    serverSettings.setFooterLinks(aux);
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
        serverSettings.getServerSettings();
        reactSwal.fire('Success', 'Setting updated', 'success');
      }
    },
    [reactSwal, serverSettings.getServerSettings, serverSettings.customPrimaryColor, serverSettings.customTextColor, serverSettings.customPrimaryButtonColor, serverSettings.customSecondaryButtonColor]
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
        serverSettings.getServerSettings();
      }
    },
    [reactSwal, serverSettings.getServerSettings]
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
        serverSettings.getServerSettings();
      }
    },
    [reactSwal, serverSettings.getServerSettings]
  );

  useEffect(() => {
    serverSettings.getServerSettings();
  }, [serverSettings.getServerSettings]);

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
    serverSettings.setFeaturedProduct('null');
    if (serverSettings.featuredContract === 'null') {
      return;
    }
    if (!fullContractData[serverSettings.featuredContract]?.products) {
      return;
    }
    const options = Object.keys(
      fullContractData[serverSettings.featuredContract].products
    ).map((productIndex) => {
      const data =
        fullContractData[serverSettings.featuredContract].products[
          productIndex
        ];
      return { label: `${data.name} (${data.copies} NFTs)`, value: data._id };
    });

    setProductOptions(options);
  }, [serverSettings.featuredContract, fullContractData]);

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
              disabled={!!serverSettings.settings?.[item.value]}
              className="btn rair-button"
              style={{
                background: secondaryButtonColor,
                color: textColor
              }}
              onClick={() => setServerSetting({ [item.value]: 'true' })}>
              Yes
            </button>
            <button
              disabled={!serverSettings.settings?.[item.value]}
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
              getter={serverSettings.featuredContract}
              setter={serverSettings.setFeaturedContract}
              options={Object.keys(fullContractData).map((contract) => {
                return {
                  label: `${fullContractData[contract].title} (${chainData[
                    fullContractData[contract].blockchain
                  ]?.symbol})`,
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
              getter={serverSettings.featuredProduct}
              setter={serverSettings.setFeaturedProduct}
              options={productOptions}
            />
          </div>
        </div>
        <button
          disabled={
            serverSettings.featuredProduct === 'null' ||
            serverSettings.featuredContract === 'null'
          }
          className="btn rair-button"
          style={{
            background: primaryButtonColor,
            color: textColor
          }}
          onClick={() => {
            if (
              serverSettings.featuredProduct !== 'null' &&
              serverSettings.featuredContract !== 'null'
            ) {
              setServerSetting({
                featuredCollection: serverSettings.featuredProduct
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
          getter={serverSettings.nodeAddress}
          setter={serverSettings.setNodeAddress}
          placeholder="Node address"
        />
        <button
          className="btn rair-button"
          style={{
            background: secondaryButtonColor,
            color: textColor
          }}
          onClick={() =>
            setServerSetting({ nodeAddress: serverSettings.nodeAddress })
          }>
          Set
        </button>
      </div>
      <div className="col-12 px-5 col-md-6 my-2">
        <h3>Blockchain settings:</h3>
        {serverSettings.blockchainSettings?.map((chain, index) => {
          return (
            <details className="row" key={index}>
              <summary className="h5">{chain.name}</summary>
              <div className="col-12">
                <span className="me-4">Sync contracts:</span>
                <button
                  disabled={!!chain?.sync}
                  className="btn rair-button"
                  style={{
                    background: secondaryButtonColor,
                    color: textColor
                  }}
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'sync', 'true')
                  }>
                  Yes
                </button>
                <button
                  disabled={!chain?.sync}
                  className="btn rair-button"
                  style={{
                    background: primaryButtonColor,
                    color: textColor
                  }}
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
                  className="btn rair-button"
                  style={{
                    background: secondaryButtonColor,
                    color: textColor
                  }}
                  onClick={() =>
                    setBlockchainSetting(chain.hash, 'display', 'true')
                  }>
                  Yes
                </button>
                <button
                  disabled={!chain?.display}
                  className="btn rair-button"
                  style={{
                    background: primaryButtonColor,
                    color: textColor
                  }}
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
      <div className="col-12 text-end col-md-6 px-5 my-2">
        <h3>Super admins:</h3>
        {serverSettings.settings.superAdminsOnVault
          ? 'Currently using Vault'
          : ''}
        {serverSettings.superAdmins &&
          serverSettings.superAdmins.map((user, index) => {
            return (
              <div key={index} className="row">
                <InputField
                  disabled={!!serverSettings.settings.superAdminsOnVault}
                  customClass="rounded-rair text-center col-12 col-md-10"
                  getter={user}
                  setter={modifySuperAdminAddress(index)}
                  type="text"
                />
                <button
                  className="btn col-12 col-md-2 btn-danger"
                  disabled={!!serverSettings.settings.superAdminsOnVault}
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
          disabled={!!serverSettings.settings.superAdminsOnVault}
          onClick={() => {
            const result = serverSettings?.superAdmins.reduce(
              (result, user) => {
                return result && isAddress(user);
              },
              true
            );
            if (result) {
              setServerSetting({
                superAdmins: serverSettings.superAdmins.map((userAddress) =>
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
          disabled={!!serverSettings.settings.superAdminsOnVault}
          onClick={() => {
            modifySuperAdminAddress(serverSettings.superAdmins.length)('');
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
              getter: serverSettings.customPrimaryColor,
              setter: serverSettings.setCustomPrimaryColor,
              label: 'Primary Color'
            },
            {
              getter: serverSettings.customSecondaryColor,
              setter: serverSettings.setCustomSecondaryColor,
              label: 'Secondary Color'
            },
            {
              getter: serverSettings.customTextColor,
              setter: serverSettings.setCustomTextColor,
              label: 'Text Color'
            },
            {
              getter: serverSettings.customPrimaryButtonColor,
              setter: serverSettings.setCustomPrimaryButtonColor,
              label: 'Primary Button Color'
            },
            {
              getter: serverSettings.customSecondaryButtonColor,
              setter: serverSettings.setCustomSecondaryButtonColor,
              label: 'Secondary Button Color'
            },
            {
              getter: serverSettings.customFadeButtonColor,
              setter: serverSettings.setCustomFadeButtonColor,
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
                  darkModePrimary: serverSettings.customPrimaryColor,
                  darkModeSecondary: serverSettings.customSecondaryColor,
                  darkModeText: serverSettings.customTextColor,
                  buttonPrimaryColor: serverSettings.customPrimaryButtonColor,
                  buttonFadeColor: serverSettings.customFadeButtonColor,
                  buttonSecondaryColor:
                    serverSettings.customSecondaryButtonColor
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
                    serverSettings.getServerSettings();
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
                    serverSettings.getServerSettings();
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
          {serverSettings.footerLinks &&
            serverSettings.footerLinks.map((footerLink, index) => {
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
              setServerSetting({ footerLinks: serverSettings.footerLinks });
            }}>
            Set Footer Links
          </button>
          <button
            className="btn btn-success float-end"
            disabled={!!serverSettings.settings.superAdminsOnVault}
            onClick={() => {
              const aux = serverSettings?.footerLinks
                ? [...serverSettings.footerLinks]
                : [];
              aux.push({
                label: '',
                url: ''
              });
              serverSettings.setFooterLinks(aux);
            }}>
            Add
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Legal info</h3>
          <InputField
            customClass="rounded-rair form-control"
            getter={serverSettings.legal}
            setter={serverSettings.setLegal}
            placeholder="Legal information"
          />
          <button
            className="btn rair-button"
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            onClick={() => setServerSetting({ legal: serverSettings.legal })}>
            Set
          </button>
        </div>
        <div className="col-12 px-5 my-2">
          <h3>Default Signup Message</h3>
          <InputField
            customClass="rounded-rair form-control"
            getter={serverSettings.signupMessage}
            setter={serverSettings.setSignupMessage}
            placeholder="Message sent through notifications"
          />
          <button
            className="btn rair-button"
            style={{
              background: secondaryButtonColor,
              color: textColor
            }}
            onClick={() =>
              setServerSetting({ signupMessage: serverSettings.signupMessage })
            }>
            Set
          </button>
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;
