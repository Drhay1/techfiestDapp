require('dotenv').config();

const {
  POLYGON_ESCROW_FACTORY_ADDRESS,
  POLYGON_STAKING_CONTRACT_ADDRESS,
  ETH_ESCROW_FACTORY_ADDRESS,
  ETH_STAKING_CONTRACT_ADDRESS,
  POLYGON_HMT_ADDRESS,
  ETH_HMT_ADDRESS,
  POLYGON_MUMBAI_HTTP_SERVER,
  POLYGON_ETH_HTTP_SERVER,
  ETH_SEPOLIA_SERVER,
  ETH_HTTP_SERVER,
  ETH_SEPOLIA_HMT_ADDRESS,
  POLYGON_MUMBAI_HMT_ADDRESS,
  POLYGON_MUMBAI_STAKING_CONTRACT_ADDRESS,
  POLYGON_MUMBAI_ESCROW_FACTORY_ADDRESS,
  ETH_SEPOLIA_STAKING_CONTRACT_ADDRESS,
  ETH_SEPOLIA_ESCROW_FACTORY_ADDRESS,
} = process.env;

export const stakes = {
  repOracle: process.env.REP_ORACLE_STAKE! || 10,
  recOracle: process.env.REC_ORACLE_STAKE! || 10,
};

export const randomNumberGenerator = () => {
  return Math.floor(Math.random() * (Number.MAX_SAFE_INTEGER - 100)) + 100;
};

export const gasLimit = process.env.GAS_LIMIT || 5000000;
export const escrowFundAmount = process.env.ESCROW_FUND_AMOUNT || 30;
export const statusesMap = [
  'Launched',
  'Pending',
  'Partial',
  'Paid',
  'Complete',
  'Cancelled',
];

type ErcToken = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
};

type Chain = {
  name: string;
  chainId: number;
  website: string;
  nativeCurrency: string;
  consensus: string;
  escrowFactoryAddress: string;
  stakingAddress: string;
  provider: string;
  hmtAddress: string;
};

type Token = {
  id: number;
  address: string;
  symbol: string;
  decimals: number;
  chainId: number;
};

// polygon mainnet
const polygonMainnetTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
    symbol: 'USDC',
    decimals: 6,
    chainId: 137,
  },
  {
    id: randomNumberGenerator(),
    address: '0xc748b2a084f8efc47e086ccddd9b7e67aeb571bf',
    symbol: 'HMT',
    decimals: 18,
    chainId: 137,
  },
  {
    id: randomNumberGenerator(),
    address: '0xc3c604f1943b8c619c5d65cd11a876e9c8edcf10',
    symbol: 'MGH',
    decimals: 18,
    chainId: 137,
  },

  {
    id: randomNumberGenerator(),
    address: '0xc2132d05d31c914a87c6611c10748aeb04b58e8f',
    symbol: 'USDT',
    decimals: 6,
    chainId: 137,
  },

  {
    id: randomNumberGenerator(),
    address: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
    symbol: 'DAI',
    decimals: 18,
    chainId: 137,
  },
];

// ethereum mainnet tokens
const ethereumMainnetTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    symbol: 'USDC',
    decimals: 6,
    chainId: 1,
  },
  {
    id: randomNumberGenerator(),
    address: '0xd1ba9bac957322d6e8c07a160a3a8da11a0d2867',
    symbol: 'HMT',
    decimals: 18,
    chainId: 1,
  },
  {
    id: randomNumberGenerator(),
    address: '0x8765b1a0eb57ca49be7eacd35b24a574d0203656',
    symbol: 'MGH',
    decimals: 18,
    chainId: 1,
  },
  {
    id: randomNumberGenerator(),
    address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
    symbol: 'USDT',
    decimals: 6,
    chainId: 1,
  },

  {
    id: randomNumberGenerator(),
    address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    symbol: 'DAI',
    decimals: 18,
    chainId: 1,
  },
];

// polygon Mumbai tokens
export const polygonMumbaiTokens: Token[] = [
  {
    id: randomNumberGenerator(),
    address: '0x36c93a10e33d4E381a86CfdD877118BC24d5F2Eb',
    symbol: 'HMT',
    decimals: 18,
    chainId: 80001,
  },
];

export const supportedTokens: ErcToken[] = [
  ...polygonMainnetTokens,
  ...polygonMumbaiTokens,
  ...ethereumMainnetTokens,
];

export const chains: Chain[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    website: 'https://ethereum.org',
    nativeCurrency: 'Ether (ETH)',
    consensus: 'Proof of Work (PoW) transitioning to Proof of Stake (PoS)',
    escrowFactoryAddress: ETH_ESCROW_FACTORY_ADDRESS,
    stakingAddress: ETH_STAKING_CONTRACT_ADDRESS,
    provider: ETH_HTTP_SERVER,
    hmtAddress: ETH_HMT_ADDRESS,
  },
  {
    name: 'Polygon',
    chainId: 137,
    website: 'https://polygon.technology',
    nativeCurrency: 'MATIC',
    consensus: 'Proof of Stake (PoS)',
    escrowFactoryAddress: POLYGON_ESCROW_FACTORY_ADDRESS,
    stakingAddress: POLYGON_STAKING_CONTRACT_ADDRESS,
    provider: POLYGON_ETH_HTTP_SERVER,
    hmtAddress: POLYGON_HMT_ADDRESS,
  },
  {
    name: 'Sepolia EtH',
    chainId: 11155111,
    website: 'url',
    nativeCurrency: 'ETH',
    consensus: 'Proof of Stake (PoS)',
    escrowFactoryAddress: ETH_SEPOLIA_ESCROW_FACTORY_ADDRESS,
    stakingAddress: ETH_SEPOLIA_STAKING_CONTRACT_ADDRESS,
    provider: ETH_SEPOLIA_SERVER,
    hmtAddress: ETH_SEPOLIA_HMT_ADDRESS,
  },
  {
    name: 'Polygon Mumbai',
    chainId: 80001,
    website: 'url',
    nativeCurrency: 'MATIC',
    consensus: 'PolygonSTDOUT',
    escrowFactoryAddress: POLYGON_MUMBAI_ESCROW_FACTORY_ADDRESS,
    stakingAddress: POLYGON_MUMBAI_STAKING_CONTRACT_ADDRESS,
    provider: POLYGON_MUMBAI_HTTP_SERVER,
    hmtAddress: POLYGON_MUMBAI_HMT_ADDRESS,
  },
];
