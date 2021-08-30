const NodeCache = require('node-cache');
const ethUtil = require('ethereumjs-util');
const sigUtil = require('eth-sig-util');
const uuidv4 = require('uuid/v4');
const crypto = require('crypto');

const secret = uuidv4();
let cache = new NodeCache({
  stdTTL: 600
});

module.exports = (options) => async (req, res, next) => {
  const DEFAULT_OPTIONS = {
    signature: 'MetaSignature',
    message: 'MetaMessage',
    address: 'MetaAddress',
    dAppName: '*** WARNING *** Put your dApp name *** WARNING ***',
    action: 'Authentication'
  }

  options = Object.assign(
    DEFAULT_OPTIONS,
    options
  )

  // Address param is passed & isValidAddress
  if (req.params[options.address]) {
    const address = req.params[options.address];

    if (ethUtil.isValidAddress(address)) {
      const challenge = createChallenge(address, options);
      let json = {
        challenge
      }
      req.metaAuth = json;
    } else {
      next(new Error('Invalid Ethereum address passed to eth-auth'))
    }
  }

  // Challenge message returned with signature
  if (req.params[options.message] &&
    req.params[options.signature]) {

    const recovered = await checkChallenge(
      req.params[options.message],
      req.params[options.signature],
      options
    )
    let token = {
      recovered
    }
    req.metaAuth = token;
  }

  next();
}

function createChallenge(address, options) {
  const hash = crypto.createHmac('sha256', secret)
    .update(address + uuidv4())
    .digest('hex');

  cache.set(address.toLowerCase(), hash);

  const domain = [
    { name: "name", type: "string" } //TODO: Add other things here
  ];

  const message = [
    {name:'challenge', type:'string'}
  ]

  const domainData = {
    name: options.dAppName
  }

  const messageData = {
    challenge: hash
  }


  const challenge = JSON.stringify({
    types: {
        EIP712Domain: domain,
        Challenge: message
    },
    domain: domainData,
    primaryType: "Challenge",
    message: messageData
  })

  return challenge;
}

async function checkChallenge(challenge, sig, options) {
  const domain = [
    { name: "name", type: "string" }
  ]

  const message = [
    {name:'challenge', type:'string'}
  ]

  const domainData = {
    name: options.dAppName
  }

  const messageData = {
    challenge: challenge
  }

  const data = {
    types: {
        EIP712Domain: domain,
        Challenge: message
    },
    domain: domainData,
    primaryType: "Challenge",
    message: messageData
  }
 

  const recovered = await sigUtil.recoverTypedSignature({
    data,
    sig
  });

  const storedChallenge = cache.get(recovered.toLowerCase());

  if (storedChallenge === challenge) {
    cache.del(recovered);
    return recovered;
  }
  return false;
}
