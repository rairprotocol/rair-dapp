import { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { isAddress } from 'ethers/lib/utils';

import { BlockchainSetting, Settings } from './adminView.types';

import { RootState } from '../../ducks';
import {
  setCustomColors,
  setCustomLogosDark,
  setCustomLogosLight
} from '../../ducks/colors/actions';
import { ColorStoreType } from '../../ducks/colors/colorStore.types';
import useSwal from '../../hooks/useSwal';
import chainData from '../../utils/blockchainData';
import { rFetch } from '../../utils/rFetch';
import { OptionsType } from '../common/commonTypes/InputSelectTypes.types';
import InputField from '../common/InputField';
import InputSelect from '../common/InputSelect';

const ServerSettings = ({ fullContractData }) => {
  const [settings, setSettings] = useState<Settings>({});
  const [productOptions, setProductOptions] = useState<OptionsType[]>();
  const [featuredContract, setFeaturedContract] = useState('null');
  const [featuredProduct, setFeaturedProduct] = useState('null');
  const [blockchainSettings, setBlockchainSettings] = useState<
    BlockchainSetting[]
  >([]);
  const [superAdmins, setSuperAdmins] = useState<string[]>([]);
  const [nodeAddress, setNodeAddress] = useState(
    import.meta.env.VITE_NODE_ADDRESS
  );
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#222021');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('#4e4d4d');
  const [customTextColor, setCustomTextColor] = useState('#FFFFFF');
  const [customPrimaryButtonColor, setCustomPrimaryButtonColor] =
    useState('#725bdb');
  const [customSecondaryButtonColor, setCustomSecondaryButtonColor] =
    useState('#e882d5');
  const [customFadeButtonColor, setCustomFadeButtonColor] = useState('#1486c5');

  const [customLightModeLogo, setCustomLightModeLogo] = useState({ name: '' });
  const [customDarkModeLogo, setCustomDarkModeLogo] = useState({ name: '' });
  const [customLightModeMobileLogo, setCustomLightModeMobileLogo] = useState({
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
  const dispatch = useDispatch();

  const getServerSettings = useCallback(async () => {
    const { success, settings, blockchainSettings } =
      await rFetch('/api/settings');
    if (success) {
      setSettings(settings);
      if (settings.featuredCollection) {
        setNodeAddress(
          settings?.nodeAddress || import.meta.env.VITE_NODE_ADDRESS
        );
        setFeaturedContract(settings?.featuredCollection?.contract?._id);
        setFeaturedProduct(settings?.featuredCollection?._id);
      }
      if (settings.darkModeMobileLogo && settings.lightModeMobileLogo) {
        dispatch(
          setCustomLogosDark({
            mobile: settings.darkModeMobileLogo,
            desktop: settings.darkModeBannerLogo
          })
        );
        dispatch(
          setCustomLogosLight({
            mobile: settings.lightModeMobileLogo,
            desktop: settings.lightModeBannerLogo
          })
        );
      }
      dispatch(
        setCustomColors({
          primary: settings.darkModePrimary,
          secondary: settings.darkModeSecondary,
          text: settings.darkModeText,
          primaryButton: settings.buttonPrimaryColor,
          fadeButton: settings.buttonFadeColor,
          secondaryButton: settings.buttonSecondaryColor
        })
      );
      if (settings.darkModePrimary) {
        setCustomPrimaryColor(settings.darkModePrimary);
      }
      if (settings.darkModeSecondary) {
        setCustomSecondaryColor(settings.darkModeSecondary);
      }
      if (settings.darkModeText) {
        setCustomTextColor(settings.darkModeText);
      }
      if (settings.buttonPrimaryColor) {
        setCustomPrimaryButtonColor(settings.buttonPrimaryColor);
      }
      if (settings.buttonFadeColor) {
        setCustomSecondaryButtonColor(settings.buttonSecondaryColor);
      }
      if (settings.buttonSecondaryColor) {
        setCustomFadeButtonColor(settings.buttonFadeColor);
      }
      setSuperAdmins(settings?.superAdmins);
      setBlockchainSettings(blockchainSettings || []);
    }
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
        reactSwal.fire('Success', 'Setting updated', 'success');
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
    []
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
              setServerSetting({ featuredCollection: featuredProduct });
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
                  <i className="fa fa-arrow-up" />
                </button>
                <button
                  onClick={() => {
                    setAppLogos(item.target, undefined);
                    getServerSettings();
                  }}
                  className="col-12 col-md-1 btn btn-danger">
                  <i className="fa fa-trash" />
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ServerSettings;
