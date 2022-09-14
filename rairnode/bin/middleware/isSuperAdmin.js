const _ = require('lodash');
const { vaultAppRoleTokenManager, vaultKeyManager } = require('../vault');
const log = require('../utils/logger')(module);

const { superAdmin: superAdminConfig } = require('../config');

module.exports = async (req, res, next) => {
  try {
    let superAdmin = false;
    let address = null;

    if (!_.isUndefined(req.user)) {
      address = req.user.publicAddress;
    }

    if (!_.isUndefined(req.metaAuth)) {
      address = req.metaAuth.recovered;
    }

    if (address && superAdminConfig.storageKey) {
      const vaultToken = vaultAppRoleTokenManager.getToken();
      const vaultRes = await vaultKeyManager.read({
        secretName: superAdminConfig.storageKey,
        vaultToken,
      });

      if (vaultRes) {
        superAdmin = _.chain(vaultRes)
          .map((v) => v.toLowerCase())
          .includes(address)
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
