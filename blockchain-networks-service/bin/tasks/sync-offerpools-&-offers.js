const ethers = require('ethers');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { abi: MinterAbi } = require('../integrations/ethers/contracts/Minter_Marketplace.json');
const { BigNumberFromFunc, BigNumber } = require('../utils/helpers');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming

module.exports = (context) => {
  context.agenda.define('sync offerPools & offers', { lockLifetime }, async (task, done) => {
    try {
      const { providerData, network } = task.attrs.data;
      const offerPoolsForSave = [];
      const offersForSave = [];
      const provider = new ethers.providers.JsonRpcProvider(providerData.url, providerData.network);
      const minterInstance = await new ethers.Contract(providerData.minterAddress, MinterAbi, provider);
      const products = await context.db.Contract.aggregate([
        { $match: { blockchain: network } },
        { $lookup: { from: 'Product', localField: 'contractAddress', foreignField: 'contract', as: 'products' } },
        { $unwind: '$products' },
        { $replaceRoot: { newRoot: '$products' } }
      ]);

      await Promise.all(_.map(products, async product => {
        try {
          const offerPoolIndex = await BigNumberFromFunc(minterInstance.contractToOfferRange, [product.contract, product.collectionIndexInContract]);
          const { contractAddress, productIndex, availableRanges } = await minterInstance.getOfferInfo(offerPoolIndex);
          const rangeNumber = BigNumber(availableRanges);

          offerPoolsForSave.push({
            marketplaceCatalogIndex: offerPoolIndex,
            contract: contractAddress,
            product: BigNumber(productIndex),
            rangeNumber
          });

          await Promise.all(_.chain(rangeNumber)
            .range()
            .map(async offerIndex => {
              const exist = await context.db.Offer.exists({
                contract: contractAddress.toLowerCase(),
                offerPool: offerPoolIndex,
                offerIndex
              });

              if (!exist) {
                const {
                  contractAddress,
                  collectionIndex,
                  tokenStart,
                  tokenEnd,
                  tokensAllowed,
                  price,
                  name
                } = await minterInstance.getOfferRangeInfo(offerPoolIndex, offerIndex);

                offersForSave.push({
                  offerIndex,
                  contract: contractAddress,
                  product: Number(productIndex.toString()),
                  offerPool: offerPoolIndex,
                  price: BigNumber(price),
                  range: [BigNumber(tokenStart), BigNumber(tokenEnd)],
                  offerName: name,
                  copies: BigNumber(tokensAllowed)
                });
              }
            })
            .value());
        } catch (e) {
          if (e.reason !== 'Minting Marketplace: There are no offers registered for that address') throw e;
        }

        if (!_.isEmpty(offerPoolsForSave)) {
          try {
            await context.db.OfferPool.insertMany(offerPoolsForSave, { ordered: false });
          } catch (e) {
          }
        }

        if (!_.isEmpty(offersForSave)) {
          try {
            await context.db.Offer.insertMany(offersForSave, { ordered: false });
          } catch (e) {
          }
        }
      }));

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
