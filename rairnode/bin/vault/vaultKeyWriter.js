const axios = require('axios');
const {
  getVaultNamespace,
  getVaultUrl
} = require('./vaultUtils');

class VaultKeyWriter {
  async write({secretName, data, vaultToken}) {
    try {
      const secretKVDestinationName = "key_storage"
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
}

const vaultKeyWriter = new VaultKeyWriter();

module.exports = {
  vaultKeyWriter
}