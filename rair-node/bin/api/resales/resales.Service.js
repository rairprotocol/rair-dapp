const { getBytes, isAddress } = require('ethers');
const { ResaleTokenOffer, Contract, MintedToken, ServerSetting, Blockchain } = require('../../models');
const AppError = require('../../utils/errors/AppError');
const log = require('../../utils/logger')(module);
const { diamondMarketplaceAbi } = require('../../integrations/smartContracts');
const { getInstance, getContractRunner } = require('../../integrations/ethers/contractInstances');

exports.openResales = async (req, res, next) => {
    try {
        const { contract, blockchain, index } = req.query;
        const pipeline = [
            {
                $match: {
                    buyer: { $exists: false },
                },
            },
            {
                $lookup: {
                    from: 'User',
                    as: 'sellerData',
                    localField: 'seller',
                    foreignField: 'publicAddress',
                },
            },
            {
                $unwind: {
                    path: '$sellerData',
                    preserveNullAndEmptyArrays: true,
                },
            },
        ];
        if (index) {
            pipeline.push({
                $match: {
                    tokenIndex: index,
                },
            });
        }
        pipeline.push({
            $lookup: {
                from: 'Contract',
                as: 'contractData',
                localField: 'tokenContract',
                foreignField: '_id',
            },
        }, {
            $unwind: {
                path: '$contractData',
                preserveNullAndEmptyArrays: true,
            },
        });
        if (blockchain) {
            const contractQuery = {
                'contractData.blockchain': blockchain,
            };
            if (contract) {
                contractQuery['contractData.contractAddress'] = contract;
            }
            pipeline.push({
                $match: contractQuery,
            });
        }
        const offers = await ResaleTokenOffer.aggregate(pipeline);
        return res.json({ success: true, data: offers });
    } catch (e) {
        return next(new AppError(e));
    }
};

exports.createResaleOffer = async (req, res, next) => {
    try {
        const { contract, blockchain, index, price } = req.body;
        const { userData } = req.session;

        const foundContract = await Contract.findOne({
            blockchain,
            contractAddress: contract,
        });

        if (!foundContract) {
            return next(new AppError('No contract data found'));
        }

        const foundToken = await MintedToken.findOne({
            contract: foundContract._id,
            uniqueIndexInContract: index,
        });
        if (!foundToken) {
            log.error(`No db entry found for token ${blockchain}/${contract}:${index}`);
        } else if (foundToken.ownerAddress !== userData.publicAddress) {
            return next(new AppError('User is not owner of token'));
        }

        const existingOffer = await ResaleTokenOffer.findOne({
            tokenContract: foundContract._id,
            tokenIndex: index,
            seller: userData.publicAddress,
            buyer: undefined,
        });
        if (existingOffer) {
            return next(new AppError("There's a resale offer already open"));
        }

        const newOffer = new ResaleTokenOffer({
            tokenContract: foundContract._id,
            tokenIndex: index,
            price,
            seller: userData.publicAddress,
        });
        newOffer.save();

        return res.json({ success: true, offer: newOffer });
    } catch (e) {
        return next(new AppError(e));
    }
};

exports.updateResaleOffer = async (req, res, next) => {
    try {
        const { id, price } = req.body;
        const { userData } = req.session;
        await ResaleTokenOffer.findOneAndUpdate({
            _id: id,
            seller: userData.publicAddress,
            buyer: undefined,
        }, { $set: { price } });
        return res.json({
            success: true,
        });
    } catch (e) {
        return next(new AppError(e));
    }
};

exports.deleteResaleOffer = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userData } = req.session;
        await ResaleTokenOffer.findOneAndDelete({
            _id: id,
            seller: userData.publicAddress,
            buyer: undefined,
        });
        return res.json({
            success: true,
        });
    } catch (e) {
        return next(new AppError(e));
    }
};

exports.generatePurchaseRequest = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { userData } = req.session;
        const serverSettings = await ServerSetting.findOne({});
        if (!serverSettings || !serverSettings.nodeAddress) {
          return next(new AppError('Cannot process resales at the moment.'));
        }
        const foundOffer = await ResaleTokenOffer.findOne({
            _id: id,
            buyer: undefined, // Makes sure the offer hasn't been purchased
        }).populate('tokenContract');

        const blockchainData = await Blockchain.findOne({
            hash: foundOffer.tokenContract.blockchain,
        });

        if (!foundOffer?.tokenContract?.blockchain) {
          return next(new AppError('No resale offer found'));
        }
        if (!process.env.WITHDRAWER_PRIVATE_KEY) {
          return next(new AppError('Cannot process resales at the moment'));
        }
        const marketAddress = blockchainData.diamondMarketplaceAddress;
        if (!isAddress(marketAddress)) {
            return next(new AppError('Cannot process resales at the moment!'));
        }
        try {
            const wallet = await getContractRunner(
                foundOffer.tokenContract.blockchain,
                foundOffer.tokenContract.blockchain === '0x250',
                true,
            );
            const diamondMarketplaceInstance = await getInstance(
                foundOffer.tokenContract.blockchain,
                marketAddress,
                diamondMarketplaceAbi,
                true,
                true,
            );
            const saleHash = await diamondMarketplaceInstance.generateResaleHash(
                foundOffer.tokenContract.contractAddress,
                userData.publicAddress,
                foundOffer.seller,
                foundOffer.tokenIndex,
                foundOffer.price,
                serverSettings.nodeAddress,
            );
            if (!saleHash) {
                return next(new AppError('Invalid signature'));
            }
            const signedWithdrawHash = await wallet.signMessage(getBytes(saleHash));
            return res.json({ success: true, hash: signedWithdrawHash });
        } catch (err) {
            log.error(err);
            return next(new AppError('Error generating signature'));
        }
    } catch (err) {
      log.error(err);
      return next('Error generating resale hash');
    }
  };
