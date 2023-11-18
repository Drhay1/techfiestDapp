type Chain = {
  name: string;
  chainId: number;
  website: string;
  nativeCurrency: string;
  consensus: string;
  logo: string;
  providerUrl: string;
};

export const chains: Chain[] = [
  {
    name: 'Ethereum',
    chainId: 1,
    website: 'https://ethereum.org/',
    nativeCurrency: 'Ether (ETH)',
    consensus: 'Proof of Work (PoW) transitioning to Proof of Stake (PoS)',
    logo: 'ethereum.svg',
    providerUrl:
      'https://eth-mainnet.g.alchemy.com/v2/oNWlLXrzT5Chk-mDUBYUtFMk8XcjGOMi',
  },
  {
    name: 'Polygon',
    chainId: 137,
    website: '',
    nativeCurrency: 'MATIC',
    consensus: 'Proof of Stake (PoS)',
    logo: 'matic.svg',
    providerUrl:
      'https://polygon-mainnet.g.alchemy.com/v2/f4skIGprG-LqkOvUjk63L45u6SLu8vWz',
  },
  // {
  //   name: 'Sepolia EtH',
  //   chainId: 11155111,
  //   website: 'url',
  //   nativeCurrency: 'ETH',
  //   consensus: 'Proof of Stake (PoS)',
  //   logo: 'sep.svg',
  //   providerUrl:
  //     'https://eth-sepolia.g.alchemy.com/v2/v8wDJxDIvrvZlgNgNuCBLjyFfrzmg9hX',
  // },
  // {
  //   name: 'Polygon Mumbai',
  //   chainId: 80001,
  //   website: 'url',
  //   nativeCurrency: 'MATIC',
  //   consensus: 'PolygonSTDOUT',
  //   logo: 'pm.svg',
  //   providerUrl:
  //     'https://polygon-mumbai.g.alchemy.com/v2/oFxjq176T9O5D32slOp8Qq0QCbgm3mrM',
  // },
];

export const NETWORKS: { [k: string]: string } = {
  1: 'Ethereum Main Network',
  5: 'Goerli Test Network',
  42: 'Kovan Test Network',
  56: 'Binance Smart Chain',
  1337: 'Ganache',
  137: 'Polygon',
};
