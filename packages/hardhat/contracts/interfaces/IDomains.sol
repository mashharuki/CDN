interface IDomains {
  function price(string calldata name) external view returns (uint);

  function register(string calldata name) external payable;
}
