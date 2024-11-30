// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import { Origin } from "@layerzerolabs/oapp-evm/contracts/oapp/OApp.sol";

contract MockLZEndpoint {
    uint16 public chainId;
    mapping(uint16 => bytes) public remotes;
    mapping(uint16 => uint256) public minDstGasLookup;

    event Packet(bytes payload);
    event Message(uint16 srcChainId, bytes srcAddress, address dstAddress, bytes payload);

    constructor(uint16 _chainId) {
        chainId = _chainId;
    }

    function send(
        uint16 _dstChainId,
        bytes memory _destination,
        bytes memory _payload,
        address payable _refundAddress,
        address _zroPaymentAddress,
        bytes memory _adapterParams
    ) external payable {
        emit Packet(_payload);
    }

    function receivePayload(
        uint16 _srcChainId,
        bytes memory _srcAddress,
        address _dstAddress,
        uint64 _nonce,
        uint _gasLimit,
        bytes memory _payload
    ) external {
        emit Message(_srcChainId, _srcAddress, _dstAddress, _payload);
    }

    function setDestLzEndpoint(address _endpoint, uint16 _chainId) external {
        remotes[_chainId] = abi.encodePacked(_endpoint);
    }

    function setMinDstGas(uint16 _dstChainId, uint256 _minGas) external {
        minDstGasLookup[_dstChainId] = _minGas;
    }

    function estimateFees(
        uint16 _dstChainId,
        address _userApplication,
        bytes calldata _payload,
        bool _payInZRO,
        bytes calldata _adapterParams
    ) external view returns (uint256 nativeFee, uint256 zroFee) {
        return (0.01 ether, 0);
    }
}