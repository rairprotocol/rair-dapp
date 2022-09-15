const { LockedTokens } = require('../models');
const eFactory = require('../utils/entityFactory');

exports.getLocks = eFactory.getAll(LockedTokens, { filter: { contract: 'query.contractId', product: 'query.product' } });
