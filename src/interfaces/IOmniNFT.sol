// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

interface IOmniNFT {
    function sendNFT(
        uint32 _dstEid,
        bytes calldata _toAddress,
        uint256 _tokenId,
        bytes calldata _options
    ) external payable;

    function estimateSendFee(
        uint32 _dstEid,
        bytes calldata _toAddress,
        uint256 _tokenId,
        bytes calldata _options
    ) external view returns (uint256 nativeFee, uint256 zroFee);

    function setTrustedRemote(uint32 _eid, bytes calldata _path) external;
    function setMinDstGas(uint32 _eid, uint256 _minGas) external;
}