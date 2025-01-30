// import Swal from "sweetalert2";
import { useCallback, useEffect, useRef, useState } from 'react';
import MetaMaskOnboarding from '@metamask/onboarding';
import { Maybe } from '@metamask/providers/dist/utils';

import { coinbaseIcon } from '../../../images';

import './OnboardingCoinbaseButton.css';
import { useAppSelector } from '../../../hooks/useReduxHooks';

const ONBOARD_TEXT = 'Click here to install MetaMask!';
const CONNECT_TEXT = 'Connect Wallet';
const CONNECTED_TEXT = 'Connected';

export function OnboardingCoinbaseButton() {
  const [buttonText, setButtonText] = useState<string>(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Maybe<unknown>>([]);
  const [showButtonPhone, setShowButtonPhone] = useState<boolean>();
  const onboarding = useRef<MetaMaskOnboarding>();

  const dappUrl = window.location.host;
  const CoinbaseAppDeepLink = 'https://www.coinbase.com/wallet/downloads';
  const hotDropsVar = import.meta.env.VITE_TESTNET;

  const isMobileDevice = useCallback(() => {
    if (
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|BB|PlayBook|IEMobile|Windows Phone|Kindle|Silk|Opera Mini/i.test(
        navigator.userAgent
      )
    ) {
      setShowButtonPhone(true);
    } else {
      setShowButtonPhone(false);
    }
  }, []);

  useEffect(() => {
    isMobileDevice();
  }, [isMobileDevice]);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (Array.isArray(accounts) && accounts.length > 0) {
        setButtonText(CONNECTED_TEXT);
        setDisabled(true);
        onboarding?.current?.stopOnboarding();
      } else {
        setButtonText(CONNECT_TEXT);
        setDisabled(false);
      }
    }
  }, [accounts]);

  // React.useEffect(() => {
  //   function handleNewAccounts(newAccounts) {
  //     setAccounts(newAccounts);
  //   }
  //   if (MetaMaskOnboarding.isMetaMaskInstalled()) {
  //     window.ethereum
  //       .request({ method: 'eth_requestAccounts' })
  //       .then(handleNewAccounts);
  //     window.ethereum.on('accountsChanged', handleNewAccounts);
  //     return () => {
  //       window.ethereum.off('accountsChanged', handleNewAccounts);
  //     };
  //   }
  // }, []);

  const onClick = () => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      window.ethereum
        ?.request({ method: 'eth_requestAccounts' })
        .then((newAccounts) => setAccounts(newAccounts));
    } else {
      if (!onboarding.current) {
        onboarding.current = new MetaMaskOnboarding();
      }
      onboarding?.current?.startOnboarding();
    }
  };
  return (
    <a target={'_blank'} href={CoinbaseAppDeepLink} rel="noreferrer">
      <button
        className={`metamask-on-boarding ${
          hotDropsVar === 'true' ? 'hotdrops-bg' : ''
        }`}>
        Connect to Coinbase 
        {hotDropsVar !== 'true' && <img width={showButtonPhone ? 48 : 24} src={coinbaseIcon}></img>}
      </button>
    </a>
  )
}
