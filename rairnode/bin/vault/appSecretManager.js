const axios = require('axios');
const {
  getVaultNamespace,
  getVaultUrl,
  getVaultAppSecretKVLocation
} = require('./vaultUtils');

const {
  executePromisesSequentially
} = require('../utils/helpers');

const getSecret = async ({appName, secretName, vaultToken}) => {
  // Define params
  const axiosParams = {
    method: "GET",
    url: `${getVaultUrl()}/v1/${getVaultAppSecretKVLocation()}/data/${appName}/${secretName}`,
    headers: {
      "X-Vault-Request": true,
      "X-Vault-Namespace": getVaultNamespace(),
      "X-Vault-Token": vaultToken
    }
  }

  // Make call to vault
  const res = await axios(axiosParams);

  // basic / non-success error handling
  if(res.status !== 200) {
    throw new Error('Vault received non 200 code while trying to retrieve secret!')
  }

  // Data comes back in this format
  // Leaving this here for a future typescript refactor

  // data: any
  // metadata: {
    // created_time: string,
    // custom_metadata: any,
    // deletion_time: string,
    // destroyed: boolean,
    // version: number
  // }
  return res.data.data;
}

class AppSecretManager {
  constructor() {
    // initialize with a null map
    this.secretMap = new Map();
  }

  getSecretFromMemory(secretKey) {
    return this.secretMap.get(secretKey);
  }

  async getAppSecrets({vaultToken, appName, listOfSecretsToFetch}) {
    try {
      await executePromisesSequentially({
        items: listOfSecretsToFetch,
        action: async (secretName) => {
          const secretData = await getSecret({
            appName,
            secretName,
            vaultToken
          });
          // Save secret into map on class
          this.secretMap.set(secretName, secretData);
        }
      })

      // return after all secrets have been retreived sequentially
      return this.secretMap;
    } catch (err) {
      console.log('Error retrieving secrets');
    }
  }
}

// instantiate a singleton instance of this class to use across the app
const appSecretManager = new AppSecretManager();

module.exports = {
  appSecretManager
}