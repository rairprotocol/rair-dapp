const axios = require('axios');
const {
  getVaultNamespace,
  getVaultUrl
} = require('./vaultUtils');

class VaultKeyManager {

  getKVProviderName() {
    return "key_storage" 
  }

  async write({secretName, data, vaultToken}) {
    try {
      const secretKVDestinationName = this.getKVProviderName()
      const url = getVaultUrl() + "/v1/" + secretKVDestinationName + "/data/" + secretName
      const res = await axios({
        method: "POST",
        url,
        headers: {
          "X-Vault-Request": true,
          "X-Vault-Namespace": getVaultNamespace(),
          "X-Vault-Token": vaultToken
        },
        data: {
          data: {
            ...data
          }
        }
      });
      return res;
    } catch(err) {
      throw err;
    }    
  }

  async read({secretName, vaultToken}) {
    try {
      const secretKVDestinationName = this.getKVProviderName()
      const url = getVaultUrl() + "/v1/" + secretKVDestinationName + "/" + secretName
      const axiosParams = {
        method: "GET",
        url,
        headers: {
          "X-Vault-Request": true,
          "X-Vault-Namespace": getVaultNamespace(),
          "X-Vault-Token": vaultToken
        }
      }
      const res = await axios(axiosParams);
      return res;
    } catch(err) {
      throw err;
    }
  }
}

const vaultKeyManager = new VaultKeyManager();

module.exports = {
  vaultKeyManager
}