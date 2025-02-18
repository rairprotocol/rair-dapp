const NodeCache = require('node-cache');
const { isAddress } = require('ethers');
const { recoverTypedSignature } = require('@metamask/eth-sig-util');
const { createHmac, randomUUID } = require('crypto');

const logger = require('../../utils/logger')(module);
const AppError = require('../../utils/errors/AppError');

const secret = randomUUID();

const cache = new NodeCache({
  stdTTL: 600,
});

// Names of the fields in req.params to look for
const OPTIONS = {
  signature: 'MetaSignature',
  message: 'MetaMessage',
  address: 'MetaAddress',
  dAppName: 'RAIR.tech',
  action: 'Authentication',
};

// Repeated definitions that I moved to a single const
const getMessageConfig = {
  domain: [
    { name: 'name', type: 'string' },
  ],
  message: [
    { name: 'challenge', type: 'string' },
    { name: 'description', type: 'string' },
  ],
  domainData: {
    name: OPTIONS.dAppName,
  },
};

const recoverUserFromSignature = async (challenge, signature) => {
  const { domain, message, domainData } = getMessageConfig;
  // recoverTypedSignature expects the message's contents to be
  //    the same, this includes the description of the action,
  //    which is why the description is stored in cache using the hash as key

  // The user's address has 32 characters, the hash has 64, it will never clash in cache
  const messageData = {
    challenge,
    description: cache.get(challenge),
  };
  const data = {
    types: {
      EIP712Domain: domain,
      Challenge: message,
    },
    domain: domainData,
    primaryType: 'Challenge',
    message: messageData,
  };
  try {
    const recovered = await recoverTypedSignature({
      data,
      signature,
      version: 'V4',
    });
    return recovered;
  } catch (error) {
    logger.error(error);
    return undefined;
  }
};

// Validates that a challenge is correct.
async function checkChallenge(challenge, sig) {
  const recovered = await recoverUserFromSignature(challenge, sig);
  if (!recovered) {
    return false;
  }
  const storedChallenge = cache.get(recovered.toLowerCase());
  if (storedChallenge === challenge) {
    cache.del(recovered);
    cache.del(challenge);
    cache.set(`${recovered}secret`);
    return recovered;
  }
  return false;
}

function createChallenge(address, customDescription, userSecret) {
  const hash = createHmac('sha256', secret)
    .update(address + randomUUID())
    .digest('hex');

  cache.set(address.toLowerCase(), hash);
  cache.set(hash, customDescription);
  cache.set(`${address}secret`, userSecret);

  const { domain, message, domainData } = getMessageConfig;

  const messageData = {
    description: customDescription,
    challenge: hash,
  };

  const challenge = JSON.stringify({
    types: {
      EIP712Domain: domain,
      Challenge: message,
    },
    domain: domainData,
    primaryType: 'Challenge',
    message: messageData,
  });

  return challenge;
}

async function validateChallenge(req, target) {
  if (req[target][OPTIONS.message] && req[target][OPTIONS.signature]) {
    const recovered = await checkChallenge(
      req[target][OPTIONS.message],
      req[target][OPTIONS.signature],
    );
    const token = {
      recovered,
    };
    return token;
  }
  return undefined;
}

module.exports = {
  generateChallenge: (message) => (req, res, next) => {
    if (req.params[OPTIONS.address]) {
      const address = req.params[OPTIONS.address];
      if (isAddress(address)) {
        const challenge = createChallenge(address, message);
        const json = {
          challenge,
        };
        req.metaAuth = json;
      } else {
        return next(new AppError('Invalid user address'));
      }
    }
    return next();
  },
  generateChallengeV2: (req, res, next) => {
    const { userAddress, ownerAddress } = req.body;
    if (!req.metaAuth.customDescription || !isAddress(userAddress)) {
      return next(new AppError('Error in signature description', 400));
    }
    const challenge = createChallenge(
      userAddress,
      req.metaAuth.customDescription,
      ownerAddress,
    );
    const json = { challenge };
    req.metaAuth = json;
    return next();
  },
  validateChallenge: async (req, res, next) => {
    req.metaAuth = await validateChallenge(req, 'params');
    return next();
  },
  validateWeb3AuthOwner: async (req, res, next) => {
    const { MetaSignature, MetaMessage, userAddress } = req.body;
    if (!MetaSignature || !MetaMessage || !userAddress) {
      return next(new AppError('Error in web3Auth login', 400));
    }
    const recovered = await recoverUserFromSignature(MetaMessage, MetaSignature);
    const storedOwner = cache.get(`${userAddress}secret`);
    if (
      recovered !== undefined &&
      storedOwner !== undefined &&
      recovered.toLowerCase() === storedOwner.toLowerCase()
    ) {
      cache.del(userAddress.toLowerCase());
      cache.del(MetaMessage);
      cache.del(`${userAddress}secret`);
      req.metaAuth = { recovered: userAddress.toLowerCase() };
      req.web3LoginMethod = 'web3auth';
    } else {
      req.metaAuth = undefined;
    }
    return next();
  },
  validateChallengeV2: async (req, res, next) => {
    req.metaAuth = await validateChallenge(req, 'body');
    req.web3LoginMethod = 'metamask';
    return next();
  },
};
