import {
  describeBehaviorOfUpgradeableProxy,
  UpgradeableProxyBehaviorArgs,
} from './UpgradeableProxy.behavior';
import { SignerWithAddress } from '@nomicfoundation/hardhat-ethers/signers';
import { deployMockContract } from '@solidstate/library';
import { describeFilter } from '@solidstate/library';
import { IUpgradeableProxyOwnable } from '@solidstate/typechain-types';
import { expect } from 'chai';
import { ethers } from 'hardhat';

interface UpgradeableProxyOwnableArgs extends UpgradeableProxyBehaviorArgs {
  getOwner: () => Promise<SignerWithAddress>;
  getNonOwner: () => Promise<SignerWithAddress>;
}

export function describeBehaviorOfUpgradeableProxyOwnable(
  deploy: () => Promise<IUpgradeableProxyOwnable>,
  {
    getOwner,
    getNonOwner,
    implementationFunction,
    implementationFunctionArgs,
  }: UpgradeableProxyOwnableArgs,
  skips?: string[],
) {
  const describe = describeFilter(skips);

  describe('::UpgradeableProxyOwnable', () => {
    let instance: IUpgradeableProxyOwnable;
    let owner: SignerWithAddress;
    let nonOwner: SignerWithAddress;

    beforeEach(async () => {
      instance = await deploy();
      owner = await getOwner();
      nonOwner = await getNonOwner();
    });

    describeBehaviorOfUpgradeableProxy(
      deploy,
      {
        implementationFunction,
        implementationFunctionArgs,
      },
      [],
    );

    describe('#setImplementation(address)', () => {
      it('updates implementation address', async () => {
        const implementationFunction = 'fn';
        const abi = [
          `function ${implementationFunction} () external view returns (bool)`,
        ];

        const implementation = await deployMockContract(owner, abi);

        const contract = new ethers.Contract(
          await instance.getAddress(),
          abi,
          owner,
        );

        await expect(
          contract[implementationFunction].staticCall(),
        ).not.to.be.revertedWith('Mock on the method is not initialized');

        await instance.connect(owner).setImplementation(implementation.address);

        // call reverts, but with mock-specific message
        await expect(
          contract[implementationFunction].staticCall(),
        ).to.be.revertedWith('Mock on the method is not initialized');
      });

      describe('reverts if', () => {
        it('sender is not owner', async () => {
          await expect(
            instance.connect(nonOwner).setImplementation(ethers.ZeroAddress),
          ).to.be.revertedWithCustomError(instance, 'Ownable__NotOwner');
        });
      });
    });
  });
}
