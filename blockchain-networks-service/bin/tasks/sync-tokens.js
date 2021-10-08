const ethers = require('ethers');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { abi: Token } = require('../integrations/ethers/contracts/RAIR_ERC721.json');
const { BigNumberFromFunc, BigNumber } = require('../utils/helpers');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming

module.exports = (context) => {
  context.agenda.define('sync tokens', { lockLifetime }, async (task, done) => {
    try {
      const { providerData, network } = task.attrs.data;
      const tokensForSave = [];
      const offersForUpdate = [];
      const arrayOfContracts = await context.db.Contract.find({ blockchain: network }).distinct('contractAddress');
      const provider = new ethers.providers.JsonRpcProvider(providerData.url, providerData.network);

      await Promise.all(_.map(arrayOfContracts, async contractAddress => {
        const tokenInstance = new ethers.Contract(contractAddress, Token, provider);
        const numberOfMintedTokens = await BigNumberFromFunc(tokenInstance.totalSupply);

        await Promise.all(_.chain(numberOfMintedTokens)
          .range()
          .map(async tokenIndex => {
            let tokenId = await BigNumberFromFunc(tokenInstance.tokenByIndex, [tokenIndex]);
            const owner = await tokenInstance.ownerOf(tokenId);
            const productIndex = await BigNumberFromFunc(tokenInstance.tokenToProduct, [tokenId]);
            const foundProduct = await context.db.Product.findOne({
              contract: contractAddress,
              collectionIndexInContract: productIndex
            });

            const foundOffers = await context.db.Offer.find({
              contract: contractAddress,
              product: productIndex
            });

            const token = tokenId - foundProduct.firstTokenIndex;
            if (!_.isEmpty(foundProduct) && !_.isEmpty(foundOffers)) {
              const offer = _.find(foundOffers, offer => _.inRange(token, offer.range[0], (offer.range[1] + 1)));
              const index = _.findIndex(offersForUpdate, o => o.contract === offer.contract && o.offerPool === offer.offerPool && o.offerIndex === offer.offerIndex);

              if (index < 0) {
                offer.soldCopies = 1;
                offersForUpdate.push(_.pick(offer, ['contract', 'offerPool', 'offerIndex', 'soldCopies']));
              } else {
                ++offersForUpdate[index].soldCopies;
              }

              tokensForSave.push({
                updateOne: {
                  filter: { contract: contractAddress, offerPool: offer.offerPool, token },
                  update: {
                    ownerAddress: owner,
                    offer: offer.offerIndex,
                    uniqueIndexInContract: tokenId,
                    isMinted: true
                  },
                  upsert: true,
                  setDefaultsOnInsert: true
                }
              });
            }
          })
          .value());

        if (!_.isEmpty(tokensForSave)) {
          try {
            await context.db.MintedToken.bulkWrite(tokensForSave, { ordered: false });
          } catch (e) {}
        }

        if (!_.isEmpty(offersForUpdate)) {
          try {
            const resultOffers = _.map(offersForUpdate, offer => ({
              updateOne: {
                filter: { contract: offer.contract, offerPool: offer.offerPool, offerIndex: offer.offerIndex },
                update: {
                  soldCopies: offer.soldCopies
                }
              }
            }));

            await context.db.Offer.bulkWrite(resultOffers, { ordered: false });
          } catch (e) {
            console.log(e);
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
