import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;
  const { deployer } = await getNamedAccounts();

  // Get LayerZero endpoint for the current network
  const lzEndpoint = await getLZEndpoint(hre);

  // Deploy facets
  const nftFacet = await deploy('NFTFacet', {
    from: deployer,
    log: true,
  });

  const crossChainFacet = await deploy('CrossChainFacet', {
    from: deployer,
    args: [lzEndpoint],
    log: true,
  });

  const adminFacet = await deploy('AdminFacet', {
    from: deployer,
    log: true,
  });

  //   return {
  //     NFTFacet: nftFacet.address,
  //     CrossChainFacet: crossChainFacet.address,
  //     AdminFacet: adminFacet.address,
  //   };
  return true;
};

async function getLZEndpoint(hre: HardhatRuntimeEnvironment): Promise<string> {
  const network = hre.network.name;
  const endpoints: { [key: string]: string } = {
    mainnet: '0x66A71Dcef29A0fFBDBE3c6a460a3B5BC225Cd675',
    goerli: '0xbfD2135BFfbb0B5378b56643c2Df8a87552Bfa23',
    hardhat: '0x0000000000000000000000000000000000000001',
  };
  return endpoints[network] || endpoints.hardhat;
}

func.tags = ['Facets'];
export default func;
