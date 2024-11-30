import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';
import { getSelectors } from '../utils/diamond';
import { artifacts } from 'hardhat';

function getFacetSelectors(contractName: string) {
  const contract = artifacts.readArtifactSync(contractName);
  return getSelectors(contract.abi);
}

async function getLZEndpoint(hre: HardhatRuntimeEnvironment): Promise<string> {
  // For testnet/mainnet, return actual LZ Endpoint address
  // For localhost/hardhat, deploy mock endpoint
  if (hre.network.name === 'hardhat' || hre.network.name === 'localhost') {
    const { deploy } = hre.deployments;
    const { deployer } = await hre.getNamedAccounts();

    const endpoint = await deploy('LZEndpointMock', {
      from: deployer,
      args: [],
      log: true,
    });
    return endpoint.address;
  }

  // Add other network endpoints as needed
  throw new Error('LZ Endpoint not configured for this network');
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  const facets = await deployments.all();
  const lzEndpoint = await getLZEndpoint(hre);

  // Deploy Diamond
  const diamond = await deploy('OmniNFTDiamond', {
    from: deployer,
    args: [
      deployer, // owner
      lzEndpoint, // LZ endpoint
      ethers.utils.parseEther('0.01'), // mintFee
      ethers.utils.parseEther('0.05'), // transferFee
      50, // maxBatchSize
    ],
    log: true,
  });

  // Get Diamond contract
  const Diamond = await ethers.getContractAt('OmniNFTDiamond', diamond.address);

  // Prepare facet cuts
  const facetCuts = [
    {
      target: facets.NFTFacet.address,
      action: 0, // ADD
      selectors: getFacetSelectors('NFTFacet'),
    },
    {
      target: facets.CrossChainFacet.address,
      action: 0,
      selectors: getFacetSelectors('CrossChainFacet'),
    },
    {
      target: facets.AdminFacet.address,
      action: 0,
      selectors: getFacetSelectors('AdminFacet'),
    },
  ];

  // Add facets to diamond
  const tx = await Diamond.diamondCut(
    facetCuts,
    ethers.constants.AddressZero,
    '0x'
  );
  await tx.wait();

  console.log('Diamond deployed to:', diamond.address);
};

func.tags = ['Diamond'];
func.dependencies = ['Facets'];
export default func;
