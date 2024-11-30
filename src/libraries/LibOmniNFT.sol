// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

library LibOmniNFT {
    bytes32 constant STORAGE_POSITION = keccak256("omni.nft.storage");

    struct OmniStorage {
        // Cross-chain settings
        mapping(uint32 => bytes) trustedRemoteLookup;  // eid -> remote address
        mapping(uint32 => uint256) minDstGasLookup;    // eid -> min gas
        
        // NFT settings
        uint256 mintFee;
        uint256 transferFee;
        uint256 maxBatchSize;
        
        // Emergency settings
        bool emergencyMode;
        address emergencyContact;
    }

    function omniStorage() internal pure returns (OmniStorage storage ds) {
        bytes32 position = STORAGE_POSITION;
        assembly {
            ds.slot := position
        }
    }

    // Events
    event TrustedRemoteSet(uint32 indexed eid, bytes path);
    event MinDstGasSet(uint32 indexed eid, uint256 minGas);
    event EmergencyModeSet(bool enabled);
    event FeesUpdated(uint256 mintFee, uint256 transferFee);

    // Errors
    error Unauthorized();
    error InvalidFee();
    error EmergencyModeActive();
    error InvalidDestination();
    error NotTokenOwner();
}