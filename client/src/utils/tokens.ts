import { randomNumberGenerator } from './utils';

type Token = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
  coingeckoID?: string;
};

// polygon mumbai tokens
const polygonMainnetTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC',
    decimals: 6,
    chainId: 137,
    coingeckoID: 'usdc',
  },
  {
    id: randomNumberGenerator(),
    address: '0xc748b2a084f8efc47e086ccddd9b7e67aeb571bf',
    symbol: 'HMT',
    decimals: 18,
    chainId: 137,
    coingeckoID: 'human-protocol',
  },
  {
    id: randomNumberGenerator(),
    address: '0xc3c604f1943b8c619c5d65cd11a876e9c8edcf10',
    symbol: 'MGH',
    decimals: 18,
    chainId: 137,
    coingeckoID: 'metagamehub-dao',
  },

  {
    id: randomNumberGenerator(),
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    symbol: 'USDT',
    decimals: 6,
    chainId: 137,
    coingeckoID: 'tether',
  },

  {
    id: randomNumberGenerator(),
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    symbol: 'DAI',
    decimals: 18,
    chainId: 137,
    coingeckoID: 'dai',
  },
];

//Ethereum tokens
const ethereumMainnetTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    decimals: 6,
    chainId: 1,
    coingeckoID: 'usdc',
  },
  {
    id: randomNumberGenerator(),
    address: '0xd1ba9bac957322d6e8c07a160a3a8da11a0d2867',
    symbol: 'HMT',
    decimals: 18,
    chainId: 1,
    coingeckoID: 'human-protocol',
  },
  {
    id: randomNumberGenerator(),
    address: '0x8765b1a0eb57ca49be7eacd35b24a574d0203656',
    symbol: 'MGH',
    decimals: 18,
    chainId: 1,
    coingeckoID: 'metagamehub-dao',
  },
  {
    id: randomNumberGenerator(),
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
    chainId: 1,
    coingeckoID: 'tether',
  },

  {
    id: randomNumberGenerator(),
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
    chainId: 1,
    coingeckoID: 'dai',
  },
];

// dev tokens (mumbai)
const polygonMumbaiTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0x36c93a10e33d4E381a86CfdD877118BC24d5F2Eb',
    symbol: 'HMT',
    decimals: 18,
    chainId: 80001,
    coingeckoID: 'human-protocol',
  },
];

export const supportedTokens: Token[] = [
  ...ethereumMainnetTokens,
  ...polygonMainnetTokens,
  ...polygonMumbaiTokens,
];

export type Address = `0x${string}`;
