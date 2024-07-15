// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

contract SampleForwarder is ERC2771Forwarder {
  // Event
  event Received(address indexed sender, uint256 amount);
  event FallbackReceived(address indexed sender, uint256 amount);

  constructor() ERC2771Forwarder("SampleForwarder") {}

  receive() external payable {
    // ETHの受け取りと処理
    emit Received(msg.sender, msg.value);
  }

  fallback() external payable {
    // ETHの受け取りと処理
    emit FallbackReceived(msg.sender, msg.value);
  }
}
