// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "forge-std/Test.sol";
import "./helpers/TestSetup.sol";

contract NFTFacetTest is Test, TestSetup {
    function setUp() public {
        setUpDiamond();
    }

    function test_Mint() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        NFTFacet(address(diamond)).mint{value: MINT_FEE}();
        
        assertEq(NFTFacet(address(diamond)).ownerOf(1), user1);
        assertEq(NFTFacet(address(diamond)).balanceOf(user1), 1);
    }

    function test_MintFailsWithInsufficientFee() public {
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert("InsufficientFee");
        NFTFacet(address(diamond)).mint{value: MINT_FEE - 1}();
    }

    function test_BatchMint() public {
        uint256 batchSize = 5;
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        NFTFacet(address(diamond)).batchMint{value: MINT_FEE * batchSize}(batchSize);
        
        for(uint256 i = 1; i <= batchSize; i++) {
            assertEq(NFTFacet(address(diamond)).ownerOf(i), user1);
        }
        assertEq(NFTFacet(address(diamond)).balanceOf(user1), batchSize);
    }

    function test_BatchMintFailsExceedingMaxSize() public {
        uint256 batchSize = MAX_BATCH_SIZE + 1;
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        vm.expectRevert("BatchSizeExceeded");
        NFTFacet(address(diamond)).batchMint{value: MINT_FEE * batchSize}(batchSize);
    }

    function test_Transfer() public {
        // Mint token
        vm.deal(user1, 1 ether);
        vm.prank(user1);
        NFTFacet(address(diamond)).mint{value: MINT_FEE}();
        
        // Transfer token
        vm.prank(user1);
        NFTFacet(address(diamond)).transferFrom(user1, user2, 1);
        
        assertEq(NFTFacet(address(diamond)).ownerOf(1), user2);
        assertEq(NFTFacet(address(diamond)).balanceOf(user1), 0);
        assertEq(NFTFacet(address(diamond)).balanceOf(user2), 1);
    }
}