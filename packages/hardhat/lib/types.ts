export const EIP712Domain = [
  {name: "name", type: "string"},
  {name: "version", type: "string"},
  {name: "chainId", type: "uint256"},
  {name: "verifyingContract", type: "address"},
];

export const ForwardRequest = [
  {name: "from", type: "address"},
  {name: "to", type: "address"},
  {name: "value", type: "uint256"},
  {name: "gas", type: "uint256"},
  {name: "nonce", type: "uint256"},
  {name: "deadline", type: "uint48"},
  {name: "data", type: "bytes"},
];
