import { ethers } from 'ethers';

// Helper function to get function selectors from ABI
export function getSelectors(abi: any[]) {
  const signatures = abi
    .filter((item) => item.type === 'function')
    .map((item) => {
      const signature = `${item.name}(${item.inputs
        .map((input: any) => input.type)
        .join(',')})`;
      return ethers.utils
        .keccak256(ethers.utils.toUtf8Bytes(signature))
        .substring(0, 10);
    });
  return signatures;
}
