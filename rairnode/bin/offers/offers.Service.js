// const contractService = require('../contracts/contracts.Service');
// const productctService = require('../products/product.Service');
const { Offer } = require('../models');
const eFactory = require('../utils/entityFactory');

exports.getOfferById = eFactory.getOne(Offer);
exports.getAllOffers = eFactory.getAll(Offer);
