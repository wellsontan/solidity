// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.0;

interface OracleInterface {
    function requestData(uint256 requestId, bytes memory data) external;
}

abstract contract OracleClient {
    address _oracleAddr;

    uint256 _requestCounter = 0;

    constructor(address oracleAd) {
        _oracleAddr = oracleAd;
    }

    modifier oracleOnly() {
        require(msg.sender == _oracleAddr);
        _;
    }

    function requestDataFromOracle(bytes memory data) internal returns (uint256) {
        OracleInterface(_oracleAddr).requestData(++_requestCounter, data);
        return _requestCounter;
    }

    function receiveDataFromOracle(uint256 requestId, uint256 data) public virtual;
}

abstract contract Oracle is OracleInterface {
    event request(uint256 requestId, address caller, bytes data);

    address public trustedServer;

    modifier trusted() {
        require(msg.sender == trustedServer);
        _;
    }

    constructor(address serverAddr) {
        trustedServer = serverAddr;
    }

    function requestData(uint256 requestId, bytes memory data) public override {
        emit request(requestId, msg.sender, data);
    }

    function replyData(uint256 requestId, address caller, uint256 data) public virtual trusted {
        OracleClient(caller).receiveDataFromOracle(requestId, data);
    }

}

contract SupplyOracle is Oracle {
    constructor(address serverAddr) Oracle(serverAddr) {}
}

abstract contract SupplyOracleClient is OracleClient {
    constructor(address oracleAd) OracleClient(oracleAd) {}

    function requestRandFromOracle() internal returns (uint256) {
        requestDataFromOracle(bytes("0"));
        return _requestCounter;
    }

    function receiveDataFromOracle(uint256 requestId, uint256 data) public override {
        receiveRandFromOracle(requestId, data);
    }

    function receiveRandFromOracle(uint256 requestId, uint256 rand) internal virtual;
}