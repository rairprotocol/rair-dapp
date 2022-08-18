// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.15;

// Interfaces
import "openzeppelin-v4.7.1/utils/introspection/IERC1820Registry.sol";
import "openzeppelin-v4.7.1/token/ERC777/IERC777.sol";
import {IRAIR721_Deployer} from "./RAIR721_Deployer.sol";
// Parent classes
import "openzeppelin-v4.7.1/token/ERC777/IERC777Recipient.sol";
import "openzeppelin-v4.7.1/access/AccessControlEnumerable.sol";

// We only need the name of the deployment, there's no need to import the entire ERC721Metadata Interface
interface RAIR721Metadata {
    function name() external returns (string memory);
}

//
interface IRAIR721_Single_Factory {
    // These are arrays on the real contract
    function creators(uint) external returns (address);

    function ownerToContracts(address, uint) external returns (address);

    // These are actual functions in the real contract
    function getCreatorsCount() external view returns (uint count);

    function getContractCountOf(address deployer)
        external
        view
        returns (uint count);
}

/// @title  RAIR ERC721 Factory
/// @notice Handles the deployment of ERC721 RAIR Tokens
/// @author Juan M. Sanchez M.
/// @dev 	Uses AccessControl for the reception of ERC777 tokens!
contract RAIR721_Master_Factory is IERC777Recipient, AccessControlEnumerable {
    IERC1820Registry internal constant _ERC1820_REGISTRY =
        IERC1820Registry(0x1820a4B7618BdE71Dce8cdc73aAB6C95905faD24);

    bytes32 public constant OWNER = keccak256("OWNER");
    bytes32 public constant ERC777 = keccak256("ERC777");

    mapping(address => address[]) public ownerToContracts;
    mapping(address => address) public contractToOwner;

    mapping(address => uint) public deploymentCostForERC777;

    address public deployerAddress;
    address[] public creators;

    event NewTokensAccepted(address erc777, uint priceForNFT);
    event TokenNoLongerAccepted(address erc777);
    event DeploymentPriceUpdated(address erc777, uint priceToDeploy);

    // Old deployment event, for classic contracts
    event NewContractDeployed(
        address owner,
        uint id,
        address token,
        string contractName
    );
    // New and Diamond deployment event
    event DeployedContract(
        address deployerAddress,
        uint deploymentIndex,
        address deploymentAddress,
        string deploymentName
    );

    event TokensWithdrawn(address recipient, address erc777, uint amount);

    /// @notice Factory Constructor
    /// @param  _pricePerToken    Tokens required for the deployment
    /// @param  _rairAddress 	  Address of the primary ERC777 contract (RAIR contract)
    constructor(uint _pricePerToken, address _rairAddress) {
        _ERC1820_REGISTRY.setInterfaceImplementer(
            address(this),
            keccak256("ERC777TokensRecipient"),
            address(this)
        );
        _setRoleAdmin(OWNER, OWNER);
        _setRoleAdmin(ERC777, OWNER);
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(OWNER, msg.sender);
        _setupRole(ERC777, _rairAddress);
        deploymentCostForERC777[_rairAddress] = _pricePerToken;
        emit NewTokensAccepted(_rairAddress, _pricePerToken);
    }

    function setDeployerAddress(address deployerAddress_)
        public
        onlyRole(OWNER)
    {
        deployerAddress = deployerAddress_;
    }

    /// @notice Returns the number of addresses that have deployed a contract
    function getCreatorsCount() public view returns (uint count) {
        return creators.length;
    }

    /// @notice Returns the number of contracts deployed by an address
    /// @dev	Use alongside ownerToContracts for the full list of tokens
    /// @param	deployer	Wallet address to query
    function getContractCountOf(address deployer)
        public
        view
        returns (uint count)
    {
        return ownerToContracts[deployer].length;
    }

    /// @notice Transfers tokens from the factory to any of the OWNER addresses
    /// @dev 	If the contract has less than the amount, the ERC777 contract will revert
    /// @dev 	AccessControl makes sure only an OWNER can withdraw
    /// @param 	erc777	Address of the ERC777 contract
    /// @param 	amount	Amount of tokens to withdraw
    function withdrawTokens(address erc777, uint amount)
        public
        onlyRole(OWNER)
    {
        require(
            hasRole(ERC777, erc777),
            "RAIR Factory: Specified contract isn't an approved erc777 contract"
        );
        IERC777(erc777).send(msg.sender, amount, "Factory Withdraw");
        emit TokensWithdrawn(msg.sender, erc777, amount);
    }

    /// @notice	Adds an address to the list of allowed minters
    /// @param	_erc777Address	Address of the new Token
    function add777Token(address _erc777Address, uint _pricePerToken)
        public
        onlyRole(OWNER)
    {
        grantRole(ERC777, _erc777Address);
        deploymentCostForERC777[_erc777Address] = _pricePerToken;
        emit NewTokensAccepted(_erc777Address, _pricePerToken);
    }

    /// @notice	Removes an address from the list of allowed minters
    /// @param	_erc777Address	Address of the Token
    function remove777Token(address _erc777Address) public onlyRole(OWNER) {
        revokeRole(ERC777, _erc777Address);
        deploymentCostForERC777[_erc777Address] = 0;
        emit TokenNoLongerAccepted(_erc777Address);
    }

    function updateDeploymentPrice(
        address _erc777Address,
        uint _deploymentPrice
    ) public onlyRole(OWNER) {
        _checkRole(ERC777, _erc777Address);
        deploymentCostForERC777[_erc777Address] = _deploymentPrice;
        emit DeploymentPriceUpdated(_erc777Address, _deploymentPrice);
    }

    /// @notice Function called by an ERC777 when they send tokens
    /// @dev    This is our deployment mechanism for ERC721 contracts!
    /// @param operator		The operator calling the send() function
    /// @param from			The owner of the tokens
    /// @param to			The recipient of the tokens
    /// @param amount		The number of tokens sent
    /// @param userData		bytes sent from the send call
    /// @param operatorData	bytes sent from the operator
    function tokensReceived(
        address operator,
        address from,
        address to,
        uint256 amount,
        bytes calldata userData,
        bytes calldata operatorData
    ) external override onlyRole(ERC777) {
        require(
            to == address(this),
            "RAIR Factory: Token received is not this address"
        );
        require(
            deploymentCostForERC777[msg.sender] > 0,
            "RAIR Factory: Deployments for this token are currently disabled"
        );
        require(
            amount >= deploymentCostForERC777[msg.sender],
            "RAIR Factory: not enough RAIR tokens to deploy a contract"
        );
        require(
            deployerAddress != address(0),
            "RAIR Factory: No deployer found!"
        );

        if (amount - (deploymentCostForERC777[msg.sender]) > 0) {
            IERC777(msg.sender).send(
                from,
                amount - (deploymentCostForERC777[msg.sender]),
                userData
            );
        }
        address[] storage tokensFromOwner = ownerToContracts[from];

        if (tokensFromOwner.length == 0) {
            creators.push(from);
        }

        address newToken = IRAIR721_Deployer(deployerAddress).deployContract(
            from,
            string(userData)
        );

        tokensFromOwner.push(newToken);
        contractToOwner[newToken] = from;
        emit DeployedContract(
            from,
            tokensFromOwner.length,
            newToken,
            string(userData)
        );
    }

    /// @notice 	Imports deployment data from previous factories
    /// @dev 		This way we can recover data in case of an update / bugfix
    /// @dev 		We are not removing data from the imported factories, so don't run this twice!
    /// @param 		factoryAddress   	Address of the factory to import
    function importData(address factoryAddress, bool diamond)
        public
        onlyRole(OWNER)
    {
        IRAIR721_Single_Factory instance = IRAIR721_Single_Factory(
            factoryAddress
        );

        uint numberOfCreators = instance.getCreatorsCount();

        for (uint i; i < numberOfCreators; i++) {
            address creatorAddress = instance.creators(i);
            uint numberOfDeployments = instance.getContractCountOf(
                creatorAddress
            );

            for (uint j; j < numberOfDeployments; j++) {
                address deploymentAddress = instance.ownerToContracts(
                    creatorAddress,
                    j
                );

                if (ownerToContracts[creatorAddress].length == 0) {
                    creators.push(creatorAddress);
                }
                if (contractToOwner[deploymentAddress] == address(0)) {
                    contractToOwner[deploymentAddress] = creatorAddress;
                    ownerToContracts[creatorAddress].push(deploymentAddress);
                    if (diamond) {
                        emit DeployedContract(
                            creatorAddress,
                            ownerToContracts[creatorAddress].length,
                            deploymentAddress,
                            RAIR721Metadata(deploymentAddress).name()
                        );
                    } else {
                        emit NewContractDeployed(
                            creatorAddress,
                            ownerToContracts[creatorAddress].length,
                            deploymentAddress,
                            RAIR721Metadata(deploymentAddress).name()
                        );
                    }
                }
            }
        }
    }
}
