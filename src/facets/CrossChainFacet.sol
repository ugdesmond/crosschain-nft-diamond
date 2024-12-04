// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { IOmniNFT } from "../interfaces/IOmniNFT.sol";
import { OApp, Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { MessagingFee } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";
import { SolidStateERC721 } from "@solidstate/contracts/token/ERC721/SolidStateERC721.sol";
import "../libraries/LibOmniNFT.sol";

contract CrossChainFacet is OApp, SolidStateERC721 {
    using LibOmniNFT for LibOmniNFT.OmniStorage;

    event CrossChainTransfer(uint256 indexed tokenId, uint32 dstEid, bytes toAddress);
    event CrossChainReceived(uint256 indexed tokenId, uint32 srcEid, address toAddress);

    constructor(address _endpoint) OApp(_endpoint, msg.sender) {}

    function sendNFT(
        uint32 _dstEid,
        bytes calldata _toAddress,
        uint256 _tokenId,
        bytes calldata _options
    ) external payable {
        LibOmniNFT.OmniStorage storage s = LibOmniNFT.omniStorage();
        if (s.emergencyMode) revert LibOmniNFT.EmergencyModeActive();
        if (!_isApprovedOrOwner(msg.sender, _tokenId)) revert LibOmniNFT.NotTokenOwner();
        if (msg.value < s.transferFee) revert LibOmniNFT.InvalidFee();
        if (s.trustedRemoteLookup[_dstEid].length == 0) revert LibOmniNFT.InvalidDestination();

        // Burn token on source chain
        _burn(_tokenId);

        // Send cross-chain message
        bytes memory payload = abi.encode(_toAddress, _tokenId);
        _lzSend(
            _dstEid,
            payload,
            _options,
            MessagingFee(msg.value, 0),
            payable(msg.sender)
        );

        emit CrossChainTransfer(_tokenId, _dstEid, _toAddress);
    }

    function _lzReceive(
        Origin calldata _origin,
        bytes32 /* _guid */,
        bytes calldata _payload,
        address /* _executor */,
        bytes calldata /* _extraData */
    ) internal override {
        LibOmniNFT.OmniStorage storage s = LibOmniNFT.omniStorage();
        if (s.emergencyMode) revert LibOmniNFT.EmergencyModeActive();
        if (s.trustedRemoteLookup[_origin.srcEid].length == 0) revert LibOmniNFT.InvalidDestination();

        (bytes memory toAddressBytes, uint256 tokenId) = abi.decode(_payload, (bytes, uint256));
        address toAddress = _bytesToAddress(toAddressBytes);

        _mint(toAddress, tokenId);
        emit CrossChainReceived(tokenId, _origin.srcEid, toAddress);
    }

    function _bytesToAddress(bytes memory _bytes) internal pure returns (address addr) {
        require(_bytes.length == 20, "Invalid address length");
        assembly {
            addr := mload(add(_bytes, 20))
        }
    }
}