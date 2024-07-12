//@ts-nocheck
import { useCallback, useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

import { BlockchainSetting, Settings } from './adminView.types';

import {
  setCustomColors,
  setCustomLogosDark,
  setCustomLogosLight
} from '../../ducks/colors/actions';
import { HotdropsFavicon, RairFavicon } from '../../images';
import { rFetch } from '../../utils/rFetch';
import { FooterLinkType } from '../common/commonTypes/InputSelectTypes.types';

const useServerSettings = () => {
  const dispatch = useDispatch();
  const [settings, setSettings] = useState<Settings>({});
  const [nodeAddress, setNodeAddress] = useState(
    import.meta.env.VITE_NODE_ADDRESS
  );
  const [legal, setLegal] = useState('');
  const [signupMessage, setSignupMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [featuredContract, setFeaturedContract] = useState('null');
  const [featuredProduct, setFeaturedProduct] = useState('null');
  const [customPrimaryColor, setCustomPrimaryColor] = useState('#222021');
  const [customSecondaryColor, setCustomSecondaryColor] = useState('#4e4d4d');
  const [customTextColor, setCustomTextColor] = useState('#FFFFFF');
  const [customPrimaryButtonColor, setCustomPrimaryButtonColor] =
    useState('#725bdb');
  const [customSecondaryButtonColor, setCustomSecondaryButtonColor] =
    useState('#e882d5');
  const [customFadeButtonColor, setCustomFadeButtonColor] = useState('#1486c5');
  const [superAdmins, setSuperAdmins] = useState<string[]>([]);
  const [footerLinks, setFooterLinks] = useState<FooterLinkType[]>([]);
  const [blockchainSettings, setBlockchainSettings] = useState<
    BlockchainSetting[]
  >([]);

  const getServerSettings = useCallback(async () => {
    setIsLoading(true);
    const { success, settings, blockchainSettings } =
      await rFetch('/api/settings');
    if (success && settings) {
      setSettings(settings);
      setNodeAddress(
        settings?.nodeAddress || import.meta.env.VITE_NODE_ADDRESS
      );
      setLegal(settings?.legal || '');
      setSignupMessage(settings?.signupMessage || '');
      if (settings.featuredCollection) {
        setFeaturedContract(settings?.featuredCollection?.contract?._id);
        setFeaturedProduct(settings?.featuredCollection?._id);
      }

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
      setIsLoading(false);
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
      setFooterLinks(settings.footerLinks);
    }
    setIsLoading(false);
  }, [dispatch, ]);

  useEffect(() => {
    getServerSettings();
  }, [getServerSettings]);

  useEffect(() => {
    if (settings.favicon) {
      const changeFavicon = () => {
        const link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href = settings.favicon; // Set the href to your favicon
        document.getElementsByTagName('head')[0].appendChild(link);
      };

      changeFavicon(); // Call the function to change the favicon when the component mounts
    } else {
      const changeFavicon = () => {
        const link =
          document.querySelector("link[rel*='icon']") ||
          document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'icon';
        link.href =
          import.meta.env.VITE_TESTNET === 'true'
            ? HotdropsFavicon
            : RairFavicon; // Set the href to your favicon
        document.getElementsByTagName('head')[0].appendChild(link);
      };

      changeFavicon(); // Call the function to change the favicon when the component mounts
    }

    // Optionally, you can remove the old favicon when the component unmounts
    return () => {
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.parentNode.removeChild(link);
      }
    };
  }, [settings]);

  return {
    getServerSettings,
    settings,
    nodeAddress,
    setNodeAddress,
    featuredContract,
    setFeaturedContract,
    featuredProduct,
    setFeaturedProduct,
    customPrimaryColor,
    setCustomPrimaryColor,
    customSecondaryColor,
    setCustomSecondaryColor,
    customTextColor,
    setCustomTextColor,
    customPrimaryButtonColor,
    setCustomPrimaryButtonColor,
    customSecondaryButtonColor,
    setCustomSecondaryButtonColor,
    customFadeButtonColor,
    setCustomFadeButtonColor,
    superAdmins,
    setSuperAdmins,
    footerLinks,
    setFooterLinks,
    legal,
    setLegal,
    signupMessage,
    setSignupMessage,
    blockchainSettings,
    isLoading
  };
};


export default useServerSettings;
