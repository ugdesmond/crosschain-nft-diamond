export interface networkConfigItem {
  blockConfirmations?: number;
  salaryCharge?: number;
  feeAmountConverter?: number;
  walletAddress?: string;
}

export interface networkConfigInfo {
  [key: string]: networkConfigItem;
}

export const networkConfig: networkConfigInfo = {
  localhost: {
    blockConfirmations: 1,
    salaryCharge: 1,
    feeAmountConverter: 100,
  },
  hardhat: {
    blockConfirmations: 1,
    salaryCharge: 1, // precision 1*10^18
    feeAmountConverter: 100,
  },
  goerli: {
    blockConfirmations: 2,
    salaryCharge: 1,
    feeAmountConverter: 100,
    walletAddress: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
  },
  bnbtestnet: {
    blockConfirmations: 2,
    salaryCharge: 1,
    feeAmountConverter: 100,
    walletAddress: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
  },
  polygontestnet: {
    blockConfirmations: 2,
    salaryCharge: 1,
    feeAmountConverter: 100,
    walletAddress: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
  },
  assetchaintestnet: {
    blockConfirmations: 2,
    salaryCharge: 1,
    feeAmountConverter: 100,
    walletAddress: '0x3f5d53EB3cD50D4eFD9Cc9ae1f73097C4072f6f0',
  },
  bscmainnet: {
    blockConfirmations: 5,
    salaryCharge: 15,
    feeAmountConverter: 1000,
    walletAddress: '0x5d515E197a3d0803FB11465ad37A5a6B3c01ba4A',
  },
};

export const developmentChains = ['hardhat', 'localhost'];
