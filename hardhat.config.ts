import { HardhatUserConfig } from 'hardhat/config';
import '@nomicfoundation/hardhat-toolbox';
import * as dotenv from 'dotenv';
import 'hardhat-deploy'; // Add this import
import '@nomicfoundation/hardhat-verify';

dotenv.config();
const ETHER_SCAN_API_KEY =
  process.env.NETWORK_TO_DEPLOY === 'bscmainnet'
    ? process.env.TEST_BSCSCAN_API_KEY
    : process.env.NETWORK_TO_DEPLOY === 'polygontestnet'
    ? process.env.TEST_POLYGONSCAN_API_KEY
    : process.env.ETHERSCAN_API_KEY;

const PRIVATE_KEY: any[] = [];
if (process.env.PRIVATE_KEY) {
  PRIVATE_KEY.push(process.env.PRIVATE_KEY);
}
if (process.env.PRIVATE_KEY_ACCOUNT2) {
  PRIVATE_KEY.push(process.env.PRIVATE_KEY_ACCOUNT2);
}
if (process.env.PRIVATE_KEY_ACCOUNT3) {
  PRIVATE_KEY.push(process.env.PRIVATE_KEY_ACCOUNT3);
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.27',
      },
      {
        version: '0.8.20',
      },
    ],

    // settings: {
    //   optimizer: {
    //     enabled: true,
    //     runs: 1,
    //   },
    // },
  },
  namedAccounts: {
    deployer: {
      default: 0, // here this will by default take the first account as deployer
      1: 0, // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player: {
      default: 1,
    },
  },
  defaultNetwork: 'hardhat',
  networks: {
    hardhat: {
      chainId: 31337,
      gas: 500000000,
      gasPrice: 8000000000,
      blockGasLimit: 300000000,
    },
    ropsten: {
      url: process.env.ROPSTEN_URL || '',
      accounts: PRIVATE_KEY,
    },
    goerli: {
      chainId: 5,
      url: process.env.GORELI_URL || '',
      accounts: PRIVATE_KEY,
      gasPrice: 10000000000,
      gas: 2000000,
    },
    bnbtestnet: {
      chainId: 97,
      url: process.env.BNB_TESTNET_URL || '',
      accounts: PRIVATE_KEY,
      gasPrice: 20000000000,
      gas: 6000000,
    },
    polygontestnet: {
      chainId: 80001,
      url: process.env.POLYGON_TESTNET_URL || '',
      accounts: PRIVATE_KEY,
      gasPrice: 20000000000,
      gas: 6000000,
    },
    assetchaintestnet: {
      chainId: 42421,
      url: process.env.ASSET_CHAIN_TESTNET_URL || '',
      accounts: PRIVATE_KEY,
      gasPrice: 20000000000,
      gas: 6000000,
    },
    bscmainnet: {
      chainId: 56,
      url: process.env.BNB_MAINNET_URL,
      accounts: PRIVATE_KEY,
      gasPrice: 5000000000,
      gas: 500000,
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: 'USD',
  },
  verify: {
    etherscan: {
      apiKey: ETHER_SCAN_API_KEY,
    },
  },
  mocha: {
    timeout: 100000000,
  },
  paths: {
    sources: './src',
    tests: './test/hardhat',
    cache: './cache',
    artifacts: './artifacts',
  },
};

export default config;
