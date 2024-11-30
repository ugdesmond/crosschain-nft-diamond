// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Diamond } from "@solidstate/contracts/proxy/diamond/Diamond.sol";
import { DiamondWritable } from "@solidstate/contracts/proxy/diamond/DiamondWritable.sol";
import { DiamondFallback } from "@solidstate/contracts/proxy/diamond/DiamondFallback.sol";
import { LibOmniNFT } from "./libraries/LibOmniNFT.sol";

contract OmniNFTDiamond is Diamond, DiamondWritable, DiamondFallback {
    constructor(
        address _owner,
        address _lzEndpoint,
        uint256 _mintFee,
        uint256 _transferFee,
        uint256 _maxBatchSize
    ) {
        LibOmniNFT.OmniStorage storage s = LibOmniNFT.omniStorage();
        s.mintFee = _mintFee;
        s.transferFee = _transferFee;
        s.maxBatchSize = _maxBatchSize;
        s.emergencyContact = _owner;

        _setOwner(_owner);
    }

    receive() external payable {}
}