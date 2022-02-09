// SPDX-License-Identifier: GPL-3.0
    
pragma solidity >=0.8.00 <0.9.0;
import "remix_tests.sol"; // this import is automatically injected by Remix.
import "remix_accounts.sol";
import "../BeefCertification.sol";
import "https://github.com/GNSPS/solidity-bytes-utils/blob/5d251ad816e804d55ac39fa146b4622f55708579/contracts/BytesLib.sol";

// File name has to end with '_test.sol', this file can contain more than one testSuite contracts
contract BeefSupplyChainTest is Hotpot_BeefSign {
    using BytesLib for bytes;
    address acc0 ;
    address acc1 ;
    address acc2 ;
    address acc3 ;
    address acc4 ;
    address acc5 ;
    

    
    /// 'beforeAll' runs before all other tests
    /// More special functions are: 'beforeEach', 'beforeAll', 'afterEach' & 'afterAll'
    function beforeAll() public {
        // Here should instantiate tested contract
        acc0 = TestsAccounts.getAccount(0);
        acc1 = TestsAccounts.getAccount(1);
        acc2 = TestsAccounts.getAccount(2);
        acc3 = TestsAccounts.getAccount(3);
        acc4 = TestsAccounts.getAccount(4);
        acc5 = TestsAccounts.getAccount(5);
    }
    constructor() Hotpot_BeefSign(acc5){

    }

    function managerTest() public{
        Assert.equal(manager, acc0,'Manager should be acc0');
    }
    function serverTest() public{
        Assert.equal(isWorking, true,'working');
    }
    
    /// Try to add lunch venue as a user other than manager. This should fail
    /// #sender: account-1
    function registerUserFailure1() public {
        try this.addCertifier(acc2,"testfailure1","location") {
            Assert.ok(false,'Method execution should fail');
        }catch Error(string memory reason){
            Assert.equal (reason , 'Can only be executed by the manager', 'Failed with unexpected reason');
        }catch ( bytes memory ) {
            Assert .ok(false , 'Failed unexpected ') ;
        }
    
    }
    /// #sender: account-0
    function registerUsertrue() public {
        addCertifier(acc1,"test1","location1");
        Assert.equal(true, true,'working');
    }
    /// #sender: account-0
    function registerCertifier() public {
        addCertifier(acc4,"test2","location2");
        Assert.equal(true, true,'working');
    }

    /// #sender: account-0
    function checkUserT() public {
       bool tempB =  isExistCertifier(acc1);
        Assert.equal(tempB, true,'working');
    }
    
    function checkUserF() public {
       bool tempB =  isExistCertifier(acc0);
        Assert.equal(tempB, false,'working');
    }
}
