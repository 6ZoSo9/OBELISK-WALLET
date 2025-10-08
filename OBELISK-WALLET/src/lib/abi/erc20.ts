export const ERC20_ABI = [
  // balanceOf
  { "constant": true, "inputs": [{ "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "name": "", "type": "uint256" }], "type": "function", "stateMutability": "view" },
  // decimals
  { "constant": true, "inputs": [], "name": "decimals", "outputs": [{ "name": "", "type": "uint8" }], "type": "function", "stateMutability": "view" },
  // symbol
  { "constant": true, "inputs": [], "name": "symbol", "outputs": [{ "name": "", "type": "string" }], "type": "function", "stateMutability": "view" },
  // name
  { "constant": true, "inputs": [], "name": "name", "outputs": [{ "name": "", "type": "string" }], "type": "function", "stateMutability": "view" }
] as const;
