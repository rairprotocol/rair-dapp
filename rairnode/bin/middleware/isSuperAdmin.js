const _ = require('lodash');
const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const log = require('../utils/logger')(module);

const { superAdmin: superAdminConfig } = require('../config');

module.exports = async (req, res, next) => {
  try {
    const { publicAddress } = req.user;
    let superAdmin = false;

    if (superAdminConfig.storageKye) {
      const vaultToken = vaultAppRoleTokenManager.getToken();
      const vaultRes = await vaultKeyManager.read({
        secretName: superAdminConfig.storageKye,
        vaultToken,
      });

      if (vaultRes) {
        superAdmin = _.chain(vaultRes)
          .map((v) => v.toLowerCase())
          .includes(publicAddress)
          .value();
      }
    }

    req.user = { ...req.user, superAdmin };

    return next();
  } catch (err) {
    log.error(err);

    return next();
  }
};
