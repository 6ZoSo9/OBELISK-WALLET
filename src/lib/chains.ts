export const SEPOLIA = {
  chainId: 11155111,
  name: 'sepolia',
  rpcUrls: [
    'https://sepolia.infura.io/v3/REPLACE_ME'
  ],
  nativeCurrency: { name: 'SepoliaETH', symbol: 'ETH', decimals: 18 },
  blockExplorerUrls: ['https://sepolia.etherscan.io']
};

export type AddChainParams = {
  chainId: `0x${string}`;
  chainName: string;
  nativeCurrency: { name: string; symbol: string; decimals: number };
  rpcUrls: string[];
  blockExplorerUrls?: string[];
};

export function toHexChainId(id: number): `0x${string}` {
  return `0x${id.toString(16)}` as const;
}
