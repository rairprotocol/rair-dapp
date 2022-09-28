const NodeCache = require('node-cache');
const { utils } = require('ethers');
const { recoverTypedSignature } = require('@metamask/eth-sig-util');
const { v4: uuidv4 } = require('uuid');
const { createHmac } = require('crypto');

const secret = uuidv4();

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

// Validates that a challenge is correct.
async function checkChallenge(challenge, sig) {
  const { domain, message, domainData } = getMessageConfig;

  // recoverTypedSignature expects the message's contents to be
  //    the same, this includes the description of the action,
  //    which is why the description is stored in cache using the hash as key

  // The user's address has 32 characters, the hash has 64, it will never clash

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

  const recovered = await recoverTypedSignature({
    data,
    signature: sig,
    version: 'V4',
  });

  const storedChallenge = cache.get(recovered.toLowerCase());

  if (storedChallenge === challenge) {
    cache.del(recovered);
    cache.del(challenge);
    return recovered;
  }
  return false;
}

function createChallenge(address, options, customDescription) {
  const hash = createHmac('sha256', secret)
    .update(address + uuidv4())
    .digest('hex');

  cache.set(address.toLowerCase(), hash);
  cache.set(hash, customDescription);

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

module.exports = {
  generateChallenge: (message) => (req, res, next) => {
    if (req.params[OPTIONS.address]) {
      const address = req.params[OPTIONS.address];
      if (utils.isAddress(address)) {
        const challenge = createChallenge(address, OPTIONS, message);
        const json = {
          challenge,
        };
        req.metaAuth = json;
      } else {
        next(new Error('Invalid Ethereum address passed to ethers'));
      }
    }
    next();
  },
  validateChallenge: async (req, res, next) => {
    if (req.params[OPTIONS.message] && req.params[OPTIONS.signature]) {
      const recovered = await checkChallenge(
        req.params[OPTIONS.message],
        req.params[OPTIONS.signature],
      );
      const token = {
        recovered,
      };
      req.metaAuth = token;
    }
    next();
  },
};
