// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.10;
import './AppStorage.sol';
import '@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol';
import '@openzeppelin/contracts/utils/Address.sol';
import 'hardhat/console.sol';

contract ERC721Facet is AccessControlAppStorageEnumerable721 {
	using Address for address;

	bytes32 public constant TRADER = keccak256("TRADER");
	bytes32 public constant MINTER = keccak256("MINTER");

	event ProductCompleted(uint indexed id, string name);
	event Transfer(address indexed from, address indexed to, uint256 indexed tokenId);

	function name() public view returns (string memory) {
		return s._name;
	}

	function symbol() public view returns (string memory) {
		return s._symbol;
	}

	/// @notice	Overridden function from the ERC721 contract that returns our
	///			variable base URI instead of the hardcoded URI
	function _baseURI() internal view returns (string memory) {
		return s.baseURI;
	}
	
	/// @notice Queries if an operator can act on behalf of an owner on all of their tokens
	/// @dev Overrides the OpenZeppelin standard by allowing anyone with the TRADER role to transfer tokens
	/// @param owner 		Owner of the tokens.
	/// @param operator 	Operator of the tokens.
	function isApprovedForAll(address owner, address operator) public view virtual returns (bool) {
		return (hasRole(TRADER, operator) || s._operatorApprovals[owner][operator]);
	}

	function mintFromRange(address to, uint rangeId, uint indexInRange) external onlyRole(MINTER) {
		require(s.ranges.length > rangeId, "RAIR ERC721: Range does not exist");
		range storage selectedRange = s.ranges[rangeId];
		product storage selectedProduct = s.products[s.rangeToProduct[rangeId]];
		console.log(selectedRange.rangeStart, indexInRange, selectedRange.rangeEnd);
		require(indexInRange >= selectedRange.rangeStart && indexInRange <= selectedRange.rangeEnd, "RAIR ERC721: Invalid token index");
		require(selectedRange.tokensAllowed > 0, "RAIR ERC721: Cannot mint more tokens in this range");
		require(selectedProduct.mintableTokens > 0, "RAIR ERC721: Cannot mint more tokens in this product");
		_safeMint(to, selectedProduct.startingToken + indexInRange, '');
	}

	function mintFromProduct(address to, uint productId, uint indexInProduct) external onlyRole(MINTER) {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		product storage selectedProduct = s.products[productId];
		require(indexInProduct >= selectedProduct.startingToken && indexInProduct <= selectedProduct.endingToken, "RAIR ERC721: Invalid token index");
		require(selectedProduct.mintableTokens > 0, "RAIR ERC721: Cannot mint more tokens in this product");
		_safeMint(to, selectedProduct.startingToken + indexInProduct, '');
	}
	
		/*
	/// @notice	Mints a specific token within a product
	/// @dev	Has to be used alongside getNextSequentialIndex to simulate a sequential minting
	/// @dev	Anyone that wants a specific token just has to call this
	/// @param	to					Address of the new token's owner
	/// @param	productId			Product to mint from
	/// @param	indexInProduct	Internal index of the token
	function mint(address to, uint productId, uint indexInProduct) internal {
		require(s.products.length > productId, "RAIR ERC721: Product does not exist");
		product storage currentProduct = s.products[productId];
		
		require(indexInProduct <= currentProduct.endingToken - currentProduct.startingToken, "RAIR ERC721: Invalid token index");

		_safeMint(to, currentProduct.startingToken + indexInProduct);

		s.tokensByProduct[productId].push(currentProduct.startingToken + indexInProduct);

		s.tokenToProduct[currentProduct.startingToken + indexInProduct] = productId;
		currentProduct.mintableTokens--;

		range storage lock;

		for (uint i = 0; i < currentProduct.length; i++) {
			if (_lockedRange[currentProduct.locks[i]].startingToken <= currentProduct.startingToken + indexInProduct &&
					_lockedRange[currentProduct.locks[i]].endingToken >= currentProduct.startingToken + indexInProduct) {
				lock = _lockedRange[currentProduct.locks[i]];
				tokenToLock[currentProduct.startingToken + indexInProduct] = currentProduct.locks[i];
				if (lock.lockCountdown > 0) {
					lock.lockCountdown--;
					if (lock.lockCountdown == 0) {
						emit RangeUnlocked(productId, lock.startingToken, lock.endingToken);
					}
				}
				break;
			}
		}
		if (currentProduct.mintableTokens == 0) {
			emit ProductCompleted(productId, currentProduct.name);
		}
	}
		*/

	function _exists(uint256 tokenId) internal view virtual returns (bool) {
		return s._owners[tokenId] != address(0);
	}

	function _safeMint(address to, uint256 tokenId) internal virtual {
		_safeMint(to, tokenId, "");
	}

	function _safeMint(
		address to,
		uint256 tokenId,
		bytes memory _data
	) internal virtual {
		_mint(to, tokenId);
		require(
			_checkOnERC721Received(address(0), to, tokenId, _data),
			"ERC721: transfer to non ERC721Receiver implementer"
		);
	}

	function _mint(address to, uint256 tokenId) internal virtual {
		require(to != address(0), "ERC721: mint to the zero address");
		require(!_exists(tokenId), "ERC721: token already minted");

		_beforeTokenTransfer(address(0), to, tokenId);

		s._balances[to] += 1;
		s._owners[tokenId] = to;

		emit Transfer(address(0), to, tokenId);
	}

	/// @notice Hook being called before every transfer
	/// @dev	Transfer locking happens here!
	/// @param	_from		Token's original owner
	/// @param	_to			Token's new owner
	/// @param	_tokenId	Token's ID
	function _beforeTokenTransfer(address _from, address _to, uint256 _tokenId) internal {
		if (_from != address(0) && _to != address(0)) {
			/*
			if (_lockedRange[tokenToLock[_tokenId]].productIndex == tokenToProduct[_tokenId]) {
				require(_lockedRange[tokenToLock[_tokenId]].lockCountdown == 0, "RAIR ERC721: Transfers for this range are currently locked");
			}
			*/
			_checkRole(TRADER, msg.sender);
		} 
		//require(hasRole(TRADER, _from), 'RAIR ERC721: Transfers cannot be made outside RAIR marketplaces!');
	}

	function _checkOnERC721Received(
        address from,
        address to,
        uint256 tokenId,
        bytes memory _data
    ) private returns (bool) {
        if (to.isContract()) {
            try IERC721Receiver(to).onERC721Received(_msgSender(), from, tokenId, _data) returns (bytes4 retval) {
                return retval == IERC721Receiver.onERC721Received.selector;
            } catch (bytes memory reason) {
                if (reason.length == 0) {
                    revert("ERC721: transfer to non ERC721Receiver implementer");
                } else {
                    assembly {
                        revert(add(32, reason), mload(reason))
                    }
                }
            }
        } else {
            return true;
        }
    }
}