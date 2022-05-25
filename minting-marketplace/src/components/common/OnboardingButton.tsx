import MetaMaskOnboarding from "@metamask/onboarding";
// import Swal from "sweetalert2";
import React, { useState, useEffect, useRef, useCallback } from "react";

const ONBOARD_TEXT = "Click here to install MetaMask!";
const CONNECT_TEXT = "Connect Wallet";
const CONNECTED_TEXT = "Connected";

export function OnboardingButton() {
  const [buttonText, setButtonText] = useState<string>(ONBOARD_TEXT);
  const [isDisabled, setDisabled] = useState<boolean>(false);
  const [accounts, setAccounts] = useState<Array<string>>([]);
  const [showButtonPhone, setShowButtonPhone] = useState<boolean>();
  const onboarding = useRef<MetaMaskOnboarding>();

  const dappUrl = window.location.host;
  const metamaskAppDeepLink = "https://metamask.app.link/dapp/" + dappUrl;

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
    if (!onboarding.current) {
      onboarding.current = new MetaMaskOnboarding();
    }
  }, []);

  useEffect(() => {
    if (MetaMaskOnboarding.isMetaMaskInstalled()) {
      if (accounts.length > 0) {
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
        .request({ method: "eth_requestAccounts" })
        .then((newAccounts: Array<string>) => setAccounts(newAccounts));
    } else {
      onboarding?.current?.startOnboarding();
    }
  };
  return showButtonPhone ? (
    <a href={metamaskAppDeepLink}>
      <button className="metamask-on-boarding">
        Connect your phone to MetaMask
      </button>
    </a>
  ) : (
    <button
      className="metamask-on-boarding"
      disabled={isDisabled}
      onClick={onClick}
    >
      {buttonText}
    </button>
  );
}
