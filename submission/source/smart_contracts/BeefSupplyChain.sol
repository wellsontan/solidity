/*
this is supply chain smart contracts , response for manage raw beef infomation.
How to depoly this contract:
---- Depoly oracle contract First 
---- Depoly this contract with oracle contract address 
---- Depoly BeefCertification contract and call "addCertifier"
*/


// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

import "./supplyChainOracle.sol";

contract Hotpot_BeefSC is SupplyOracleClient{

    enum types {FARMER, PROCESSOR, DISTRIBUTOR, RETAILER}
    address public manager;
    bool isWorking; 

    // you need to give the oracle address for deploy this contract. 
    constructor(address oracleAd) SupplyOracleClient(oracleAd) {
        manager = msg.sender;
        isWorking = true;
    }

// A user structure for all participater  
    struct User{
        string name;
        string location;
        address userAddress;
        types userType;
        bool isUsed;
    }
    
// A raw beef strcture to storage information
    struct BeefProduct{
        uint256[]  journeyList;
        uint journeyLength;

        string offChainHash;
        string base_info;

        string[] signID;
        uint signListLength;

        bool isUsed;
    }

// a strcture to showing beef product history
    struct Journey{
        uint256 journeyID;
        string beefProductID;
        User user;
        uint date;
        string produceInfo;
        bool isUsed;
    }

    mapping(address => User) private users;
    mapping(string => BeefProduct) private beefs;
    mapping(uint256 => Journey ) private allJourney;
    
    address public Certifier;
    uint256 public tmp_seed;
    uint256 public req_id;
    uint256 tmp_journeyID;
    uint256 journeyReqCount;

//modifier --------------------------------------------//
    modifier serverWorking(){
        require(isWorking == true, "server is end");
        _;
    }
    modifier restricted(){
        require(msg.sender == manager, "Can only be executed by the manager");
        _;
    }
    modifier authorizer(){
        require(users[msg.sender].isUsed == true, "Can only be executed by the authorizer");
        _;
    }
    modifier certifier(){
        require(Certifier == msg.sender, "Can only be executed by the Certifier");
        _;
    }

// event--------------------------------------------//
    event BeefJourneyIDRequest(address creator, string  beefID, uint  date , string   produceInfo);
    function createJourneyID(string memory beefID, uint  date , string  memory produceInfo) serverWorking private {
        emit BeefJourneyIDRequest(msg.sender, beefID, date , produceInfo);
    }

    function BeefJourneyIDReply(uint256 reqID, uint256 journeyID) public {
        journeyReqCount = reqID;
        tmp_journeyID = journeyID;
    }
    function createJourney(string memory beefID, uint  date , string  memory produceInfo) serverWorking authorizer public {
        SupplyOracleClient.requestRandFromOracle();
        addJourney( msg.sender, beefID, date, produceInfo, tmp_seed);
    }

    function addJourney(address useraddress ,string memory beefID, uint  date , string  memory produceInfo , uint256 journeyID) private {
        Journey memory newJourney;
        newJourney.date = date;
        newJourney.produceInfo = produceInfo;
        newJourney.user = users[useraddress];
        newJourney.journeyID = journeyID;
        newJourney.isUsed = true;
        beefs[beefID].journeyList.push(journeyID);
        beefs[beefID].journeyLength ++;
        
        allJourney[journeyID] = newJourney;
    }


// function for this smart contracts 

    // Emergency stop
    function stopServer() restricted public  {
        isWorking = false;
    } 

    function addCertifierContractAddr(address certifierContractAddr) restricted public {
        Certifier = certifierContractAddr;
    }

    // oracle receive function 
    function receiveRandFromOracle(uint256 requestId, uint256 rand) internal override {
        req_id = requestId;
        tmp_seed = rand;
    }

    // for testing only will remove in real deploy.
     function askRequest() public {
         requestRandFromOracle();
    }
//function for beef supply chain  --------------------------------------------//
    
    // checking is there exist user information
    function isExistUser(address _key) public view returns(bool){
        return users[_key].isUsed == true;
    }

    // checking is there exist raw beef product  information
    function isExistBeefProduct(string memory _key) public view returns(bool){
        return beefs[_key].isUsed == true;
    }

    // Manager register user by call this function.
    function registerUser(address  userAddress , string  memory name , string memory location , types   userType) serverWorking restricted public {
        //add new user
        if(isExistUser(userAddress) == false){
            User memory newUser;
            newUser.name = name;
            newUser.location = location ;
            newUser.userType = userType;
            newUser.userAddress = userAddress;
            newUser.isUsed = true;
            users[userAddress] = newUser;
        // update a current user 
        }else{
            users[userAddress].name = name;
            users[userAddress].location = location;
            users[userAddress].userType = userType;
        }
    } 

    // Manager can remove user 
    function removeUser(address userAddress)  serverWorking restricted public {
        users[userAddress].isUsed = false;
        delete users[userAddress];
    }

    // All user can add there own beef prpduce;
    function addBeefProduce(string memory beefID , string  memory baseInfo) serverWorking authorizer public returns(bool){
        if(isExistBeefProduct(beefID) == false){
            BeefProduct memory newProduct;
            newProduct.base_info = baseInfo;
            newProduct.offChainHash = beefID;
            newProduct.signListLength = 0;
            newProduct.journeyLength = 0;
            newProduct.isUsed = true;
            beefs[beefID] = newProduct;
            return true;
        }
        return false;
    }

    // using can know a Journey detail information 
    function getJourneyInfo (uint256 journeyID) serverWorking authorizer  view public returns(uint date, string memory produceInfo ,string memory userName) {
        if(allJourney[journeyID].isUsed == true){
            return(allJourney[journeyID].date , allJourney[journeyID].produceInfo, allJourney[journeyID].user.name );
        }
    }

    // This function is calling by certifier from beefCertification 
    function addSign(string  memory beefID, string memory signID)  serverWorking certifier public {
        beefs[beefID].signID.push(signID);
        beefs[beefID].signListLength ++;
    }
    

    // get info function .
    function getBeefInfo(string memory beefID) serverWorking authorizer  view public returns(string memory){
        return beefs[beefID].base_info;
    }
    function getBeefJourney (string memory beefID) serverWorking view public returns (uint256[] memory){
        return beefs[beefID].journeyList;
    } 
    function getBeefSign (string memory beefID) serverWorking view public returns (string[] memory){
        return beefs[beefID].signID;
    } 
}