import { Provider } from 'ethers';

const validateInteger = (number: string | number) => {
  if (
    number === undefined ||
    number.toString() === '' ||
    Number.isNaN(number)
  ) {
    return false;
  }
  try {
    BigInt(number);
  } catch (err) {
    return false;
  }
  return true;
};

const metamaskEventListeners = (provider: Provider) => {
  provider.on(
    'debug',
    ({
      // action,
      request,
      response
      // provider
    }) => {
      if (import.meta.env.VITE_LOG_WEB3 === 'true') {
        console.info(
          response ? 'Receiving response to' : 'Sending request',
          request.method
        );
      }
    }
  );
  provider.on('network', (newNetwork, oldNetwork) => {
    // When a Provider makes its initial connection, it emits a "network"
    // event with a null oldNetwork along with the newNetwork. So, if the
    // oldNetwork exists, it represents a changing network
    /*
        Example of a network object:
        {
            "name": "goerli",
            "chainId": 5,
            "ensAddress": "0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e"
        }
      */
    if (oldNetwork) {
      console.info(
        `Detected a network change, from ${oldNetwork.name} to ${newNetwork.name}`
      );
    } else {
      console.info(`Connected to ${newNetwork.name}`);
    }
  });
};

export { metamaskEventListeners, validateInteger };
