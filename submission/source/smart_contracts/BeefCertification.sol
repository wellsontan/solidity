// SPDX-License-Identifier: GPL-3.0


/*this constact is for beef certification. All certifier functions are implement in this constract.

    How to depoly this contract:
---- Depoly oracle contract First 
---- Depoly this contract with oracle contract address 

*/

// this is a 
pragma solidity ^0.8.0;
import "./supplyChainOracle.sol"; 
import "./BeefSupplyChain.sol"; 

contract Hotpot_BeefSign is SupplyOracleClient{

    // 
    bool isWorking; 
    address public manager;
    uint256 tmp_seed;
    uint256 req_id;
    address beef_sc;

    constructor(address oracleAd) SupplyOracleClient(oracleAd) {
        manager = msg.sender;
        isWorking = true;
    }
    
    struct Certifier{
        string name;
        string userInfo;
        address userAddress;
        uint userSignLength;
        string[] allSign ;
        bool isUsed;
    }
    


    struct SignRecord{
        string signID;
        uint8 tempID;
        Certifier creator;
        uint validDate;
        string signName;
        string signInfo;
        bool isUsed;
    }

    mapping(address => Certifier) public certifiers;
    //hash => detail of sign
    //mapping(string => string) public beefSign;
    mapping(string => SignRecord) private signRecords;
    mapping (uint8 => SignRecord) private tempSignRecords;
    uint256 private req;
    string public tempRealID;
    

//event 

    //ask oracles to get sign id , or some hash number 
    // event SignIDRequest(address creator, uint8 tempID);
    // function createSignID(address creator ,uint8 tempID) public {
    //     emit SignIDRequest(creator,tempID);
    // }
    // remove tempone and add it to the signRecords 
    function createID (uint8 tempID , string memory realID) private  {
        tempSignRecords[tempID].signID = realID;
        signRecords[realID] =  tempSignRecords[tempID];
        certifiers[msg.sender].allSign.push(realID);
        certifiers[msg.sender].userSignLength++ ;

        delete tempSignRecords[tempID] ;
    }
    function createSignID(uint8 tempID) serverWorking public {
        SupplyOracleClient.requestRandFromOracle();
        bytes32 btemp =  keccak256(abi.encode(tmp_seed)) ;
        string  memory real =byte32ToString(btemp);
        tempRealID = real;
        createID(tempID,real);
        
    }

    function byte32ToString(bytes32 b) pure public returns (string memory) {

       bytes memory names = new bytes(b.length);

       for(uint i = 0; i < b.length; i++) {

           names[i] = b[i];
       }

       return string(names);
   }
    function receiveRandFromOracle(uint256 requestId, uint256 rand) internal override {
        req_id = requestId;
        tmp_seed = rand;
    }
    

// modifier
    modifier serverWorking(){
        require(isWorking == true, "server is end");
        _;
    }

    modifier restricted(){
        require(msg.sender == manager, "Can only be executed by the manager");
        _;
    }
    modifier authorizer(){
        require(certifiers[msg.sender].isUsed != false, "Can only be executed by the authorizer");
        _;
    }

// function 
    // Emergency stop
    function stopSignServer() restricted  public {
        isWorking = false;
    }

    // checking is there exist Certifier information
    function isExistCertifier(address _key) public view returns(bool){
        return certifiers[_key].isUsed == true;
    }

    // checking is there exist CERTIFICATION information
    function isExistBeefSign(string memory _key) public view returns(bool){
        return signRecords[_key].isUsed == true;
    }
    //  add SuplyChain contract address 
    function addSuplyChainAddress(address sc_address) public restricted {
        beef_sc = sc_address;
    }



//function for sign

    // Manager to add certifer 
    function addCertifier(address userAddress , string memory name , string memory info ) serverWorking restricted public {
        if(isExistCertifier(userAddress) == false){
            Certifier memory newUser;
            newUser.name = name;
            newUser.userInfo = info ;
            newUser.userAddress = userAddress;
            newUser.isUsed = true;
            certifiers[userAddress] = newUser;
        // update a current user 
        }else{
            certifiers[userAddress].name = name;
            certifiers[userAddress].userInfo = info;
        }
    }
    function removeCertifier(address userAddress)  serverWorking restricted public {
        certifiers[userAddress].isUsed = false;
        delete certifiers[userAddress];
    }


    // certifer ask a certification number 
    function createSign (uint validDate,string  memory signName,string  memory signInfo)  serverWorking authorizer public  {
        address sender = msg.sender;
        uint8 tempID = uint8(uint256(block.timestamp)%251);
        SignRecord memory newSign ;
        newSign.tempID = tempID;
        newSign.creator = certifiers[sender];
        newSign.validDate = validDate;
        newSign.signName = signName;
        newSign.signInfo = signInfo;
        newSign.isUsed = true;

        tempSignRecords[tempID] = newSign;
        createSignID(tempID);
    }

    // check a certification number legal or not 
    function checkSign (string  memory signID) authorizer serverWorking view public returns (bool) {
        if(signRecords[signID].isUsed == true){
            return true;
        }else{
            return false;
        }
    }

    // get info function 
    function getSignInfo(string memory signID) authorizer serverWorking view public returns (uint, string  memory ,string memory){
        uint date = signRecords[signID].validDate;
        string memory  signName = signRecords[signID].signName;
        string  memory signInfo = signRecords[signID].signInfo;
        return (date,signName,signInfo);

    }

    function getUserSign(address user) authorizer serverWorking view public returns (string[] memory ){
        return certifiers[user].allSign;
    }


    // certifier can use this function to sign a beef product
    function signBeefProduct (string memory beefID , string memory signID ) serverWorking authorizer public  {
        require(beef_sc != address(0));
        Hotpot_BeefSC(beef_sc).addSign(beefID,signID);
    }


}