import {
  prepareEvent,
  prepareContractCall,
  readContract,
  type BaseTransactionOptions,
  type AbiParameterToPrimitiveType,
} from "thirdweb";

/**
 * Contract events
 */

/**
 * Represents the filters for the "ApprovalForAll" event.
 */
export type ApprovalForAllEventFilters = Partial<{
  _owner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_owner";
    type: "address";
  }>;
  _operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_operator";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the ApprovalForAll event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { approvalForAllEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  approvalForAllEvent({
 *  _owner: ...,
 *  _operator: ...,
 * })
 * ],
 * });
 * ```
 */
export function approvalForAllEvent(filters: ApprovalForAllEventFilters = {}) {
  return prepareEvent({
    signature:
      "event ApprovalForAll(address indexed _owner, address indexed _operator, bool _approved)",
    filters,
  });
}

/**
 * Creates an event object for the ContractURIUpdated event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { contractURIUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  contractURIUpdatedEvent()
 * ],
 * });
 * ```
 */
export function contractURIUpdatedEvent() {
  return prepareEvent({
    signature: "event ContractURIUpdated(string prevURI, string newURI)",
  });
}

/**
 * Represents the filters for the "DefaultRoyalty" event.
 */
export type DefaultRoyaltyEventFilters = Partial<{
  newRoyaltyRecipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "newRoyaltyRecipient";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the DefaultRoyalty event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { defaultRoyaltyEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  defaultRoyaltyEvent({
 *  newRoyaltyRecipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function defaultRoyaltyEvent(filters: DefaultRoyaltyEventFilters = {}) {
  return prepareEvent({
    signature:
      "event DefaultRoyalty(address indexed newRoyaltyRecipient, uint256 newRoyaltyBps)",
    filters,
  });
}

/**
 * Represents the filters for the "LevelUp" event.
 */
export type LevelUpEventFilters = Partial<{
  account: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "account";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the LevelUp event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { levelUpEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  levelUpEvent({
 *  account: ...,
 * })
 * ],
 * });
 * ```
 */
export function levelUpEvent(filters: LevelUpEventFilters = {}) {
  return prepareEvent({
    signature: "event LevelUp(address indexed account, uint256 level)",
    filters,
  });
}

/**
 * Represents the filters for the "Miaowed" event.
 */
export type MiaowedEventFilters = Partial<{
  attacker: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "attacker";
    type: "address";
  }>;
  victim: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "victim";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the Miaowed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { miaowedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  miaowedEvent({
 *  attacker: ...,
 *  victim: ...,
 * })
 * ],
 * });
 * ```
 */
export function miaowedEvent(filters: MiaowedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event Miaowed(address indexed attacker, address indexed victim, uint256 level)",
    filters,
  });
}

/**
 * Creates an event object for the OperatorRestriction event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { operatorRestrictionEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  operatorRestrictionEvent()
 * ],
 * });
 * ```
 */
export function operatorRestrictionEvent() {
  return prepareEvent({
    signature: "event OperatorRestriction(bool restriction)",
  });
}

/**
 * Represents the filters for the "OwnerUpdated" event.
 */
export type OwnerUpdatedEventFilters = Partial<{
  prevOwner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "prevOwner";
    type: "address";
  }>;
  newOwner: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "newOwner";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the OwnerUpdated event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { ownerUpdatedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  ownerUpdatedEvent({
 *  prevOwner: ...,
 *  newOwner: ...,
 * })
 * ],
 * });
 * ```
 */
export function ownerUpdatedEvent(filters: OwnerUpdatedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event OwnerUpdated(address indexed prevOwner, address indexed newOwner)",
    filters,
  });
}

/**
 * Represents the filters for the "RoyaltyForToken" event.
 */
export type RoyaltyForTokenEventFilters = Partial<{
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  royaltyRecipient: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "royaltyRecipient";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the RoyaltyForToken event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { royaltyForTokenEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  royaltyForTokenEvent({
 *  tokenId: ...,
 *  royaltyRecipient: ...,
 * })
 * ],
 * });
 * ```
 */
export function royaltyForTokenEvent(
  filters: RoyaltyForTokenEventFilters = {}
) {
  return prepareEvent({
    signature:
      "event RoyaltyForToken(uint256 indexed tokenId, address indexed royaltyRecipient, uint256 royaltyBps)",
    filters,
  });
}

/**
 * Represents the filters for the "TokensClaimed" event.
 */
export type TokensClaimedEventFilters = Partial<{
  claimer: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "claimer";
    type: "address";
  }>;
  receiver: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "receiver";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the TokensClaimed event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensClaimedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensClaimedEvent({
 *  claimer: ...,
 *  receiver: ...,
 *  tokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensClaimedEvent(filters: TokensClaimedEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TokensClaimed(address indexed claimer, address indexed receiver, uint256 indexed tokenId, uint256 quantityClaimed)",
    filters,
  });
}

/**
 * Represents the filters for the "TokensLazyMinted" event.
 */
export type TokensLazyMintedEventFilters = Partial<{
  startTokenId: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "startTokenId";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the TokensLazyMinted event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { tokensLazyMintedEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  tokensLazyMintedEvent({
 *  startTokenId: ...,
 * })
 * ],
 * });
 * ```
 */
export function tokensLazyMintedEvent(
  filters: TokensLazyMintedEventFilters = {}
) {
  return prepareEvent({
    signature:
      "event TokensLazyMinted(uint256 indexed startTokenId, uint256 endTokenId, string baseURI, bytes encryptedBaseURI)",
    filters,
  });
}

/**
 * Represents the filters for the "TransferBatch" event.
 */
export type TransferBatchEventFilters = Partial<{
  _operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_operator";
    type: "address";
  }>;
  _from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_from";
    type: "address";
  }>;
  _to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_to";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the TransferBatch event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferBatchEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferBatchEvent({
 *  _operator: ...,
 *  _from: ...,
 *  _to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferBatchEvent(filters: TransferBatchEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TransferBatch(address indexed _operator, address indexed _from, address indexed _to, uint256[] _ids, uint256[] _values)",
    filters,
  });
}

/**
 * Represents the filters for the "TransferSingle" event.
 */
export type TransferSingleEventFilters = Partial<{
  _operator: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_operator";
    type: "address";
  }>;
  _from: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_from";
    type: "address";
  }>;
  _to: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "address";
    name: "_to";
    type: "address";
  }>;
}>;

/**
 * Creates an event object for the TransferSingle event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { transferSingleEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  transferSingleEvent({
 *  _operator: ...,
 *  _from: ...,
 *  _to: ...,
 * })
 * ],
 * });
 * ```
 */
export function transferSingleEvent(filters: TransferSingleEventFilters = {}) {
  return prepareEvent({
    signature:
      "event TransferSingle(address indexed _operator, address indexed _from, address indexed _to, uint256 _id, uint256 _value)",
    filters,
  });
}

/**
 * Represents the filters for the "URI" event.
 */
export type URIEventFilters = Partial<{
  _id: AbiParameterToPrimitiveType<{
    indexed: true;
    internalType: "uint256";
    name: "_id";
    type: "uint256";
  }>;
}>;

/**
 * Creates an event object for the URI event.
 * @param filters - Optional filters to apply to the event.
 * @returns The prepared event object.
 * @example
 * ```
 * import { getContractEvents } from "thirdweb";
 * import { uRIEvent } from "TODO";
 *
 * const events = await getContractEvents({
 * contract,
 * events: [
 *  uRIEvent({
 *  _id: ...,
 * })
 * ],
 * });
 * ```
 */
export function uRIEvent(filters: URIEventFilters = {}) {
  return prepareEvent({
    signature: "event URI(string _value, uint256 indexed _id)",
    filters,
  });
}

/**
 * Contract read functions
 */

/**
 * Calls the "OPERATOR_FILTER_REGISTRY" function on the contract.
 * @param options - The options for the OPERATOR_FILTER_REGISTRY function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { OPERATOR_FILTER_REGISTRY } from "TODO";
 *
 * const result = await OPERATOR_FILTER_REGISTRY();
 *
 * ```
 */
export async function OPERATOR_FILTER_REGISTRY(
  options: BaseTransactionOptions
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x41f43434",
      [],
      [
        {
          internalType: "contract IOperatorFilterRegistry",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "balanceOf" function.
 */
export type BalanceOfParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "";
    type: "address";
  }>;
  arg_1: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "";
    type: "uint256";
  }>;
};

/**
 * Calls the "balanceOf" function on the contract.
 * @param options - The options for the balanceOf function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOf } from "TODO";
 *
 * const result = await balanceOf({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function balanceOf(
  options: BaseTransactionOptions<BalanceOfParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x00fdd58e",
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.arg_0, options.arg_1],
  });
}

/**
 * Represents the parameters for the "balanceOfBatch" function.
 */
export type BalanceOfBatchParams = {
  accounts: AbiParameterToPrimitiveType<{
    internalType: "address[]";
    name: "accounts";
    type: "address[]";
  }>;
  ids: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "ids";
    type: "uint256[]";
  }>;
};

/**
 * Calls the "balanceOfBatch" function on the contract.
 * @param options - The options for the balanceOfBatch function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { balanceOfBatch } from "TODO";
 *
 * const result = await balanceOfBatch({
 *  accounts: ...,
 *  ids: ...,
 * });
 *
 * ```
 */
export async function balanceOfBatch(
  options: BaseTransactionOptions<BalanceOfBatchParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4e1273f4",
      [
        {
          internalType: "address[]",
          name: "accounts",
          type: "address[]",
        },
        {
          internalType: "uint256[]",
          name: "ids",
          type: "uint256[]",
        },
      ],
      [
        {
          internalType: "uint256[]",
          name: "",
          type: "uint256[]",
        },
      ],
    ],
    params: [options.accounts, options.ids],
  });
}

/**
 * Calls the "contractURI" function on the contract.
 * @param options - The options for the contractURI function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { contractURI } from "TODO";
 *
 * const result = await contractURI();
 *
 * ```
 */
export async function contractURI(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe8a3d485",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "getBaseURICount" function on the contract.
 * @param options - The options for the getBaseURICount function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getBaseURICount } from "TODO";
 *
 * const result = await getBaseURICount();
 *
 * ```
 */
export async function getBaseURICount(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x63b45e2d",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "getBatchIdAtIndex" function.
 */
export type GetBatchIdAtIndexParams = {
  index: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_index";
    type: "uint256";
  }>;
};

/**
 * Calls the "getBatchIdAtIndex" function on the contract.
 * @param options - The options for the getBatchIdAtIndex function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getBatchIdAtIndex } from "TODO";
 *
 * const result = await getBatchIdAtIndex({
 *  index: ...,
 * });
 *
 * ```
 */
export async function getBatchIdAtIndex(
  options: BaseTransactionOptions<GetBatchIdAtIndexParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x2419f51b",
      [
        {
          internalType: "uint256",
          name: "_index",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.index],
  });
}

/**
 * Calls the "getDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the getDefaultRoyaltyInfo function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getDefaultRoyaltyInfo } from "TODO";
 *
 * const result = await getDefaultRoyaltyInfo();
 *
 * ```
 */
export async function getDefaultRoyaltyInfo(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0xb24f2d39",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "getRoyaltyInfoForToken" function.
 */
export type GetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "getRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the getRoyaltyInfoForToken function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getRoyaltyInfoForToken } from "TODO";
 *
 * const result = await getRoyaltyInfoForToken({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function getRoyaltyInfoForToken(
  options: BaseTransactionOptions<GetRoyaltyInfoForTokenParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4cc157df",
      [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "uint16",
          name: "",
          type: "uint16",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "getScore" function.
 */
export type GetScoreParams = {
  player: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "player";
    type: "address";
  }>;
};

/**
 * Calls the "getScore" function on the contract.
 * @param options - The options for the getScore function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { getScore } from "TODO";
 *
 * const result = await getScore({
 *  player: ...,
 * });
 *
 * ```
 */
export async function getScore(
  options: BaseTransactionOptions<GetScoreParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xd47875d0",
      [
        {
          internalType: "address",
          name: "player",
          type: "address",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.player],
  });
}

/**
 * Represents the parameters for the "isApprovedForAll" function.
 */
export type IsApprovedForAllParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "";
    type: "address";
  }>;
  arg_1: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "";
    type: "address";
  }>;
};

/**
 * Calls the "isApprovedForAll" function on the contract.
 * @param options - The options for the isApprovedForAll function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isApprovedForAll } from "TODO";
 *
 * const result = await isApprovedForAll({
 *  arg_0: ...,
 *  arg_1: ...,
 * });
 *
 * ```
 */
export async function isApprovedForAll(
  options: BaseTransactionOptions<IsApprovedForAllParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xe985e9c5",
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.arg_0, options.arg_1],
  });
}

/**
 * Calls the "isGamePaused" function on the contract.
 * @param options - The options for the isGamePaused function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { isGamePaused } from "TODO";
 *
 * const result = await isGamePaused();
 *
 * ```
 */
export async function isGamePaused(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0422ddf3",
      [],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "name" function on the contract.
 * @param options - The options for the name function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { name } from "TODO";
 *
 * const result = await name();
 *
 * ```
 */
export async function name(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x06fdde03",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "nextTokenIdToMint" function on the contract.
 * @param options - The options for the nextTokenIdToMint function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { nextTokenIdToMint } from "TODO";
 *
 * const result = await nextTokenIdToMint();
 *
 * ```
 */
export async function nextTokenIdToMint(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x3b1475a7",
      [],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "operatorRestriction" function on the contract.
 * @param options - The options for the operatorRestriction function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { operatorRestriction } from "TODO";
 *
 * const result = await operatorRestriction();
 *
 * ```
 */
export async function operatorRestriction(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x504c6e01",
      [],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Calls the "owner" function on the contract.
 * @param options - The options for the owner function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { owner } from "TODO";
 *
 * const result = await owner();
 *
 * ```
 */
export async function owner(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x8da5cb5b",
      [],
      [
        {
          internalType: "address",
          name: "",
          type: "address",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "royaltyInfo" function.
 */
export type RoyaltyInfoParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "tokenId";
    type: "uint256";
  }>;
  salePrice: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "salePrice";
    type: "uint256";
  }>;
};

/**
 * Calls the "royaltyInfo" function on the contract.
 * @param options - The options for the royaltyInfo function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { royaltyInfo } from "TODO";
 *
 * const result = await royaltyInfo({
 *  tokenId: ...,
 *  salePrice: ...,
 * });
 *
 * ```
 */
export async function royaltyInfo(
  options: BaseTransactionOptions<RoyaltyInfoParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x2a55205a",
      [
        {
          internalType: "uint256",
          name: "tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "salePrice",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "address",
          name: "receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "royaltyAmount",
          type: "uint256",
        },
      ],
    ],
    params: [options.tokenId, options.salePrice],
  });
}

/**
 * Represents the parameters for the "supportsInterface" function.
 */
export type SupportsInterfaceParams = {
  interfaceId: AbiParameterToPrimitiveType<{
    internalType: "bytes4";
    name: "interfaceId";
    type: "bytes4";
  }>;
};

/**
 * Calls the "supportsInterface" function on the contract.
 * @param options - The options for the supportsInterface function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { supportsInterface } from "TODO";
 *
 * const result = await supportsInterface({
 *  interfaceId: ...,
 * });
 *
 * ```
 */
export async function supportsInterface(
  options: BaseTransactionOptions<SupportsInterfaceParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x01ffc9a7",
      [
        {
          internalType: "bytes4",
          name: "interfaceId",
          type: "bytes4",
        },
      ],
      [
        {
          internalType: "bool",
          name: "",
          type: "bool",
        },
      ],
    ],
    params: [options.interfaceId],
  });
}

/**
 * Calls the "symbol" function on the contract.
 * @param options - The options for the symbol function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { symbol } from "TODO";
 *
 * const result = await symbol();
 *
 * ```
 */
export async function symbol(options: BaseTransactionOptions) {
  return readContract({
    contract: options.contract,
    method: [
      "0x95d89b41",
      [],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [],
  });
}

/**
 * Represents the parameters for the "totalSupply" function.
 */
export type TotalSupplyParams = {
  arg_0: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "";
    type: "uint256";
  }>;
};

/**
 * Calls the "totalSupply" function on the contract.
 * @param options - The options for the totalSupply function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { totalSupply } from "TODO";
 *
 * const result = await totalSupply({
 *  arg_0: ...,
 * });
 *
 * ```
 */
export async function totalSupply(
  options: BaseTransactionOptions<TotalSupplyParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0xbd85b039",
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "",
          type: "uint256",
        },
      ],
    ],
    params: [options.arg_0],
  });
}

/**
 * Represents the parameters for the "uri" function.
 */
export type UriParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
};

/**
 * Calls the "uri" function on the contract.
 * @param options - The options for the uri function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { uri } from "TODO";
 *
 * const result = await uri({
 *  tokenId: ...,
 * });
 *
 * ```
 */
export async function uri(options: BaseTransactionOptions<UriParams>) {
  return readContract({
    contract: options.contract,
    method: [
      "0x0e89341c",
      [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
      ],
      [
        {
          internalType: "string",
          name: "",
          type: "string",
        },
      ],
    ],
    params: [options.tokenId],
  });
}

/**
 * Represents the parameters for the "verifyClaim" function.
 */
export type VerifyClaimParams = {
  claimer: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_claimer";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
};

/**
 * Calls the "verifyClaim" function on the contract.
 * @param options - The options for the verifyClaim function.
 * @returns The parsed result of the function call.
 * @example
 * ```
 * import { verifyClaim } from "TODO";
 *
 * const result = await verifyClaim({
 *  claimer: ...,
 *  tokenId: ...,
 *  quantity: ...,
 * });
 *
 * ```
 */
export async function verifyClaim(
  options: BaseTransactionOptions<VerifyClaimParams>
) {
  return readContract({
    contract: options.contract,
    method: [
      "0x4bbb1abf",
      [
        {
          internalType: "address",
          name: "_claimer",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.claimer, options.tokenId, options.quantity],
  });
}

/**
 * Contract write functions
 */

/**
 * Represents the parameters for the "attack" function.
 */
export type AttackParams = {
  victim: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "victim";
    type: "address";
  }>;
};

/**
 * Calls the "attack" function on the contract.
 * @param options - The options for the "attack" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { attack } from "TODO";
 *
 * const transaction = attack({
 *  victim: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function attack(options: BaseTransactionOptions<AttackParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd018db3e",
      [
        {
          internalType: "address",
          name: "victim",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.victim],
  });
}

/**
 * Represents the parameters for the "burn" function.
 */
export type BurnParams = {
  account: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "account";
    type: "address";
  }>;
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "id";
    type: "uint256";
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
};

/**
 * Calls the "burn" function on the contract.
 * @param options - The options for the "burn" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { burn } from "TODO";
 *
 * const transaction = burn({
 *  account: ...,
 *  id: ...,
 *  amount: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burn(options: BaseTransactionOptions<BurnParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf5298aca",
      [
        {
          internalType: "address",
          name: "account",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.account, options.id, options.amount],
  });
}

/**
 * Represents the parameters for the "burnBatch" function.
 */
export type BurnBatchParams = {
  owner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_owner";
    type: "address";
  }>;
  tokenIds: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "_tokenIds";
    type: "uint256[]";
  }>;
  amounts: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "_amounts";
    type: "uint256[]";
  }>;
};

/**
 * Calls the "burnBatch" function on the contract.
 * @param options - The options for the "burnBatch" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { burnBatch } from "TODO";
 *
 * const transaction = burnBatch({
 *  owner: ...,
 *  tokenIds: ...,
 *  amounts: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function burnBatch(options: BaseTransactionOptions<BurnBatchParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x6b20c454",
      [
        {
          internalType: "address",
          name: "_owner",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "_tokenIds",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "_amounts",
          type: "uint256[]",
        },
      ],
      [],
    ],
    params: [options.owner, options.tokenIds, options.amounts],
  });
}

/**
 * Represents the parameters for the "claim" function.
 */
export type ClaimParams = {
  receiver: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_receiver";
    type: "address";
  }>;
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
  quantity: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_quantity";
    type: "uint256";
  }>;
};

/**
 * Calls the "claim" function on the contract.
 * @param options - The options for the "claim" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { claim } from "TODO";
 *
 * const transaction = claim({
 *  receiver: ...,
 *  tokenId: ...,
 *  quantity: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claim(options: BaseTransactionOptions<ClaimParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2bc43fd9",
      [
        {
          internalType: "address",
          name: "_receiver",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "_quantity",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.receiver, options.tokenId, options.quantity],
  });
}

/**
 * Calls the "claimKitten" function on the contract.
 * @param options - The options for the "claimKitten" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { claimKitten } from "TODO";
 *
 * const transaction = claimKitten();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function claimKitten(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0xbe895ece", [], []],
    params: [],
  });
}

/**
 * Represents the parameters for the "lazyMint" function.
 */
export type LazyMintParams = {
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_amount";
    type: "uint256";
  }>;
  baseURIForTokens: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_baseURIForTokens";
    type: "string";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "_data";
    type: "bytes";
  }>;
};

/**
 * Calls the "lazyMint" function on the contract.
 * @param options - The options for the "lazyMint" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { lazyMint } from "TODO";
 *
 * const transaction = lazyMint({
 *  amount: ...,
 *  baseURIForTokens: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function lazyMint(options: BaseTransactionOptions<LazyMintParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xd37c353b",
      [
        {
          internalType: "uint256",
          name: "_amount",
          type: "uint256",
        },
        {
          internalType: "string",
          name: "_baseURIForTokens",
          type: "string",
        },
        {
          internalType: "bytes",
          name: "_data",
          type: "bytes",
        },
      ],
      [
        {
          internalType: "uint256",
          name: "batchId",
          type: "uint256",
        },
      ],
    ],
    params: [options.amount, options.baseURIForTokens, options.data],
  });
}

/**
 * Represents the parameters for the "multicall" function.
 */
export type MulticallParams = {
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes[]";
    name: "data";
    type: "bytes[]";
  }>;
};

/**
 * Calls the "multicall" function on the contract.
 * @param options - The options for the "multicall" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { multicall } from "TODO";
 *
 * const transaction = multicall({
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function multicall(options: BaseTransactionOptions<MulticallParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xac9650d8",
      [
        {
          internalType: "bytes[]",
          name: "data",
          type: "bytes[]",
        },
      ],
      [
        {
          internalType: "bytes[]",
          name: "results",
          type: "bytes[]",
        },
      ],
    ],
    params: [options.data],
  });
}

/**
 * Represents the parameters for the "safeBatchTransferFrom" function.
 */
export type SafeBatchTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  ids: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "ids";
    type: "uint256[]";
  }>;
  amounts: AbiParameterToPrimitiveType<{
    internalType: "uint256[]";
    name: "amounts";
    type: "uint256[]";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
};

/**
 * Calls the "safeBatchTransferFrom" function on the contract.
 * @param options - The options for the "safeBatchTransferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { safeBatchTransferFrom } from "TODO";
 *
 * const transaction = safeBatchTransferFrom({
 *  from: ...,
 *  to: ...,
 *  ids: ...,
 *  amounts: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeBatchTransferFrom(
  options: BaseTransactionOptions<SafeBatchTransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x2eb2c2d6",
      [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256[]",
          name: "ids",
          type: "uint256[]",
        },
        {
          internalType: "uint256[]",
          name: "amounts",
          type: "uint256[]",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [
      options.from,
      options.to,
      options.ids,
      options.amounts,
      options.data,
    ],
  });
}

/**
 * Represents the parameters for the "safeTransferFrom" function.
 */
export type SafeTransferFromParams = {
  from: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "from";
    type: "address";
  }>;
  to: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "to";
    type: "address";
  }>;
  id: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "id";
    type: "uint256";
  }>;
  amount: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "amount";
    type: "uint256";
  }>;
  data: AbiParameterToPrimitiveType<{
    internalType: "bytes";
    name: "data";
    type: "bytes";
  }>;
};

/**
 * Calls the "safeTransferFrom" function on the contract.
 * @param options - The options for the "safeTransferFrom" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { safeTransferFrom } from "TODO";
 *
 * const transaction = safeTransferFrom({
 *  from: ...,
 *  to: ...,
 *  id: ...,
 *  amount: ...,
 *  data: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function safeTransferFrom(
  options: BaseTransactionOptions<SafeTransferFromParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xf242432a",
      [
        {
          internalType: "address",
          name: "from",
          type: "address",
        },
        {
          internalType: "address",
          name: "to",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "id",
          type: "uint256",
        },
        {
          internalType: "uint256",
          name: "amount",
          type: "uint256",
        },
        {
          internalType: "bytes",
          name: "data",
          type: "bytes",
        },
      ],
      [],
    ],
    params: [
      options.from,
      options.to,
      options.id,
      options.amount,
      options.data,
    ],
  });
}

/**
 * Represents the parameters for the "setApprovalForAll" function.
 */
export type SetApprovalForAllParams = {
  operator: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "operator";
    type: "address";
  }>;
  approved: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "approved";
    type: "bool";
  }>;
};

/**
 * Calls the "setApprovalForAll" function on the contract.
 * @param options - The options for the "setApprovalForAll" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setApprovalForAll } from "TODO";
 *
 * const transaction = setApprovalForAll({
 *  operator: ...,
 *  approved: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setApprovalForAll(
  options: BaseTransactionOptions<SetApprovalForAllParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0xa22cb465",
      [
        {
          internalType: "address",
          name: "operator",
          type: "address",
        },
        {
          internalType: "bool",
          name: "approved",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.operator, options.approved],
  });
}

/**
 * Represents the parameters for the "setContractURI" function.
 */
export type SetContractURIParams = {
  uri: AbiParameterToPrimitiveType<{
    internalType: "string";
    name: "_uri";
    type: "string";
  }>;
};

/**
 * Calls the "setContractURI" function on the contract.
 * @param options - The options for the "setContractURI" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setContractURI } from "TODO";
 *
 * const transaction = setContractURI({
 *  uri: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setContractURI(
  options: BaseTransactionOptions<SetContractURIParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x938e3d7b",
      [
        {
          internalType: "string",
          name: "_uri",
          type: "string",
        },
      ],
      [],
    ],
    params: [options.uri],
  });
}

/**
 * Represents the parameters for the "setDefaultRoyaltyInfo" function.
 */
export type SetDefaultRoyaltyInfoParams = {
  royaltyRecipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_royaltyRecipient";
    type: "address";
  }>;
  royaltyBps: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_royaltyBps";
    type: "uint256";
  }>;
};

/**
 * Calls the "setDefaultRoyaltyInfo" function on the contract.
 * @param options - The options for the "setDefaultRoyaltyInfo" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setDefaultRoyaltyInfo } from "TODO";
 *
 * const transaction = setDefaultRoyaltyInfo({
 *  royaltyRecipient: ...,
 *  royaltyBps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setDefaultRoyaltyInfo(
  options: BaseTransactionOptions<SetDefaultRoyaltyInfoParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x600dd5ea",
      [
        {
          internalType: "address",
          name: "_royaltyRecipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_royaltyBps",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.royaltyRecipient, options.royaltyBps],
  });
}

/**
 * Represents the parameters for the "setOperatorRestriction" function.
 */
export type SetOperatorRestrictionParams = {
  restriction: AbiParameterToPrimitiveType<{
    internalType: "bool";
    name: "_restriction";
    type: "bool";
  }>;
};

/**
 * Calls the "setOperatorRestriction" function on the contract.
 * @param options - The options for the "setOperatorRestriction" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setOperatorRestriction } from "TODO";
 *
 * const transaction = setOperatorRestriction({
 *  restriction: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOperatorRestriction(
  options: BaseTransactionOptions<SetOperatorRestrictionParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x32f0cd64",
      [
        {
          internalType: "bool",
          name: "_restriction",
          type: "bool",
        },
      ],
      [],
    ],
    params: [options.restriction],
  });
}

/**
 * Represents the parameters for the "setOwner" function.
 */
export type SetOwnerParams = {
  newOwner: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_newOwner";
    type: "address";
  }>;
};

/**
 * Calls the "setOwner" function on the contract.
 * @param options - The options for the "setOwner" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setOwner } from "TODO";
 *
 * const transaction = setOwner({
 *  newOwner: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setOwner(options: BaseTransactionOptions<SetOwnerParams>) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x13af4035",
      [
        {
          internalType: "address",
          name: "_newOwner",
          type: "address",
        },
      ],
      [],
    ],
    params: [options.newOwner],
  });
}

/**
 * Represents the parameters for the "setRoyaltyInfoForToken" function.
 */
export type SetRoyaltyInfoForTokenParams = {
  tokenId: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_tokenId";
    type: "uint256";
  }>;
  recipient: AbiParameterToPrimitiveType<{
    internalType: "address";
    name: "_recipient";
    type: "address";
  }>;
  bps: AbiParameterToPrimitiveType<{
    internalType: "uint256";
    name: "_bps";
    type: "uint256";
  }>;
};

/**
 * Calls the "setRoyaltyInfoForToken" function on the contract.
 * @param options - The options for the "setRoyaltyInfoForToken" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { setRoyaltyInfoForToken } from "TODO";
 *
 * const transaction = setRoyaltyInfoForToken({
 *  tokenId: ...,
 *  recipient: ...,
 *  bps: ...,
 * });
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function setRoyaltyInfoForToken(
  options: BaseTransactionOptions<SetRoyaltyInfoForTokenParams>
) {
  return prepareContractCall({
    contract: options.contract,
    method: [
      "0x9bcf7a15",
      [
        {
          internalType: "uint256",
          name: "_tokenId",
          type: "uint256",
        },
        {
          internalType: "address",
          name: "_recipient",
          type: "address",
        },
        {
          internalType: "uint256",
          name: "_bps",
          type: "uint256",
        },
      ],
      [],
    ],
    params: [options.tokenId, options.recipient, options.bps],
  });
}

/**
 * Calls the "startGame" function on the contract.
 * @param options - The options for the "startGame" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { startGame } from "TODO";
 *
 * const transaction = startGame();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function startGame(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0xd65ab5f2", [], []],
    params: [],
  });
}

/**
 * Calls the "stopGame" function on the contract.
 * @param options - The options for the "stopGame" function.
 * @returns A prepared transaction object.
 * @example
 * ```
 * import { stopGame } from "TODO";
 *
 * const transaction = stopGame();
 *
 * // Send the transaction
 * ...
 *
 * ```
 */
export function stopGame(options: BaseTransactionOptions) {
  return prepareContractCall({
    contract: options.contract,
    method: ["0x83bd72ba", [], []],
    params: [],
  });
}
