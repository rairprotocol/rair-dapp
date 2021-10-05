const ethers = require('ethers');
const _ = require('lodash');
const log = require('../utils/logger')(module);
const { abi: Token } = require('../integrations/ethers/contracts/RAIR_ERC721.json');

const lockLifetime = 1000 * 60 * 5; // 5 minutes - This could become very expensive and time consuming
const NAME = 'sync products';

const BigNumber = value => parseInt(value.toString());
const BigNumberFromFunc = async func => Number((await func()).toString());

module.exports = (context) => {
  context.agenda.define('sync products', { lockLifetime }, async (task, done) => {
    try {
      const { providerData, network } = task.attrs.data;
      const productsForSave = [];
      // const locksForSave = [];
      const provider = new ethers.providers.JsonRpcProvider(providerData.url, providerData.network);
      const arrayOfContracts = await context.db.Contract.find({ blockchain: network }).distinct('contractAddress');

      await Promise.all(_.map(arrayOfContracts, async contract => {
        const erc721Instance = new ethers.Contract(contract, Token, provider);
        const numberOfProducts = await BigNumberFromFunc(erc721Instance.getProductCount);

        await Promise.all(_.chain(numberOfProducts)
          .range()
          .map(async productIndex => {
            const {
              startingToken,
              endingToken,
              mintableTokensLeft,
              productName,
              locks
            } = await erc721Instance.getProduct(productIndex);

            const start = BigNumber(startingToken);
            const end = BigNumber(endingToken);
            const left = BigNumber(mintableTokensLeft);
            const copies = (end - start) + 1;

            productsForSave.push({
              name: productName,
              collectionIndexInContract: productIndex,
              contract: erc721Instance.address,
              copies,
              soldCopies: copies - left,
              firstTokenIndex: start
            });

            // TODO: ranges have to be unique inside of collection
            // await Promise.all(_.map(locks, async l => {
            //   const lockIndex = BigNumber(l);
            //   const lockInfo = await erc721Instance.getLockedRange(lockIndex);
            //
            //   const lockStart = BigNumber(lockInfo.startingToken) + start;
            //   const lockEnd = BigNumber(lockInfo.endingToken) + start;
            //   const count = BigNumber(lockInfo.countToUnlock);
            //
            //   if (BigNumber(lockInfo.productIndex) === productIndex) {
            //     locksForSave.push({
            //       contract: erc721Instance.address,
            //       isLocked: count !== 0,
            //       lockedTokens: count,
            //       product: productIndex,
            //       range: [lockStart, lockEnd]
            //     });
            //   }
            // }));
          })
          .value());
      }));

      if (!_.isEmpty(productsForSave)) {
        try {
          await context.db.Product.insertMany(productsForSave, { ordered: false });
        } catch (e) {
        }
      }

      // if (!_.isEmpty(locksForSave)) {
      //   try {
      //     await context.db.LockedTokens.insertMany(locksForSave, { ordered: false });
      //   } catch (e) {
      //   }
      // }

      return done();
    } catch (e) {
      log.error(e);
      return done(e);
    }
  });
};
