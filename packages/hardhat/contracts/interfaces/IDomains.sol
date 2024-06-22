// SPDX-License-Identifier: MIT
pragma solidity >=0.8.4;

interface IDomains {
  struct Listing {
    uint256 tokenId;
    address seller;
  }

  event Register(address indexed owner, string name);
  event SetRecord(address indexed owner, string name, string record);
  event DomainExpired(uint256 indexed tokenId);
  event DomainTransferred(uint256 indexed tokenId, address indexed newOwner);

  function price(
    string calldata name,
    uint256 _years
  ) external pure returns (uint256);

  function register(string calldata name, uint256 _years) external payable;

  function getAddress(string calldata name) external view returns (address);

  function setRecord(string calldata name, string calldata record) external;

  function checkRegistered(string calldata _name) external view returns (bool);

  function getRecord(
    string calldata name
  ) external view returns (string memory);

  function isOwner() external view returns (bool);

  function withdraw() external;

  function getAllNames() external view returns (string[] memory);

  function getDomainsByOwner(
    address _owner
  ) external view returns (string[] memory);

  function checkExpiration(uint256 tokenId) external;

  function detach(uint256 tokenId) external;

  function valid(string calldata name) external pure returns (bool);

  // ERC721 functions
  function ownerOf(uint256 tokenId) external view returns (address);

  function safeTransferFrom(address from, address to, uint256 tokenId) external;

  function safeTransferFrom(
    address from,
    address to,
    uint256 tokenId,
    bytes calldata data
  ) external;

  function approve(address to, uint256 tokenId) external;

  function getApproved(uint256 tokenId) external view returns (address);

  function setApprovalForAll(address operator, bool approved) external;

  function isApprovedForAll(
    address owner,
    address operator
  ) external view returns (bool);

  function transferFrom(address from, address to, uint256 tokenId) external;

  function supportsInterface(bytes4 interfaceId) external view returns (bool);

  function updateAddress(
    string calldata name,
    address _address,
    uint256 _tokenId,
    uint256 _years
  ) external;
}
