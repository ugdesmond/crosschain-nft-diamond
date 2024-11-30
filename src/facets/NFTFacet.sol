// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { SolidStateERC721 } from "@solidstate/contracts/token/ERC721/SolidStateERC721.sol";
import { AccessControl } from "@solidstate/contracts/access/AccessControl.sol";
import "../libraries/LibOmniNFT.sol";

contract NFTFacet is SolidStateERC721, AccessControl {
    using LibOmniNFT for LibOmniNFT.OmniStorage;

    error BatchSizeExceeded();
    error InsufficientFee();

    event Minted(address indexed to, uint256 tokenId);
    event BatchMinted(address indexed to, uint256[] tokenIds);

    modifier whenNotEmergency() {
        if (LibOmniNFT.omniStorage().emergencyMode) revert LibOmniNFT.EmergencyModeActive();
        _;
    }

    function mint() external payable whenNotEmergency {
        LibOmniNFT.OmniStorage storage s = LibOmniNFT.omniStorage();
        if (msg.value < s.mintFee) revert InsufficientFee();
        
        uint256 tokenId = _getNextTokenId();
        _mint(msg.sender, tokenId);
        emit Minted(msg.sender, tokenId);
    }

    function batchMint(uint256 quantity) external payable whenNotEmergency {
        LibOmniNFT.OmniStorage storage s = LibOmniNFT.omniStorage();
        if (quantity > s.maxBatchSize) revert BatchSizeExceeded();
        if (msg.value < s.mintFee * quantity) revert InsufficientFee();

        uint256[] memory tokenIds = new uint256[](quantity);
        for(uint256 i = 0; i < quantity; i++) {
            uint256 tokenId = _getNextTokenId();
            _mint(msg.sender, tokenId);
            tokenIds[i] = tokenId;
        }
        
        emit BatchMinted(msg.sender, tokenIds);
    }

    function _getNextTokenId() private view returns (uint256) {
        return totalSupply() + 1;
    }
}