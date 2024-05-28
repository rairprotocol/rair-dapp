const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const log = require('./logger')(module);

const { superAdmin: superAdminConfig } = require('../config');

class VaultTokenValidation {
  constructor() {
    this.vaultData = [];
  }

  async refreshVaultData() {
    if (superAdminConfig.storageKey) {
      const vaultToken = vaultAppRoleTokenManager.getToken();
      const vaultResponse = await vaultKeyManager.read({
        secretName: superAdminConfig.storageKey,
        vaultToken,
      });
      if (!vaultResponse) {
        log.error('Error querying Vault!');
        return;
      }
      this.vaultData = Object.keys(vaultResponse).map((item) => vaultResponse[item].toLowerCase());
      log.info(`Loaded vault data with ${this.vaultData.length} tokens`);
    }
  }

  async hasSuperAdminRights(userAddress) {
    let result = this.vaultData.includes(userAddress.toLowerCase());
    if (result === false && this.vaultData.length === 0) {
      await this.refreshVaultData();
      // Try again in case the vault data has updated
      result = this.vaultData.includes(userAddress.toLowerCase());
    }
    if (result) {
      log.info(`${userAddress} logged in as Super Admin!`);
    }
    return result;
  }
}

const superAdminValidatorInstance = new VaultTokenValidation();

module.exports = {
  superAdminInstance: superAdminValidatorInstance,
};
