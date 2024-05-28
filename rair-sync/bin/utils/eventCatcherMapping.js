const { utils } = require('ethers');

// Load the Smart Contract ABIs
const {
  erc721Abi,
  minterAbi,
  factoryAbi,
  // erc777Abi,
  diamondMarketplaceAbi,
  diamondFactoryAbi,
  classicDeprecatedEvents,
  diamondDeprecatedEvents,
  creditHandlerEvents,
} = require('../integrations/ethers/contracts');

// Load all event handler functions
const {
  insertContract,
  insertCollection,
  insertTokenClassic,
  insertTokenDiamond,
  insertOfferPool,
  insertOffer,
  insertDiamondOffer,
  insertDiamondRange,
  metadataForToken,
  metadataForProduct,
  updateOfferClassic,
  updateDiamondRange,
  metadataForContract,
  depositCredits,
  withdrawCredits,
  updateMintingOffer,
  sellResaleOffer,
  createResaleOffer,
  transferredToken,
} = require('./eventCatcherUtils');

// Smart contract events are mapped to an insertion logic
// The list of keys in this object are also used by the transaction catcher
//  to know if an event is relevant and needs to be synced
const insertionMapping = {
  // Diamond Factory
  DeployedContract: insertContract,
  CreatedCollection: insertCollection,
  CreatedRange: insertDiamondRange,
  UpdatedRange: updateDiamondRange,
  UpdatedBaseURI: metadataForContract,
  UpdatedProductURI: metadataForProduct,
  UpdatedTokenURI: metadataForToken,

  // Diamond Marketplace
  AddedMintingOffer: insertDiamondOffer,
  TokenMinted: insertTokenClassic,
  MintedToken: insertTokenDiamond,
  UpdatedMintingOffer: updateMintingOffer,
  TokenSold: sellResaleOffer,
  TokenOfferCreated: createResaleOffer,

  // Classic Factory
  NewContractDeployed: insertContract,

  // Classic ERC721
  BaseURIChanged: metadataForContract,
  ProductURIChanged: metadataForProduct,
  TokenURIChanged: metadataForToken,
  ProductCreated: insertCollection,
  Transfer: transferredToken,

  // Classic Marketplace
  AddedOffer: insertOfferPool,
  AppendedRange: insertOffer,
  UpdatedOffer: updateOfferClassic,
  // SoldOut: null,

  // Credit Handler
  ReceivedTokens: depositCredits,
  WithdrewCredit: withdrawCredits,
};

// This function processes each ABI and extracts the event name
const getContractEvents = (abi, isDiamond = false) => {
  // Initialize the mapping of each event
  const mapping = {};
  const abiInteface = new utils.Interface(abi);

  // Generate an interface with the ABI found
  Object.keys(abiInteface.events).forEach((eventSignature) => {
    // Find the one entry in the ABI for the signature
    const [singleAbi] = abi.filter((item) => {
      if (item.type !== 'event') {
        return false;
      }
      let fullOperationName = `${item.name}`;
      item.inputs.forEach((input, index, array) => {
        let add = '';
        if (index === 0) {
          add += '(';
        }
        add += input.type;
        if (index === array.length - 1) {
          add += ')';
        } else {
          add += ',';
        }
        fullOperationName = `${fullOperationName}${add}`;
      });
      return fullOperationName === eventSignature;
    });
    if (!singleAbi) {
      console.error(`Couldn't find ABI for signature ${eventSignature}`);
    } else {
      mapping[utils.id(eventSignature)] = {
        signature: eventSignature,
        abi: [singleAbi],
        diamondEvent: isDiamond,
        operation: insertionMapping[singleAbi.name],
      };
    }
  });
  return mapping;
};

// We populate this once on startup and query it when necessary
const masterMapping = {
  ...getContractEvents(erc721Abi),
  ...getContractEvents(minterAbi),
  ...getContractEvents(factoryAbi),

  ...getContractEvents(diamondFactoryAbi, true),
  ...getContractEvents(diamondMarketplaceAbi, true),

  ...getContractEvents(classicDeprecatedEvents, false),
  ...getContractEvents(diamondDeprecatedEvents, true),

  ...getContractEvents(creditHandlerEvents, true),
};

module.exports = {
  masterMapping,
  insertionMapping,
};
