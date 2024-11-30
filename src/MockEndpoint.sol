// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MockEndpoint {
    // Add basic LayerZero endpoint mock functionality
    // This is a minimal mock - add more functionality as needed
    address public owner;
    mapping(address => address) public delegates;

    constructor() {
        owner = msg.sender;
    }

    // Add the missing setDelegate function
    function setDelegate(address _delegate) external {
        delegates[msg.sender] = _delegate;
    }
}