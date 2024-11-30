import { describeFilter } from '@solidstate/library';
import { ERC721Enumerable } from '@solidstate/typechain-types';
import { expect } from 'chai';
import { ContractTransactionResponse } from 'ethers';

export interface ERC721EnumerableBehaviorArgs {
  mint: (
    address: string,
    tokenId: bigint,
  ) => Promise<ContractTransactionResponse>;
  burn: (tokenId: bigint) => Promise<ContractTransactionResponse>;
  supply: bigint;
}

export function describeBehaviorOfERC721Enumerable(
  deploy: () => Promise<ERC721Enumerable>,
  args: ERC721EnumerableBehaviorArgs,
  skips?: string[],
) {
  const describe = describeFilter(skips);

  describe('::ERC721Enumerable', () => {
    let instance: ERC721Enumerable;

    beforeEach(async () => {
      instance = await deploy();
    });

    describe('#totalSupply()', () => {
      it('returns total token supply', async () => {
        expect(await instance.totalSupply()).to.equal(args.supply);

        await args.mint(await instance.getAddress(), 2n);
        expect(await instance.totalSupply()).to.equal(args.supply + 1n);

        await args.burn(2n);
        expect(await instance.totalSupply()).to.equal(args.supply);
      });
    });

    describe('#tokenOfOwnerByIndex(address,uint256)', () => {
      it('returns token id held by given account at given index', async () => {
        // TODO: query balance to determine starting index

        await expect(
          instance.tokenOfOwnerByIndex.staticCall(
            await instance.getAddress(),
            0,
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableSet__IndexOutOfBounds',
        );

        await expect(
          instance.tokenOfOwnerByIndex.staticCall(
            await instance.getAddress(),
            1,
          ),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableSet__IndexOutOfBounds',
        );

        await args.mint(await instance.getAddress(), 1n);
        await args.mint(await instance.getAddress(), 2n);

        expect(
          await instance.tokenOfOwnerByIndex.staticCall(
            await instance.getAddress(),
            0,
          ),
        ).to.equal(1);

        expect(
          await instance.tokenOfOwnerByIndex.staticCall(
            await instance.getAddress(),
            1,
          ),
        ).to.equal(2);
      });
    });

    describe('#tokenByIndex(uint256)', () => {
      it('returns token id held globally at given index', async () => {
        const index = await instance.totalSupply.staticCall();

        await expect(
          instance.tokenByIndex.staticCall(index),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableMap__IndexOutOfBounds',
        );

        await expect(
          instance.tokenByIndex.staticCall(index + 1n),
        ).to.be.revertedWithCustomError(
          instance,
          'EnumerableMap__IndexOutOfBounds',
        );

        // TODO: mint to different addresses
        await args.mint(await instance.getAddress(), 1n);
        await args.mint(await instance.getAddress(), 2n);

        expect(await instance.tokenByIndex.staticCall(index)).to.equal(1);

        expect(await instance.tokenByIndex.staticCall(index + 1n)).to.equal(2);
      });
    });
  });
}
