// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

contract SampleForwarder is ERC2771Forwarder {
  constructor() ERC2771Forwarder("SampleForwarder") {}
}
