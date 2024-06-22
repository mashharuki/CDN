interface INFTMarketplace {
  struct Listing {
    uint256 tokenId;
    address seller;
  }

  event Listed(uint256 indexed tokenId, address indexed seller);
  event Canceled(uint256 indexed tokenId, address indexed seller);
  event Sold(uint256 indexed tokenId, address indexed buyer, uint256 price);

  function setDomainsContract(address _domainsContractAddress) external;

  function listItem(uint256 tokenId) external;

  function buyItem(
    uint256 tokenId,
    string calldata name,
    uint256 duration
  ) external payable;

  function cancelListing(uint256 tokenId) external;

  function withdraw() external;

  function getListing(uint256 tokenId) external view returns (Listing memory);
}
