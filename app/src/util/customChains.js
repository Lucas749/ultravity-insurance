import { Chain } from 'wagmi'
 


export const mantle = {
    id: 5001,
    name: 'Mantle',
    network: 'Mantle Testnet',
    iconUrl: "https://pbs.twimg.com/profile_images/1597775748580134914/bLhE1aY1_400x400.jpg",
    nativeCurrency: {
      decimals: 18,
      name: 'BitDAO',
      symbol: 'BIT',
    },
    rpcUrls: {
      public: { http: ['https://rpc.testnet.mantle.xyz'] },
      default: { http: ['https://rpc.testnet.mantle.xyz'] },
    },
    blockExplorers: {
      default: { name: 'SnowTrace', url: 'https://explorer.testnet.mantle.xyz' },
    },
  }